import { describe, it, expect, vi } from "vitest";
import { onSessionExpiry, raiseSessionExpiry } from "@/lib/session-expiry-signal";

describe("session-expiry-signal", () => {
  it("raise fires all subscribed listeners exactly once", () => {
    const a = vi.fn();
    const b = vi.fn();
    onSessionExpiry(a);
    onSessionExpiry(b);

    raiseSessionExpiry();

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe stops future calls", () => {
    const a = vi.fn();
    const unsubscribe = onSessionExpiry(a);
    unsubscribe();

    raiseSessionExpiry();

    expect(a).not.toHaveBeenCalled();
  });

  it("raise with no listeners is a no-op", () => {
    expect(() => raiseSessionExpiry()).not.toThrow();
  });
});