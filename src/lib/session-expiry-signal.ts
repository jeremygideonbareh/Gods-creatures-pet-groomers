/**
 * Session-expiry signal — tiny pub/sub used to raise the "session refresh failed"
 * event so the SessionExpiryGate can trigger the SessionErrorBoundary UI.
 *
 * The auth hot path (main.tsx authLink) must NEVER call signOut on token expiry;
 * instead it raises this signal and the boundary shows the full-screen
 * "Session Expired — Sign In Again" UI (user-approved behavior).
 */

export type SessionExpiryListener = () => void;

const listeners = new Set<SessionExpiryListener>();

/**
 * Subscribe to the session-expiry signal. Returns an unsubscribe function.
 */
export function onSessionExpiry(listener: SessionExpiryListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Raise the session-expiry signal. Calls every subscribed listener exactly once.
 * Safe to call with zero listeners (no-op).
 */
export function raiseSessionExpiry(): void {
  for (const listener of [...listeners]) {
    listener();
  }
}