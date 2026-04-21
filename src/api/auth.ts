/**
 * auth.ts — Authentication API calls.
 *
 * All functions in this module communicate with the backend auth endpoints.
 * Centralising API calls here keeps components free of axios/fetch details.
 */

import axios from "axios";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Payload sent to the backend when verifying a Google credential. */
interface GoogleSignInPayload {
  /**
   * The raw JWT credential string issued by Google.
   * The backend must validate this token using Google's token-info endpoint
   * or a server-side library (e.g. google-auth-library).
   */
  credential: string;
}

/** Shape of the response returned by `POST /api/auth/google`. */
export interface GoogleSignInResult {
  /** Application-level access token (or session token) issued by your backend. */
  token: string;
  user: {
    name: string;
    email: string;
    /** Single character used as an avatar placeholder. */
    avatar: string;
    role: "admin" | "guest";
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Sends the Google-issued JWT credential to the backend for verification.
 *
 * Backend contract:
 *   POST /api/auth/google
 *   Body:    { credential: "<google-jwt>" }
 *   Returns: { token: "<app-token>", user: { name, email, avatar, role } }
 *
 * The backend should:
 *   1. Verify the Google JWT (signature, audience, expiry).
 *   2. Look up or create the application user record.
 *   3. Return an application-level token and the user's profile.
 *
 * @param credential - The raw JWT string from `CredentialResponse.credential`.
 * @throws AxiosError if the request fails or the backend rejects the token.
 */
export async function signInWithGoogle(
  credential: string,
): Promise<GoogleSignInResult> {
  const payload: GoogleSignInPayload = { credential };

  // POST /api/auth/google — swap the Google JWT for an app token + user profile.
  const { data } = await axios.post<GoogleSignInResult>(
    "/api/auth/google",
    payload,
  );

  return data;
}
