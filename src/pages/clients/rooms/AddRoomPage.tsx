import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCreateRoomMutation } from "../../../hooks/useRoomsQuery";
import type { CreateRoomDTO, RoomStatus } from "../../../types/room";

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Còn trống" },
  { value: "OCCUPIED", label: "Đang sử dụng" },
  { value: "MAINTENANCE", label: "Đang bảo trì" },
];

const EMPTY_FORM: CreateRoomDTO = {
  name: "",
  location: "",
  capacity: 1,
  description: "",
  status: "AVAILABLE",
};

export default function AddRoomPage() {
  const navigate = useNavigate();
  const { mutate: createRoom, isPending, isError, error } = useCreateRoomMutation();
  const [form, setForm] = useState<CreateRoomDTO>(EMPTY_FORM);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(form, {
      onSuccess: () => navigate("/rooms"),
    });
  };

  return (
    <div className="max-w-lg mx-auto">
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
        <p className="text-sm text-base-content/50 mt-0.5">Điền thông tin phòng bên dưới</p>
      </div>

      {isError && (
        <div role="alert" className="alert alert-error mb-4 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>
            {(error as Error)?.message ?? "Thêm phòng thất bại. Vui lòng thử lại."}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 border border-base-200 shadow-sm"
      >
        <div className="card-body gap-4">
          {/* Name */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Tên phòng <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="VD: Phòng Deluxe 301"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Vị trí</span>
            </label>
            <input
              type="text"
              name="location"
              className="input w-full"
              placeholder="VD: Tầng 3, Toà A"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* Capacity + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">Sức chứa <span className="text-error">*</span></span>
              </label>
              <input
                type="number"
                name="capacity"
                className="input w-full"
                placeholder="Số người"
                min={1}
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">Trạng thái</span>
              </label>
              <select
                name="status"
                className="select w-full"
                value={form.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Mô tả</span>
            </label>
            <textarea
              name="description"
              className="textarea w-full resize-none"
              placeholder="Mô tả ngắn về phòng..."
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="card-actions mt-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Đang lưu...
                </>
              ) : (
                "Thêm phòng"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
