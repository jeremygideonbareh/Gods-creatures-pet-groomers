import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { NHOST_FUNCTIONS_URL } from "@/lib/nhost";

declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget: string;
      }) => Promise<{
        error?: boolean;
        paymentDetails?: {
          orderId: string;
          paymentId: string;
          paymentMessage: string;
        };
      }>;
    };
  }
}

/**
 * Load the Cashfree checkout SDK once. Resolves immediately if already loaded.
 * Rejects on script load failure.
 */
export function loadCashfreeScript(): Promise<void> {
  if (document.getElementById("cashfree-sdk")) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "cashfree-sdk";
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree payment gateway."));
    document.body.appendChild(script);
  });
}

export type CheckoutResult =
  | { status: "success"; bookingId: string; orderId: string }
  | { status: "cancelled" }
  | { status: "pending" }
  | { status: "error"; message: string };

/**
 * Shared Cashfree checkout flow: open the SDK checkout for a payment session,
 * then confirm the booking server-side via confirm-booking. Used by BOTH the
 * storefront booking modal and the MyBookings retry path so there is exactly
 * one checkout implementation.
 */
export function useCashfreeCheckout() {
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(
    async (params: {
      paymentSessionId: string;
      bookingId: string;
      orderId: string;
    }): Promise<CheckoutResult> => {
      setLoading(true);
      try {
        if (!window.Cashfree) {
          try {
            await loadCashfreeScript();
          } catch {
            return { status: "error", message: "Failed to load Cashfree payment gateway." };
          }
          if (!window.Cashfree) {
            return {
              status: "error",
              message: "Cashfree payment gateway failed to load. Please refresh and try again.",
            };
          }
        }

        const cashfree = window.Cashfree({ mode: import.meta.env.VITE_CASHFREE_MODE || "sandbox" });
        const result = await cashfree.checkout({
          paymentSessionId: params.paymentSessionId,
          redirectTarget: "_modal",
        });

        if (result.error) {
          // Payment cancelled or failed — booking stays as "pending_payment"
          return { status: "cancelled" };
        }

        const confirmRes = await fetch(`${NHOST_FUNCTIONS_URL}/confirm-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: params.bookingId,
            order_id: params.orderId,
            payment_id: result.paymentDetails?.paymentId,
          }),
        });

        const confirmData = await confirmRes.json();

        if (confirmData.success) {
          return { status: "success", bookingId: params.bookingId, orderId: params.orderId };
        }
        return { status: "pending" };
      } catch (err) {
        return {
          status: "error",
          message: err instanceof Error ? err.message : "Failed to process payment",
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { startCheckout, loading };
}

interface CheckoutGateProps {
  paymentSessionId: string;
  bookingId: string;
  orderId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onCancelled?: () => void;
  buttonLabel?: string;
}

/**
 * Thin button wrapper around useCashfreeCheckout for call sites that already
 * hold a payment session (e.g. a retry flow that fetched a fresh session).
 */
export function CheckoutGate({
  paymentSessionId,
  bookingId,
  orderId,
  onSuccess,
  onError,
  onCancelled,
  buttonLabel = "Pay ₹500 via Cashfree",
}: CheckoutGateProps) {
  const { startCheckout, loading } = useCashfreeCheckout();

  const handleClick = async () => {
    const result = await startCheckout({ paymentSessionId, bookingId, orderId });
    if (result.status === "success") {
      onSuccess?.();
    } else if (result.status === "cancelled") {
      onCancelled?.();
    } else if (result.status === "pending") {
      onError?.(
        "Payment was received but booking confirmation is pending. Your booking will be confirmed shortly.",
      );
    } else {
      onError?.(result.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white font-semibold text-xs transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" /> Opening Payment...
        </>
      ) : (
        buttonLabel
      )}
    </button>
  );
}