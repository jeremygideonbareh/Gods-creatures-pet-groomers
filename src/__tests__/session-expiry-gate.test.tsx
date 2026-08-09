// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import SessionErrorBoundary from "@/components/SessionErrorBoundary";
import SessionExpiryGate from "@/components/SessionExpiryGate";
import { raiseSessionExpiry } from "@/lib/session-expiry-signal";

describe("SessionExpiryGate", () => {
  it("shows the Session Expired fallback when the signal is raised", () => {
    render(
      <SessionErrorBoundary onSessionExpired={() => {}}>
        <SessionExpiryGate />
        <span>content</span>
      </SessionErrorBoundary>,
    );

    act(() => {
      raiseSessionExpiry();
    });

    expect(screen.getByText("Session Expired")).toBeTruthy();
    expect(screen.getByText("Sign In Again")).toBeTruthy();
    expect(screen.queryByText("content")).toBeNull();
  });

  it("renders children intact when no signal is raised", () => {
    render(
      <SessionErrorBoundary onSessionExpired={() => {}}>
        <SessionExpiryGate />
        <span>content</span>
      </SessionErrorBoundary>,
    );

    expect(screen.getByText("content")).toBeTruthy();
    expect(screen.queryByText("Session Expired")).toBeNull();
  });
});