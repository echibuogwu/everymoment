import { toast } from "sonner";

export function showSuccess(message: string) {
  toast.success(message, {
    duration: 4000,
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(86,200,140,0.35)",
      borderLeft: "3px solid oklch(0.65 0.16 142)",
      borderRadius: "0.75rem",
      boxShadow:
        "0 0 16px oklch(0.65 0.16 142 / 0.2), 0 4px 24px rgba(0,0,0,0.3)",
      color: "inherit",
    },
  });
}

export function showError(message: string) {
  toast.error(message, {
    duration: 5000,
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(220,80,60,0.35)",
      borderLeft: "3px solid oklch(0.62 0.2 22)",
      borderRadius: "0.75rem",
      boxShadow:
        "0 0 16px oklch(0.62 0.2 22 / 0.2), 0 4px 24px rgba(0,0,0,0.3)",
      color: "inherit",
    },
  });
}

export function showInfo(message: string) {
  toast(message, {
    duration: 4000,
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderLeft: "3px solid oklch(var(--accent))",
      borderRadius: "0.75rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      color: "inherit",
    },
  });
}

export function showLoading(message: string) {
  return toast.loading(message, {
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "0.75rem",
      color: "inherit",
    },
  });
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

export { toast };
