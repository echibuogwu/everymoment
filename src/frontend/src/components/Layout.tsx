import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Bookmark,
  Compass,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import {
  useUnreadMessageCount,
  useUnreadNotificationCount,
} from "../hooks/use-backend";
import { useIsAdmin, useProfile } from "../hooks/use-profile";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

// Detect scroll direction and position
function useScrollBehavior() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setScrolled(y > 10);
      setScrollingDown(y > lastScrollY.current && y > 50);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrolled, scrollingDown };
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors duration-200 text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="theme-toggle"
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { data: count = 0 } = useUnreadNotificationCount();

  if (!isAuthenticated) return null;

  return (
    <Link
      to="/notifications"
      className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors duration-200 text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
      data-ocid="notification-bell"
    >
      <Bell className="w-4 h-4" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function GlassHeader({ scrolled }: { scrolled: boolean }) {
  const { isAuthenticated, logout, login, isLoggingIn } = useAuth();
  const { profile } = useProfile();

  const avatarUrl = profile?.photo?.getDirectURL();
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      data-ocid="app-header"
      animate={{
        backgroundColor: scrolled ? "var(--header-bg-scrolled)" : "transparent",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={
        {
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          "--header-bg-scrolled": "var(--header-bg-dark, rgba(10,8,24,0.75))",
        } as React.CSSProperties
      }
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/explore"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <motion.span
            className="font-display font-bold text-lg tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.28 280), oklch(0.78 0.22 310))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            EveryMoment
          </motion.span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />

          {isAuthenticated && (
            <motion.div whileTap={{ scale: 0.93 }}>
              <Button
                asChild
                size="sm"
                variant="default"
                className="hidden sm:flex items-center gap-1 h-8 px-3 rounded-full text-xs font-medium"
                data-ocid="create-moment-btn"
              >
                <Link to="/moments/new">
                  <Plus className="w-3.5 h-3.5" />
                  New
                </Link>
              </Button>
            </motion.div>
          )}

          {isAuthenticated && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-ocid="user-avatar-trigger"
                  aria-label="User menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Avatar className="w-8 h-8 ring-2 ring-white/20">
                    {avatarUrl && (
                      <AvatarImage src={avatarUrl} alt={profile.username} />
                    )}
                    <AvatarFallback className="text-xs font-display font-semibold bg-accent/20 text-accent-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 z-50">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-foreground truncate">
                    @{profile.username}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile/$username"
                    params={{ username: profile.username }}
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="nav-profile"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="nav-my-moments"
                  >
                    <Home className="w-4 h-4" />
                    My Moments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/messages"
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="nav-messages"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/saved"
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="nav-saved"
                  >
                    <Bookmark className="w-4 h-4" />
                    Saved Moments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/activity"
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="nav-activity"
                  >
                    <Activity className="w-4 h-4" />
                    Activity Feed
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                  data-ocid="nav-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isAuthenticated ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : (
            <motion.div whileTap={{ scale: 0.93 }}>
              <Button
                size="sm"
                variant="default"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="h-8 px-4 rounded-full text-xs font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
                data-ocid="header-signin-btn"
                aria-label="Sign in"
              >
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

const NAV_ITEMS_AUTH = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/saved", label: "Saved", icon: Bookmark },
] as const;

const NAV_ITEMS_GUEST = [
  { to: "/explore", label: "Explore", icon: Compass },
] as const;

function NavMessagesBadge() {
  const { data: count = 0 } = useUnreadMessageCount();
  if (count === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function FloatingBottomNav({
  scrollingDown,
}: {
  scrollingDown: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const location = useLocation();

  const navItems = isAuthenticated
    ? [
        ...NAV_ITEMS_AUTH,
        ...(isAdmin
          ? [{ to: "/admin" as const, label: "Admin", icon: ShieldCheck }]
          : []),
      ]
    : [...NAV_ITEMS_GUEST];

  const showCreate = isAuthenticated;

  return (
    <motion.div
      className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
      initial={false}
      animate={{
        scale: scrollingDown ? 0.94 : 1,
        opacity: scrollingDown ? 0.7 : 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        className="relative pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full border border-white/10"
        style={{
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          backgroundColor: "oklch(var(--card) / 0.7)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        data-ocid="bottom-nav"
        aria-label="Main navigation"
      >
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to || location.pathname.startsWith(`${to}/`);

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "text-accent"
                  : "text-foreground/50 hover:text-foreground/80",
              )}
              data-ocid={`bottom-nav-${label.toLowerCase()}`}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Sliding active capsule */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-accent/15"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <span className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className="w-5 h-5"
                  />
                  {label === "Messages" && <NavMessagesBadge />}
                </span>
                <span className="text-[9px] font-body font-medium leading-none tracking-wide">
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* Create button — elevated above pill */}
        {showCreate && (
          <motion.div
            className="relative -my-3 mx-1"
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            <Link
              to="/moments/new"
              className="flex items-center justify-center w-11 h-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.28 280), oklch(0.65 0.22 310))",
                boxShadow:
                  "0 0 20px oklch(0.72 0.28 280 / 0.55), 0 4px 12px rgba(0,0,0,0.35)",
              }}
              data-ocid="bottom-nav-create"
              aria-label="Create moment"
            >
              <Sparkles className="w-4.5 h-4.5 text-white" size={18} />
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.div>
  );
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const { scrolled, scrollingDown } = useScrollBehavior();
  const location = useLocation();

  // Reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const pageTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  const pageInitial = prefersReducedMotion ? {} : { opacity: 0, y: 16 };
  const pageAnimate = prefersReducedMotion ? {} : { opacity: 1, y: 0 };
  const pageExit = prefersReducedMotion ? {} : { opacity: 0, y: -8 };

  return (
    <div
      className="flex flex-col min-h-screen bg-background relative"
      style={
        {
          "--header-bg-dark": "rgba(10, 8, 24, 0.75)",
          "--header-bg-light": "rgba(255, 255, 255, 0.75)",
        } as React.CSSProperties
      }
    >
      {/* Gradient background layer */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.06 290 / 0.6) 0%, transparent 70%)",
        }}
      />

      <GlassHeader scrolled={scrolled} />

      {/* Main content with page transition */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-14 pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={pageInitial}
            animate={pageAnimate}
            exit={pageExit}
            transition={pageTransition}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Attribution footer */}
      <footer
        className="w-full border-t border-border/40 py-4 text-center mb-28 z-10"
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "oklch(var(--card) / 0.4)",
        }}
      >
        <p className="text-[11px] text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Floating glass pill nav */}
      {!hideNav && <FloatingBottomNav scrollingDown={scrollingDown} />}
    </div>
  );
}
