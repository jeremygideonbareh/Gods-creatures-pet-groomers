import { describe, it, expect } from "vitest";

type ExistingBooking = {
  service: string;
  date: string;
  status: string;
};

function checkBookingConflict(
  service: string,
  date: string,
  existingBookings: ExistingBooking[],
): boolean {
  return existingBookings.some(
    (b) =>
      b.service === service &&
      b.date === date &&
      (b.status === "pending_verification" || b.status === "confirmed"),
  );
}

describe("Double-Booking Prevention", () => {
  it("should detect conflict when same service+date has pending booking", () => {
    const existing: ExistingBooking[] = [
      { service: "Full Groom", date: "2026-07-15", status: "pending_verification" },
    ];
    expect(checkBookingConflict("Full Groom", "2026-07-15", existing)).toBe(true);
  });

  it("should detect conflict when same service+date has confirmed booking", () => {
    const existing: ExistingBooking[] = [
      { service: "Full Groom", date: "2026-07-15", status: "confirmed" },
    ];
    expect(checkBookingConflict("Full Groom", "2026-07-15", existing)).toBe(true);
  });

  it("should NOT detect conflict when same service+date has cancelled booking", () => {
    const existing: ExistingBooking[] = [
      { service: "Full Groom", date: "2026-07-15", status: "cancelled" },
    ];
    expect(checkBookingConflict("Full Groom", "2026-07-15", existing)).toBe(false);
  });

  it("should NOT detect conflict for different service same date", () => {
    const existing: ExistingBooking[] = [
      { service: "Bath Package", date: "2026-07-15", status: "pending_verification" },
    ];
    expect(checkBookingConflict("Full Groom", "2026-07-15", existing)).toBe(false);
  });

  it("should NOT detect conflict for same service different date", () => {
    const existing: ExistingBooking[] = [
      { service: "Full Groom", date: "2026-07-14", status: "pending_verification" },
    ];
    expect(checkBookingConflict("Full Groom", "2026-07-15", existing)).toBe(false);
  });

  it("should return false for empty bookings array", () => {
    expect(checkBookingConflict("Full Groom", "2026-07-15", [])).toBe(false);
  });
});
