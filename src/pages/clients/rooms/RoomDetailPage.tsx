import { useParams, Link } from "react-router";
import { useRoomDetailQuery } from "../../../hooks/useRoomsQuery";
import type { Booking, BookingStatus } from "../../../types/booking";
import type { User } from "../../../types/user";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// In room context: APPROVED = slot taken (red), PENDING = tentative (yellow)
const BOOKING_STATUS: Record<BookingStatus, { label: string; className: string }> = {
  APPROVED:  { label: "Đã duyệt",  className: "badge-success" },
  PENDING:   { label: "Chờ duyệt", className: "badge-warning" },
  REJECTED:  { label: "Từ chối",   className: "badge-neutral" },
  CANCELLED: { label: "Đã huỷ",   className: "badge-neutral" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatHour(h: string) {
  return h.slice(0, 5);
}

function groupByDate(bookings: Booking[]): Record<string, Booking[]> {
  return bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    (acc[b.startDate] ??= []).push(b);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RequesterTag({ requester }: { requester: User }) {
  const initials = requester.fullName
    ? requester.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : requester.email[0].toUpperCase();

  return (
    <span className="flex flex-col gap-0.5 text-xs text-base-content/40">
      <span className="flex items-center gap-1.5">
        {requester.avatarUrl ? (
          <img
            src={requester.avatarUrl}
            alt={requester.fullName ?? requester.email}
            className="size-4 rounded-full object-cover shrink-0"
          />
        ) : (
          <span className="size-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-semibold shrink-0">
            {initials}
          </span>
        )}
        <span className="truncate">
          {requester.fullName ?? requester.email}
        </span>
      </span>
      {requester.fullName && (
        <span className="pl-[22px] truncate text-base-content/30">
          {requester.email}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: room, isLoading, isError } = useRoomDetailQuery(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-8 w-32 rounded-lg" />
        <div className="skeleton h-32 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-base-content/40 text-sm mb-4">
          Không thể tải thông tin phòng.
        </p>
        <Link to="/rooms" className="btn btn-ghost btn-sm">
          ← Về danh sách phòng
        </Link>
      </div>
    );
  }

  const bookingsByDate = groupByDate(room.bookings);
  const sortedDates = Object.keys(bookingsByDate).sort();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/rooms"
        className="inline-flex items-center gap-1.5 text-sm text-base-content/50 hover:text-base-content transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Danh sách phòng
      </Link>

      {/* Room info */}
      <div className="bg-base-100 border border-base-200 rounded-xl p-6 space-y-3">
        <h1 className="text-xl font-bold text-base-content">{room.name}</h1>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-base-content/60">
          {room.location && (
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {room.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {room.capacity} người
          </span>
        </div>

        {room.description && (
          <p className="text-sm text-base-content/60 border-t border-base-200 pt-3">
            {room.description}
          </p>
        )}
      </div>

      {/* Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-base-content">
            Lịch đặt phòng
          </h2>
          {room.bookings.length > 0 && (
            <span className="text-xs text-base-content/40">
              {room.bookings.length} booking
            </span>
          )}
        </div>

        {room.bookings.length === 0 ? (
          <div className="text-center py-12 bg-base-100 border border-base-200 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-9 mx-auto mb-2 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-base-content/40">Chưa có booking nào</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedDates.map((date) => (
              <div key={date}>
                {/* Date header */}
                <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-2 px-1">
                  {formatDate(date)}
                </p>

                {/* Bookings for this date */}
                <div className="space-y-2">
                  {bookingsByDate[date].map((booking) => {
                    const bStatus = BOOKING_STATUS[booking.status];
                    const isActive = booking.status === "APPROVED" || booking.status === "PENDING";
                    return (
                      <div
                        key={booking.id}
                        className={`flex items-center gap-3 bg-base-100 border rounded-xl px-4 py-3 ${
                          isActive ? "border-base-200" : "border-base-200/50 opacity-50"
                        }`}
                      >
                        {/* Time block */}
                        <div className="shrink-0 text-center min-w-[72px]">
                          <p className="text-sm font-semibold text-base-content tabular-nums">
                            {formatHour(booking.startHour)}
                          </p>
                          <p className="text-[10px] text-base-content/40">—</p>
                          <p className="text-sm font-semibold text-base-content tabular-nums">
                            {formatHour(booking.endHour)}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="w-px self-stretch bg-base-200 shrink-0" />

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-base-content truncate">
                            {booking.title}
                          </p>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            {booking.attendeeCount != null && (
                              <p className="text-xs text-base-content/40">
                                {booking.attendeeCount} người tham dự
                              </p>
                            )}
                            {booking.requester && (
                              <span className="mt-1">
                                <RequesterTag requester={booking.requester} />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <span className={`badge badge-sm shrink-0 ${bStatus.className}`}>
                          {bStatus.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        {room.bookings.length > 0 && (
          <div className="flex gap-4 mt-4 px-1">
            <span className="flex items-center gap-1.5 text-xs text-base-content/40">
              <span className="inline-block size-2 rounded-full bg-success" />
              Đã duyệt (chặn giờ)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-base-content/40">
              <span className="inline-block size-2 rounded-full bg-warning" />
              Chờ duyệt (tham khảo)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
