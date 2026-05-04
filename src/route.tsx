import { createBrowserRouter, redirect } from "react-router";
import ClientAppLayout from "./layouts/ClientAppLayout";
import RoomsListPage from "./pages/clients/rooms/RoomsListPage";
import AddRoomPage from "./pages/clients/rooms/AddRoomPage";
import RoomDetailPage from "./pages/clients/rooms/RoomDetailPage";
import BookingPage from "./pages/clients/booking/BookingPage";
import BookingHistoryPage from "./pages/clients/booking/BookingHistoryPage";
import BookingsManagementPage from "./pages/admins/bookings/BookingsManagementPage";
import LoginPage from "./pages/auth/LoginPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  // Client login — Google OAuth
  {
    path: "/login",
    Component: LoginPage,
  },

  // Admin login — email + password
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },

  // Main app layout
  {
    path: "/",
    Component: ClientAppLayout,
    children: [
      {
        index: true,
        loader: () => redirect("/rooms"),
      },
      {
        path: "rooms",
        Component: RoomsListPage,
      },
      {
        path: "rooms/add",
        element: (
          <ProtectedRoute requiredRole="admin" loginPath="/admin/login">
            <AddRoomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rooms/:id",
        Component: RoomDetailPage,
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute requiredRole="guest">
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking/history",
        element: (
          <ProtectedRoute requiredRole="guest">
            <BookingHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/bookings",
        element: (
          <ProtectedRoute requiredRole="admin" loginPath="/admin/login">
            <BookingsManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "unauthorized",
        Component: UnauthorizedPage,
      },
    ],
  },
]);

export default router;
