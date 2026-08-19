// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MyBookings from "@/components/MyBookings";

const { mockState } = vi.hoisted(() => ({
  mockState: { bookings: [] as any[] },
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", displayName: "A" },
    loading: false,
    sessionError: null,
  }),
}));

vi.mock("@/context/SiteContentContext", () => ({
  useSiteContent: () => ({
    content: {
      booking: {
        whatsappNumber: "910000000000",
        whatsappConfirmMessage: "Please send your payment screenshot",
      },
    },
  }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({
    data: { bookings: mockState.bookings },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMutation: () => [vi.fn()],
}));

vi.mock("@/components/payment/CheckoutGate", () => ({
  useCashfreeCheckout: () => ({ startCheckout: vi.fn(), loading: false }),
}));

vi.mock("@/lib/nhost", () => ({
  nhost: { getUserSession: () => ({ accessToken: "tok" }) },
  NHOST_FUNCTIONS_URL: "https://functions.test",
}));

const makeBooking = (id: string, status: string) => ({
  id,
  customer_name: "A",
  service: "Full Groom",
  preferred_date: "2026-08-10",
  preferred_time: "10:00 AM",
  advance_paid: 500,
  total_price: 1500,
  status,
  created_at: "2026-08-09",
  notes: null,
  addons: null,
  transaction_id: `tx_${id}`,
  pet: { name: "Bruno", breed: "Lab" },
});

describe("MyBookings", () => {
  beforeEach(() => {
    mockState.bookings = [
      makeBooking("b1", "pending_payment"),
      makeBooking("b2", "confirmed"),
      makeBooking("b3", "payment_failed"),
      makeBooking("b4", "pending_verification"),
      makeBooking("b5", "cancelled"),
    ];
  });

  it("renders Retry Payment only for pending_payment and payment_failed bookings", () => {
    render(<MyBookings />);
    expect(screen.getAllByText("Retry Payment")).toHaveLength(2);
  });

  it("renders Cancel only for pending_payment and pending_verification bookings", () => {
    render(<MyBookings />);
    expect(screen.getAllByText("Cancel")).toHaveLength(2);
  });

  it("renders status badges for every booking", () => {
    render(<MyBookings />);
    expect(screen.getByText("Payment Pending")).toBeTruthy();
    expect(screen.getByText("Confirmed")).toBeTruthy();
    expect(screen.getByText("Payment Failed")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
    expect(screen.getByText("Cancelled")).toBeTruthy();
  });

  it("renders the empty state when there are no bookings", () => {
    mockState.bookings = [];
    render(<MyBookings />);
    expect(screen.getByText(/No bookings yet/)).toBeTruthy();
  });

  it("renders the WhatsApp payment-proof link only on pending_verification bookings", () => {
    render(<MyBookings />);
    const links = screen.getAllByRole("link", { name: /Send payment proof on WhatsApp/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://wa.me/910000000000");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });
});