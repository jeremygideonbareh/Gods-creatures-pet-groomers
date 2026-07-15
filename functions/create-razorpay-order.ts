import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

interface CreateOrderBody {
  amount?: number;
  receipt?: string;
  notes?: Record<string, string>;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set");
    return res.status(500).json({
      error: "Razorpay not configured",
      message: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  const body = req.body as CreateOrderBody;
  const amount = body?.amount ?? 50000;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: body.receipt ?? `deposit_${Date.now()}`,
      notes: body.notes ?? {},
    });

    console.log("Razorpay order created:", order.id);
    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return res.status(500).json({
      error: "Failed to create payment order",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
