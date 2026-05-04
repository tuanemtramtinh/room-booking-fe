import { useState } from "react";
import { isAxiosError } from "axios";
import { useUsersQuery, useUpdateUserMutation } from "../../../hooks/useUsersQuery";
import type { User, UserRole, UserStatus } from "../../../types/user";

type RoleFilter = UserRole | "ALL";
type StatusFilter = UserStatus | "ALL";

function EditModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateUserMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Tên không được để trống.");
      return;
    }
    updateMutation.mutate(
      { id: user.id, dto: { fullName: fullName.trim() } },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          if (isAxiosError(err)) {
            setError(err.response?.data?.message ?? "Cập nhật thất bại.");
          } else {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
          }
        },
      }
    );
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-semibold text-base mb-4">Sửa tên người dùng</h3>
        <p className="text-xs text-base-content/50 mb-4 truncate">{user.email}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-sm">Họ và tên</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên đầy đủ"
              autoFocus
            />
          </div>
          {error && (
            <div className="alert alert-error py-2 text-sm">{error}</div>
          )}
          <div className="modal-action mt-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <span className="loading loading-spinner loading-xs" />
              )}
              Lưu
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

function UserRow({
  user,
  onEdit,
}: {
  user: User;
  onEdit: (user: User) => void;
}) {
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <tr className="hover">
      <td>
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName ?? user.email}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-xs font-semibold shrink-0">
              {initials}
            </div>
          )}
          <div>
            <p className="font-medium text-sm leading-tight">
              {user.fullName ?? <span className="text-base-content/40 italic">Chưa có tên</span>}
            </p>
            <p className="text-xs text-base-content/50 leading-tight">{user.email}</p>
          </div>
        </div>
      </td>
      <td>
        <span
          className={`badge badge-sm ${
            user.role === "ADMIN" ? "badge-neutral" : "badge-ghost"
          }`}
        >
          {user.role === "ADMIN" ? "Admin" : "Staff"}
        </span>
      </td>
      <td>
        <span
          className={`badge badge-sm ${
            user.status === "ACTIVE" ? "badge-success" : "badge-error"
          }`}
        >
          {user.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu"}
        </span>
      </td>
      <td>
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => onEdit(user)}
          title="Sửa tên"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default function UsersManagementPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [keywordTimer, setKeywordTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filters = {
    ...(roleFilter !== "ALL" && { role: roleFilter }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
  };

  const { data: users, isLoading, isError, error } = useUsersQuery(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (keywordTimer) clearTimeout(keywordTimer);
    const timer = setTimeout(() => setDebouncedKeyword(value), 400);
    setKeywordTimer(timer);
  };

  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? "Không thể tải danh sách người dùng.")
    : "Có lỗi xảy ra. Vui lòng thử lại.";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-base-content">Quản lý người dùng</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            Xem và cập nhật thông tin người dùng trong hệ thống
          </p>
        </div>
        {!isLoading && users && (
          <span className="badge badge-neutral badge-lg">{users.length} người dùng</span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Keyword search */}
        <div className="relative flex-1 min-w-48">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            className="input input-bordered input-sm w-full pl-9"
            placeholder="Tìm theo tên hoặc email..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />
        </div>

        {/* Role filter */}
        <select
          className="select select-bordered select-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
        </select>

        {/* Status filter */}
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Vô hiệu</option>
        </select>
      </div>

      {/* Error */}
      {isError && (
        <div className="alert alert-error">
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
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="skeleton size-8 rounded-full" />
                        <div className="space-y-1.5">
                          <div className="skeleton h-3 w-28 rounded" />
                          <div className="skeleton h-2.5 w-40 rounded" />
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton h-5 w-12 rounded-full" /></td>
                    <td><div className="skeleton h-5 w-16 rounded-full" /></td>
                    <td><div className="skeleton h-6 w-6 rounded" /></td>
                  </tr>
                ))
              : !isError && users?.length === 0
              ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-base-content/40">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )
              : users?.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                  />
                ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingUser && (
        <EditModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </div>
  );
}
