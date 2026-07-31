const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg";
const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ConfirmBookingBody {
  booking_id?: string;
  order_id?: string;
  payment_id?: string;
}

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).set(CORS_HEADERS).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).set(CORS_HEADERS).json({ error: "Method not allowed" });
  }

  // Check required env vars
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    console.error("CASHFREE_APP_ID or CASHFREE_SECRET_KEY is not set");
    return res.status(500).set(CORS_HEADERS).json({ error: "Cashfree not configured" });
  }

  if (!NHOST_GRAPHQL_URL || !HASURA_GRAPHQL_ADMIN_SECRET) {
    console.error("NHOST_GRAPHQL_URL or HASURA_GRAPHQL_ADMIN_SECRET is not set");
    return res.status(500).set(CORS_HEADERS).json({ error: "Hasura not configured" });
  }

  const body = req.body as ConfirmBookingBody;
  const { booking_id, order_id, payment_id } = body;

  if (!booking_id || !order_id) {
    return res.status(400).set(CORS_HEADERS).json({
      error: "Missing required fields: booking_id, order_id",
    });
  }

  try {
    // Step 1: Call Cashfree API to verify payment status
    console.log("Verifying payment for order:", order_id);

    const cfRes = await fetch(`${CASHFREE_API_URL}/orders/${order_id}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    });

    if (!cfRes.ok) {
      const errBody = await cfRes.text();
      console.error("Cashfree API error:", cfRes.status, errBody);

      if (cfRes.status === 404) {
        return res.status(404).set(CORS_HEADERS).json({
          success: false,
          error: "Cashfree order not found. Payment may not have been processed.",
        });
      }

      return res.status(502).set(CORS_HEADERS).json({
        success: false,
        error: "Payment gateway verification failed. Please try again.",
      });
    }

    const payments = await cfRes.json();
    console.log("Cashfree payments response:", JSON.stringify(payments));

    // Cashfree returns an array of payments for the order
    const paymentsArray = Array.isArray(payments) ? payments : (payments?.data || [payments]);
    const latestPayment = paymentsArray[0];

    if (!latestPayment) {
      return res.status(200).set(CORS_HEADERS).json({
        success: false,
        booking_id,
        status: "pending_payment",
        payment_status: "NO_PAYMENTS_FOUND",
        message: "No payments found for this order.",
      });
    }

    const paymentStatus = latestPayment.payment_status;

    if (paymentStatus === "SUCCESS") {
      // Step 2: Update booking to confirmed
      const confirmMutation = {
        query: `
          mutation ConfirmBooking($id: uuid!, $transaction_id: String!, $status: String!) {
            update_bookings_by_pk(pk_columns: { id: $id }, _set: {
              transaction_id: $transaction_id,
              status: $status
            }) { id status }
          }
        `,
        variables: {
          id: booking_id,
          transaction_id: payment_id || latestPayment.payment_id || "",
          status: "confirmed",
        },
      };

      const updateRes = await fetch(NHOST_GRAPHQL_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET!,
        },
        body: JSON.stringify(confirmMutation),
      });

      const updateData = await updateRes.json();

      if (updateData.errors) {
        console.error("GraphQL update error:", JSON.stringify(updateData.errors));
        return res.status(500).set(CORS_HEADERS).json({
          success: false,
          error: "Failed to update booking status.",
        });
      }

      const updatedBooking = updateData?.data?.update_bookings_by_pk;
      console.log("Booking confirmed:", booking_id, "status:", updatedBooking?.status);

      return res.set(CORS_HEADERS).json({
        success: true,
        booking_id,
        status: "confirmed",
      });
    } else {
      // Payment not yet successful
      console.log("Payment status is:", paymentStatus, "for booking:", booking_id);
      return res.set(CORS_HEADERS).json({
        success: false,
        booking_id,
        status: "pending_payment",
        payment_status: paymentStatus,
        message: `Payment status is ${paymentStatus}. Booking will be confirmed once payment completes.`,
      });
    }
  } catch (err) {
    console.error("confirm-booking error:", err);
    return res.status(500).set(CORS_HEADERS).json({
      success: false,
      error: err instanceof Error ? err.message : "Payment verification failed",
    });
  }
}
