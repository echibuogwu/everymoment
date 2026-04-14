import { useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { useProfile } from "../hooks/use-profile";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login, loginError } =
    useAuth();
  const { actor } = useBackend();
  const { hasProfile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  // Track if we've ever started a redirect to avoid double-navigates
  const redirectingRef = useRef(false);

  /**
   * Redirect logic — fires whenever auth/actor/profile state changes.
   *
   * Gate order:
   *   1. Still initializing → wait
   *   2. Not authenticated → stay on login page (show UI)
   *   3. Authenticated but actor not ready → wait
   *   4. Authenticated + actor ready but profile query still loading → wait
   *   5. All settled → redirect to /dashboard or /onboarding
   */
  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) return;
    if (!actor) return;
    if (isProfileLoading) return;
    if (redirectingRef.current) return;

    redirectingRef.current = true;

    if (hasProfile) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/onboarding" });
    }
  }, [
    isAuthenticated,
    isInitializing,
    actor,
    isProfileLoading,
    hasProfile,
    navigate,
  ]);

  // Reset redirect flag if we end up back on login page unauthenticated
  useEffect(() => {
    if (!isAuthenticated && !isInitializing) {
      redirectingRef.current = false;
    }
  }, [isAuthenticated, isInitializing]);

  /**
   * Show a full-screen spinner while:
   *   - II is checking for an existing session on page load (isInitializing)
   *   - User is authenticated (we'll redirect them — don't show the login UI)
   *
   * This prevents the "already authenticated" error by never showing
   * the Sign In button to an authenticated user.
   */
  if (isInitializing || isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  // ── At this point: isInitializing=false, isAuthenticated=false ──
  // Show the login UI.

  const hasRealError = !!loginError;
  const errorMessage = loginError
    ? loginError.message.includes("timed out")
      ? "Sign-in timed out. Please try again."
      : "Sign-in was cancelled or failed. Please try again."
    : null;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="login-page"
    >
      {/* Top bar */}
      <header className="px-5 pt-5 flex items-center justify-between">
        <span className="font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none">
          EveryMoment
        </span>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        {/* Visual mark */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="oklch(var(--primary-foreground))"
                fillOpacity="0.15"
              />
              <circle
                cx="12"
                cy="8"
                r="2.5"
                fill="oklch(var(--primary-foreground))"
              />
              <path
                d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5"
                stroke="oklch(var(--primary-foreground))"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mb-10 text-center space-y-2.5">
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-none tracking-tight text-foreground">
            Every<span className="opacity-40">M</span>oment
          </h1>
          <p className="text-sm text-muted-foreground font-body max-w-[260px] leading-relaxed">
            Capture, organize, and share your most meaningful memories.
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-[320px] bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-[13px] font-body text-muted-foreground text-center mb-5 leading-snug">
            Sign in with Internet Identity to get started
          </p>

          {/* Sign-in button — NEVER permanently disabled */}
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="login-btn"
            aria-label={
              hasRealError
                ? "Try signing in again"
                : "Sign in with Internet Identity"
            }
            className="w-full flex items-center justify-center gap-2.5 bg-foreground text-background rounded-xl px-5 py-3.5 font-body font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[46px]"
          >
            {isLoggingIn ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin"
                  role="status"
                  aria-label="Connecting"
                />
                <span>Connecting…</span>
              </>
            ) : (
              <>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="3.8"
                    ry="9.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M2.5 12h19"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 7.5h16M4 16.5h16"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>
                  {hasRealError
                    ? "Try again"
                    : "Sign in with Internet Identity"}
                </span>
              </>
            )}
          </button>

          {hasRealError && errorMessage && (
            <p
              className="mt-3 text-center text-[11px] text-destructive font-body leading-relaxed"
              role="alert"
              data-ocid="login-error-msg"
            >
              {errorMessage}
            </p>
          )}

          {!hasRealError && (
            <p className="mt-4 text-center text-[11px] text-muted-foreground font-body leading-relaxed">
              Passwordless &amp; secure — no email or password needed.
            </p>
          )}
        </div>

        {/* Feature hints */}
        <div className="mt-10 flex items-center gap-6 text-[11px] text-muted-foreground font-body">
          {["Capture", "Organize", "Share"].map((label) => (
            <span key={label} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 inline-block" />
              {label}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center">
        <p className="text-[11px] text-muted-foreground font-body">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
          >
            Built with caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
