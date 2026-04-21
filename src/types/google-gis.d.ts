/**
 * Type declarations for the Google Identity Services (GIS) library.
 * https://developers.google.com/identity/gsi/web/reference/js-reference
 *
 * This file is auto-included by TypeScript via tsconfig "include": ["src"].
 * It is NOT a module — all declarations are ambient (global).
 */

// ---------------------------------------------------------------------------
// Core response & config types
// ---------------------------------------------------------------------------

/**
 * The object passed to your credential callback after a successful sign-in.
 * The `credential` field is a base64-encoded JWT you must verify on the backend.
 */
interface CredentialResponse {
  /** Base64url-encoded JWT containing the user's identity claims. */
  credential: string;
  /** Describes how the credential was selected (e.g. "btn", "auto", "user"). */
  select_by: string;
}

/** Configuration object passed to `google.accounts.id.initialize()`. */
interface IdConfiguration {
  /** Your OAuth 2.0 Client ID from Google Cloud Console. */
  client_id: string;
  /**
   * Called by GIS after a successful sign-in.
   * Use a globally accessible function when relying on the data-attribute approach,
   * or a direct reference when using the programmatic API.
   */
  callback: (response: CredentialResponse) => void;
  /** Automatically selects the sole available account. Default: false. */
  auto_select?: boolean;
  /** Cancels the One Tap flow when the user clicks outside the prompt. Default: true. */
  cancel_on_tap_outside?: boolean;
}

/** Options forwarded to `google.accounts.id.renderButton()`. */
interface GsiButtonConfiguration {
  /** Button style — "standard" shows text; "icon" shows only the G logo. */
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  /** Button width in pixels (min 200, max 400). */
  width?: number;
  /** BCP 47 locale code, e.g. "vi" for Vietnamese. */
  locale?: string;
}

// ---------------------------------------------------------------------------
// google.accounts.id namespace
// ---------------------------------------------------------------------------

interface GoogleAccountsId {
  /**
   * Initialises the GIS client.  Must be called before `renderButton` or `prompt`.
   */
  initialize: (config: IdConfiguration) => void;

  /**
   * Renders a Google Sign-In button inside `parent`.
   * @param parent - A DOM element that will contain the button.
   * @param options - Visual configuration for the button.
   */
  renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;

  /**
   * Displays the One Tap prompt.
   * Call after `initialize` when you want to trigger the floating dialog.
   */
  prompt: () => void;

  /** Suppresses automatic credential selection for the current user session. */
  disableAutoSelect: () => void;

  /**
   * Revokes the OAuth token for the given user.
   * @param hint - The user's email address or the sub value from the JWT.
   */
  revoke: (
    hint: string,
    callback: (done: { successful: boolean; error?: string }) => void,
  ) => void;
}

/** The `google` global injected by the GIS script. */
declare namespace google {
  namespace accounts {
    const id: GoogleAccountsId;
  }
}


