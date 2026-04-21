import { RouterProvider } from "react-router";
import router from "./route";
import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <RoomProvider>
      <RouterProvider router={router} />
    </RoomProvider>
  );
}

export default App;
