import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Robust wrapper around Internet Identity.
 *
 * ROOT CAUSE FIX (page reload logs out / sign-in unclickable):
 *
 * The underlying InternetIdentityProvider restores a saved session on mount
 * but always ends with setStatus("idle") in its finally block — it never
 * sets status to "success" for a restored session.  This means:
 *
 *   - loginStatus stays "idle" even though identity is valid and non-anonymous
 *   - isAuthenticated (loginStatus === "success") is always false after reload
 *   - login() detects the valid delegation and throws "User is already
 *     authenticated", leaving loginStatus as "loginError", which makes the
 *     button appear broken
 *
 * FIX: we detect the restored-session case ourselves by checking whether
 * `identity` is present and non-anonymous while loginStatus is "idle" or
 * "loginError" (the latter happens when the user clicks Sign In after a
 * reload and the library throws "already authenticated").  We normalise both
 * to "success" so the rest of the app works correctly.
 *
 * loginStatus lifecycle (normalised):
 *   "initializing"  — II is setting up the AuthClient on page load
 *   "logging-in"    — II popup is open, user is authenticating
 *   "success"       — authenticated (new login OR restored session)
 *   "idle"          — unauthenticated / logged out
 *   "loginError"    — login failed (excluding "already authenticated")
 *
 * SESSION PERSISTENCE:
 *   Sessions persist indefinitely until browser storage is cleared.
 *   No timeout, no expiry warning.
 */

export function useAuth() {
  const {
    identity,
    loginStatus: rawStatus,
    login: rawLogin,
    clear,
    loginError: rawLoginError,
  } = useInternetIdentity();

  // ── Detect restored session ────────────────────────────────────────────────
  // identity is non-null and non-anonymous when a prior session was restored,
  // even though the library leaves loginStatus as "idle".
  const isRestoredSession =
    !!identity && !identity.getPrincipal().isAnonymous();

  // "already authenticated" error means identity IS valid — treat as success.
  const isAlreadyAuthError =
    rawStatus === "loginError" &&
    (rawLoginError?.message?.includes("already authenticated") ||
      rawLoginError?.message?.includes("User is already authenticated"));

  // Normalised status
  const effectiveStatus =
    isRestoredSession || isAlreadyAuthError ? "success" : rawStatus;

  const isAuthenticated = effectiveStatus === "success";
  const isInitializing = effectiveStatus === "initializing";
  const isLoggingIn = effectiveStatus === "logging-in";
  const principal = identity?.getPrincipal() ?? null;

  // ── Login with timeout + stuck-state recovery ──────────────────────────────
  const loginTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loginTimedOut, setLoginTimedOut] = useState(false);

  // Clear timeout when login resolves (success, error, or user cancel)
  useEffect(() => {
    if (rawStatus !== "logging-in") {
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
        loginTimeoutRef.current = null;
      }
      setLoginTimedOut(false);
    }
  }, [rawStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
    };
  }, []);

  const login = useCallback(() => {
    setLoginTimedOut(false);

    // If already authenticated (restored session), no need to re-login
    if (isAuthenticated) {
      console.warn(
        "[useAuth] login() called but already authenticated — ignoring",
      );
      return;
    }

    // Set a timeout so the button never stays stuck in "logging-in" forever
    loginTimeoutRef.current = setTimeout(() => {
      console.error("[useAuth] Login timed out after 20 seconds");
      setLoginTimedOut(true);
    }, 20_000);

    rawLogin();
  }, [isAuthenticated, rawLogin]);

  // Real errors: exclude "already authenticated" (handled above) and user-cancel
  const loginError =
    rawStatus === "loginError" && !isAlreadyAuthError
      ? rawLoginError
      : undefined;

  // If login timed out, expose a synthetic error
  const effectiveLoginError = loginTimedOut
    ? new Error("Sign-in timed out. Please try again.")
    : loginError;

  // isLoggingIn should reset if timed out so button becomes clickable again
  const effectiveIsLoggingIn = isLoggingIn && !loginTimedOut;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn: effectiveIsLoggingIn,
    principal,
    loginStatus: effectiveStatus,
    login,
    /** Clears II delegation and resets loginStatus to idle */
    logout: clear,
    loginError: effectiveLoginError,
  };
}
