import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  ActivityEvent,
  Announcement,
  ConversationSummary,
  Message,
  MomentId,
  Notification,
  UserId,
  backendInterface,
} from "../backend";
import { QUERY_KEYS } from "../lib/query-keys";

/**
 * Returns the authenticated backend actor.
 *
 * IMPORTANT — isFetching semantics:
 *   isFetching = true  → the actor canister session is still being established.
 *                        This is NOT a data-fetch indicator.
 *   isFetching = false → actor is either ready (actor !== null) or will never
 *                        be ready without re-authentication.
 *
 * Do NOT use isFetching as a guard in React Query `enabled` conditions — it
 * causes queries to never fire when an existing II session is restored
 * (isAuthenticated becomes true before isFetching clears).
 *
 * Use `!!actor` instead.
 */
export function useBackend(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  return { actor: actor as backendInterface | null, isFetching };
}

// ── Bulk Import Types ─────────────────────────────────────────────────────────

/** Shape of a parsed CSV row before sending to the backend. */
export interface BulkImportMomentRow {
  title: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  /** ISO 8601 or Unix ms string from the CSV `startDate` / `eventDate` column */
  startDate?: string;
  /** Raw semicolon-separated tags string from the CSV */
  tags?: string;
  coverImage?: string;
  visibility?: string;
}

/** Per-row result returned by the hook after a bulk import. */
export interface BulkImportResult {
  rowIndex: number;
  title: string;
  success: boolean;
  error?: string;
  warning?: string;
}

// ── useAdminBulkImportMoments ─────────────────────────────────────────────────

/**
 * Mutation hook for bulk-importing moments from a parsed CSV payload.
 * Calls the backend `adminBulkImportMoments` method.
 */
export function useAdminBulkImportMoments() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<
    BulkImportResult[],
    Error,
    {
      rows: BulkImportMomentRow[];
      onProgress?: (current: number, total: number) => void;
    }
  >({
    mutationFn: async ({ rows, onProgress }) => {
      if (!actor) throw new Error("Not connected to backend");

      // Transform CSV rows into the backend BulkImportMomentRow shape
      const inputs = rows.map((row) => {
        let startDateTs = BigInt(Date.now()) * 1_000_000n;
        if (row.startDate) {
          const parsed = Date.parse(row.startDate);
          if (!Number.isNaN(parsed)) {
            startDateTs = BigInt(parsed) * 1_000_000n;
          }
        }

        const tagList = row.tags
          ? row.tags
              .split(";")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        const vis =
          row.visibility?.toLowerCase() === "private" ? "private" : "public";

        return {
          title: row.title,
          description: row.description,
          location: row.location,
          locationLat: row.locationLat,
          locationLng: row.locationLng,
          startDate: startDateTs,
          endDate: undefined,
          maxAttendees: undefined,
          tags: tagList,
          visibility: vis,
          coverImageUrl: row.coverImage ? row.coverImage : undefined,
        };
      });

      onProgress?.(0, rows.length);
      const raw = await actor.adminBulkImportMoments(inputs);
      onProgress?.(rows.length, rows.length);

      // Map backend errors and warnings (indexed by bigint row) into per-row results
      const errorMap = new Map<number, string>(
        raw.errors.map((e) => [Number(e.row), e.message]),
      );
      const warningMap = new Map<number, string>(
        (raw.warnings ?? []).map((w) => [Number(w.row), w.message]),
      );

      return rows.map((row, i) => {
        const errMsg = errorMap.get(i);
        const warnMsg = warningMap.get(i);
        return {
          rowIndex: i,
          title: row.title,
          success: !errMsg,
          error: errMsg,
          warning: warnMsg,
        };
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminMoments,
      });
    },
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useNotifications() {
  const { actor } = useBackend();
  return useQuery<Notification[]>({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor,
    refetchInterval: 30_000,
  });
}

export function useUnreadNotificationCount() {
  const { actor } = useBackend();
  return useQuery<number>({
    queryKey: QUERY_KEYS.unreadNotificationCount,
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getUnreadNotificationCount();
      return Number(count);
    },
    enabled: !!actor,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.markNotificationRead(id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.unreadNotificationCount,
        }),
      ]);
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.markAllNotificationsRead();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.unreadNotificationCount,
        }),
      ]);
    },
  });
}

// ── Messages ──────────────────────────────────────────────────────────────────

