import { useState } from "react";
import { useRoomsQuery } from "../../../hooks/useRoomsQuery";

const EMPTY_FORM = {
  roomId: "",
  checkIn: "",
  checkOut: "",
  guestName: "",
  guestCount: "",
};

export default function BookingPage() {
  const { data: rooms, isLoading } = useRoomsQuery();
  const availableRooms = rooms?.filter((r) => r.status === "AVAILABLE") ?? [];

  const [form, setForm] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to booking API endpoint
    setSuccess(true);
    setForm(EMPTY_FORM);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Đặt phòng</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Điền thông tin để hoàn tất đặt phòng
        </p>
      </div>

      {success && (
        <div
          role="alert"
          className="alert alert-success mb-5 shadow-sm animate-[fadeIn_0.3s_ease]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Đặt phòng thành công!</span>
          <span className="text-sm opacity-80">Thông tin đã được ghi nhận.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 border border-base-200 shadow-sm"
      >
        <div className="card-body gap-5">
          {/* Room select */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">
                Phòng <span className="text-error">*</span>
              </span>
            </label>
            {isLoading ? (
              <div className="skeleton h-10 w-full rounded-lg" />
            ) : (
              <select
                name="roomId"
                className="select w-full"
                value={form.roomId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Chọn phòng
                </option>
                {availableRooms.length === 0 && (
                  <option disabled>— Không có phòng trống —</option>
                )}
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                    {room.location ? ` · ${room.location}` : ""}
                    {` (${room.capacity} người)`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Check-in / Check-out */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">Ngày check-in</span>
              </label>
              <input
                type="date"
                name="checkIn"
                className="input w-full"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">Ngày check-out</span>
              </label>
              <input
                type="date"
                name="checkOut"
                className="input w-full"
                value={form.checkOut}
                onChange={handleChange}
                min={form.checkIn}
                required
              />
            </div>
          </div>

          {/* Guest name */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Tên khách</span>
            </label>
            <input
              type="text"
              name="guestName"
              className="input w-full"
              placeholder="Họ và tên khách hàng"
              value={form.guestName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Guest count */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Số lượng khách</span>
            </label>
            <input
              type="number"
              name="guestCount"
              className="input w-full"
              placeholder="Số lượng khách"
              min={1}
              value={form.guestCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary w-full">
              Đặt phòng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
