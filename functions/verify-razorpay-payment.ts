import { createHmac, timingSafeEqual } from "crypto";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

interface VerifyPaymentBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

/**
 * Computes HMAC SHA256 hex digest of the payload using the Razorpay key secret.
 * Expected payload: razorpay_order_id + "|" + razorpay_payment_id
 */
function computeSignature(orderId: string, paymentId: string): string {
  const hmac = createHmac("sha256", RAZORPAY_KEY_SECRET!);
  hmac.update(`${orderId}|${paymentId}`);
  return hmac.digest("hex");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_SECRET is not set");
    return res.status(500).json({
      error: "Razorpay not configured",
      message:
        "RAZORPAY_KEY_SECRET must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  const body = req.body as VerifyPaymentBody;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      verified: false,
      error:
        "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
    });
  }

  try {
    const expectedSignature = computeSignature(
      razorpay_order_id,
      razorpay_payment_id,
    );

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    // Constant-time comparison to prevent timing attacks
    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      console.error(
        "Razorpay signature verification failed for order:",
        razorpay_order_id,
      );
      return res.status(400).json({
        verified: false,
        error: "Invalid signature",
      });
    }

    console.log(
      "Razorpay payment verified successfully:",
      razorpay_payment_id,
    );
    return res.json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Razorpay signature verification error:", err);
    return res.status(500).json({
      verified: false,
      error: "Signature verification failed",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
