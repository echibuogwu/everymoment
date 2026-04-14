import { useAuth } from "./use-auth";

/**
 * Returns a wrapper that either runs the action (if authenticated) or
 * triggers the Internet Identity login flow directly.
 *
 * Usage:
 *   const requireAuth = useRequireAuth();
 *   <button onClick={() => requireAuth(() => doSomething())}>Like</button>
 */
export function useRequireAuth() {
  const { isAuthenticated, login } = useAuth();

  return function requireAuth(action: () => void) {
    if (isAuthenticated) {
      action();
    } else {
      login();
    }
  };
}
