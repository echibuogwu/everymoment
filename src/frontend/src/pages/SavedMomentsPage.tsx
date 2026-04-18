import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useAuth } from "../hooks/use-auth";
import {
  useBackend,
  useBookmarkMoment,
  useBookmarks,
  useIsBookmarked,
  useUnbookmarkMoment,
} from "../hooks/use-backend";
import type { MomentId, MomentListItem } from "../types";

// ── Bookmark toggle overlaid on a card ───────────────────────────────────────

function BookmarkToggle({ momentId }: { momentId: MomentId }) {
  const { data: isBookmarked } = useIsBookmarked(momentId);
  const { mutate: bookmark, isPending: isBookmarking } = useBookmarkMoment();
  const { mutate: unbookmark, isPending: isUnbookmarking } =
    useUnbookmarkMoment();

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      unbookmark(momentId);
    } else {
      bookmark(momentId);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isBookmarking || isUnbookmarking}
      className="p-1.5 rounded-full transition-colors hover:bg-accent/10"
      aria-label={isBookmarked ? "Remove bookmark" : "Save moment"}
      data-ocid="saved.bookmark_toggle"
    >
      <Bookmark
        className={`w-4 h-4 ${isBookmarked ? "fill-accent text-accent" : "text-muted-foreground"}`}
      />
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function SavedMomentsPage() {
  const { isAuthenticated } = useAuth();
  const { actor } = useBackend();
  const navigate = useNavigate();
  const { data: bookmarkIds = [], isLoading: isLoadingIds } = useBookmarks();

  // Fetch details for each bookmarked moment id
  const { data: moments = [], isLoading: isLoadingMoments } = useQuery<
    MomentListItem[]
  >({
    queryKey: ["savedMomentDetails", bookmarkIds],
    queryFn: async () => {
      if (!actor || bookmarkIds.length === 0) return [];
      const results = await Promise.allSettled(
        bookmarkIds.map((id) => actor.getMomentDetail(id)),
      );
      return results
        .filter(
          (
            r,
          ): r is PromiseFulfilledResult<
            Awaited<ReturnType<typeof actor.getMomentDetail>>
          > => r.status === "fulfilled" && r.value !== null,
        )
        .map((r) => r.value as unknown as MomentListItem);
    },
    enabled: !!actor && bookmarkIds.length > 0,
  });

  const isLoading = isLoadingIds || isLoadingMoments;

  // Not authenticated — prompt to sign in
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-24 gap-5 text-center"
          data-ocid="saved.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
            <Bookmark className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              Sign in to view saved moments
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Bookmark moments to find them here later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-6" data-ocid="saved.page">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Saved Moments
            </h1>
            {!isLoading && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {moments.length === 0
                  ? "Nothing saved yet"
                  : `${moments.length} saved`}
              </p>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            data-ocid="saved.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-52 rounded-2xl" />
            ))}
          </div>
        ) : moments.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-14 gap-5 text-center"
            data-ocid="saved.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
              <Bookmark className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                No saved moments yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Explore moments and tap the bookmark icon to save them here.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              <Link to="/explore" data-ocid="saved.explore_link">
                Explore moments
              </Link>
            </Button>
          </div>
        ) : (
          /* Grid of saved moment cards */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            data-ocid="saved.list"
          >
            {moments.map((moment, index) => (
              <div
                key={moment.id.toString()}
                className="relative"
                data-ocid={`saved.item.${index + 1}`}
              >
                <MomentCard
                  moment={moment}
                  onClick={() =>
                    navigate({
                      to: "/moments/$momentId",
                      params: { momentId: moment.id.toString() },
                    })
                  }
                />
                {/* Bookmark toggle overlaid top-left */}
                <div className="absolute top-2 left-2 z-20">
                  <BookmarkToggle momentId={moment.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
