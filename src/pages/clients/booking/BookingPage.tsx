import { useState } from "react";
import { isAxiosError } from "axios";
import { useRoomsQuery, useRoomDetailQuery } from "../../../hooks/useRoomsQuery";
import { useCreateBookingMutation } from "../../../hooks/useBookingMutation";
import type { Booking, BookingStatus } from "../../../types/booking";

const BOOKING_BADGE: Record<BookingStatus, { label: string; cls: string }> = {
  APPROVED:  { label: "Đã duyệt",  cls: "badge-success" },
  PENDING:   { label: "Chờ duyệt", cls: "badge-warning" },
  REJECTED:  { label: "Từ chối",   cls: "badge-neutral" },
  CANCELLED: { label: "Đã huỷ",   cls: "badge-neutral" },
};

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    weekday: "short", day: "2-digit", month: "2-digit",
  });
}

// HTML time input gives "HH:mm" — backend needs "HH:mm:ss"
function toTimeString(t: string) {
  return t ? `${t}:00` : "";
}

const EMPTY_FORM = {
  roomId: "",
  title: "",
  description: "",
  attendeeCount: "",
  startDate: "",
  startHour: "",
  endHour: "",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  CANCELLED: "Đã huỷ",
};

export default function BookingPage() {
  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery();
  const { mutate: createBooking, isPending } = useCreateBookingMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [created, setCreated] = useState<Booking | null>(null);

  const selectedRoomId = form.roomId ? Number(form.roomId) : 0;
  const { data: roomDetail, isLoading: detailLoading } = useRoomDetailQuery(selectedRoomId);
  const visibleBookings = roomDetail?.bookings.filter(
    (b) => b.status === "APPROVED" || b.status === "PENDING",
  ) ?? [];

  const availableRooms = rooms?.filter((r) => r.status === "AVAILABLE") ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "startHour" || name === "endHour") setTimeError(null);
    setApiError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeError(null);
    setApiError(null);

    if (form.startHour && form.endHour && form.startHour >= form.endHour) {
      setTimeError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
      return;
    }

    createBooking(
      {
        roomId: Number(form.roomId),
        title: form.title,
        description: form.description || undefined,
        attendeeCount: form.attendeeCount ? Number(form.attendeeCount) : undefined,
        startDate: form.startDate,
        startHour: toTimeString(form.startHour),
        endHour: toTimeString(form.endHour),
      },
      {
        onSuccess: (booking) => {
          setCreated(booking);
          setForm(EMPTY_FORM);
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 409) {
              setApiError("Phòng không còn trống trong khung giờ này. Vui lòng chọn giờ hoặc phòng khác.");
            } else if (status === 400) {
              const msg = err.response?.data?.message as string | undefined;
              setApiError(
                msg === "startHour must be before endHour"
                  ? "Giờ bắt đầu phải nhỏ hơn giờ kết thúc."
                  : "Thông tin không hợp lệ. Vui lòng kiểm tra lại.",
              );
            } else if (status === 404) {
              setApiError("Phòng không tồn tại.");
            } else if (status === 401) {
              setApiError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
              setApiError("Đặt phòng thất bại. Vui lòng thử lại.");
            }
          } else {
            setApiError("Đặt phòng thất bại. Vui lòng thử lại.");
          }
        },
      },
    );
  };

  // Success state
  if (created) {
    const room = rooms?.find((r) => r.id === created.roomId);
    return (
      <div className="max-w-lg mx-auto">
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body items-center text-center gap-4 py-10">
            <div className="size-14 rounded-full bg-success/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-7 text-success"
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
            </div>

            <div>
              <h2 className="text-xl font-bold text-base-content">
                Đặt phòng thành công!
              </h2>
              <p className="text-sm text-base-content/50 mt-1">
                Yêu cầu của bạn đang chờ admin xét duyệt.
              </p>
            </div>

            <div className="w-full bg-base-200/50 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/50">Mã booking</span>
                <span className="font-medium text-base-content">#{created.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/50">Tiêu đề</span>
                <span className="font-medium text-base-content truncate max-w-[60%] text-right">
                  {created.title}
                </span>
              </div>
              {room && (
                <div className="flex justify-between">
                  <span className="text-base-content/50">Phòng</span>
                  <span className="font-medium text-base-content">{room.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-base-content/50">Ngày</span>
                <span className="font-medium text-base-content">{created.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/50">Thời gian</span>
                <span className="font-medium text-base-content">
                  {created.startHour.slice(0, 5)} – {created.endHour.slice(0, 5)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/50">Trạng thái</span>
                <span className="badge badge-warning badge-sm font-medium">
                  {STATUS_LABEL[created.status]}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary w-full mt-2"
              onClick={() => setCreated(null)}
            >
              Đặt phòng mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Đặt phòng</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Điền thông tin để hoàn tất đặt phòng
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 border border-base-200 shadow-sm"
      >
        <div className="card-body gap-5">
          {/* API error */}
          {apiError && (
            <div role="alert" className="alert alert-error shadow-sm py-3">
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span className="text-sm">{apiError}</span>
            </div>
          )}

          {/* Room */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">
                Phòng <span className="text-error">*</span>
              </span>
            </label>
            {roomsLoading ? (
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

          {/* Room bookings preview */}
          {form.roomId && (
            <div className="rounded-xl border border-base-200 bg-base-200/30 p-3 space-y-2">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Lịch đặt phòng hiện tại
              </p>
              {detailLoading ? (
                <div className="space-y-2">
                  <div className="skeleton h-8 w-full rounded-lg" />
                  <div className="skeleton h-8 w-full rounded-lg" />
                </div>
              ) : visibleBookings.length === 0 ? (
                <p className="text-xs text-base-content/40 py-1 text-center">
                  Chưa có booking nào
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    visibleBookings.reduce<Record<string, typeof visibleBookings>>(
                      (acc, b) => { (acc[b.startDate] ??= []).push(b); return acc; },
                      {}
                    )
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, bks]) => (
                      <div key={date}>
                        <p className="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-1.5">
                          {formatDate(date)}
                        </p>
                        <div className="space-y-1">
                          {bks.map((bk) => {
                            const badge = BOOKING_BADGE[bk.status];
                            return (
                              <div
                                key={bk.id}
                                className="flex items-center gap-2 rounded-lg bg-base-100 border border-base-200 px-3 py-2 text-xs"
                              >
                                <span className="font-mono tabular-nums text-base-content/70 shrink-0">
                                  {bk.startHour.slice(0, 5)}–{bk.endHour.slice(0, 5)}
                                </span>
                                <span className="truncate flex-1 text-base-content/60">
                                  {bk.title}
                                </span>
                                <span className={`badge badge-xs shrink-0 ${badge.cls}`}>
                                  {badge.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">
                Tiêu đề <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="title"
              className="input w-full"
              placeholder="VD: Họp nhóm dự án"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Mô tả</span>
            </label>
            <textarea
              name="description"
              className="textarea w-full resize-none"
              rows={2}
              placeholder="Mô tả thêm về buổi họp (tuỳ chọn)"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">
                Ngày <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              name="startDate"
              className="input w-full"
              value={form.startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start / End time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">
                  Giờ bắt đầu <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="time"
                name="startHour"
                className={`input w-full ${timeError ? "input-error" : ""}`}
                value={form.startHour}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium">
                  Giờ kết thúc <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="time"
                name="endHour"
                className={`input w-full ${timeError ? "input-error" : ""}`}
                value={form.endHour}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {timeError && (
            <p className="text-error text-xs -mt-3">{timeError}</p>
          )}

          {/* Attendee count */}
          <div className="form-control">
            <label className="label pb-1.5">
              <span className="label-text font-medium">Số người tham dự</span>
            </label>
            <input
              type="number"
              name="attendeeCount"
              className="input w-full"
              placeholder="Số người tham dự (tuỳ chọn)"
              min={1}
              value={form.attendeeCount}
              onChange={handleChange}
            />
          </div>

          <div className="card-actions mt-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending && <span className="loading loading-spinner loading-sm" />}
              {isPending ? "Đang gửi…" : "Đặt phòng"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
