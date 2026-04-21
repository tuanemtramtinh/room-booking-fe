import { createBrowserRouter, redirect } from "react-router";
import ClientAppLayout from "./layouts/ClientAppLayout";
import RoomsListPage from "./pages/clients/rooms/RoomsListPage";
import AddRoomPage from "./pages/clients/rooms/AddRoomPage";
import BookingPage from "./pages/clients/booking/BookingPage";
import LoginPage from "./pages/auth/LoginPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  // Login — standalone, outside the main layout
  {
    path: "/login",
    Component: LoginPage,
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
          <ProtectedRoute requiredRole="admin">
            <AddRoomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute>
            <BookingPage />
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
