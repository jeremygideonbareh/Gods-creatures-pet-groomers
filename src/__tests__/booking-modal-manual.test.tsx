// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingModal from "@/components/ui/booking-modal";

const { bookingContent, pricingMenu, startCheckoutMock } = vi.hoisted(() => ({
  bookingContent: {
    modalTitle: "Book a Session",
    modalSubtitle: "Schedule your pet's grooming",
    bookingFeeLabel: "Booking Fee",
    bookingFeeDetail: "500 fee required",
    proceedCta: "Proceed to Schedule",
    questionsCta: "Questions? Call us",
    formTitle: "Tell us about your pet",
    formSubtitle: "Fill in the details",
    submittingLabel: "Submitting...",
    successEmoji: "🎉",
    successTitle: "Booking Submitted!",
    successMessage: "We'll get back to you soon",
    advancePaymentTitle: "Advance Payment Required",
    advancePaymentDetail: "Pay 500 via UPI to confirm your slot",
    whatsappConfirmMessage: "Send your payment screenshot on WhatsApp",
    whatsappNumber: "918798897732",
  },
  pricingMenu: {
    basicServices: [
      { id: "bath", label: "Bath & Brush", prices: { cat: 400, small: 500, medium: 600, large: 700, xlarge: 800 } },
    ],
    completePackages: [],
    addOnServices: [],
    boardingRates: {
      label: "Boarding (per day)",
      rates: { small: 400, medium: 500, large: 600, xlarge: 700 },
      note: "note",
      phone: "8798897732",
      cta: "Call to book",
    },
  },
  startCheckoutMock: vi.fn(),
}));

vi.mock("@/context/SiteContentContext", () => ({
  useSiteContent: () => ({
    content: { booking: bookingContent, pricingMenu },
  }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", displayName: "A" },
    loading: false,
    sessionError: null,
  }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({
    data: { pets: [] },
    loading: false,
    error: null,
  }),
}));

vi.mock("@/lib/nhost", () => ({
  nhost: { getUserSession: () => ({ accessToken: "tok" }) },
  NHOST_FUNCTIONS_URL: "https://functions.test",
}));

vi.mock("@/components/payment/CheckoutGate", () => ({
  useCashfreeCheckout: () => ({ startCheckout: startCheckoutMock, loading: false }),
  loadCashfreeScript: vi.fn().mockResolvedValue(undefined),
}));

describe("BookingModal manual payment mode", () => {
  beforeEach(() => {
    startCheckoutMock.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: RequestInfo | URL) => {
        const u = String(url);
        if (u.includes("get-booked-slots")) {
          return { ok: true, json: async () => ({ booked: [] }) };
        }
        if (u.includes("create-booking-order")) {
          return { ok: true, json: async () => ({ payment_mode: "manual", booking_id: "b1" }) };
        }
        throw new Error("unexpected fetch: " + u);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function fillFormAndSubmit() {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(bookingContent.proceedCta) }));
    fireEvent.change(await screen.findByPlaceholderText("Phone number"), { target: { value: "9876543210" } });
    fireEvent.click(screen.getByRole("button", { name: /Small \(Up to 10kg\)/ }));
    fireEvent.click(screen.getByRole("button", { name: /Bath & Brush/ }));
    // Monday 2026-08-24 has slots ["09:00", "14:00", "16:00"]
    fireEvent.change(screen.getByLabelText("Preferred date"), { target: { value: "2026-08-24" } });
    await waitFor(() =>
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("get-booked-slots"),
        expect.anything(),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "09:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Book" }));
  }

  it("shows WhatsApp payment instructions instead of launching Cashfree when payment_mode is manual", async () => {
    render(<BookingModal isOpen={true} onClose={vi.fn()} />);

    await fillFormAndSubmit();

    await screen.findByText(bookingContent.successTitle);

    // Manual branch: success panel shows payment instructions + WhatsApp proof link
    expect(screen.getByText(bookingContent.advancePaymentTitle)).toBeTruthy();
    expect(screen.getByText(bookingContent.advancePaymentDetail)).toBeTruthy();
    expect(screen.getByText(bookingContent.whatsappConfirmMessage)).toBeTruthy();

    const waLink = screen.getByRole("link", { name: "Send Proof on WhatsApp" });
    expect(waLink).toHaveAttribute("href", `https://wa.me/${bookingContent.whatsappNumber}`);
    expect(waLink).toHaveAttribute("target", "_blank");
    expect(waLink).toHaveAttribute("rel", "noopener noreferrer");

    // The Cashfree checkout must NOT be triggered in manual mode
    expect(startCheckoutMock).not.toHaveBeenCalled();

    // Booking was created server-side with the right payload
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    const orderCall = fetchMock.mock.calls.find(([url]) => String(url).includes("create-booking-order"));
    expect(orderCall).toBeTruthy();
    const body = JSON.parse((orderCall![1] as RequestInit).body as string);
    expect(body.preferred_date).toBe("2026-08-24");
    expect(body.preferred_time).toBe("09:00");
  });

  it("still launches the Cashfree checkout when payment_mode is cashfree", async () => {
    startCheckoutMock.mockResolvedValue({ status: "success" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: RequestInfo | URL) => {
        const u = String(url);
        if (u.includes("get-booked-slots")) {
          return { ok: true, json: async () => ({ booked: [] }) };
        }
        if (u.includes("create-booking-order")) {
          return {
            ok: true,
            json: async () => ({
              payment_mode: "cashfree",
              payment_session_id: "ps1",
              booking_id: "b2",
              cashfree_order_id: "co1",
            }),
          };
        }
        throw new Error("unexpected fetch: " + u);
      }),
    );

    render(<BookingModal isOpen={true} onClose={vi.fn()} />);

    await fillFormAndSubmit();

    await waitFor(() => expect(startCheckoutMock).toHaveBeenCalledTimes(1));
    expect(startCheckoutMock).toHaveBeenCalledWith({
      paymentSessionId: "ps1",
      bookingId: "b2",
      orderId: "co1",
    });

    // No WhatsApp proof link in the Cashfree success path
    await screen.findByText(bookingContent.successTitle);
    expect(screen.queryByRole("link", { name: "Send Proof on WhatsApp" })).toBeNull();
  });
});
