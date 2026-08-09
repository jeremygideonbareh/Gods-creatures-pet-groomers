import { useEffect, useState } from "react";
import { onSessionExpiry } from "@/lib/session-expiry-signal";

/**
 * SessionExpiryGate — when the session-expiry signal fires (refresh failed in the
 * auth hot path), this component throws during render so the nearest error
 * boundary (SessionErrorBoundary) catches it and shows its full-screen
 * "Session Expired — Sign In Again" UI.
 *
 * Deterministic render-throw pattern: the throw happens in render, which error
 * boundaries catch reliably (no effect-throw ambiguity).
 */
export function SessionExpiryGate() {
  const [expired, setExpired] = useState(false);

  useEffect(() => onSessionExpiry(() => setExpired(true)), []);

  if (expired) {
    throw new Error("Session expired. Please sign in again.");
  }

  return null;
}

export default SessionExpiryGate;