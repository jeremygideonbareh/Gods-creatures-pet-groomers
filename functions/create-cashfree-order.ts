const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Use sandbox for test mode, switch to api.cashfree.com for production
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg";

interface CreateOrderBody {
  amount?: number;
  customer_details?: {
    customer_id?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_name?: string;
  };
  order_meta?: Record<string, string>;
  order_tags?: Record<string, string>;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    console.error("CASHFREE_APP_ID or CASHFREE_SECRET_KEY is not set");
    return res.status(500).json({
      error: "Cashfree not configured",
      message: "CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set in Nhost Dashboard → Environment Variables.",
    });
  }

  const body = req.body as CreateOrderBody;
  const amount = body?.amount ?? 50000;

  // Build Cashfree order payload
  const orderPayload: Record<string, unknown> = {
    order_amount: amount / 100, // Cashfree expects in rupees (not paise)
    order_currency: "INR",
    order_id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    customer_details: {
      customer_id: body.customer_details?.customer_id ?? `cust_${Date.now()}`,
      customer_email: body.customer_details?.customer_email ?? "",
      customer_phone: body.customer_details?.customer_phone ?? "",
      customer_name: body.customer_details?.customer_name ?? "",
    },
    order_meta: {
      return_url: "",
      notify_url: "",
    },
    order_tags: body.order_tags ?? {},
  };

  const auth = Buffer.from(`${CASHFREE_APP_ID}:${CASHFREE_SECRET_KEY}`).toString("base64");

  try {
    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Cashfree order creation failed:", response.status, errBody);
      return res.status(response.status).json({
        error: "Failed to create payment order",
        message: `Cashfree API returned ${response.status}: ${errBody}`,
      });
    }

    const data = await response.json();
    console.log("Cashfree order created:", data.order_id);

    return res.json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      amount: amount,
      currency: "INR",
    });
  } catch (err) {
    console.error("Cashfree order creation error:", err);
    return res.status(500).json({
      error: "Failed to create payment order",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
