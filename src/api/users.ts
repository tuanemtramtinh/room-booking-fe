import axiosInstance from "./axiosInstance";
import type { User, UserFilters, UpdateUserDTO } from "../types/user";

export const userApi = {
  getAll: (filters?: UserFilters): Promise<User[]> =>
    axiosInstance
      .get<User[]>("/api/users", {
        params: {
          ...(filters?.role && { role: filters.role }),
          ...(filters?.status && { status: filters.status }),
          ...(filters?.keyword && { keyword: filters.keyword }),
        },
      })
      .then((r) => r.data),

  update: (id: number, dto: UpdateUserDTO): Promise<User> =>
    axiosInstance
      .put<User>(`/api/users/${id}`, dto)
      .then((r) => r.data),
};
