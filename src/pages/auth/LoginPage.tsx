import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth, type AuthUser } from "../../context/AuthContext";
import { signInWithGoogle } from "../../api/auth";

// Ambient declaration so TypeScript accepts `window.google` without importing
// the full GIS type package. The detailed types live in src/types/google-gis.d.ts.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

// ---------------------------------------------------------------------------
// Google OAuth Client ID
// Replace this with your real Client ID from Google Cloud Console:
// https://console.cloud.google.com/ → APIs & Services → Credentials → OAuth 2.0
// ---------------------------------------------------------------------------
const GOOGLE_CLIENT_ID = "1002611281170-vjmvi0vjac3s0hb869f00udgeu5l4jvq.apps.googleusercontent.com";

// ---------------------------------------------------------------------------
// Mock accounts — kept as a development fallback; remove before production
// ---------------------------------------------------------------------------
const MOCK_ACCOUNTS: AuthUser[] = [
  {
    name: "Admin RoomBook",
    email: "admin@roombook.vn",
    avatar: "A",
    role: "admin",
  },
  {
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    avatar: "N",
    role: "guest",
  },
  {
    name: "Trần Thị Bích",
    email: "tranthibich@gmail.com",
    avatar: "T",
    role: "guest",
  },
];

const AVATAR_COLORS: Record<string, string> = {
  A: "bg-indigo-500",
  N: "bg-emerald-500",
  T: "bg-rose-500",
};

// ---------------------------------------------------------------------------

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/rooms";

  useEffect(() => {
    // Credential callback — passed directly to the GIS JS API instead of
    // being registered as a global, which avoids stale-closure issues on
    // SPA navigation.
    const handleCredentialResponse = async (response: CredentialResponse) => {
      try {
        console.log("🔥🔥🔥 ĐÂY LÀ ID TOKEN CỦA BẠN:", response.credential);
        // Step 1 — Exchange the Google JWT for an application token + user.
        //          signInWithGoogle POSTs { credential } to POST /api/auth/google.
        const result = await signInWithGoogle(response.credential);

        // Step 2 — Map the backend user to our local AuthUser shape.
        const appUser: AuthUser = {
          name: result.user.name,
          email: result.user.email,
          // Use the first character of the name as the avatar placeholder.
          avatar: result.user.name.charAt(0).toUpperCase(),
          role: result.user.role,
        };

        // Step 3 — Persist the session and redirect to the original destination.
        login(appUser);
        navigate(from, { replace: true });
      } catch (err) {
        // TODO: replace console.error with a toast / inline error banner.
        console.error("Google sign-in failed:", err);
      }
    };

    // Initialise the GIS library and render the official button into the
    // #google-signin-button container.
    const initGIS = () => {
      // Guard: the script tag may exist but not have finished parsing yet.
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

    // Dynamically inject the GIS script the first time this page is visited.
    // A stable id lets us detect SPA navigation back to this page and skip
    // a duplicate network request — calling initGIS directly instead.
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
      // Script tag already in DOM AND fully loaded — re-render the button
      // into the freshly mounted container (e.g. SPA back-navigation).
      initGIS();
    } else {
      // Script tag exists but is still downloading (e.g. slow network on
      // first load, or HMR re-mount before onload fires). Wire up onload so
      // initGIS runs as soon as parsing completes.
      const existingScript = document.getElementById("gis-client") as HTMLScriptElement | null;
      if (existingScript) existingScript.onload = initGIS;
    }
  }, [login, navigate, from]);

  const handleSelect = (account: AuthUser) => {
    login(account);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Google-style card */}
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-6 text-center border-b border-[#e8eaed]">
            {/* Google "G" logo */}
            <svg
              className="mx-auto mb-4 size-10"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <h1 className="text-2xl font-normal text-[#202124] mb-1">
              Đăng nhập
            </h1>
            <p className="text-base text-[#202124]">
              Chuyển đến{" "}
              <span className="font-medium">RoomBook</span>
            </p>
          </div>

          {/* Account list */}
          <div className="py-2">
            {/* Google Sign-In button — rendered by google.accounts.id.renderButton() */}
            <div className="flex justify-center px-6 pt-4 pb-2">
              <div id="google-signin-button" />
            </div>

            {/* Divider between Google button and dev-only mock accounts */}
            <div className="flex items-center gap-3 px-6 py-3">
              <div className="flex-1 h-px bg-[#e8eaed]" />
              <span className="text-xs text-[#5f6368] shrink-0">
                hoặc chọn tài khoản thử nghiệm
              </span>
              <div className="flex-1 h-px bg-[#e8eaed]" />
            </div>

            <p className="px-6 py-2 text-sm text-[#5f6368]">
              Chọn tài khoản
            </p>
            {MOCK_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleSelect(account)}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[#f8f9fa] transition-colors text-left group"
              >
                {/* Avatar */}
                <div
                  className={`size-10 rounded-full ${AVATAR_COLORS[account.avatar]} flex items-center justify-center text-white font-medium text-sm shrink-0`}
                >
                  {account.avatar}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#202124] truncate">
                      {account.name}
                    </p>
                    {account.role === "admin" && (
                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#5f6368] truncate">
                    {account.email}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-[#5f6368] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#e8eaed] bg-[#f8f9fa]">
            <p className="text-xs text-[#5f6368] text-center">
              Để đăng nhập bằng Google thật,{" "}
              <span className="text-[#1a73e8] cursor-pointer hover:underline">
                liên hệ quản trị viên
              </span>
            </p>
          </div>
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
