import axiosInstance from "./axiosInstance";
import type { Room, RoomDetail, CreateRoomDTO } from "../types/room";

export const roomApi = {
  getAll: (): Promise<Room[]> =>
    axiosInstance.get<Room[]>("/api/rooms").then((r) => r.data),

  getById: (id: number): Promise<RoomDetail> =>
    axiosInstance.get<RoomDetail>(`/api/rooms/${id}`).then((r) => r.data),

  create: (dto: CreateRoomDTO): Promise<Room> =>
    axiosInstance.post<Room>("/api/rooms", dto).then((r) => r.data),
};
