import { describe, it, expect } from "vitest";

describe("Session Token Validation", () => {
  function createMockSession(expOffsetSec: number) {
    const payload = { exp: Math.floor(Date.now() / 1000) + expOffsetSec };
    return {
      accessToken: `header.${btoa(JSON.stringify(payload))}.signature`,
    };
  }

  function isSessionValid(session: { accessToken: string } | null): boolean {
    if (!session?.accessToken) return false;
    try {
      const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  it("should detect expired token", () => {
    const expiredSession = createMockSession(-3600);
    expect(isSessionValid(expiredSession)).toBe(false);
  });

  it("should detect valid token", () => {
    const validSession = createMockSession(3600);
    expect(isSessionValid(validSession)).toBe(true);
  });

  it("should return false for null session", () => {
    expect(isSessionValid(null)).toBe(false);
  });

  it("should return false for malformed token", () => {
    const badSession = { accessToken: "not-a-valid-jwt" };
    expect(isSessionValid(badSession)).toBe(false);
  });

  it("should handle token expiring exactly now as expired", () => {
    const exactSession = createMockSession(0);
    expect(isSessionValid(exactSession)).toBe(false);
  });
});
