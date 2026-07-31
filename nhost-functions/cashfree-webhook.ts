import { createHmac, timingSafeEqual } from "crypto";

const CASHFREE_WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET;
const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CashfreeOrder {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_tags?: Record<string, string>;
}

interface CashfreePayment {
  payment_id: string;
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
}

interface CashfreeWebhookPayload {
  data: {
    order: CashfreeOrder;
    payment: CashfreePayment;
  };
  event: string;
  event_time: string;
  type: string;
}

const HANDLED_EVENTS = ["payment.success", "payment.failed"] as const;

type HandledEvent = (typeof HANDLED_EVENTS)[number];

function getStatusForEvent(event: HandledEvent): string {
  switch (event) {
    case "payment.success":
      return "confirmed";
    case "payment.failed":
      return "payment_failed";
  }
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest();

  const actualSignature = Buffer.from(signature, "hex");

  if (expectedSignature.length !== actualSignature.length) {
    return false;
  }

  return timingSafeEqual(expectedSignature, actualSignature);
}

async function updateBookingStatus(
  bookingId: string,
  status: string,
  transactionId?: string,
): Promise<{ id: string; status: string } | null> {
  const mutation = `
    mutation UpdateBookingStatus($id: uuid!, $status: String!, $transaction_id: String) {
      update_bookings_by_pk(
        pk_columns: { id: $id }
        _set: { status: $status, transaction_id: $transaction_id }
      ) {
        id
        status
      }
    }
  `;

  const response = await fetch(NHOST_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: bookingId,
        status,
        transaction_id: transactionId ?? null,
      },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("Hasura mutation errors:", JSON.stringify(result.errors));
    throw new Error(`Hasura mutation failed: ${result.errors[0]?.message || "Unknown error"}`);
  }

  return result.data?.update_bookings_by_pk ?? null;
}

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).set(CORS_HEADERS).send("");
  }

  console.log("=== cashfree-webhook invoked ===");
  console.log("Method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).set(CORS_HEADERS).json({ error: "Method not allowed" });
  }

  // Verify required env vars are present
  if (!CASHFREE_WEBHOOK_SECRET) {
    console.error("FATAL: CASHFREE_WEBHOOK_SECRET is not set");
    return res.status(500).set(CORS_HEADERS).json({
      error: "Webhook not configured",
      message: "CASHFREE_WEBHOOK_SECRET must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  if (!NHOST_GRAPHQL_URL) {
    console.error("FATAL: NHOST_GRAPHQL_URL is not set");
    return res.status(500).set(CORS_HEADERS).json({
      error: "Hasura not configured",
      message: "NHOST_GRAPHQL_URL must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  if (!NHOST_ADMIN_SECRET) {
    console.error("FATAL: NHOST_ADMIN_SECRET is not set");
    return res.status(500).set(CORS_HEADERS).json({
      error: "Hasura not configured",
      message: "NHOST_ADMIN_SECRET must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  // --- Webhook signature verification ---
  const signature = req.headers["x-webhook-signature"] as string | undefined;

  if (!signature) {
    console.error("Missing x-webhook-signature header");
    return res.status(400).set(CORS_HEADERS).json({ error: "Missing webhook signature" });
  }

  // Reconstruct the raw body from the parsed JSON to verify the signature
  const rawBody = JSON.stringify(req.body);

  const isValid = verifySignature(rawBody, signature, CASHFREE_WEBHOOK_SECRET);

  if (!isValid) {
    console.error("Invalid webhook signature — possible tampering");
    return res.status(400).set(CORS_HEADERS).json({ error: "Invalid webhook signature" });
  }

  console.log("Webhook signature verified successfully");

  // --- Parse the webhook payload ---
  const payload = req.body as CashfreeWebhookPayload;
  const event = payload.event;

  console.log("Cashfree event received:", event);

  if (!HANDLED_EVENTS.includes(event as HandledEvent)) {
    console.log(`Ignoring unhandled event: ${event}`);
    return res.set(CORS_HEADERS).json({ ok: true, message: `Ignored event: ${event}` });
  }

  // Extract booking_id from order tags
  const orderTags = payload.data?.order?.order_tags;
  const bookingId = orderTags?.booking_id;

  if (!bookingId) {
    console.error(
      "Missing booking_id in order tags. Order:",
      JSON.stringify(payload.data?.order),
    );
    return res.status(400).set(CORS_HEADERS).json({
      error: "Missing booking_id in order tags",
      message:
        "The order must include order_tags.booking_id to correlate with a booking record.",
    });
  }

  const newStatus = getStatusForEvent(event as HandledEvent);
  console.log(
    `Processing event: ${event} → booking_id: ${bookingId} → status: ${newStatus}`,
  );

  try {
    const paymentId = payload.data?.payment?.payment_id;
    const updatedBooking = await updateBookingStatus(
      bookingId,
      newStatus,
      newStatus === "confirmed" ? paymentId : undefined,
    );

    if (!updatedBooking) {
      console.warn(`Booking not found for id: ${bookingId} — possible orphan payment`);
      // Still return 200 because the webhook was valid and processed;
      // the booking might have been deleted manually.
      return res.set(CORS_HEADERS).json({ ok: true, warning: "Booking not found" });
    }

    console.log(
      `Booking ${updatedBooking.id} status updated to ${updatedBooking.status}`,
    );

    return res.set(CORS_HEADERS).json({ ok: true });
  } catch (err) {
    console.error("Failed to update booking status:", err);
    return res.status(500).set(CORS_HEADERS).json({
      error: "Failed to update booking status",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
