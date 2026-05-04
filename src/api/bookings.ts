import axiosInstance from "./axiosInstance";
import type { Booking, BookingStatus, CreateBookingDTO } from "../types/booking";

export const bookingApi = {
  create: (dto: CreateBookingDTO): Promise<Booking> =>
    axiosInstance.post<Booking>("/api/bookings", dto).then((r) => r.data),

  getAll: (status?: BookingStatus): Promise<Booking[]> =>
    axiosInstance
      .get<Booking[]>("/api/bookings", { params: status ? { status } : undefined })
      .then((r) => r.data),

  approve: (id: number): Promise<Booking> =>
    axiosInstance.put<Booking>(`/api/bookings/${id}/approve`).then((r) => r.data),

  reject: (id: number, rejectReason?: string): Promise<Booking> =>
    axiosInstance
      .put<Booking>(`/api/bookings/${id}/reject`, { rejectReason })
      .then((r) => r.data),

  getHistory: (): Promise<Booking[]> =>
    axiosInstance.get<Booking[]>("/api/bookings/history").then((r) => r.data),
};
