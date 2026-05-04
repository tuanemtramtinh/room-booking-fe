import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/users";
import type { UserFilters, UpdateUserDTO } from "../types/user";

export const USERS_QUERY_KEY = ["users"] as const;

export function useUsersQuery(filters?: UserFilters) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, filters],
    queryFn: () => userApi.getAll(filters),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserDTO }) =>
      userApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
