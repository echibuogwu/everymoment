import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../lib/query-keys";
import type { SaveProfileInput, UserProfilePublic } from "../types";
import { useAuth } from "./use-auth";
import { useBackend } from "./use-backend";

/**
 * Fetches the caller's own profile.
 *
 * GUARD RULE: enabled = isAuthenticated && !!actor
 *
 * Do NOT add !isFetching to enabled. isFetching tracks actor session
 * initialization, not data fetching. Adding it causes the query to stay
 * disabled when an existing II session is detected (isAuthenticated=true
 * but isFetching briefly stays true), resulting in an infinite loading spinner.
 *
 * The queryFn returns null safely when actor is null (belt-and-suspenders).
 */
export function useProfile() {
  const { isAuthenticated } = useAuth();
  const { actor } = useBackend();

  const query = useQuery<UserProfilePublic | null>({
    queryKey: QUERY_KEYS.callerProfile,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: isAuthenticated && !!actor,
    staleTime: 1000 * 60 * 5,
  });

  // When not authenticated: isLoading = false (nothing to load).
  // When authenticated but actor not ready yet: isLoading = true (query hasn't
  // started yet — we must NOT signal "done" here or LoginPage will read a false
  // hasProfile=false and redirect incorrectly before the query ever runs).
  // When authenticated and actor ready: reflect query.isLoading.
  const actorReady = actor !== null;
  const isLoading = isAuthenticated
    ? actorReady
      ? query.isLoading
      : true
    : false;

  return {
    profile: query.data ?? null,
    isLoading,
    /**
     * true  = profile exists (data is a non-null UserProfilePublic)
     * false = authenticated + query settled + no profile found
     * false = unauthenticated / query not yet run (treat as "no profile")
     */
    hasProfile: query.data != null,
    refetch: query.refetch,
  };
}

/**
 * Returns whether the current caller has admin privileges.
 * Safe to call from any component — returns false until authenticated.
 */
export function useIsAdmin() {
  const { isAuthenticated } = useAuth();
  const { actor } = useBackend();

  const query = useQuery<boolean>({
    queryKey: QUERY_KEYS.callerRole,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: isAuthenticated && !!actor,
    staleTime: 1000 * 60 * 10,
  });

  return query.data ?? false;
}

/**
 * Mutation hook for saving the caller's own profile.
 * Invalidates callerProfile and the username-based profile query on success.
 */
export function useSaveProfile(username?: string) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveProfileInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected to backend");
      await actor.saveCallerUserProfile(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.callerProfile,
      });
      if (username) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.userProfileByUsername(username),
        });
      }
    },
  });
}
