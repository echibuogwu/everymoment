import { w as ue } from "./index-CqHW4ujE.js";
function showSuccess(message) {
  ue.success(message, {
    duration: 4e3,
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(86,200,140,0.35)",
      borderLeft: "3px solid oklch(0.65 0.16 142)",
      borderRadius: "0.75rem",
      boxShadow: "0 0 16px oklch(0.65 0.16 142 / 0.2), 0 4px 24px rgba(0,0,0,0.3)",
      color: "inherit"
    }
  });
}
function showError(message) {
  ue.error(message, {
    duration: 5e3,
    style: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(220,80,60,0.35)",
      borderLeft: "3px solid oklch(0.62 0.2 22)",
      borderRadius: "0.75rem",
      boxShadow: "0 0 16px oklch(0.62 0.2 22 / 0.2), 0 4px 24px rgba(0,0,0,0.3)",
      color: "inherit"
    }
  });
}
export {
  showSuccess as a,
  showError as s
};
