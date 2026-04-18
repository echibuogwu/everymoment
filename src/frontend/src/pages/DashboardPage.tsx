import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AuthGuard } from "../components/AuthGuard";
import { CalendarView } from "../components/CalendarView";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

function MomentGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["a", "b", "c", "d"] as const).map((k) => (
        <div key={k} className="glass-card rounded-2xl overflow-hidden">
          <Skeleton className="w-full aspect-[4/3]" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
      <span className="text-lg font-display font-bold bg-gradient-to-br from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-xs text-muted-foreground font-body">{label}</span>
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

  const momentCount = moments?.length ?? 0;

  return (
    <AuthGuard requireAuth requireProfile currentPath="/dashboard">
      <Layout>
        <div className="py-4 space-y-5">
          {/* Hero greeting */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
            className="glass-card rounded-3xl p-5 space-y-4"
            data-ocid="dashboard-hero"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[oklch(var(--accent))]" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    Welcome back
                  </span>
                </div>
                <h1 className="font-display font-bold text-2xl bg-gradient-to-r from-foreground via-foreground to-[oklch(var(--accent))] bg-clip-text text-transparent leading-tight">
                  Your Moments
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Every memory, beautifully captured
                </p>
              </div>
              {/* Create button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate({ to: "/moments/new" })}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold bg-[oklch(var(--accent))] text-[oklch(var(--accent-foreground))] shadow-lg transition-smooth animate-glow-pulse"
                data-ocid="dashboard-create-btn"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 flex-wrap">
              <StatBadge label="moments" value={momentCount} />
            </div>
          </motion.div>

          {/* Calendar section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CalendarView />
          </motion.div>

          {/* My Moments section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="space-y-3"
          >
            <h2 className="font-display font-semibold text-base bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent px-1">
              All Moments
            </h2>

            {isLoading ? (
              <MomentGridSkeleton />
            ) : !moments || moments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
                className="glass-card rounded-3xl p-8 flex flex-col items-center text-center space-y-4"
                data-ocid="dashboard-empty-state"
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(var(--accent)/0.12)] flex items-center justify-center">
                  <CalendarDays className="w-8 h-8 text-[oklch(var(--accent))]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    No moments yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Create your first Moment to start capturing and sharing
                    memories with the people who matter most.
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate({ to: "/moments/new" })}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] text-white shadow-lg animate-glow-pulse"
                  data-ocid="dashboard-empty-create-btn"
                >
                  <Plus className="w-4 h-4" />
                  Create your first Moment
                </motion.button>
              </motion.div>
            ) : (
              <div
                className="grid grid-cols-2 gap-3"
                data-ocid="dashboard-moments-grid"
              >
                <AnimatePresence>
                  {moments.map((moment, i) => (
                    <motion.div
                      key={moment.id.toString()}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.06,
                        ease: [0.34, 1.1, 0.64, 1],
                      }}
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile FAB */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => navigate({ to: "/moments/new" })}
          className="fixed bottom-20 right-4 sm:hidden w-14 h-14 rounded-full flex items-center justify-center shadow-2xl tap-target z-30 animate-glow-pulse bg-gradient-to-br from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] text-white"
          data-ocid="dashboard-fab"
          aria-label="Create moment"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </Layout>
    </AuthGuard>
  );
}
