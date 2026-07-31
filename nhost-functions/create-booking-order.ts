const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg";
const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreateBookingOrderBody {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service?: string;
  preferred_date?: string;
  notes?: string;
  pet_id?: string | null;
  addons?: string[];
  total_price?: number;
}

/**
 * Decode JWT payload to extract user_id and email from Hasura claims.
 * JWT format: header.payload.signature
 * The payload is base64url-encoded JSON.
 */
function decodeJwtPayload(token: string): { user_id: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url → base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    const claims = parsed["https://hasura.io/jwt/claims"];
    return {
      user_id: claims?.["x-hasura-user-id"] || parsed.sub || "",
      email: parsed.email || "",
    };
  } catch {
    return null;
  }
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

  if (!NHOST_GRAPHQL_URL || !NHOST_ADMIN_SECRET) {
    console.error("NHOST_GRAPHQL_URL or NHOST_ADMIN_SECRET is not set");
    return res.status(500).set(CORS_HEADERS).json({ error: "Hasura not configured" });
  }

  // Verify authentication
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).set(CORS_HEADERS).json({ error: "Authentication required. Please sign in." });
  }

  const token = authHeader.slice(7);
  const userInfo = decodeJwtPayload(token);
  if (!userInfo || !userInfo.user_id) {
    return res.status(401).set(CORS_HEADERS).json({ error: "Invalid authentication token." });
  }

  const body = req.body as CreateBookingOrderBody;

  // Validate required fields
  if (!body.customer_name || !body.customer_email || !body.customer_phone || !body.service || !body.preferred_date) {
    return res.status(400).set(CORS_HEADERS).json({
      error: "Missing required fields: customer_name, customer_email, customer_phone, service, preferred_date",
    });
  }

  const preferredDate = body.preferred_date;
  const service = body.service;

  try {
    // Step 1: Check for booking conflict
    const conflictQuery = {
      query: `
        query CheckConflict($service: String!, $preferred_date: date!) {
          bookings(where: {
            service: { _eq: $service },
            preferred_date: { _eq: $preferred_date },
            status: { _in: ["pending_verification", "confirmed", "pending_payment"] }
          }) { id }
        }
      `,
      variables: { service, preferred_date: preferredDate },
    };

    const conflictRes = await fetch(NHOST_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
      },
      body: JSON.stringify(conflictQuery),
    });

    const conflictData = await conflictRes.json();
    const existingBookings = conflictData?.data?.bookings;
    if (existingBookings && existingBookings.length > 0) {
      return res.status(409).set(CORS_HEADERS).json({
        error: "This time slot is already booked. Please choose a different date or time.",
      });
    }

    // Step 2: Insert booking via GraphQL admin secret
    const insertMutation = {
      query: `
        mutation CreatePendingBooking($object: bookings_insert_input!) {
          insert_bookings_one(object: $object) { id }
        }
      `,
      variables: {
        object: {
          customer_name: body.customer_name,
          email: body.customer_email,
          phone: body.customer_phone,
          service: service,
          preferred_date: preferredDate,
          notes: body.notes || "",
          user_id: userInfo.user_id,
          pet_id: body.pet_id || null,
          addons: body.addons || [],
          total_price: body.total_price || 0,
          advance_paid: 500,
          transaction_id: "",
          status: "pending_payment",
        },
      },
    };

    const insertRes = await fetch(NHOST_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
      },
      body: JSON.stringify(insertMutation),
    });

    const insertData = await insertRes.json();

    if (insertData.errors) {
      console.error("GraphQL insert error:", JSON.stringify(insertData.errors));
      const msg = insertData.errors[0]?.message || "Failed to create booking";
      if (msg.toLowerCase().includes("unique constraint") || msg.toLowerCase().includes("unique_transaction_id")) {
        return res.status(409).set(CORS_HEADERS).json({ error: "A booking with this payment reference already exists." });
      }
      return res.status(500).set(CORS_HEADERS).json({ error: msg });
    }

    const newBooking = insertData?.data?.insert_bookings_one;
    if (!newBooking?.id) {
      console.error("No booking ID returned from insert", JSON.stringify(insertData));
      return res.status(500).set(CORS_HEADERS).json({ error: "Failed to create booking record." });
    }

    const bookingId = newBooking.id;

    // Step 3: Create Cashfree order with booking_id in order_tags
    const orderId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const orderPayload = {
      order_amount: 500, // ₹500 booking fee (in rupees)
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userInfo.user_id,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        customer_name: body.customer_name,
      },
      order_meta: {
        return_url: "",
        notify_url: "",
      },
      order_tags: {
        booking_id: bookingId,
      },
    };

    const cashfreeRes = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!cashfreeRes.ok) {
      const errBody = await cashfreeRes.text();
      console.error("Cashfree order creation failed:", cashfreeRes.status, errBody);
      // Booking was created but Cashfree order failed — leave it as pending_payment for retry
      return res.status(502).set(CORS_HEADERS).json({
        error: "Payment gateway order creation failed. Your booking draft has been saved.",
        booking_id: bookingId,
      });
    }

    const cashfreeData = await cashfreeRes.json();
    console.log("Cashfree order created:", cashfreeData.order_id, "for booking:", bookingId);

    return res.set(CORS_HEADERS).json({
      payment_session_id: cashfreeData.payment_session_id,
      booking_id: bookingId,
      cashfree_order_id: orderId,
    });
  } catch (err) {
    console.error("create-booking-order error:", err);
    return res.status(500).set(CORS_HEADERS).json({
      error: err instanceof Error ? err.message : "Failed to process booking",
    });
  }
}
