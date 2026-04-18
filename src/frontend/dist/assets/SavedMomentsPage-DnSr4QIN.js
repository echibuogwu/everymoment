import { u as useAuth, a as useBackend, c as useNavigate, n as useBookmarks, f as useQuery, j as jsxRuntimeExports, g as Link, k as useIsBookmarked, l as useBookmarkMoment, m as useUnbookmarkMoment } from "./index-CtLY6vs2.js";
import { L as Layout, i as Bookmark, B as Button } from "./Layout--chq1LOo.js";
import { S as Skeleton } from "./skeleton-DM4I-2Ld.js";
import { M as MomentCard } from "./MomentCard-BN4hJRRA.js";
import "./index-DIX-OhXh.js";
import "./proxy-C4ENgEup.js";
import "./user-DWv8V36G.js";
import "./sun-Dp_dfXPb.js";
import "./map-pin-BZ9OY5eh.js";
import "./users-Cc_IBNm5.js";
function BookmarkToggle({ momentId }) {
  const { data: isBookmarked } = useIsBookmarked(momentId);
  const { mutate: bookmark, isPending: isBookmarking } = useBookmarkMoment();
  const { mutate: unbookmark, isPending: isUnbookmarking } = useUnbookmarkMoment();
  const toggle = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      unbookmark(momentId);
    } else {
      bookmark(momentId);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: toggle,
      disabled: isBookmarking || isUnbookmarking,
      className: "p-1.5 rounded-full transition-colors hover:bg-accent/10",
      "aria-label": isBookmarked ? "Remove bookmark" : "Save moment",
      "data-ocid": "saved.bookmark_toggle",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Bookmark,
        {
          className: `w-4 h-4 ${isBookmarked ? "fill-accent text-accent" : "text-muted-foreground"}`
        }
      )
    }
  );
}
function SavedMomentsPage() {
  const { isAuthenticated } = useAuth();
  const { actor } = useBackend();
  const navigate = useNavigate();
  const { data: bookmarkIds = [], isLoading: isLoadingIds } = useBookmarks();
  const { data: moments = [], isLoading: isLoadingMoments } = useQuery({
    queryKey: ["savedMomentDetails", bookmarkIds],
    queryFn: async () => {
      if (!actor || bookmarkIds.length === 0) return [];
      const results = await Promise.allSettled(
        bookmarkIds.map((id) => actor.getMomentDetail(id))
      );
      return results.filter(
        (r) => r.status === "fulfilled" && r.value !== null
      ).map((r) => r.value);
    },
    enabled: !!actor && bookmarkIds.length > 0
  });
  const isLoading = isLoadingIds || isLoadingMoments;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 gap-5 text-center",
        "data-ocid": "saved.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-7 h-7 text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "Sign in to view saved moments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Bookmark moments to find them here later." })
          ] })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", "data-ocid": "saved.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Saved Moments" }),
      !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: moments.length === 0 ? "Nothing saved yet" : `${moments.length} saved` })
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
        "data-ocid": "saved.loading_state",
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-52 rounded-2xl" }, i))
      }
    ) : moments.length === 0 ? (
      /* Empty state */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-14 gap-5 text-center",
          "data-ocid": "saved.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-7 h-7 text-muted-foreground/50" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No saved moments yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Explore moments and tap the bookmark icon to save them here." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "sm",
                variant: "outline",
                className: "rounded-full",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", "data-ocid": "saved.explore_link", children: "Explore moments" })
              }
            )
          ]
        }
      )
    ) : (
      /* Grid of saved moment cards */
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
          "data-ocid": "saved.list",
          children: moments.map((moment, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative",
              "data-ocid": `saved.item.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MomentCard,
                  {
                    moment,
                    onClick: () => navigate({
                      to: "/moments/$momentId",
                      params: { momentId: moment.id.toString() }
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkToggle, { momentId: moment.id }) })
              ]
            },
            moment.id.toString()
          ))
        }
      )
    )
  ] }) });
}
export {
  SavedMomentsPage
};
