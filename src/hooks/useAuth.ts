import { createContext, useContext } from "react";

export type Role = "admin" | "guest";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: Role;
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
