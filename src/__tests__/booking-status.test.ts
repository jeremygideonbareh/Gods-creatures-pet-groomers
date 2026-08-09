import { describe, it, expect } from "vitest";
import { canUserCancel, canRetry, canAdminCancel } from "@/lib/booking-status";

describe("booking-status action guards", () => {
  describe("canUserCancel", () => {
    it("allows pending_payment", () => {
      expect(canUserCancel("pending_payment")).toBe(true);
    });
    it("allows pending_verification", () => {
      expect(canUserCancel("pending_verification")).toBe(true);
    });
    it("blocks payment_failed", () => {
      expect(canUserCancel("payment_failed")).toBe(false);
    });
    it("blocks confirmed (money has moved — refund flow out of scope)", () => {
      expect(canUserCancel("confirmed")).toBe(false);
    });
    it("blocks cancelled", () => {
      expect(canUserCancel("cancelled")).toBe(false);
    });
  });

  describe("canRetry", () => {
    it("allows pending_payment", () => {
      expect(canRetry("pending_payment")).toBe(true);
    });
    it("allows payment_failed", () => {
      expect(canRetry("payment_failed")).toBe(true);
    });
    it("blocks pending_verification", () => {
      expect(canRetry("pending_verification")).toBe(false);
    });
    it("blocks confirmed", () => {
      expect(canRetry("confirmed")).toBe(false);
    });
    it("blocks cancelled", () => {
      expect(canRetry("cancelled")).toBe(false);
    });
  });

  describe("canAdminCancel", () => {
    it("allows pending_payment", () => {
      expect(canAdminCancel("pending_payment")).toBe(true);
    });
    it("allows payment_failed", () => {
      expect(canAdminCancel("payment_failed")).toBe(true);
    });
    it("allows pending_verification", () => {
      expect(canAdminCancel("pending_verification")).toBe(true);
    });
    it("blocks confirmed", () => {
      expect(canAdminCancel("confirmed")).toBe(false);
    });
    it("blocks cancelled", () => {
      expect(canAdminCancel("cancelled")).toBe(false);
    });
  });
});