/**
 * auth.ts — Authentication API calls.
 *
 * All functions in this module communicate with the backend auth endpoints.
 * Centralising API calls here keeps components free of axios/fetch details.
 */

import axiosInstance, { ACCESS_TOKEN_KEY } from "./axiosInstance";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Payload sent to `POST /api/auth/google`. */
interface GoogleSignInPayload {
  idToken: string;
}

/** User object returned inside the auth response. */
export interface GoogleAuthUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
}

/** Shape of the response returned by `POST /api/auth/google`. */
export interface GoogleSignInResult {
  accessToken: string;
  tokenType: "Bearer";
  user: GoogleAuthUser;
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export function saveAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Sends the Google-issued ID token to the backend for verification.
 *
 * Backend contract:
 *   POST /api/auth/google
 *   Body:    { idToken: "<google-id-token>" }
 *   Returns: { accessToken, tokenType: "Bearer", user }
 *
 * @param idToken - The raw JWT string from `CredentialResponse.credential`.
 * @throws AxiosError if the request fails or the backend rejects the token.
 */
export async function signInWithGoogle(
  idToken: string,
): Promise<GoogleSignInResult> {
  const payload: GoogleSignInPayload = { idToken };
  const { data } = await axiosInstance.post<GoogleSignInResult>(
    "/api/auth/google",
    payload,
  );
  return data;
}

/** Payload sent to `POST /api/auth/admin`. */
interface AdminSignInPayload {
  email: string;
  password: string;
}

/**
 * Signs in as an admin using email + password (BCrypt).
 *
 * Backend contract:
 *   POST /api/auth/admin
 *   Body:    { email, password }
 *   Returns: { accessToken, tokenType: "Bearer", user }
 *
 * @throws AxiosError 401 for wrong credentials, 403 for non-admin or inactive account.
 */
export async function signInAsAdmin(
  email: string,
  password: string,
): Promise<GoogleSignInResult> {
  const payload: AdminSignInPayload = { email, password };
  const { data } = await axiosInstance.post<GoogleSignInResult>(
    "/api/auth/admin",
    payload,
  );
  return data;
}
