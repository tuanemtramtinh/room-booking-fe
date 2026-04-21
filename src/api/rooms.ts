import axiosInstance from "./axiosInstance";
import type { Room, CreateRoomDTO } from "../types/room";

export const roomApi = {
  getAll: (): Promise<Room[]> =>
    axiosInstance.get<Room[]>("/api/rooms").then((r) => r.data),

  create: (dto: CreateRoomDTO): Promise<Room> =>
    axiosInstance.post<Room>("/api/rooms", dto).then((r) => r.data),
};
