import { createBrowserRouter, redirect } from "react-router";
import ClientAppLayout from "./layouts/ClientAppLayout";
import RoomsListPage from "./pages/clients/rooms/RoomsListPage";
import AddRoomPage from "./pages/clients/rooms/AddRoomPage";
import BookingPage from "./pages/clients/booking/BookingPage";

const router = createBrowserRouter([
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
        Component: AddRoomPage,
      },
      {
        path: "booking",
        Component: BookingPage,
      },
    ],
  },
]);

export default router;
