import { nhost } from "@/lib/nhost";

/**
 * Nhost's password-reset email points at the auth service's /verify endpoint.
 * On success that endpoint redirects back to the app with a refresh token in
 * the URL, e.g.
 *
 *   https://godscreaturespet.in/?refreshToken=<uuid>&type=passwordReset
 *
 * The SDK does not consume that automatically, so nothing used to happen: the
 * link just landed on the homepage and the user was never able to set a new
 * password. This exchanges the token for a real session so that
 * `changeUserPassword` — which requires an authenticated caller — can run.
 */

const RESET_TYPES = new Set(["passwordReset", "passwordreset"]);

/** Read a param from either the query string or the hash fragment. */
function readParam(name: string): string | null {
  const { search, hash } = window.location;
  const fromSearch = new URLSearchParams(search).get(name);
  if (fromSearch) return fromSearch;
  // Nhost has used a hash fragment in some versions; accept both.
  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(rawHash).get(name);
}

/** Strip the reset params so a refresh doesn't retry a now-spent token. */
function cleanUrl(): void {
  const url = new URL(window.location.href);
  ["refreshToken", "type", "error", "errorDescription"].forEach((p) => url.searchParams.delete(p));
  url.hash = "";
  window.history.replaceState({}, document.title, url.pathname + url.search);
}

export interface PasswordResetLanding {
  status: "none" | "ready" | "error";
  message?: string;
}

/**
 * Detect a password-reset landing and, if present, establish a session from it.
 *
 * @returns "ready" when the caller should prompt for a new password.
 */
export async function consumePasswordResetFromUrl(): Promise<PasswordResetLanding> {
  if (typeof window === "undefined") return { status: "none" };

  const type = readParam("type");
  const refreshToken = readParam("refreshToken");

  // Nhost reports a failed/expired ticket by redirecting back with an error.
  const error = readParam("error");
  if (error && type && RESET_TYPES.has(type)) {
    cleanUrl();
    return {
      status: "error",
      message:
        readParam("errorDescription") ||
        "That reset link is invalid or has expired. Please request a new one.",
    };
  }

  if (!refreshToken || !type || !RESET_TYPES.has(type)) return { status: "none" };

  try {
    // updateSessionFromResponseMiddleware (wired by createClient) persists the
    // returned session, so getUserSession() is populated after this call.
    await nhost.auth.refreshToken({ refreshToken });
  } catch {
    cleanUrl();
    return {
      status: "error",
      message: "That reset link is invalid or has expired. Please request a new one.",
    };
  }

  cleanUrl();

  if (!nhost.getUserSession()) {
    return {
      status: "error",
      message: "Could not start a session from that link. Please request a new one.",
    };
  }

  return { status: "ready" };
}
