import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomApi } from "../api/rooms";
import type { CreateRoomDTO } from "../types/room";

export const ROOMS_QUERY_KEY = ["rooms"] as const;

export function useRoomsQuery() {
  return useQuery({
    queryKey: ROOMS_QUERY_KEY,
    queryFn: roomApi.getAll,
  });
}

export function useRoomDetailQuery(id: number) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRoomDTO) => roomApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });
}
