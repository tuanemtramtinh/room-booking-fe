import { Link } from "react-router";
import { useRooms } from "../../../context/RoomContext";

export default function RoomsListPage() {
  const { rooms, deleteRoom } = useRooms();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Danh sách phòng</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {rooms.length} phòng đang quản lý
          </p>
        </div>
        <Link to="/rooms/add" className="btn btn-primary btn-sm gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm phòng mới
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body items-center text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-12 text-base-content/20 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <p className="text-base-content/50 font-medium">Chưa có phòng nào</p>
            <p className="text-sm text-base-content/30 mb-4">
              Bắt đầu bằng cách thêm phòng đầu tiên
            </p>
            <Link to="/rooms/add" className="btn btn-primary btn-sm">
              Thêm phòng ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200/60 text-base-content/70 text-xs uppercase tracking-wider">
                  <th className="w-16">STT</th>
                  <th>Tên phòng</th>
                  <th>Sức chứa</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-base-200/40 transition-colors">
                    <td className="text-base-content/40 font-mono text-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="font-medium text-base-content">{room.name}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {room.capacity} người
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => deleteRoom(room.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
