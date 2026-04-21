export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  status: RoomStatus;
};

export type CreateRoomDTO = Omit<Room, "id">;
