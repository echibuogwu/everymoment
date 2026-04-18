import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, CalendarDays, Plus, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { CalendarView } from "../components/CalendarView";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

type DashboardTab = "calendar" | "moments" | "activity";

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

const TAB_ITEMS: {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "moments", label: "My Moments", icon: Sparkles },
  { id: "activity", label: "Activity", icon: Activity },
];

export function DashboardPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>("calendar");

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

          {/* Tab switcher */}
          <div
            className="flex items-center gap-1 p-1 glass-card rounded-2xl"
            data-ocid="dashboard.tabs"
          >
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                  data-ocid={`dashboard.tab.${tab.id}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "calendar" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView />
            </motion.div>
          )}

          {activeTab === "moments" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
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
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
              data-ocid="dashboard.activity_panel"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-base text-foreground">
                  Activity Feed
                </h3>
                <p className="text-sm text-muted-foreground">
                  See what people you follow are doing
                </p>
              </div>
              <Link
                to="/activity"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold bg-accent text-accent-foreground transition-smooth hover:opacity-90"
                data-ocid="dashboard.activity_cta"
              >
                <Activity className="w-3.5 h-3.5" />
                View full activity feed
              </Link>
            </motion.div>
          )}
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
