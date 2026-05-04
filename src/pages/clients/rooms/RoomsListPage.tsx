import { Link } from "react-router";
import { useRoomsQuery } from "../../../hooks/useRoomsQuery";


export default function RoomsListPage() {
  const { data: rooms, isLoading, isError } = useRoomsQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Danh sách phòng</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {rooms ? `${rooms.length} phòng đang quản lý` : "Đang tải..."}
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

      {/* Loading */}
      {isLoading && (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body items-center py-16">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="text-sm text-base-content/40 mt-2">Đang tải danh sách phòng...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Không thể tải danh sách phòng. Vui lòng kiểm tra kết nối.</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && rooms?.length === 0 && (
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
            <Link to="/rooms/add" className="btn btn-primary btn-sm mt-4">
              Thêm phòng ngay
            </Link>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && rooms && rooms.length > 0 && (
        <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200/60 text-base-content/70 text-xs uppercase tracking-wider">
                  <th className="w-14">STT</th>
                  <th>Tên phòng</th>
                  <th>Vị trí</th>
                  <th>Sức chứa</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, idx) => {
                  return (
                    <tr key={room.id} className="hover:bg-base-200/40 transition-colors">
                      <td className="text-base-content/40 font-mono text-sm">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td>
                        <Link
                          to={`/rooms/${room.id}`}
                          className="font-medium text-base-content hover:text-primary transition-colors"
                        >
                          {room.name}
                        </Link>
                        {room.description && (
                          <div className="text-xs text-base-content/40 mt-0.5 truncate max-w-xs">
                            {room.description}
                          </div>
                        )}
                      </td>
                      <td className="text-sm text-base-content/70">{room.location || "—"}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {room.capacity} người
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
