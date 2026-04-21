import { Outlet, NavLink } from "react-router";

export default function ClientAppLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-semibold text-primary" : "text-base-content/60 hover:text-base-content transition-colors";

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
            <li>
              <NavLink to="/rooms/add" className={linkClass}>
                Thêm phòng
              </NavLink>
            </li>
            <li>
              <NavLink to="/booking" className={linkClass}>
                Đặt phòng
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          <span className="badge badge-ghost badge-sm text-base-content/40">
            v1.0
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
