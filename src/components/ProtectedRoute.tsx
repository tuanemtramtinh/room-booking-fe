import { Navigate, useLocation } from "react-router";
import { useAuth, type Role } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
