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
      data-ocid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-4",
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-foreground text-lg">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm max-w-xs">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
