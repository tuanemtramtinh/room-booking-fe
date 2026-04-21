import { createContext, useContext, useState, type ReactNode } from "react";

export type Room = {
  id: string;
  name: string;
  capacity: number;
};

type RoomContextType = {
  rooms: Room[];
  addRoom: (room: Omit<Room, "id">) => void;
  deleteRoom: (id: string) => void;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Phòng Hướng Biển 101", capacity: 2 },
    { id: "2", name: "Phòng Suite Cao Cấp 201", capacity: 4 },
  ]);

  const addRoom = (room: Omit<Room, "id">) => {
    setRooms((prev) => [...prev, { ...room, id: Date.now().toString() }]);
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RoomContext.Provider value={{ rooms, addRoom, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRooms must be used within RoomProvider");
  return ctx;
}
