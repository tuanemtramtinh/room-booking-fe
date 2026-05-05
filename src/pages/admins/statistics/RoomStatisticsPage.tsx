import { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  useRoomsQuery,
  useRoomDetailQuery,
} from "../../../hooks/useRoomsQuery";
import type { Booking, BookingStatus } from "../../../types/booking";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const DAYS_OF_WEEK = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const MONTHS = [
  "Th.1",
  "Th.2",
  "Th.3",
  "Th.4",
  "Th.5",
  "Th.6",
  "Th.7",
  "Th.8",
  "Th.9",
  "Th.10",
  "Th.11",
  "Th.12",
];

const STATUSES: BookingStatus[] = [
  "APPROVED",
  "PENDING",
  "REJECTED",
  "CANCELLED",
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  APPROVED: "#10b981",
  PENDING: "#f59e0b",
  REJECTED: "#ef4444",
  CANCELLED: "#9ca3af",
};

function computeMonthlyByStatus(bookings: Booking[], year: number) {
  const result: Record<BookingStatus, number[]> = {
    APPROVED: new Array(12).fill(0),
    PENDING: new Array(12).fill(0),
    REJECTED: new Array(12).fill(0),
    CANCELLED: new Array(12).fill(0),
  };
  for (const b of bookings) {
    const date = new Date(b.startDate);
    if (date.getFullYear() === year) {
      result[b.status][date.getMonth()]++;
    }
  }
  return result;
}

// getDay() returns 0=Sun,1=Mon,...,6=Sat → reindex to Mon(0)...Sun(6)
function computeWeeklyByStatus(bookings: Booking[], year: number) {
  const result: Record<BookingStatus, number[]> = {
    APPROVED: new Array(7).fill(0),
    PENDING: new Array(7).fill(0),
    REJECTED: new Array(7).fill(0),
    CANCELLED: new Array(7).fill(0),
  };
  for (const b of bookings) {
    const date = new Date(b.startDate);
    if (date.getFullYear() === year) {
      const dayIndex = (date.getDay() + 6) % 7; // Mon=0 ... Sun=6
      result[b.status][dayIndex]++;
    }
  }
  return result;
}

function computeStatusCounts(bookings: Booking[]) {
  const counts: Record<BookingStatus, number> = {
    APPROVED: 0,
    PENDING: 0,
    REJECTED: 0,
    CANCELLED: 0,
  };
  for (const b of bookings) {
    counts[b.status]++;
  }
  return counts;
}

