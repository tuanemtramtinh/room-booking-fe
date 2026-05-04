import { useBookingHistoryQuery } from "../../../hooks/useBookingsQuery";
import { useRoomsQuery } from "../../../hooks/useRoomsQuery";
import type { Booking, BookingStatus } from "../../../types/booking";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "Chờ duyệt", className: "badge-warning" },
  APPROVED:  { label: "Đã duyệt",  className: "badge-success" },
  REJECTED:  { label: "Từ chối",   className: "badge-error" },
  CANCELLED: { label: "Đã huỷ",   className: "badge-neutral" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatHour(h: string) {
  return h.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Booking card
// ---------------------------------------------------------------------------

function BookingCard({ booking, roomName }: { booking: Booking; roomName?: string }) {
  const badge = STATUS_BADGE[booking.status];

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-base-content truncate">{booking.title}</p>
          {booking.description && (
            <p className="text-xs text-base-content/50 truncate mt-0.5">
              {booking.description}
            </p>
          )}
        </div>
        <span className={`badge badge-sm shrink-0 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/60">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {roomName ?? `Phòng #${booking.roomId}`}
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(booking.startDate)}
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatHour(booking.startHour)} – {formatHour(booking.endHour)}
        </span>
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
          Lý do từ chối: {booking.rejectReason}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookingHistoryPage() {
  const { data: bookings, isLoading, isError } = useBookingHistoryQuery();
  const { data: rooms } = useRoomsQuery();

  const roomMap = Object.fromEntries((rooms ?? []).map((r) => [r.id, r.name]));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Lịch sử đặt phòng</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Các yêu cầu đặt phòng của bạn
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-base-content/40">
          <p className="text-sm">Không thể tải lịch sử. Vui lòng thử lại.</p>
        </div>
      ) : !bookings?.length ? (
        <div className="text-center py-16 text-base-content/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">Bạn chưa có lịch sử đặt phòng nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              roomName={roomMap[booking.roomId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