export function useConversations() {
  const { actor } = useBackend();
  return useQuery<ConversationSummary[]>({
    queryKey: QUERY_KEYS.conversations,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConversations();
    },
    enabled: !!actor,
    refetchInterval: 15_000,
  });
}

export function useConversation(userId: string | null) {
  const { actor } = useBackend();
  return useQuery<Message[]>({
    queryKey: QUERY_KEYS.conversation(userId ?? ""),
    queryFn: async () => {
      if (!actor || !userId) return [];
      const principal = { toString: () => userId } as Principal;
      return actor.getConversation(principal);
    },
    enabled: !!actor && !!userId,
    refetchInterval: 10_000,
  });
}

export function useSendMessage() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, { recipientId: UserId; text: string }>({
    mutationFn: async ({ recipientId, text }) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.sendMessage(recipientId, text);
    },
    onSuccess: async (_data, { recipientId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.conversation(recipientId.toString()),
        }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations }),
      ]);
    },
  });
}

export function useMarkConversationRead() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UserId>({
    mutationFn: async (otherUserId) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.markConversationRead(otherUserId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.unreadMessageCount,
        }),
      ]);
    },
  });
}

export function useUnreadMessageCount() {
  const { actor } = useBackend();
  return useQuery<number>({
    queryKey: QUERY_KEYS.unreadMessageCount,
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getUnreadMessageCount();
      return Number(count);
    },
    enabled: !!actor,
    refetchInterval: 15_000,
  });
}

// ── Announcements ─────────────────────────────────────────────────────────────

export function useAnnouncements(momentId: string | null) {
  const { actor } = useBackend();
  return useQuery<Announcement[]>({
    queryKey: QUERY_KEYS.announcements(momentId ?? ""),
    queryFn: async () => {
      if (!actor || !momentId) return [];
      return actor.getAnnouncementsForMoment(momentId);
    },
    enabled: !!actor && !!momentId,
  });
}

export function usePostAnnouncement() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, { momentId: MomentId; text: string }>(
    {
      mutationFn: async ({ momentId, text }) => {
        if (!actor) throw new Error("Not connected to backend");
        return actor.postAnnouncement(momentId, text);
      },
      onSuccess: async (_data, { momentId }) => {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.announcements(momentId),
        });
      },
    },
  );
}

export function useDeleteAnnouncement() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { momentId: MomentId; announcementId: bigint }
  >({
    mutationFn: async ({ momentId, announcementId }) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.deleteAnnouncement(momentId, announcementId);
    },
    onSuccess: async (_data, { momentId }) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.announcements(momentId),
      });
    },
  });
}

// ── Activity Feed ─────────────────────────────────────────────────────────────

export function useActivityFeed() {
  const { actor } = useBackend();
  return useQuery<ActivityEvent[]>({
    queryKey: QUERY_KEYS.activityFeed,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityFeed();
    },
    enabled: !!actor,
    refetchInterval: 60_000,
  });
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────

export function useBookmarks() {
  const { actor } = useBackend();
  return useQuery<string[]>({
    queryKey: QUERY_KEYS.bookmarks,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookmarks();
    },
    enabled: !!actor,
  });
}

export function useIsBookmarked(momentId: string | null) {
  const { actor } = useBackend();
  return useQuery<boolean>({
    queryKey: QUERY_KEYS.isBookmarked(momentId ?? ""),
    queryFn: async () => {
      if (!actor || !momentId) return false;
      return actor.isBookmarked(momentId);
    },
    enabled: !!actor && !!momentId,
  });
}

export function useBookmarkMoment() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, MomentId>({
    mutationFn: async (momentId) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.bookmarkMoment(momentId);
    },
    onSuccess: async (_data, momentId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.isBookmarked(momentId),
        }),
      ]);
    },
  });
}

export function useUnbookmarkMoment() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, MomentId>({
    mutationFn: async (momentId) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.unbookmarkMoment(momentId);
    },
    onSuccess: async (_data, momentId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.isBookmarked(momentId),
        }),
      ]);
    },
  });
}

// ── Waitlist ──────────────────────────────────────────────────────────────────

export function useMomentWaitlist(momentId: string | null) {
  const { actor } = useBackend();
  return useQuery<UserId[]>({
    queryKey: QUERY_KEYS.momentWaitlist(momentId ?? ""),
    queryFn: async () => {
      if (!actor || !momentId) return [];
      return actor.getMomentWaitlist(momentId);
    },
    enabled: !!actor && !!momentId,
  });
}
