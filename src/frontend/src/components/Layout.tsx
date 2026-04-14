import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Compass,
  LayoutGrid,
  LogOut,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../hooks/use-auth";
import { useIsAdmin, useProfile } from "../hooks/use-profile";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const AUTH_NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/explore", label: "Explore", icon: Compass },
] as const;

const GUEST_NAV_ITEMS = [
  { to: "/explore", label: "Explore", icon: Compass },
] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="theme-toggle"
    >
      <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const { isAuthenticated, logout, login, isLoggingIn } = useAuth();
  const { profile } = useProfile();
  const isAdmin = useIsAdmin();
  const location = useLocation();

  const avatarUrl = profile?.photo?.getDirectURL();
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";

  const navItems = isAuthenticated
    ? [
        ...AUTH_NAV_ITEMS,
        ...(isAdmin
          ? [{ to: "/admin" as const, label: "Admin", icon: ShieldCheck }]
          : []),
      ]
    : [...GUEST_NAV_ITEMS];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 glass-header border-b border-border/60"
        data-ocid="app-header"
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/explore"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              EveryMoment
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            {isAuthenticated && (
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
            )}

            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-opacity hover:opacity-80"
                    data-ocid="user-avatar-trigger"
                    aria-label="User menu"
                  >
                    <Avatar className="w-8 h-8 ring-2 ring-border">
                      {avatarUrl && (
                        <AvatarImage src={avatarUrl} alt={profile.username} />
                      )}
                      <AvatarFallback className="text-xs font-display font-semibold bg-secondary text-secondary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
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
                      <LayoutGrid className="w-4 h-4" />
                      My Moments
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
              /* Authenticated but profile not yet loaded */
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : (
              /* Unauthenticated — show Sign In button */
              <Button
                size="sm"
                variant="default"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="h-8 px-3 rounded-full text-xs font-medium"
                data-ocid="header-signin-btn"
                aria-label="Sign in"
              >
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-28">
        {children}
      </main>

      {/* Attribution footer */}
      <footer className="w-full bg-card border-t border-border/60 py-4 text-center mb-16 z-10">
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

      {/* Bottom navigation — visible for all users */}
      {!hideNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/60"
          data-ocid="bottom-nav"
        >
          <div className="max-w-2xl mx-auto flex h-16">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive =
                location.pathname === to ||
                location.pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid={`bottom-nav-${label.toLowerCase()}`}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-5 rounded-full transition-all duration-200",
                      isActive && "bg-foreground/10",
                    )}
                  >
                    <Icon
                      className="w-4.5 h-4.5"
                      strokeWidth={isActive ? 2.5 : 1.75}
                      size={18}
                    />
                  </div>
                  <span className="text-[10px] font-body font-medium leading-none">
                    {label}
                  </span>
                </Link>
              );
            })}

            {/* Mobile create button — only for authenticated users */}
            {isAuthenticated && (
              <Link
                to="/moments/new"
                className="flex-1 flex flex-col items-center justify-center gap-1 sm:hidden transition-colors duration-200 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                data-ocid="bottom-nav-create"
                aria-label="Create moment"
              >
                <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center shadow-md -mt-3">
                  <Plus
                    className="w-4.5 h-4.5 text-primary-foreground"
                    size={18}
                  />
                </div>
                <span className="text-[10px] font-body font-medium leading-none">
                  New
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
