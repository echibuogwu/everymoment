import { u as useAuth, a as useBackend, b as useProfile, c as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner } from "./index-DXT1CttK.js";
function AuthGuard({
  children,
  requireAuth = true,
  requireProfile = true,
  currentPath = ""
}) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { actor } = useBackend();
  const { isLoading: isProfileLoading, hasProfile } = useProfile();
  const navigate = useNavigate();
  const [actorTimedOut, setActorTimedOut] = reactExports.useState(false);
  const actorTimeoutRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (requireAuth && isAuthenticated && !actor && !actorTimedOut) {
      console.log(
        "[AuthGuard] Authenticated, waiting for actor initialization..."
      );
      actorTimeoutRef.current = setTimeout(() => {
        console.error("[AuthGuard] Actor initialization timed out after 15s");
        setActorTimedOut(true);
      }, 15e3);
    }
    if (actor && actorTimeoutRef.current) {
      console.log(
        "[AuthGuard] Actor initialized successfully, clearing timeout."
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
  reactExports.useEffect(() => {
    if (!isAuthenticated) {
      setActorTimedOut(false);
      if (actorTimeoutRef.current) {
        clearTimeout(actorTimeoutRef.current);
        actorTimeoutRef.current = null;
      }
    }
  }, [isAuthenticated]);
  reactExports.useEffect(() => {
    if (!requireAuth) return;
    if (isInitializing) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (!actor) return;
    if (isProfileLoading) return;
    if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
      navigate({ to: "/onboarding" });
      return;
    }
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
    navigate
  ]);
  if (!requireAuth) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  }
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (!isAuthenticated) {
    return null;
  }
  if (isAuthenticated && !actor) {
    if (actorTimedOut) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-medium text-base", children: "Connection took too long" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm max-w-[280px]", children: "Unable to connect to the backend. Please refresh the page to try again." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => window.location.reload(),
            className: "mt-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-body font-semibold text-sm hover:opacity-90 transition-opacity",
            "data-ocid": "actor-timeout-retry",
            children: "Refresh page"
          }
        )
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (isAuthenticated && isProfileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
    return null;
  }
  if (hasProfile && currentPath === "/onboarding") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  AuthGuard as A
};
