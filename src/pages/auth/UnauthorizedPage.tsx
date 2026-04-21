import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="size-16 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-base-content mb-2">
        Không có quyền truy cập
      </h1>
      <p className="text-base-content/50 text-sm mb-6 max-w-sm">
        Trang này chỉ dành cho quản trị viên. Vui lòng đăng nhập bằng tài
        khoản có quyền Admin.
      </p>
      <div className="flex gap-3">
        <Link to="/rooms" className="btn btn-ghost btn-sm">
          Về trang chủ
        </Link>
        <Link to="/login" className="btn btn-primary btn-sm">
          Đăng nhập lại
        </Link>
      </div>
    </div>
  );
}
