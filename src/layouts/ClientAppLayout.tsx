import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../api/users";

const AVATAR_COLORS: Record<string, string> = {
  A: "bg-indigo-500",
  N: "bg-emerald-500",
  T: "bg-rose-500",
};

export default function ClientAppLayout() {
  const { user, logout, updateUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePending, setProfilePending] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const openEditProfile = () => {
    setProfileName(user?.name ?? "");
    setProfileError(null);
    setEditingProfile(true);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!profileName.trim()) {
      setProfileError("Tên không được để trống.");
      return;
    }
    setProfilePending(true);
    setProfileError(null);
    try {
      const updated = await userApi.update(user.id, { fullName: profileName.trim() });
      updateUser({ name: updated.fullName ?? profileName.trim() });
      setEditingProfile(false);
    } catch (err) {
      if (isAxiosError(err)) {
        setProfileError(err.response?.data?.message ?? "Cập nhật thất bại.");
      } else {
        setProfileError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setProfilePending(false);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-primary"
      : "text-base-content/60 hover:text-base-content transition-colors";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-50" data-theme="light">
      {/* Top Navbar */}
      <header className="navbar bg-base-100 border-b border-base-200 shadow-xs sticky top-0 z-50 px-6">
        <div className="navbar-start">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-primary-content"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-base-content">
              RoomBook
            </span>
          </div>
        </div>

        <div className="navbar-center">
          <ul className="menu menu-horizontal gap-1 px-0">
            <li>
              <NavLink to="/rooms" className={linkClass}>
                Danh sách phòng
              </NavLink>
            </li>
            {isAdmin && (
              <>
                <li>
                  <NavLink to="/rooms/add" className={linkClass}>
                    Thêm phòng
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/bookings" className={linkClass}>
                    Quản lý đặt phòng
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/users" className={linkClass}>
                    Quản lý người dùng
                  </NavLink>
                </li>
              </>
            )}
            {!isAdmin && (
              <>
                <li>
                  <NavLink to="/booking" end className={linkClass}>
                    Đặt phòng
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/booking/history" className={linkClass}>
                    Lịch sử
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                {/* Avatar */}
                <div
                  className={`size-8 rounded-full ${AVATAR_COLORS[user.avatar] ?? "bg-primary"} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
                >
                  {user.avatar}
                </div>
                {/* Name + role */}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-base-content leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-base-content/40 leading-tight">
                    {user.role === "admin" ? "Quản trị viên" : "Cán bộ"}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 text-base-content/40 hidden sm:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown menu */}
              <div
                tabIndex={0}
                className="dropdown-content bg-base-100 rounded-xl shadow-lg border border-base-200 w-56 mt-3 z-50 overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-base-200">
                  <p className="text-sm font-medium text-base-content truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-base-content/40 truncate mt-0.5">
                    {user.email}
                  </p>
                  {user.role === "admin" && (
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium mt-1.5">
                      Admin
                    </span>
                  )}
                </div>
                {/* Actions */}
                <div className="p-1.5">
                  <button
                    onClick={openEditProfile}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-base-content hover:bg-base-200 transition-colors"
                  >
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Sửa thông tin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                  >
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Đăng nhập
            </NavLink>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Edit profile modal */}
      {editingProfile && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-semibold text-base mb-1">Sửa thông tin cá nhân</h3>
            <p className="text-xs text-base-content/50 mb-4 truncate">{user?.email}</p>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-sm">Họ và tên</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Nhập tên đầy đủ"
                  autoFocus
                />
              </div>
              {profileError && (
                <div className="alert alert-error py-2 text-sm">{profileError}</div>
              )}
              <div className="modal-action mt-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditingProfile(false)}
                  disabled={profilePending}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={profilePending}
                >
                  {profilePending && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  Lưu
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setEditingProfile(false)} />
        </div>
      )}
    </div>
  );
}
