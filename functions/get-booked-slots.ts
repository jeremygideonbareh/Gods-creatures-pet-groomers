const NHOST_GRAPHQL_URL = process.env.NHOST_GRAPHQL_URL;
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GetBookedSlotsBody {
  preferred_date?: string;
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

  const body = req.body as GetBookedSlotsBody;

  if (!body?.preferred_date) {
    return res.status(400).set(CORS_HEADERS).json({ error: "Missing required field: preferred_date" });
  }

  try {
    // Public slot availability lookup — auth intentionally NOT required so the
    // booking modal can disable taken slots before a user signs in.
    const query = {
      query: `
        query GetBookedSlots($preferred_date: date!) {
          bookings(where: {
            preferred_date: { _eq: $preferred_date },
            status: { _in: ["pending_verification", "confirmed", "pending_payment"] }
          }) { preferred_time }
        }
      `,
      variables: { preferred_date: body.preferred_date },
    };

    const res2 = await fetch(NHOST_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
      },
      body: JSON.stringify(query),
    });

    const data = await res2.json();

    if (data.errors) {
      console.error("GraphQL error:", JSON.stringify(data.errors));
      return res.status(500).set(CORS_HEADERS).json({ error: "Failed to look up booked slots." });
    }

    const bookedSlots = (data?.data?.bookings ?? [])
      .map((b: any) => b?.preferred_time)
      .filter((t: any): t is string => typeof t === "string" && t.length > 0);

    return res.set(CORS_HEADERS).json({ booked: bookedSlots });
  } catch (err) {
    console.error("get-booked-slots error:", err);
    return res.status(500).set(CORS_HEADERS).json({
      error: err instanceof Error ? err.message : "Failed to look up booked slots",
    });
  }
}
