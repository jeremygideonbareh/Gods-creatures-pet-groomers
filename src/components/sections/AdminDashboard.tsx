import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, Loader2, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { designTokens } from "@/config/site-content";
import ContentEditor from "@/components/sections/ContentEditor";
import { GET_ADMIN_BOOKINGS, UPDATE_BOOKING_STATUS } from "@/lib/graphql";

const BRAND_PINK = designTokens.brandPink;

const statusBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending_verification: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-200",
    icon: <Clock size={14} />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-500/20 text-green-200",
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/20 text-red-200",
    icon: <AlertTriangle size={14} />,
  },
};

interface Booking {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  service: string;
  preferred_date: string | null;
  notes: string | null;
  advance_paid: number;
  transaction_id: string;
  status: string;
  created_at: string;
  pet: { name: string; breed: string | null } | null;
  user: { email: string } | null;
}

interface BookingsData {
  bookings: Booking[];
}

export function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState<"bookings" | "content">("bookings");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { data, loading, error } = useQuery<BookingsData>(GET_ADMIN_BOOKINGS, { skip: adminTab !== "bookings" });
  const [updateStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    refetchQueries: [{ query: GET_ADMIN_BOOKINGS }],
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/", { replace: true });
  }, [authLoading, user, navigate]);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? "";
  const isAdmin = user?.email === adminEmail;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_PINK }}>
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 text-center max-w-md">
          <AlertTriangle size={48} className="mx-auto text-white/50 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60 mb-6">You do not have permission to access this page.</p>
          <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-full bg-white font-semibold text-sm" style={{ color: BRAND_PINK }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleConfirm = async (id: string) => {
    setConfirmingId(id);
    try {
      await updateStatus({ variables: { id, status: "confirmed" } });
    } catch (err) {
      console.error("Failed to confirm booking:", err);
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_PINK }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setAdminTab("bookings")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              adminTab === "bookings"
                ? "bg-white text-pink-700"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            📋 Bookings
          </button>
          <button
            onClick={() => setAdminTab("content")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              adminTab === "content"
                ? "bg-white text-pink-700"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <FileText size={16} /> Content
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30">
          {adminTab === "content" ? (
            <ContentEditor />
          ) : (
            <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60 text-sm mt-1">{user?.email} • All Bookings</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
              {data?.bookings?.length ?? 0} bookings
            </span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={36} className="animate-spin text-white" />
            </div>
          )}

          {error && (
            <p className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-3">
              Failed to load bookings: {error.message}
            </p>
          )}

          {!loading && !error && data?.bookings?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/60">No bookings yet.</p>
            </div>
          )}

          {!loading && data?.bookings && (
            <div className="space-y-3">
              {data.bookings.map((booking: Booking) => {
                const pet = booking.pet;
                const badge = statusBadge[booking.status ?? "pending_verification"] ?? statusBadge.pending_verification;

                return (
                  <div key={booking.id} className="bg-white/10 rounded-2xl p-4 md:p-5 border border-white/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{booking.customer_name}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
                            {badge.icon} {badge.label}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs">
                          {booking.email}
                          {booking.user?.email ? ` • user: ${booking.user.email}` : ""}
                          {booking.phone ? ` • ${booking.phone}` : ""}
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                          {booking.service}
                          {booking.preferred_date ? ` • ${booking.preferred_date}` : ""}
                          {pet ? ` • ${pet.name}${pet.breed ? ` (${pet.breed})` : ""}` : ""}
                        </p>
                        {booking.notes && <p className="text-white/40 text-[10px] mt-0.5">📝 {booking.notes}</p>}
                        <p className="text-white/30 text-[10px] mt-0.5">
                          ₹{booking.advance_paid?.toString() ?? "500"} • UPI: {booking.transaction_id}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {booking.status === "pending_verification" && (
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            disabled={confirmingId === booking.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white font-semibold text-xs transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ color: BRAND_PINK }}
                          >
                            {confirmingId === booking.id ? (
                              <><Loader2 size={14} className="animate-spin" /> Confirming</>
                            ) : (
                              <><CheckCircle size={14} /> Confirm</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