export default function RoomStatisticsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedRoomId, setSelectedRoomId] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery();
  const { data: roomDetail, isLoading: detailLoading } =
    useRoomDetailQuery(selectedRoomId);

  const bookings = roomDetail?.bookings ?? [];
  const monthlyByStatus = computeMonthlyByStatus(bookings, selectedYear);
  const weeklyByStatus = computeWeeklyByStatus(bookings, selectedYear);
  const statusCounts = computeStatusCounts(bookings);
  const totalBookings = bookings.length;

  const barData = {
    labels: MONTHS,
    datasets: STATUSES.map((status) => ({
      label: STATUS_LABELS[status],
      data: monthlyByStatus[status],
      backgroundColor: STATUS_COLORS[status],
      borderRadius: 4,
      borderSkipped: false,
    })),
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const doughnutData = {
    labels: STATUSES.map((s) => STATUS_LABELS[s]),
    datasets: [
      {
        data: STATUSES.map((s) => statusCounts[s]),
        backgroundColor: STATUSES.map((s) => STATUS_COLORS[s]),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 12, padding: 12, font: { size: 12 } },
      },
    },
    cutout: "65%",
  };

  const weeklyBarData = {
    labels: DAYS_OF_WEEK,
    datasets: [
      {
        label: STATUS_LABELS["APPROVED"],
        data: weeklyByStatus["APPROVED"],
        backgroundColor: STATUS_COLORS["APPROVED"],
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: STATUS_LABELS["REJECTED"],
        data: weeklyByStatus["REJECTED"],
        backgroundColor: STATUS_COLORS["REJECTED"],
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const weeklyBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
  const approvalRate =
    totalBookings > 0
      ? Math.round((statusCounts.APPROVED / totalBookings) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-base-content">
          Thống kê sử dụng phòng
        </h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Xem thống kê số lượt đặt theo từng phòng
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-56">
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">Phòng</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            disabled={roomsLoading}
          >
            <option value={0}>-- Chọn phòng --</option>
            {rooms?.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {room.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">Năm</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={selectedRoomId === 0}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {selectedRoomId === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-base-content/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-12 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">Chọn một phòng để xem thống kê</p>
        </div>
      )}

      {/* Loading */}
      {selectedRoomId > 0 && detailLoading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}

      {/* Content */}
      {selectedRoomId > 0 && !detailLoading && roomDetail && (
        <>
          {/* Room info badge */}
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              <span className="font-semibold text-base-content">
                {roomDetail.name}
              </span>
              {" — "}
              {roomDetail.location} · Sức chứa {roomDetail.capacity} người
            </span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Tổng lượt đặt"
              value={totalBookings}
              color="text-base-content"
              bg="bg-base-100"
            />
            <StatCard
              label="Đã duyệt"
              value={statusCounts.APPROVED}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <StatCard
              label="Chờ duyệt"
              value={statusCounts.PENDING}
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <StatCard
              label="Tỉ lệ duyệt"
              value={approvalRate}
              suffix="%"
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-base-100 border border-base-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-base-content mb-4">
                Lượt đặt theo tháng — {selectedYear}
              </h2>
              {bookings.filter(
                (b) => new Date(b.startDate).getFullYear() === selectedYear,
              ).length === 0 ? (
                <div className="flex items-center justify-center h-48 text-base-content/40 text-sm">
                  Không có dữ liệu trong năm {selectedYear}
                </div>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>

            {/* Doughnut chart */}
            <div className="bg-base-100 border border-base-200 rounded-2xl p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-base-content mb-4">
                Phân bổ trạng thái (tổng)
              </h2>
              {totalBookings === 0 ? (
                <div className="flex-1 flex items-center justify-center text-base-content/40 text-sm">
                  Chưa có lượt đặt nào
                </div>
              ) : (
                <>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  {/* Center label */}
                  <p className="text-center text-xs text-base-content/50 mt-3">
                    Tổng cộng{" "}
                    <span className="font-semibold text-base-content">
                      {totalBookings}
                    </span>{" "}
                    lượt
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Weekly chart + table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar chart by day of week */}
            <div className="lg:col-span-2 bg-base-100 border border-base-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-base-content mb-1">
                Lượt đặt theo ngày trong tuần — {selectedYear}
              </h2>
              <p className="text-xs text-base-content/40 mb-4">
                Tính các lượt đã duyệt và bị từ chối
              </p>
              {weeklyByStatus["APPROVED"].every((v) => v === 0) &&
              weeklyByStatus["REJECTED"].every((v) => v === 0) ? (
                <div className="flex items-center justify-center h-48 text-base-content/40 text-sm">
                  Không có dữ liệu trong năm {selectedYear}
                </div>
              ) : (
                <Bar data={weeklyBarData} options={weeklyBarOptions} />
              )}
            </div>

            {/* Table by day of week */}
            <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-base-200">
                <h2 className="text-sm font-semibold text-base-content">
                  Bảng thống kê theo tuần
                </h2>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Năm {selectedYear}
                </p>
              </div>
              <table className="table table-sm">
                <thead>
                  <tr className="text-xs text-base-content/50">
                    <th>Ngày</th>
                    <th className="text-right text-emerald-600">Duyệt</th>
                    <th className="text-right text-red-500">Từ chối</th>
                    <th className="text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day, i) => {
                    const approved = weeklyByStatus["APPROVED"][i];
                    const rejected = weeklyByStatus["REJECTED"][i];
                    const total = approved + rejected;
                    const isWeekend = i >= 5;
                    return (
                      <tr key={day}>
                        <td>
                          <span
                            className={`text-xs font-medium ${isWeekend ? "text-violet-600" : ""}`}
                          >
                            {day}
                          </span>
                        </td>
                        <td className="text-right text-emerald-600 font-medium">
                          {approved}
                        </td>
                        <td className="text-right text-red-500 font-medium">
                          {rejected}
                        </td>
                        <td className="text-right font-semibold">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail table */}
          <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-base-200">
              <h2 className="text-sm font-semibold text-base-content">
                Chi tiết theo trạng thái
              </h2>
            </div>
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50">
                  <th>Trạng thái</th>
                  <th className="text-right">Số lượt</th>
                  <th className="text-right">Tỉ lệ</th>
                </tr>
              </thead>
              <tbody>
                {STATUSES.map((status) => (
                  <tr key={status}>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_COLORS[status] }}
                        />
                        {STATUS_LABELS[status]}
                      </span>
                    </td>
                    <td className="text-right font-semibold">
                      {statusCounts[status]}
                    </td>
                    <td className="text-right text-base-content/60">
                      {totalBookings > 0
                        ? Math.round(
                            (statusCounts[status] / totalBookings) * 100,
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix = "",
  color,
  bg,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} border border-base-200 rounded-2xl p-4`}>
      <p className="text-xs text-base-content/50 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
        {suffix && <span className="text-base font-medium">{suffix}</span>}
      </p>
    </div>
  );
}
