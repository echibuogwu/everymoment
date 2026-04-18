import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "./hooks/use-auth";
import { useProfile } from "./hooks/use-profile";

// Lazy-loaded pages
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const OnboardingPage = lazy(() =>
  import("./pages/OnboardingPage").then((m) => ({ default: m.OnboardingPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ExplorePage = lazy(() =>
  import("./pages/ExplorePage").then((m) => ({ default: m.ExplorePage })),
);
const MomentDetailPage = lazy(() =>
  import("./pages/MomentDetailPage").then((m) => ({
    default: m.MomentDetailPage,
  })),
);
const NewMomentPage = lazy(() =>
  import("./pages/NewMomentPage").then((m) => ({ default: m.NewMomentPage })),
);
const EditMomentPage = lazy(() =>
  import("./pages/EditMomentPage").then((m) => ({ default: m.EditMomentPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const ShareMomentPage = lazy(() =>
  import("./pages/ShareMomentPage").then((m) => ({
    default: m.ShareMomentPage,
  })),
);
const EventPassPage = lazy(() =>
  import("./pages/EventPassPage").then((m) => ({ default: m.EventPassPage })),
);
const MessagesPage = lazy(() =>
  import("./pages/MessagesPage").then((m) => ({ default: m.MessagesPage })),
);
const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const SavedMomentsPage = lazy(() =>
  import("./pages/SavedMomentsPage").then((m) => ({
    default: m.SavedMomentsPage,
  })),
);
const ActivityFeedPage = lazy(() =>
  import("./pages/ActivityFeedPage").then((m) => ({
    default: m.ActivityFeedPage,
  })),
);

function PageFallback() {
  return <LoadingSpinner fullScreen />;
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  ),
});

// Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <LoginPage />
    </Suspense>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <OnboardingPage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <DashboardPage />
    </Suspense>
  ),
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ExplorePage />
    </Suspense>
  ),
});

const momentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/moments/$momentId",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <MomentDetailPage />
    </Suspense>
  ),
});

// Public share link route — /moment/:momentId (no 's')
// Works for both public moments (shows content) and private (shows access request)
const momentShareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/moment/$momentId",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ShareMomentPage />
    </Suspense>
  ),
});

const newMomentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/moments/new",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <NewMomentPage />
    </Suspense>
  ),
});

const editMomentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/moments/$momentId/edit",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <EditMomentPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ProfilePage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AdminPage />
    </Suspense>
  ),
});

// Public event pass route — /event-pass/:momentId/:userId (no auth required)
const eventPassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-pass/$momentId/$userId",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <EventPassPage />
    </Suspense>
  ),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <MessagesPage />
    </Suspense>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <NotificationsPage />
    </Suspense>
  ),
});

const savedMomentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <SavedMomentsPage />
    </Suspense>
  ),
});

const activityFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ActivityFeedPage />
    </Suspense>
  ),
});

/**
 * Index route — smart redirect without hard browser navigation.
 *
 * - Authenticated + profile    → /dashboard
 * - Authenticated + no profile → /onboarding
 * - Authenticated, initializing profile → brief spinner (no flash)
 * - Unauthenticated            → /explore (so guests can browse)
 *
 * NEVER uses window.location.replace — that breaks React state init,
 * breaks TanStack Router location tracking, and kills the sign-in button.
 */
function IndexRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { hasProfile, isLoading: isProfileLoading } = useProfile();

  // Still checking II session — wait briefly
  if (isInitializing) {
    return <LoadingSpinner fullScreen />;
  }

  // Not authenticated — send to explore immediately (no spinner)
  if (!isAuthenticated) {
    return <Navigate to="/explore" />;
  }

  // Authenticated, waiting for profile to load — brief spinner
  if (isProfileLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Authenticated — route based on profile existence
  return <Navigate to={hasProfile ? "/dashboard" : "/onboarding"} />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  onboardingRoute,
  dashboardRoute,
  exploreRoute,
  newMomentRoute,
  momentDetailRoute,
  momentShareRoute,
  editMomentRoute,
  profileRoute,
  adminRoute,
  eventPassRoute,
  messagesRoute,
  notificationsRoute,
  savedMomentsRoute,
  activityFeedRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
