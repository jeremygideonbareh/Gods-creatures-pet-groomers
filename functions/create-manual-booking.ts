import { createHmac, timingSafeEqual, createPublicKey, createVerify } from "crypto";

const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreateManualBookingBody {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service?: string;
  preferred_date?: string;
  preferred_time?: string;
  upi_reference?: string;
  notes?: string;
  pet_id?: string | null;
  addons?: string[];
  total_price?: number;
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

  const body = req.body as CreateManualBookingBody;

  // Validate required fields (preferred_time required — slot-based booking)
  if (!body.customer_name || !body.customer_email || !body.customer_phone || !body.service || !body.preferred_date || !body.preferred_time) {
    return res.status(400).set(CORS_HEADERS).json({
      error: "Missing required fields: customer_name, customer_email, customer_phone, service, preferred_date, preferred_time",
    });
  }

  if (!body.upi_reference) {
    return res.status(400).set(CORS_HEADERS).json({
      error: "Missing required field: upi_reference (the GPay transaction reference number)",
    });
  }

  const preferredDate = body.preferred_date;

  try {
    // Step 1: Check for booking conflict (date + time slot, any service)
    const conflictQuery = {
      query: `
        query CheckSlot($preferred_date: date!, $preferred_time: String!) {
          bookings(where: {
            preferred_date: { _eq: $preferred_date },
            preferred_time: { _eq: $preferred_time },
            status: { _in: ["pending_verification", "confirmed", "pending_payment"] }
          }) { id }
        }
      `,
      variables: { preferred_date: preferredDate, preferred_time: body.preferred_time },
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
        error: "This time slot is already booked. Please choose a different time.",
      });
    }

    // Step 2: Insert booking via GraphQL admin secret (UPI fallback path —
    // status pending_verification until admin confirms payment from dashboard)
    const upiPrefix = `UPI Ref: ${body.upi_reference} | `;
    const insertMutation = {
      query: `
        mutation CreateManualBooking($object: bookings_insert_input!) {
          insert_bookings_one(object: $object) { id }
        }
      `,
      variables: {
        object: {
          customer_name: body.customer_name,
          email: body.customer_email,
          phone: body.customer_phone,
          service: body.service,
          preferred_date: preferredDate,
          preferred_time: body.preferred_time,
          notes: upiPrefix + (body.notes || ""),
          user_id: userInfo.user_id,
          pet_id: body.pet_id || null,
          addons: body.addons || [],
          total_price: body.total_price || 0,
          advance_paid: 500,
          // Unique placeholder: live DB requires transaction_id <> '' (check_valid_transaction_id)
          // and UNIQUE (unique_transaction_id). "upi_" prefix distinguishes manual path.
          transaction_id: `upi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          status: "pending_verification",
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

    console.log("Manual (UPI) booking created:", newBooking.id);

    return res.set(CORS_HEADERS).json({
      success: true,
      booking_id: newBooking.id,
      status: "pending_verification",
    });
  } catch (err) {
    console.error("create-manual-booking error:", err);
    return res.status(500).set(CORS_HEADERS).json({
      error: err instanceof Error ? err.message : "Failed to process booking",
    });
  }
}
