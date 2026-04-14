import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
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
        };
      });

      onProgress?.(0, rows.length);
      const raw = await actor.adminBulkImportMoments(inputs);
      onProgress?.(rows.length, rows.length);

      // Map backend errors (indexed by bigint row) into per-row results
      const errorMap = new Map<number, string>(
        raw.errors.map((e) => [Number(e.row), e.message]),
      );

      return rows.map((row, i) => {
        const errMsg = errorMap.get(i);
        return {
          rowIndex: i,
          title: row.title,
          success: !errMsg,
          error: errMsg,
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
