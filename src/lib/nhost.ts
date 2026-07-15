import { createClient, generateServiceUrl } from "@nhost/nhost-js";

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN || "your-subdomain";
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION || "";

export const nhost = createClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION,
});

export const NHOST_GRAPHQL_URL = generateServiceUrl(
  "graphql",
  NHOST_SUBDOMAIN,
  NHOST_REGION,
);

export const NHOST_FUNCTIONS_URL = generateServiceUrl(
  "functions",
  NHOST_SUBDOMAIN,
  NHOST_REGION,
);

/**
 * Check if the current Nhost JWT session token is still valid
 * by decoding the JWT and checking the `exp` claim against current time.
 */
export function isSessionValid(): boolean {
  const session = nhost.getUserSession();
  if (!session?.accessToken) return false;

  try {
    const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}
