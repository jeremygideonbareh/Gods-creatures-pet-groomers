import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Loader2, RefreshCw, XCircle, CalendarDays } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RUPEESIGN } from "@/config/site-content";
import { GET_MY_BOOKINGS, UPDATE_BOOKING_STATUS } from "@/lib/graphql";
import { BookingStatusBadge, canRetry, canUserCancel } from "@/lib/booking-status";
import { useCashfreeCheckout } from "@/components/payment/CheckoutGate";
import { nhost, NHOST_FUNCTIONS_URL } from "@/lib/nhost";

interface MyBooking {
  id: string;
  customer_name: string;
  service: string;
  preferred_date: string | null;
  preferred_time: string | null;
  advance_paid: number;
  total_price: number;
  status: string;
  created_at: string;
  notes: string | null;
  addons: string[] | null;
  transaction_id: string;
  pet: { name: string; breed: string | null } | null;
}

interface MyBookingsData {
  bookings: MyBooking[];
}

export function MyBookings() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery<MyBookingsData>(GET_MY_BOOKINGS, {
    skip: !user,
  });
  const [updateStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    refetchQueries: [{ query: GET_MY_BOOKINGS }],
  });
  const { startCheckout } = useCashfreeCheckout();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const handleRetry = async (booking: MyBooking) => {
    setBusyId(booking.id);
    setActionError("");
    try {
      const token = nhost.getUserSession()?.accessToken;
      if (!token) {
        setActionError("Please sign in to retry payment.");
        return;
      }
      const res = await fetch(`${NHOST_FUNCTIONS_URL}/retry-booking-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_id: booking.id }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to start payment retry");
      }
      const { payment_session_id, order_id } = await res.json();
      const result = await startCheckout({
        paymentSessionId: payment_session_id,
        bookingId: booking.id,
        orderId: order_id,
      });
      if (result.status === "success") {
        refetch();
      } else if (result.status === "cancelled") {
        setActionError(
          "Payment was cancelled. Your booking draft is still saved — you can retry anytime.",
        );
      } else if (result.status === "pending") {
        setActionError("Payment was received but confirmation is pending. We will confirm shortly.");
      } else {
        setActionError(result.message);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to retry payment");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setBusyId(id);
    setActionError("");
    try {
      await updateStatus({ variables: { id, status: "cancelled" } });
      setConfirmCancelId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">My Bookings</h2>
          <p className="text-white/60 text-sm mt-1">Track, retry or cancel your grooming appointments</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
          {data?.bookings?.length ?? 0} bookings
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
      )}

      {error && (
        <p className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-3">
          Failed to load bookings: {error.message}
        </p>
      )}

      {actionError && (
        <p role="alert" className="text-amber-200 text-sm text-center bg-amber-500/20 rounded-lg p-3 mb-4">
          {actionError}
        </p>
      )}

      {!loading && !error && data?.bookings?.length === 0 && (
        <div className="text-center py-12">
          <CalendarDays size={48} className="mx-auto text-white/30 mb-3" />
          <p className="text-white/60">No bookings yet — book a groom from the Store.</p>
        </div>
      )}

      {!loading && data?.bookings && data.bookings.length > 0 && (
        <div className="space-y-4">
          {data.bookings.map((booking) => {
            const pet = booking.pet;
            return (
              <div key={booking.id} className="bg-white/10 rounded-2xl p-4 md:p-5 border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">{booking.service}</span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <p className="text-white/50 text-xs">
                      {booking.preferred_date ? `📅 ${booking.preferred_date}` : ""}
                      {booking.preferred_time ? ` • ${booking.preferred_time}` : ""}
                      {pet ? ` • ${pet.name}${pet.breed ? ` (${pet.breed})` : ""}` : ""}
                    </p>
                    {booking.notes && <p className="text-white/40 text-[10px] mt-0.5">📝 {booking.notes}</p>}
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {RUPEESIGN}{booking.advance_paid?.toString() ?? "500"} booking fee • Total{" "}
                      {RUPEESIGN}{(booking.total_price ?? 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {canRetry(booking.status) && (
                      <button
                        onClick={() => handleRetry(booking)}
                        disabled={busyId === booking.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white font-semibold text-xs transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {busyId === booking.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Retrying...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} /> Retry Payment
                          </>
                        )}
                      </button>
                    )}
                    {canUserCancel(booking.status) && (
                      <button
                        onClick={() => setConfirmCancelId(booking.id)}
                        disabled={busyId === booking.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white font-semibold text-xs transition-transform hover:scale-105 hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmCancelId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setConfirmCancelId(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cancel this booking?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your slot will be freed. No payment has been charged for this booking.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(confirmCancelId)}
                disabled={busyId === confirmCancelId}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm disabled:opacity-60"
              >
                {busyId === confirmCancelId ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;