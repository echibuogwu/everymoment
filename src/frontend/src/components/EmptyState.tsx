import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-ocid="empty_state"
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 gap-5 animate-slide-up",
        className,
      )}
    >
      <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-4 max-w-xs w-full">
        {Icon && (
          <div className="glass-card rounded-2xl p-4 glow-accent-sm">
            <Icon
              className="w-8 h-8 text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-lg text-gradient-accent">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm font-body leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="mt-1 w-full">{action}</div>}
      </div>
    </div>
  );
}
