import type { ReactNode } from "react";
import { Clock, CheckCircle, AlertTriangle, X } from "lucide-react";

/**
 * Shared booking-status presentation + action guards.
 * Single source of truth for status badges (AdminDashboard + MyBookings) and
 * the cancel/retry eligibility matrix:
 *   - USER can cancel: pending_payment, pending_verification
 *   - USER can retry:  pending_payment, payment_failed
 *   - ADMIN can cancel: pending_payment, payment_failed, pending_verification
 *   - confirmed is NEVER cancellable here (money has moved -> refund flow, out of scope)
 */
export const statusBadge: Record<string, { label: string; color: string; icon: ReactNode }> = {
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
  pending_payment: {
    label: "Payment Pending",
    color: "bg-blue-500/20 text-blue-200",
    icon: <Clock size={14} />,
  },
  payment_failed: {
    label: "Payment Failed",
    color: "bg-red-500/20 text-red-200",
    icon: <AlertTriangle size={14} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-500/20 text-gray-200",
    icon: <X size={14} />,
  },
};

export function canUserCancel(status: string): boolean {
  return status === "pending_payment" || status === "pending_verification";
}

export function canRetry(status: string): boolean {
  return status === "pending_payment" || status === "payment_failed";
}

export function canAdminCancel(status: string): boolean {
  return status === "pending_payment" || status === "payment_failed" || status === "pending_verification";
}

export function BookingStatusBadge({ status }: { status: string }) {
  const badge = statusBadge[status] ?? statusBadge.pending_verification;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
      {badge.icon} {badge.label}
    </span>
  );
}