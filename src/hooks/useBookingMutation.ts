import { useMutation } from "@tanstack/react-query";
import { bookingApi } from "../api/bookings";
import type { CreateBookingDTO } from "../types/booking";

export function useCreateBookingMutation() {
  return useMutation({
    mutationFn: (dto: CreateBookingDTO) => bookingApi.create(dto),
  });
}
