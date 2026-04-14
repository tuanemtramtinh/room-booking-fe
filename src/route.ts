import { createBrowserRouter } from "react-router";
import ClientAppLayout from "./layouts/ClientAppLayout";
import HomePage from "./pages/clients/home/HomePage";
import DashboardPage from "./pages/admins/dashboard/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: ClientAppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/admin",
        Component: DashboardPage,
      },
    ],
  },
]);

export default router;
