import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "../hooks/useAuth";
import { removeAccessToken } from "../api/auth";

const STORAGE_KEY = "roombook_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (user: AuthUser) => setUser(user);
  const logout = () => {
    removeAccessToken();
    setUser(null);
  };
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
