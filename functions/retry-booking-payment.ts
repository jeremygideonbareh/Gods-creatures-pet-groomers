import { createHmac, timingSafeEqual, createPublicKey, createVerify } from "crypto";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg";
const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

// Derive the Cashfree webhook notify_url from the GraphQL URL (handles both
// `.hasura.` and `.graphql.` subdomain forms → `.functions.`), falling back to
// the known production URL if derivation fails. Mirrors create-booking-order.
const NOTIFY_URL_FALLBACK =
  "https://ukuqslqvwovrukooziwf.functions.ap-south-1.nhost.run/v1/cashfree-webhook";
function deriveNotifyUrl(): string {
  try {
    const base = NHOST_GRAPHQL_URL!
      .replace(".hasura.", ".functions.")
      .replace(".graphql.", ".functions.")
      .replace(/\/v1\/graphql\/?$/, "/v1");
    if (base.includes(".functions.")) return `${base}/cashfree-webhook`;
  } catch {
    // fall through to fallback
  }
  return NOTIFY_URL_FALLBACK;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RetryBookingPaymentBody {
  booking_id?: string;
}

/**
 * Verify a JWT's signature using the Nhost JWT secret.
 * Nhost provides NHOST_JWT_SECRET as a JSON blob like
 * {"type":"RS256","key":"-----BEGIN PUBLIC KEY-----...","kid":"..."}.
 * RS256 (RSA) tokens are verified with createVerify; HS256 tokens fall back
 * to HMAC with a constant-time comparison. Returns false on any failure.
 */
function verifyJwtSignature(token: string, jwtSecret: string): boolean {
  try {
    let secret = jwtSecret;
    let algorithm = "HS256";
    try {
      const parsed = JSON.parse(jwtSecret);
      if (typeof parsed?.key === "string") {
        secret = parsed.key;
        algorithm = parsed?.type || "HS256";
      }
    } catch {
      // Not JSON — use the raw value
    }

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const signingInput = `${parts[0]}.${parts[1]}`;
    // Base64url → base64
    const sigBase64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    const receivedSig = Buffer.from(sigBase64, "base64");

    if (algorithm.toUpperCase() === "RS256" || secret.includes("BEGIN")) {
      const publicKey = createPublicKey(secret);
      return createVerify("sha256").update(signingInput).verify(publicKey, receivedSig);
    }

    const expectedSig = createHmac("sha256", secret).update(signingInput).digest();
    if (receivedSig.length !== expectedSig.length) return false;
    return timingSafeEqual(receivedSig, expectedSig);
  } catch {
    return false;
  }
}

/**
 * Decode JWT payload to extract user_id and email from Hasura claims.
 * JWT format: header.payload.signature
 * The payload is base64url-encoded JSON.
 * The signature is VERIFIED against NHOST_JWT_SECRET before claims are trusted.
 */
function decodeJwtPayload(token: string): { user_id: string; email: string } | null {
  try {
    const jwtSecret = process.env.NHOST_JWT_SECRET;
    if (!jwtSecret) return null;
    if (!verifyJwtSignature(token, jwtSecret)) return null;

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

  const body = req.body as RetryBookingPaymentBody;

  if (!body?.booking_id) {
    return res.status(400).set(CORS_HEADERS).json({ error: "Missing required field: booking_id" });
  }

  try {
    // Step 1: Fetch the booking row
    const bookingQuery = {
      query: `
        query GetBookingForRetry($id: uuid!) {
          bookings_by_pk(id: $id) {
            id
            user_id
            customer_name
            email
            phone
            status
            total_price
          }
        }
      `,
      variables: { id: body.booking_id },
    };

    const bookingRes = await fetch(NHOST_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
      },
      body: JSON.stringify(bookingQuery),
    });

    const bookingData = await bookingRes.json();
    const booking = bookingData?.data?.bookings_by_pk;

    if (!booking) {
      return res.status(404).set(CORS_HEADERS).json({ error: "Booking not found." });
    }

    // Step 2: Guard — only never-paid statuses can be retried
    if (booking.status !== "pending_payment" && booking.status !== "payment_failed") {
      return res.status(409).set(CORS_HEADERS).json({
        error: "This booking is not payable. Only pending or failed payments can be retried.",
      });
    }

    // Step 3: Guard — users can only retry their own bookings
    if (booking.user_id !== userInfo.user_id) {
      return res.status(403).set(CORS_HEADERS).json({ error: "Not your booking." });
    }

    // Step 4: Create a FRESH Cashfree order for the existing booking.
    // Mirrors create-booking-order Step 3 exactly: same order_id format, same
    // ₹500 booking fee, same notify_url, booking linked via order_tags.
    // transaction_id / advance_paid / status are NOT touched here — they are
    // only written on payment success by confirm-booking / the webhook.
    const orderId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const orderPayload = {
      order_amount: 500, // ₹500 booking fee (in rupees)
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: booking.user_id,
        customer_email: booking.email,
        customer_phone: booking.phone || "",
        customer_name: booking.customer_name || "",
      },
      order_meta: {
        return_url: "",
        // CRITICAL: Cashfree NOTIFY_URL webhooks are PER-ORDER — they only fire
        // when notify_url is passed in the Create Order API for that payment.
        notify_url: deriveNotifyUrl(),
      },
      order_tags: {
        booking_id: booking.id,
      },
    };

    const cashfreeRes = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2026-01-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!cashfreeRes.ok) {
      const errBody = await cashfreeRes.text();
      console.error("Cashfree order creation failed on retry:", cashfreeRes.status, errBody);
      return res.status(502).set(CORS_HEADERS).json({
        error: "Payment gateway order creation failed. Please try again.",
      });
    }

    const cashfreeData = await cashfreeRes.json();
    console.log("Cashfree retry order created:", cashfreeData.order_id, "for booking:", booking.id);

    return res.set(CORS_HEADERS).json({
      payment_session_id: cashfreeData.payment_session_id,
      booking_id: booking.id,
      order_id: orderId,
    });
  } catch (err) {
    console.error("retry-booking-payment error:", err);
    return res.status(500).set(CORS_HEADERS).json({
      error: err instanceof Error ? err.message : "Failed to retry payment",
    });
  }
}