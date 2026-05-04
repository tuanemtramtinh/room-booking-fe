import type { Booking } from "./booking";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "INACTIVE";

export type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  status: RoomStatus;
};

export type RoomDetail = Room & {
  bookings: Booking[];
};

export type CreateRoomDTO = Omit<Room, "id">;
