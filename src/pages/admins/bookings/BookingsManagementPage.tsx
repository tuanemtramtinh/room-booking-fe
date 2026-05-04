import { useState } from "react";
import { isAxiosError } from "axios";
import { useBookingsQuery, useApproveBookingMutation, useRejectBookingMutation } from "../../../hooks/useBookingsQuery";
import { useRoomsQuery } from "../../../hooks/useRoomsQuery";
import type { Booking, BookingStatus } from "../../../types/booking";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_TABS: { key: BookingStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ duyệt" },
  { key: "APPROVED", label: "Đã duyệt" },
  { key: "REJECTED", label: "Từ chối" },
  { key: "CANCELLED", label: "Đã huỷ" },
];

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "Chờ duyệt", className: "badge-warning" },
  APPROVED:  { label: "Đã duyệt",  className: "badge-success" },
  REJECTED:  { label: "Từ chối",   className: "badge-error" },
  CANCELLED: { label: "Đã huỷ",   className: "badge-neutral" },
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatHour(h: string) {
  return h.slice(0, 5); // "09:00:00" → "09:00"
}

// ---------------------------------------------------------------------------
// Sub-component: Reject Modal
// ---------------------------------------------------------------------------

function RejectModal({
  booking,
  onConfirm,
  onCancel,
  isPending,
}: {
  booking: Booking;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-base-content">Từ chối booking</h3>
          <p className="text-sm text-base-content/50 mt-0.5">
            #{booking.id} — {booking.title}
          </p>
        </div>

        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text">Lý do từ chối</span>
            <span className="label-text-alt text-base-content/40">Tuỳ chọn</span>
          </label>
          <textarea
            className="textarea resize-none"
            rows={3}
            placeholder="VD: Phòng đã được đặt trước trong khung giờ này"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost btn-sm" onClick={onCancel} disabled={isPending}>
            Huỷ
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={() => onConfirm(reason)}
            disabled={isPending}
          >
            {isPending && <span className="loading loading-spinner loading-xs" />}
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Booking Card
// ---------------------------------------------------------------------------

function BookingCard({
  booking,
  roomName,
  onApprove,
  onReject,
  isApproving,
}: {
  booking: Booking;
  roomName?: string;
  onApprove: (id: number) => void;
  onReject: (booking: Booking) => void;
  isApproving: boolean;
}) {
  const badge = STATUS_BADGE[booking.status];

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-base-content truncate">{booking.title}</p>
          {booking.description && (
            <p className="text-xs text-base-content/50 truncate mt-0.5">{booking.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-base-content/30">#{booking.id}</span>
          <span className={`badge badge-sm ${badge.className}`}>{badge.label}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/60">
        {/* Room */}
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {roomName ?? `Phòng #${booking.roomId}`}
        </span>
        {/* Date */}
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(booking.startDate)}
        </span>
        {/* Time */}
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatHour(booking.startHour)} – {formatHour(booking.endHour)}
        </span>
        {/* Attendees */}
        {booking.attendeeCount != null && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {booking.attendeeCount} người
          </span>
        )}
      </div>

      {/* Reject reason */}
      {booking.status === "REJECTED" && booking.rejectReason && (
        <p className="text-xs text-error/80 bg-error/5 border border-error/20 rounded-lg px-3 py-2">
          Lý do: {booking.rejectReason}
        </p>
      )}

      {/* Actions — only for PENDING */}
      {booking.status === "PENDING" && (
        <div className="flex gap-2 justify-end pt-1 border-t border-base-200">
          <button
            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={() => onReject(booking)}
          >
            Từ chối
          </button>
          <button
            className="btn btn-success btn-sm text-white"
            onClick={() => onApprove(booking.id)}
            disabled={isApproving}
          >
            {isApproving && <span className="loading loading-spinner loading-xs" />}
            Duyệt
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function BookingsManagementPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("PENDING");
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: bookings, isLoading, isError } = useBookingsQuery();
  const { data: rooms } = useRoomsQuery();
  const approveMutation = useApproveBookingMutation();
  const rejectMutation = useRejectBookingMutation();

  const roomMap = Object.fromEntries((rooms ?? []).map((r) => [r.id, r.name]));

  const filtered =
    activeTab === "ALL"
      ? (bookings ?? [])
      : (bookings ?? []).filter((b) => b.status === activeTab);

  const countByStatus = (status: BookingStatus) =>
    (bookings ?? []).filter((b) => b.status === status).length;

  const handleApprove = (id: number) => {
    setActionError(null);
    setApprovingId(id);
    approveMutation.mutate(id, {
      onSettled: () => setApprovingId(null),
      onError: (err) => {
        const msg = isAxiosError(err)
          ? err.response?.status === 400
            ? "Chỉ có thể duyệt booking đang chờ duyệt."
            : "Duyệt thất bại. Vui lòng thử lại."
          : "Duyệt thất bại. Vui lòng thử lại.";
        setActionError(msg);
      },
    });
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectingBooking) return;
    setActionError(null);
    rejectMutation.mutate(
      { id: rejectingBooking.id, rejectReason: reason || undefined },
      {
        onSuccess: () => setRejectingBooking(null),
        onError: (err) => {
          const msg = isAxiosError(err)
            ? err.response?.status === 400
              ? "Chỉ có thể từ chối booking đang chờ duyệt."
              : "Từ chối thất bại. Vui lòng thử lại."
            : "Từ chối thất bại. Vui lòng thử lại.";
          setActionError(msg);
          setRejectingBooking(null);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Quản lý đặt phòng</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Xét duyệt các yêu cầu đặt phòng
        </p>
      </div>

      {/* Error banner */}
      {actionError && (
        <div role="alert" className="alert alert-error mb-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-sm">{actionError}</span>
          <button className="btn btn-ghost btn-xs ml-auto" onClick={() => setActionError(null)}>✕</button>
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const count = tab.key !== "ALL" ? countByStatus(tab.key) : (bookings?.length ?? 0);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn btn-sm shrink-0 gap-1.5 ${
                isActive ? "btn-primary" : "btn-ghost"
              }`}
            >
              {tab.label}
              {!isLoading && (
                <span
                  className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold w-4 h-4 ${
                    isActive
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-200 text-base-content/50"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-base-content/40">
          <p className="text-sm">Không thể tải danh sách. Vui lòng thử lại.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">Không có booking nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              roomName={roomMap[booking.roomId]}
              onApprove={handleApprove}
              onReject={setRejectingBooking}
              isApproving={approvingId === booking.id}
            />
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectingBooking && (
        <RejectModal
          booking={rejectingBooking}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectingBooking(null)}
          isPending={rejectMutation.isPending}
        />
      )}
    </div>
  );
}
