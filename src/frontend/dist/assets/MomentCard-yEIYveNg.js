import { j as jsxRuntimeExports, h as cn, V as Visibility } from "./index-DlqwQ7hd.js";
import { B as Badge } from "./badge-D1wUDQ0J.js";
import { c as createLucideIcon } from "./createLucideIcon-BUPz7SPw.js";
import { L as Lock, G as Globe, M as MapPin } from "./map-pin-CyFtcmKR.js";
import { U as Users } from "./skeleton-B1svKeA7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
function formatEventDate(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function isPrivateVisibility(visibility) {
  if (!visibility) return false;
  if (visibility === Visibility.private_) return true;
  if (typeof visibility === "object" && visibility !== null) {
    if ("private_" in visibility) return true;
    if ("private" in visibility) return true;
  }
  return false;
}
function MomentCard({ moment, onClick, className }) {
  var _a;
  const isPrivate = isPrivateVisibility(moment.visibility);
  const coverUrl = (_a = moment.coverImage) == null ? void 0 : _a.getDirectURL();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "moment-card",
      onClick,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      className: cn(
        "group card-elevated overflow-hidden transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video bg-muted overflow-hidden", children: [
          coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: coverUrl,
              alt: moment.title,
              className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-secondary/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar,
            {
              className: "w-8 h-8 text-muted-foreground/50",
              strokeWidth: 1.5
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2.5 left-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm",
                isPrivate ? "bg-foreground/80 text-primary-foreground" : "bg-background/80 text-foreground border border-border/50"
              ),
              children: [
                isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                isPrivate ? "Private" : "Public"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-[15px] leading-snug line-clamp-2 group-hover:text-foreground/80 transition-colors", children: moment.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: formatEventDate(moment.eventDate) })
            ] }),
            moment.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body truncate", children: moment.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body", children: [
                moment.attendeeCount.toString(),
                " attending"
              ] })
            ] })
          ] }),
          moment.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground font-body line-clamp-2 leading-relaxed", children: moment.description }),
          moment.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 pt-0.5", children: [
            moment.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] font-body px-1.5 py-0.5 rounded-full h-auto",
                children: [
                  "#",
                  tag
                ]
              },
              tag
            )),
            moment.tags.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] font-body px-1.5 py-0.5 rounded-full h-auto",
                children: [
                  "+",
                  moment.tags.length - 3
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  Calendar as C,
  MomentCard as M,
  isPrivateVisibility as i
};
