import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth, type AuthUser } from "../../hooks/useAuth";
import { signInWithGoogle, saveAccessToken } from "../../api/auth";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

const GOOGLE_CLIENT_ID = "1002611281170-vjmvi0vjac3s0hb869f00udgeu5l4jvq.apps.googleusercontent.com";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/rooms";
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const handleCredentialResponse = async (response: CredentialResponse) => {
      setLoginError(null);
      try {
        const result = await signInWithGoogle(response.credential);

        saveAccessToken(result.accessToken);

        const appUser: AuthUser = {
          id: result.user.id,
          name: result.user.fullName,
          email: result.user.email,
          avatar: result.user.fullName.charAt(0).toUpperCase(),
          role: result.user.role === "ADMIN" ? "admin" : "guest",
        };

        login(appUser);
        navigate(from, { replace: true });
      } catch (err) {
        console.error("Google sign-in failed:", err);
        setLoginError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    };

    const initGIS = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      const buttonEl = document.getElementById("google-signin-button");
      if (buttonEl) {
        window.google.accounts.id.renderButton(buttonEl, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "signin_with",
          logo_alignment: "left",
        });
      }
    };

    const SCRIPT_ID = "gis-client";
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGIS;
      document.body.appendChild(script);
    } else if (window.google) {
      initGIS();
    } else {
      const existingScript = document.getElementById("gis-client") as HTMLScriptElement | null;
      if (existingScript) existingScript.onload = initGIS;
    }
  }, [login, navigate, from]);

  return (
    <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-6 text-center border-b border-[#e8eaed]">
            <svg
              className="mx-auto mb-4 size-10"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <h1 className="text-2xl font-normal text-[#202124] mb-1">Đăng nhập</h1>
            <p className="text-base text-[#202124]">
              Chuyển đến <span className="font-medium">RoomBook</span>
            </p>
          </div>

          {/* Error banner */}
          {loginError && (
            <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {loginError}
            </div>
          )}

          {/* Google Sign-In button */}
          <div className="flex justify-center px-6 py-8">
            <div id="google-signin-button" />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#e8eaed] bg-[#f8f9fa]">
            <p className="text-xs text-[#5f6368] text-center">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
              <span className="text-[#1a73e8]">Điều khoản dịch vụ</span> của RoomBook
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <a href="#" className="text-xs text-[#5f6368] hover:underline">Trợ giúp</a>
          <a href="#" className="text-xs text-[#5f6368] hover:underline">Quyền riêng tư</a>
          <a href="#" className="text-xs text-[#5f6368] hover:underline">Điều khoản</a>
        </div>
      </div>
    </div>
  );
}
