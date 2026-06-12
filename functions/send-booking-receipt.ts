import { Resend } from "resend";

const RUPEESIGN = "\u20B9";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface BookingData {
  customer_name: string;
  email: string;
  service: string;
  preferred_date: string | null;
  total_price: number | null;
  addons: string[] | null;
  transaction_id: string;
  advance_paid: number;
}

interface HasuraEvent {
  event: {
    session_variables: Record<string, string>;
    op: "INSERT" | "UPDATE" | "DELETE";
    data: {
      old: Record<string, unknown> | null;
      new: BookingData;
    };
    trace_context: Record<string, unknown>;
    created_at: string;
    id: string;
    delivery_info: { max_retries: number; current_retry: number };
  };
  created_at: string;
  id: string;
  delivery_info: { max_retries: number; current_retry: number };
  trigger: { name: string };
  table: { schema: string; name: string };
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || "onboarding@resend.dev";

const REQUIRED_BOOKING_FIELDS: (keyof BookingData)[] = [
  "customer_name",
  "email",
  "service",
  "transaction_id",
  "advance_paid",
];

function buildHtmlEmail(data: BookingData): string {
  const addonsList = data.addons && data.addons.length > 0
    ? data.addons.map((a) => `<li>${escapeHtml(a)}</li>`).join("")
    : "<li>None selected</li>";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Received</title>
</head>
<body style="margin:0;padding:0;background-color:#f5e6e6;font-family:'Quicksand','Inter',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#d0999a;padding:0;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;margin:0 auto;">
          <tr>
            <td style="padding:32px 24px 0;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.3px;">
                🐾 Gods Creatures
              </h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;">
                Pet Groomers
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border-radius:24px;border:1px solid rgba(255,255,255,0.3);">
                <tr>
                  <td style="padding:28px 24px;">
                    <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#fff;">
                      Booking Received! 🎉
                    </h2>
                    <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5;">
                      Hello <strong style="color:#fff;">${escapeHtml(data.customer_name)}</strong>,<br />
                      your booking request has been received and is being reviewed.
                    </p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;">
                      <tr>
                        <td style="padding:0 0 8px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                          Booking Summary
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:13px;color:rgba(255,255,255,0.7);">Package</td>
                              <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;">${escapeHtml(data.service)}</td>
                            </tr>
                            <tr>
                              <td style="font-size:13px;color:rgba(255,255,255,0.7);padding-top:6px;">Date</td>
                              <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-top:6px;">${data.preferred_date || "To be confirmed"}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0 4px;border-top:1px solid rgba(255,255,255,0.15);">
                          <p style="margin:8px 0 4px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                            Add-On Services
                          </p>
                          <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:rgba(255,255,255,0.8);">
                            ${addonsList}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;border-top:1px solid rgba(255,255,255,0.15);">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:18px;font-weight:700;color:#fff;">Total</td>
                              <td style="font-size:18px;font-weight:700;color:#fff;text-align:right;">
                                ${RUPEESIGN}${(data.total_price ?? 0).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:16px;background:rgba(255,214,165,0.2);border:1px solid rgba(255,214,165,0.3);border-radius:16px;padding:14px 16px;">
                      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#FFD6A5;">
                        💰 Advance Payment Reminder
                      </p>
                      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;">
                        A ${RUPEESIGN}500 booking fee is required to confirm your appointment.
                        If you haven't already, please GPay <strong style="color:#fff;">9089196235@axisbank</strong>
                        and include the UPI reference in your booking.
                      </p>
                      <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">
                        Transaction ID: ${escapeHtml(data.transaction_id)}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);line-height:1.5;">
                <strong style="color:rgba(255,255,255,0.7);">Gods Creatures Pet Groomers</strong><br />
                Malki, Nongshiliang, Shillong, Meghalaya - 793001<br />
                Mon–Sat 8am–4pm | 📞 8798897732
              </p>
              <p style="margin:10px 0 0;font-size:10px;color:rgba(255,255,255,0.35);">
                *where every tail wags brighter*
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  console.log("=== send-booking-receipt invoked ===");
  console.log("Method:", req.method);
  console.log("Headers:", JSON.stringify(req.headers));
  console.log("Raw body (truncated):", JSON.stringify(req.body).slice(0, 1000));

  if (req.method !== "POST") {
    console.log("Rejected: method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("RESEND_API_KEY exists?", !!RESEND_API_KEY);
  console.log("FROM_EMAIL:", FROM_EMAIL);

  if (!RESEND_API_KEY) {
    console.error("FATAL: RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  // --- Payload extraction: support both Hasura Event Trigger & direct API ---
  let booking: BookingData | null = null;

  if (req.body?.event?.data?.new) {
    console.log("Payload format: Hasura Event Trigger");
    booking = req.body.event.data.new as BookingData;
  } else if (req.body?.customer_name) {
    console.log("Payload format: Direct API call");
    booking = req.body as BookingData;
  } else {
    console.error("FATAL: Unrecognized payload structure");
    return res.status(400).json({
      error: "Unrecognized payload structure",
      receivedKeys: Object.keys(req.body),
    });
  }

  console.log("Extracted booking:", JSON.stringify(booking));

  // --- Validate required fields ---
  const missing = REQUIRED_BOOKING_FIELDS.filter((f) => !booking![f]);
  if (missing.length > 0) {
    console.error("FATAL: Missing fields:", missing.join(", "));
    return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
  }

  if (!booking.email) {
    console.error("FATAL: Missing customer email");
    return res.status(400).json({ error: "Missing customer email" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const emailHtml = buildHtmlEmail(booking);

    console.log("Attempting to send email via Resend...");
    console.log("  from:", FROM_EMAIL);
    console.log("  to:", booking.email);
    console.log("  subject includes:", booking.customer_name);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.email,
      subject: `🐾 Booking Received — ${escapeHtml(booking.customer_name)}, your grooming request is confirmed!`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API returned an error:", JSON.stringify(error));
      return res.status(500).json({ error: error.message, details: error });
    }

    console.log("Email sent successfully. Resend response data:", JSON.stringify(data));
    return res.json({ message: "Email sent", id: data?.id });
  } catch (err) {
    console.error("Exception in send-booking-receipt:", err);
    console.error("Stack:", err instanceof Error ? err.stack : "N/A");
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
      ...(err instanceof Error ? { stack: err.stack } : {}),
    });
  }
}
