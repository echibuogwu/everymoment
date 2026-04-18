import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="glass-modal border-0 rounded-3xl p-0 max-w-sm mx-4 overflow-hidden shadow-2xl animate-scale-in"
        style={{ padding: 0 }}
      >
        <div className="p-6 space-y-5">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="font-display text-xl font-bold text-foreground">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="font-body text-muted-foreground leading-relaxed">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <div className="flex gap-3 pt-1">
            {/* Cancel */}
            <button
              type="button"
              data-ocid="confirm-dialog-cancel"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass-card rounded-2xl px-4 py-3 text-sm font-body font-medium text-foreground button-spring transition-smooth hover:opacity-80 active:scale-95"
            >
              {cancelLabel}
            </button>

            {/* Confirm */}
            <button
              type="button"
              data-ocid="confirm-dialog-confirm"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={[
                "flex-1 rounded-2xl px-4 py-3 text-sm font-body font-semibold button-spring transition-smooth active:scale-95",
                destructive
                  ? "bg-destructive text-destructive-foreground hover:opacity-90"
                  : "bg-accent text-accent-foreground glow-accent-sm hover:opacity-90",
              ].join(" ")}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
