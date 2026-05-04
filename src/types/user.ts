export type UserRole = "ADMIN" | "STAFF";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type User = {
  id: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
};

export type UserFilters = {
  role?: UserRole;
  status?: UserStatus;
  keyword?: string;
};

export type UpdateUserDTO = {
  fullName: string;
};
