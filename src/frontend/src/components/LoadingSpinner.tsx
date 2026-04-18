import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  text,
  className,
}: LoadingSpinnerProps) {
  const ringSize = {
    sm: "w-5 h-5 border-2",
    md: "w-9 h-9 border-2",
    lg: "w-14 h-14 border-[3px]",
  }[size];

  const spinner = (
    <div
      className={cn(
        "rounded-full border-accent/30 border-t-accent animate-spin",
        ringSize,
        className,
      )}
      style={{ boxShadow: "0 0 10px oklch(var(--accent) / 0.2)" }}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 gradient-bg">
        <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-5 animate-scale-in">
          {spinner}
          {text && (
            <p className="text-muted-foreground text-sm font-body">{text}</p>
          )}
        </div>
      </div>
    );
  }

  // Inline: glass pill
  return (
    <div className={cn("flex items-center justify-center p-6", className)}>
      <div className="glass-card rounded-full px-4 py-3 flex items-center gap-3">
        {spinner}
        {text && (
          <span className="text-muted-foreground text-sm font-body">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}
