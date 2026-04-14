import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Plus } from "lucide-react";
import { AuthGuard } from "../components/AuthGuard";
import { CalendarView } from "../components/CalendarView";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

function MomentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(["a", "b", "c", "d"] as const).map((k) => (
        <div key={k} className="card-elevated overflow-hidden">
          <Skeleton className="w-full aspect-[16/9]" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();

  const { data: moments, isLoading } = useQuery<MomentListItem[]>({
    queryKey: QUERY_KEYS.myMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMoments();
    },
    enabled: actor !== null,
  });

  return (
    <AuthGuard requireAuth requireProfile currentPath="/dashboard">
      <Layout>
        <div className="py-6 space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
                My Moments
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-0.5">
                Events you own or have access to
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/moments/new" })}
              className="tap-target hidden sm:flex gap-1"
              data-ocid="dashboard-create-btn"
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </div>

          {/* Calendar section */}
          <CalendarView />

          {/* Moments grid */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-base text-foreground">
              All Moments
            </h2>
            {isLoading ? (
              <MomentGridSkeleton />
            ) : !moments || moments.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No moments yet"
                description="Create your first Moment to start capturing and sharing memories."
                action={
                  <Button
                    size="lg"
                    className="tap-target"
                    onClick={() => navigate({ to: "/moments/new" })}
                    data-ocid="dashboard-empty-create-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first Moment
                  </Button>
                }
              />
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-ocid="dashboard-moments-grid"
              >
                {moments.map((moment) => (
                  <MomentCard
                    key={moment.id.toString()}
                    moment={moment}
                    onClick={() =>
                      navigate({
                        to: "/moments/$momentId",
                        params: { momentId: moment.id.toString() },
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile FAB */}
        <button
          type="button"
          onClick={() => navigate({ to: "/moments/new" })}
          className="fixed bottom-20 right-4 sm:hidden w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg tap-target z-30 transition-smooth active:scale-95"
          data-ocid="dashboard-fab"
          aria-label="Create moment"
        >
          <Plus className="w-6 h-6" />
        </button>
      </Layout>
    </AuthGuard>
  );
}
