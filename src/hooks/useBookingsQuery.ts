import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "../api/bookings";

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export function useBookingsQuery() {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: () => bookingApi.getAll(),
  });
}

export function useApproveBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bookingApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}

export function useBookingHistoryQuery() {
  return useQuery({
    queryKey: ["bookings", "history"],
    queryFn: () => bookingApi.getHistory(),
  });
}

export function useRejectBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectReason }: { id: number; rejectReason?: string }) =>
      bookingApi.reject(id, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}
