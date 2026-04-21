import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const AVATAR_COLORS: Record<string, string> = {
  A: "bg-indigo-500",
  N: "bg-emerald-500",
  T: "bg-rose-500",
};

export default function ClientAppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

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
              <li>
                <NavLink to="/rooms/add" className={linkClass}>
                  Thêm phòng
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/booking" className={linkClass}>
                Đặt phòng
              </NavLink>
            </li>
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
                    {user.role === "admin" ? "Quản trị viên" : "Khách"}
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
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-xl shadow-lg border border-base-200 w-52 mt-3 p-1.5 z-50"
              >
                <li className="px-3 py-2 mb-1 border-b border-base-200">
                  <div className="flex flex-col gap-0.5 hover:bg-transparent cursor-default">
                    <span className="text-xs font-medium text-base-content">
                      {user.name}
                    </span>
                    <span className="text-xs text-base-content/40 truncate">
                      {user.email}
                    </span>
                    {user.role === "admin" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium w-fit mt-0.5">
                        Admin
                      </span>
                    )}
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10 flex items-center gap-2 text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
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
                </li>
              </ul>
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
    </div>
  );
}
