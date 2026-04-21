import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useRooms } from "../../../context/RoomContext";

export default function AddRoomPage() {
  const { addRoom } = useRooms();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoom({ name: name.trim(), capacity: Number(capacity) });
    navigate("/rooms");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Link
          to="/rooms"
          className="text-sm text-base-content/50 hover:text-base-content transition-colors flex items-center gap-1 mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </Link>
        <h1 className="text-2xl font-bold text-base-content">Thêm phòng mới</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Điền thông tin phòng bên dưới
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 border border-base-200 shadow-sm"
      >
        <div className="card-body gap-5">
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Tên phòng</span>
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="VD: Phòng Deluxe 301"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Sức chứa</span>
            </label>
            <input
              type="number"
              className="input w-full"
              placeholder="Số người tối đa"
              min={1}
              max={100}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary w-full">
              Thêm phòng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
