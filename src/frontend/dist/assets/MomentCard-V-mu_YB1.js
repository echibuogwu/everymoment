import { r as reactExports, j as jsxRuntimeExports, i as cn, V as Visibility, u as useAuth, k as useIsBookmarked, l as useBookmarkMoment, m as useUnbookmarkMoment } from "./index-DXT1CttK.js";
import { s as showError, a as showSuccess } from "./toast-XnL6fFhF.js";
import { C as Calendar, L as Lock, G as Globe, M as MapPin } from "./map-pin-Dhjj-nbW.js";
import { U as Users } from "./users-Dx63TV8c.js";
import { c as createLucideIcon } from "./proxy-BmYmrhIs.js";
import { i as Bookmark } from "./Layout-DiYsrWyj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = createLucideIcon("bookmark-check", __iconNode);
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
function CardBookmarkButton({
  momentId,
  onClick: stopProp
}) {
  const { isAuthenticated } = useAuth();
  const { data: isBookmarked } = useIsBookmarked(
    isAuthenticated ? momentId : null
  );
  const bookmarkMutation = useBookmarkMoment();
  const unbookmarkMutation = useUnbookmarkMoment();
  if (!isAuthenticated) return null;
  const isPending = bookmarkMutation.isPending || unbookmarkMutation.isPending;
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    stopProp(e);
    if (isPending) return;
    if (isBookmarked) {
      unbookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Bookmark removed"),
        onError: () => showError("Failed to update bookmark")
      });
    } else {
      bookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Moment saved"),
        onError: () => showError("Failed to save moment")
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: handleClick,
      disabled: isPending,
      "aria-label": isBookmarked ? "Remove bookmark" : "Save moment",
      "data-ocid": "moment-card.bookmark_button",
      className: cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-200",
        "backdrop-blur-md border",
        isBookmarked ? "bg-accent text-accent-foreground border-accent/60 shadow-sm" : "bg-background/80 text-foreground border-white/20 hover:bg-background/90",
        "disabled:opacity-60"
      ),
      children: [
        isBookmarked ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-3 h-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isBookmarked ? "Saved" : "Save" })
      ]
    }
  );
}
function MomentCard({
  moment,
  onClick,
  className,
  index: _index = 0
}) {
  var _a;
  const isPrivate = isPrivateVisibility(moment.visibility);
  const coverUrl = (_a = moment.coverImage) == null ? void 0 : _a.getDirectURL();
  const [imgLoaded, setImgLoaded] = reactExports.useState(false);
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
        "group relative overflow-hidden rounded-2xl",
        "glass-card",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full overflow-hidden", children: [
          coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            !imgLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-40 animate-shimmer rounded-t-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: coverUrl,
                alt: moment.title,
                loading: "lazy",
                onLoad: () => setImgLoaded(true),
                className: cn(
                  "w-full h-auto object-cover",
                  imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                )
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-36 flex items-center justify-center bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar,
            {
              className: "w-8 h-8 text-muted-foreground/40",
              strokeWidth: 1.5
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                  "backdrop-blur-md",
                  isPrivate ? "bg-foreground/70 text-primary-foreground border border-white/10" : "bg-background/70 text-foreground border border-white/20"
                ),
                children: [
                  isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                  isPrivate ? "Private" : "Public"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CardBookmarkButton,
              {
                momentId: moment.id,
                onClick: (e) => e.stopPropagation()
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-3 pb-3 pt-2", children: [
          coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -top-6 left-0 right-0 h-6 pointer-events-none",
              style: {
                background: "linear-gradient(to bottom, transparent, var(--card-overlay, rgba(0,0,0,0)))"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-[14px] leading-snug line-clamp-2 mb-1.5", children: moment.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: formatEventDate(moment.eventDate) })
            ] }),
            moment.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body truncate", children: moment.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 flex-shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body", children: [
                moment.attendeeCount.toString(),
                " attending"
              ] })
            ] })
          ] }),
          moment.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
            moment.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-accent/15 text-accent border border-accent/20",
                children: [
                  "#",
                  tag
                ]
              },
              tag
            )),
            moment.tags.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body bg-muted/60 text-muted-foreground", children: [
              "+",
              moment.tags.length - 3
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  BookmarkCheck as B,
  MomentCard as M,
  isPrivateVisibility as i
};
