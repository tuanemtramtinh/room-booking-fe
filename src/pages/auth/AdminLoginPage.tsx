import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { isAxiosError } from "axios";
import { useAuth, type AuthUser } from "../../hooks/useAuth";
import { signInAsAdmin, saveAccessToken } from "../../api/auth";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/rooms";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInAsAdmin(email, password);

      saveAccessToken(result.accessToken);

      const appUser: AuthUser = {
        id: result.user.id,
        name: result.user.fullName,
        email: result.user.email,
        avatar: result.user.fullName.charAt(0).toUpperCase(),
        role: "admin",
      };

      login(appUser);
      navigate(from, { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message as string | undefined;

        if (status === 401) {
          setError("Email hoặc mật khẩu không đúng.");
        } else if (status === 403) {
          setError(
            message === "Account is inactive"
              ? "Tài khoản đã bị vô hiệu hóa."
              : "Tài khoản không có quyền Admin.",
          );
        } else if (status === 400) {
          setError("Vui lòng nhập đầy đủ email và mật khẩu hợp lệ.");
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-6 text-center border-b border-[#e8eaed]">
            {/* Shield icon */}
            <div className="mx-auto mb-4 size-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-normal text-[#202124] mb-1">
              Admin Portal
            </h1>
            <p className="text-base text-[#202124]">
              Chuyển đến{" "}
              <span className="font-medium">RoomBook</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {/* Error banner */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#3c4043] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hcmut.edu.vn"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#dadce0] text-sm text-[#202124] placeholder-[#80868b] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#3c4043] mb-1.5"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#dadce0] text-sm text-[#202124] placeholder-[#80868b] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#80868b] hover:text-[#5f6368] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && (
                <svg className="animate-spin size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isLoading ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
        </div>

        {/* Policy links */}
        <div className="flex justify-center gap-4 mt-6">
          <a href="#" className="text-xs text-[#5f6368] hover:underline">
            Trợ giúp
          </a>
          <a href="#" className="text-xs text-[#5f6368] hover:underline">
            Quyền riêng tư
          </a>
          <a href="#" className="text-xs text-[#5f6368] hover:underline">
            Điều khoản
          </a>
        </div>
      </div>
    </div>
  );
}
