import { u as useAuth, a as useBackend, b as useProfile, c as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, z } from "./index-DlqwQ7hd.js";
import { S as Sun, M as Moon } from "./sun-DHiVM1rX.js";
import "./createLucideIcon-BUPz7SPw.js";
function ThemeToggle() {
  const { theme, setTheme } = z();
  const isDark = theme === "dark";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => setTheme(isDark ? "light" : "dark"),
      className: "flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
      "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })
      ]
    }
  );
}
function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login, loginError } = useAuth();
  const { actor } = useBackend();
  const { hasProfile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();
  const redirectingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
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
    navigate
  ]);
  reactExports.useEffect(() => {
    if (!isAuthenticated && !isInitializing) {
      redirectingRef.current = false;
    }
  }, [isAuthenticated, isInitializing]);
  if (isInitializing || isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  const hasRealError = !!loginError;
  const errorMessage = loginError ? loginError.message.includes("timed out") ? "Sign-in timed out. Please try again." : "Sign-in was cancelled or failed. Please try again." : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "login-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-5 pt-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none", children: "EveryMoment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              width: "30",
              height: "30",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
                    fill: "oklch(var(--primary-foreground))",
                    fillOpacity: "0.15"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "12",
                    cy: "8",
                    r: "2.5",
                    fill: "oklch(var(--primary-foreground))"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5",
                    stroke: "oklch(var(--primary-foreground))",
                    strokeWidth: "1.8",
                    strokeLinecap: "round"
                  }
                )
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 text-center space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl sm:text-5xl leading-none tracking-tight text-foreground", children: [
              "Every",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "M" }),
              "oment"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body max-w-[260px] leading-relaxed", children: "Capture, organize, and share your most meaningful memories." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[320px] bg-card border border-border rounded-2xl p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-body text-muted-foreground text-center mb-5 leading-snug", children: "Sign in with Internet Identity to get started" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: login,
                disabled: isLoggingIn,
                "data-ocid": "login-btn",
                "aria-label": hasRealError ? "Try signing in again" : "Sign in with Internet Identity",
                className: "w-full flex items-center justify-center gap-2.5 bg-foreground text-background rounded-xl px-5 py-3.5 font-body font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[46px]",
                children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin",
                      role: "status",
                      "aria-label": "Connecting"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connecting…" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "svg",
                    {
                      width: "17",
                      height: "17",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      "aria-hidden": "true",
                      className: "flex-shrink-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: "12",
                            cy: "12",
                            r: "9.5",
                            stroke: "currentColor",
                            strokeWidth: "1.6"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "ellipse",
                          {
                            cx: "12",
                            cy: "12",
                            rx: "3.8",
                            ry: "9.5",
                            stroke: "currentColor",
                            strokeWidth: "1.6"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: "M2.5 12h19",
                            stroke: "currentColor",
                            strokeWidth: "1.6",
                            strokeLinecap: "round"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: "M4 7.5h16M4 16.5h16",
                            stroke: "currentColor",
                            strokeWidth: "1.2",
                            strokeLinecap: "round"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hasRealError ? "Try again" : "Sign in with Internet Identity" })
                ] })
              }
            ),
            hasRealError && errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "mt-3 text-center text-[11px] text-destructive font-body leading-relaxed",
                role: "alert",
                "data-ocid": "login-error-msg",
                children: errorMessage
              }
            ),
            !hasRealError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] text-muted-foreground font-body leading-relaxed", children: "Passwordless & secure — no email or password needed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex items-center gap-6 text-[11px] text-muted-foreground font-body", children: ["Capture", "Organize", "Share"].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-muted-foreground/40 inline-block" }),
            label
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-body", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline underline-offset-2 hover:text-foreground transition-colors duration-200",
              children: "Built with caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  LoginPage,
  ThemeToggle
};
