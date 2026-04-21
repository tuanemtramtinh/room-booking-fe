import { RouterProvider } from "react-router";
import router from "./route";
import { RoomProvider } from "./context/RoomContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <RouterProvider router={router} />
      </RoomProvider>
    </AuthProvider>
  );
}

export default App;
