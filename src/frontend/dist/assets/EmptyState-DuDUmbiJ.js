import { j as jsxRuntimeExports, h as cn } from "./index-CqHW4ujE.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "empty_state",
      className: cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 gap-5 animate-slide-up",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-3xl p-8 flex flex-col items-center gap-4 max-w-xs w-full", children: [
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-2xl p-4 glow-accent-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            className: "w-8 h-8 text-accent",
            strokeWidth: 1.5,
            "aria-hidden": "true"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-gradient-accent", children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed", children: description })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 w-full", children: action })
      ] })
    }
  );
}
export {
  EmptyState as E
};
