import { useState, useCallback } from "react";
import { useApolloClient } from "@apollo/client/react";
import { CHECK_BOOKING_CONFLICT } from "@/lib/graphql";

interface BookingConflictResult {
  checking: boolean;
  error: string | null;
  checkConflict: (service: string, preferredDate: string) => Promise<boolean>;
}

interface ConflictCheckResponse {
  bookings: { id: string; status: string }[];
}

export function useBookingConflict(): BookingConflictResult {
  const apolloClient = useApolloClient();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConflict = useCallback(
    async (service: string, preferredDate: string): Promise<boolean> => {
      setChecking(true);
      setError(null);
      try {
        const { data } = await apolloClient.query<ConflictCheckResponse>({
          query: CHECK_BOOKING_CONFLICT,
          variables: { service, preferred_date: preferredDate },
          fetchPolicy: "network-only",
        });
        const conflicts = data?.bookings?.length ?? 0;
        return conflicts > 0;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to check availability";
        setError(msg);
        console.error("Booking conflict check failed:", msg);
        return false;
      } finally {
        setChecking(false);
      }
    },
    [apolloClient],
  );

  return { checking, error, checkConflict };
}
