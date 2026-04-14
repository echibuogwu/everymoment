import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { useProfile } from "../hooks/use-profile";
import { LoadingSpinner } from "./LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  /** When true (default), route requires authentication */
  requireAuth?: boolean;
  /** When true (default), route also requires a completed profile */
  requireProfile?: boolean;
  currentPath?: string;
}

/**
 * Route-level authentication and profile guard.
 *
 * For PUBLIC routes (requireAuth=false):
 *   - Never shows a spinner — renders children immediately
 *   - No redirects
 *
 * For PROTECTED routes (requireAuth=true):
 *   Gate order — CRITICAL (do not reorder):
 *   1. isInitializing         → show spinner (II is checking for existing session)
 *   2. !isAuthenticated       → redirect to /login
 *   3. !actor (+ timeout 15s) → show spinner; after timeout show error + retry
 *   4. isProfileLoading       → show spinner (profile query in flight)
 *   5. !hasProfile            → redirect to /onboarding  (if requireProfile)
 *   6. hasProfile on onboard  → redirect to /dashboard
 */
export function AuthGuard({
  children,
  requireAuth = true,
  requireProfile = true,
  currentPath = "",
}: AuthGuardProps) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { actor } = useBackend();
  const { isLoading: isProfileLoading, hasProfile } = useProfile();
  const navigate = useNavigate();

  // Actor initialization timeout (15 seconds) — only starts after user is confirmed authenticated
  const [actorTimedOut, setActorTimedOut] = useState(false);
  const actorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only start timeout on PROTECTED routes when authenticated but actor not ready
    if (requireAuth && isAuthenticated && !actor && !actorTimedOut) {
      console.log(
        "[AuthGuard] Authenticated, waiting for actor initialization...",
      );
      actorTimeoutRef.current = setTimeout(() => {
        console.error("[AuthGuard] Actor initialization timed out after 15s");
        setActorTimedOut(true);
      }, 15_000);
    }

    // Clear timeout when actor becomes ready
    if (actor && actorTimeoutRef.current) {
      console.log(
        "[AuthGuard] Actor initialized successfully, clearing timeout.",
      );
      clearTimeout(actorTimeoutRef.current);
      actorTimeoutRef.current = null;
      setActorTimedOut(false);
    }

    return () => {
      if (actorTimeoutRef.current) {
        clearTimeout(actorTimeoutRef.current);
      }
    };
  }, [requireAuth, isAuthenticated, actor, actorTimedOut]);

  // Reset timeout state when we lose authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setActorTimedOut(false);
      if (actorTimeoutRef.current) {
        clearTimeout(actorTimeoutRef.current);
        actorTimeoutRef.current = null;
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Public routes: no redirect logic
    if (!requireAuth) return;

    // Gate 1: still initializing
    if (isInitializing) return;

    // Gate 2: must be authenticated
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }

    // Gate 3: wait for actor (required for profile query to run)
    if (!actor) return;

    // Gate 4: wait for profile query to settle
    if (isProfileLoading) return;

    // Gate 5: profile required but missing
    if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
      navigate({ to: "/onboarding" });
      return;
    }

    // Gate 6: already has profile but landed on onboarding
    if (hasProfile && currentPath === "/onboarding") {
      navigate({ to: "/dashboard" });
    }
  }, [
    requireAuth,
    isInitializing,
    isAuthenticated,
    actor,
    isProfileLoading,
    hasProfile,
    requireProfile,
    currentPath,
    navigate,
  ]);

  // ── Render guards ──

  // Public routes: always render immediately
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Gate 1: II session check in progress
  if (isInitializing) {
    return <LoadingSpinner fullScreen />;
  }

  // Gate 2: unauthenticated on protected route — redirect in flight
  if (!isAuthenticated) {
    return null;
  }

  // Gate 3: actor not ready yet — show spinner or timeout error
  if (isAuthenticated && !actor) {
    if (actorTimedOut) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-foreground font-body font-medium text-base">
            Connection took too long
          </p>
          <p className="text-muted-foreground font-body text-sm max-w-[280px]">
            Unable to connect to the backend. Please refresh the page to try
            again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            data-ocid="actor-timeout-retry"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return <LoadingSpinner fullScreen />;
  }

  // Gate 4: profile query in flight
  if (isAuthenticated && isProfileLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Gate 5: profile required but missing — redirect in flight
  if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
    return null;
  }

  // Gate 6: has profile but on onboarding — redirect in flight
  if (hasProfile && currentPath === "/onboarding") {
    return null;
  }

  return <>{children}</>;
}
