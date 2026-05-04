import type { User } from "./user";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type Booking = {
  id: number;
  userId: number;
  requester?: User | null;
  roomId: number;
  title: string;
  description: string | null;
  attendeeCount: number | null;
  startDate: string;      // yyyy-MM-dd
  startHour: string;      // HH:mm:ss
  endHour: string;        // HH:mm:ss
  status: BookingStatus;
  rejectReason: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingDTO = {
  roomId: number;
  title: string;
  description?: string;
  attendeeCount?: number;
  startDate: string;      // yyyy-MM-dd
  startHour: string;      // HH:mm:ss
  endHour: string;        // HH:mm:ss
};
