import { u as useAuth, a as useBackend, b as useProfile, c as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, z } from "./index-CtLY6vs2.js";
import { m as motion } from "./proxy-C4ENgEup.js";
import { S as Sun, M as Moon } from "./sun-Dp_dfXPb.js";
function ThemeToggle() {
  const { theme, setTheme } = z();
  const isDark = theme === "dark";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => setTheme(isDark ? "light" : "dark"),
      className: "flex items-center justify-center w-10 h-10 rounded-full glass-card transition-smooth text-muted-foreground hover:text-foreground",
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
      className: "min-h-screen gradient-bg relative overflow-hidden flex flex-col",
      "data-ocid": "login-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 overflow-hidden z-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] opacity-60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px] opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] opacity-40" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 px-5 pt-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none", children: "EveryMoment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "w-full max-w-sm",
            initial: { opacity: 0, scale: 0.88, y: 16 },
            animate: { opacity: 1, scale: 1, y: 0 },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 28,
              delay: 0.05
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-3xl p-8 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg glow-accent-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                            fill: "white",
                            fillOpacity: "0.2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "2.5", fill: "white" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: "M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5",
                            stroke: "white",
                            strokeWidth: "1.8",
                            strokeLinecap: "round"
                          }
                        )
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl tracking-tight text-gradient-accent", children: "EveryMoment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1.5 leading-relaxed max-w-[240px] mx-auto", children: "Capture, organize, and share your most meaningful memories." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-body text-muted-foreground text-center leading-snug", children: "Sign in with Internet Identity to get started" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "button",
                      onClick: login,
                      disabled: isLoggingIn,
                      "data-ocid": "login-btn",
                      "aria-label": hasRealError ? "Try signing in again" : "Sign in with Internet Identity",
                      className: "w-full flex items-center justify-center gap-2.5 rounded-full px-5 py-3.5 font-body font-semibold text-sm min-h-[48px] glow-accent disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.28 290))"
                      },
                      whileTap: { scale: 0.96 },
                      whileHover: { scale: 1.02 },
                      transition: { type: "spring", stiffness: 400, damping: 20 },
                      children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin",
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
                      className: "text-center text-[11px] text-destructive font-body leading-relaxed",
                      role: "alert",
                      "data-ocid": "login-error-msg",
                      children: errorMessage
                    }
                  ),
                  !hasRealError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[11px] text-muted-foreground font-body leading-relaxed", children: "🔒 Passwordless & secure — no email or password needed." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center justify-center gap-4", children: ["Capture", "Organize", "Share"].map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.3 + i * 0.08 },
                  className: "px-3 py-1 glass-card rounded-full text-[11px] font-body text-muted-foreground",
                  children: label
                },
                label
              )) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-body", children: [
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
