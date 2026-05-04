import { Navigate, useLocation } from "react-router";
import { useAuth, type Role } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
  loginPath?: string;
};

export default function ProtectedRoute({ children, requiredRole, loginPath = "/login" }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
