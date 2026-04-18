import { l as QueryObserver, m as infiniteQueryBehavior, n as hasPreviousPage, o as hasNextPage, p as useBaseQuery, a as useBackend, d as useQueryClient, f as useQuery, e as useMutation, Q as QUERY_KEYS, A as AccessStatus, j as jsxRuntimeExports, u as useAuth, c as useNavigate, q as RsvpStatus, r as reactExports, h as cn, E as ExternalBlob, s as MemoryMediaKind, M as MediaKind, g as useParams, t as createActorWithConfig, v as createActor } from "./index-CqHW4ujE.js";
import { B as Badge, F as FileText, I as Image } from "./badge-CyW9Nxl8.js";
import { a as Avatar, b as AvatarImage, c as AvatarFallback, X, A as AnimatePresence, L as Layout, B as Button, k as ShieldCheck } from "./Layout-BTHeHKiQ.js";
import { S as Skeleton } from "./skeleton-DB5QWWmW.js";
import { Q as QRCodeSVG, T as Ticket, a as QrCode } from "./index-C8eQ3MCG.js";
import { s as showError, a as showSuccess } from "./toast-DhazfeYI.js";
import { C as Clock } from "./clock-BmJ2D4Wz.js";
import { C as CircleX } from "./circle-x-BYhKB_zE.js";
import { C as CircleCheck } from "./circle-check-DJhRV0wI.js";
import { E as EmptyState } from "./EmptyState-DuDUmbiJ.js";
import { U as Users } from "./users-BgOmMkth.js";
import { U as UserMinus, b as UserPlus, L as LogIn, C as Check, u as useScroll, a as useTransform } from "./use-transform-TO4M05vm.js";
import { A as AuthGuard } from "./AuthGuard-BAH2Huar.js";
import { c as createLucideIcon, m as motion } from "./proxy-DHxO4phe.js";
import { R as RefreshCw } from "./refresh-cw-DEAsbOII.js";
import { L as LoaderCircle } from "./loader-circle-BJadI76l.js";
import { T as Trash2 } from "./trash-2-CJwH5tCl.js";
import { i as isPrivateVisibility } from "./MomentCard-CPRs-D8K.js";
import { I as Input } from "./input-BP1S6uwD.js";
import { C as ConfirmDialog } from "./ConfirmDialog-CqDyVMpw.js";
import { U as User } from "./user-DyEDxtSt.js";
import { U as Upload } from "./upload-exvwhlyb.js";
import { L as Lock, G as Globe, C as Calendar, M as MapPin } from "./map-pin-C-IuSehz.js";
import { A as ArrowLeft } from "./arrow-left-B8wE4UoI.js";
import "./sun-BIK3o8tY.js";
var InfiniteQueryObserver = class extends QueryObserver {
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    });
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "forward" }
      }
    });
  }
  fetchPreviousPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "backward" }
      }
    });
  }
  createResult(query, options) {
    var _a, _b;
    const { state } = query;
    const parentResult = super.createResult(query, options);
    const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
    const fetchDirection = (_b = (_a = state.fetchMeta) == null ? void 0 : _a.fetchMore) == null ? void 0 : _b.direction;
    const isFetchNextPageError = isError && fetchDirection === "forward";
    const isFetchingNextPage = isFetching && fetchDirection === "forward";
    const isFetchPreviousPageError = isError && fetchDirection === "backward";
    const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
    const result = {
      ...parentResult,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, state.data),
      hasPreviousPage: hasPreviousPage(options, state.data),
      isFetchNextPageError,
      isFetchingNextPage,
      isFetchPreviousPageError,
      isFetchingPreviousPage,
      isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
    return result;
  }
};
function useInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    options,
    InfiniteQueryObserver
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$h);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$g);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "rslqgf" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    {
      d: "M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0",
      key: "9f7x3i"
    }
  ]
];
const FileAudio = createLucideIcon("file-audio", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M12 10v6", key: "1bos4e" }],
  ["path", { d: "M9 13h6", key: "1uhe8q" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const FolderPlus = createLucideIcon("folder-plus", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6", key: "pblm9e" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18", key: "nf6bnh" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2", key: "12espp" }]
];
const Images = createLucideIcon("images", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  [
    "path",
    {
      d: "M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8",
      key: "1blaws"
    }
  ]
];
const MessageSquareHeart = createLucideIcon("message-square-heart", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
function formatDate$2(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function AccessRequestsPanel({ momentId }) {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const momentIdStr = momentId.toString();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMomentAccessRequests(momentId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const resolveMutation = useMutation({
    mutationFn: async ({
      requester,
      approved: approved2
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.resolveAccessRequest(momentId, requester, approved2);
    },
    onSuccess: (_, { approved: approved2 }) => {
      showSuccess(approved2 ? "Access approved." : "Access denied.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr)
      });
    },
    onError: () => showError("Failed to resolve request. Please try again.")
  });
  const revokeMutation = useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not connected");
      await actor.revokeMomentAccess(momentId, userId);
    },
    onSuccess: () => {
      showSuccess("Access revoked.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr)
      });
    },
    onError: () => showError("Failed to revoke access. Please try again.")
  });
  const pending = requests.filter((r) => r.status === AccessStatus.pending);
  const approved = requests.filter((r) => r.status === AccessStatus.approved);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", "data-ocid": "access-requests-panel", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "h-16 w-full rounded-2xl animate-shimmer"
      },
      i
    )) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "access-requests-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Pending Requests" }),
        pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "text-xs glass-card border-0 text-accent",
            children: pending.length
          }
        )
      ] }),
      pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body py-2", children: "No pending requests." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: pending.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3 animate-slide-up",
          "data-ocid": "access-request-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm text-foreground truncate", children: [
                req.requester.toString().slice(0, 16),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                "Requested ",
                formatDate$2(req.requestedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "deny-request-btn",
                  "aria-label": "Deny access",
                  onClick: () => resolveMutation.mutate({
                    requester: req.requester,
                    approved: false
                  }),
                  disabled: resolveMutation.isPending,
                  className: "w-9 h-9 rounded-xl glass-card flex items-center justify-center text-destructive hover:bg-destructive/15 transition-smooth button-spring disabled:opacity-50",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "approve-request-btn",
                  "aria-label": "Approve access",
                  onClick: () => resolveMutation.mutate({
                    requester: req.requester,
                    approved: true
                  }),
                  disabled: resolveMutation.isPending,
                  className: "w-9 h-9 rounded-xl flex items-center justify-center text-white bg-accent glow-accent-sm hover:opacity-90 transition-smooth button-spring disabled:opacity-50",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" })
                }
              )
            ] })
          ]
        },
        req.requester.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Approved Access" }),
        approved.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "text-xs glass-card border-0 text-accent",
            children: approved.length
          }
        )
      ] }),
      approved.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body py-2", children: "No approved users yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: approved.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3",
          "data-ocid": "approved-user-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm text-foreground truncate", children: [
                req.requester.toString().slice(0, 16),
                "…"
              ] }),
              req.resolvedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                "Approved ",
                formatDate$2(req.resolvedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "revoke-access-btn",
                onClick: () => revokeMutation.mutate(req.requester),
                disabled: revokeMutation.isPending,
                className: "glass-card rounded-xl px-3 py-1.5 text-xs font-body font-medium text-destructive hover:bg-destructive/15 transition-smooth button-spring disabled:opacity-50 flex-shrink-0",
                children: "Revoke"
              }
            )
          ]
        },
        req.requester.toString()
      )) })
    ] })
  ] });
}
const RSVP_LABELS = {
  [RsvpStatus.attending]: "Attending",
  [RsvpStatus.maybe]: "Maybe",
  [RsvpStatus.notAttending]: "Not Attending"
};
const RSVP_DOT = {
  [RsvpStatus.attending]: "bg-accent",
  [RsvpStatus.maybe]: "bg-yellow-400",
  [RsvpStatus.notAttending]: "bg-destructive"
};
function AttendeeRow({ attendee, isOwnProfile }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const attendeeId = attendee.userId.toText();
  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.userProfile(attendeeId),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(attendee.userId);
    },
    enabled: !!actor
  });
  const isFollowingQuery = useQuery({
    queryKey: QUERY_KEYS.isFollowing(attendeeId),
    queryFn: async () => {
      if (!actor || isOwnProfile) return false;
      return actor.isFollowingUser(attendee.userId);
    },
    enabled: !!actor && !isOwnProfile
  });
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (isFollowingQuery.data) {
        await actor.unfollowUser(attendee.userId);
      } else {
        await actor.followUser(attendee.userId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.isFollowing(attendeeId)
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfile(attendeeId)
      });
      showSuccess(isFollowingQuery.data ? "Unfollowed" : "Now following!");
    },
    onError: () => showError("Action failed. Try again.")
  });
  const profile = profileQuery.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3 animate-slide-up",
      "data-ocid": "attendee-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => profile && navigate({
              to: "/profile/$username",
              params: { username: profile.username }
            }),
            className: "flex items-center gap-3 flex-1 min-w-0 text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-10 h-10 flex-shrink-0 ring-2 ring-accent/20", children: [
                (profile == null ? void 0 : profile.photo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AvatarImage,
                  {
                    src: profile.photo.getDirectURL(),
                    alt: profile.username
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-bold text-sm bg-accent/20 text-accent", children: profile ? profile.username.slice(0, 2).toUpperCase() : "?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0 gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-semibold text-sm text-foreground truncate", children: profile ? `@${profile.username}` : "Loading…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 glass-card rounded-full px-2 py-0.5 w-fit", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-1.5 h-1.5 rounded-full flex-shrink-0 ${RSVP_DOT[attendee.rsvpStatus]}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-body text-muted-foreground",
                      "data-ocid": "rsvp-badge",
                      children: RSVP_LABELS[attendee.rsvpStatus]
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        !isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "attendee-follow-btn",
            onClick: () => followMutation.mutate(),
            disabled: followMutation.isPending || isFollowingQuery.isLoading,
            "aria-label": isFollowingQuery.data ? "Unfollow" : "Follow",
            className: [
              "w-9 h-9 rounded-xl flex items-center justify-center transition-smooth button-spring disabled:opacity-50 flex-shrink-0",
              isFollowingQuery.data ? "glass-card text-muted-foreground hover:text-foreground" : "glass-card text-accent hover:opacity-80"
            ].join(" "),
            children: isFollowingQuery.data ? /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
function AttendeesTab({ momentId }) {
  var _a;
  const { actor, isFetching } = useBackend();
  const { principal } = useAuth();
  const attendeesQuery = useQuery({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching
  });
  if (attendeesQuery.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card rounded-2xl flex items-center gap-3 px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full animate-shimmer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-28 h-4 rounded-full animate-shimmer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-3 rounded-full animate-shimmer" })
          ] })
        ]
      },
      i
    )) });
  }
  if (!((_a = attendeesQuery.data) == null ? void 0 : _a.length)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Users,
        title: "No attendees yet",
        description: "Be the first to RSVP to this moment."
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 space-y-2", "data-ocid": "attendees-list", children: attendeesQuery.data.map((attendee) => {
    const isOwnProfile = !!principal && attendee.userId.toText() === principal.toText();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttendeeRow,
      {
        attendee,
        isOwnProfile
      },
      attendee.userId.toText()
    );
  }) });
}
function formatTs(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function EventPassModal({
  momentId,
  currentUserPrincipal,
  actor,
  isFetchingActor,
  onClose
}) {
  const dialogRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const { data: attendanceInfo, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.momentDetail(momentId), "attendance-info"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyAttendanceInfo(momentId);
    },
    enabled: !!actor && !isFetchingActor
  });
  const qrPayload = attendanceInfo && currentUserPrincipal ? `${window.location.origin}/event-pass/${momentId}/${encodeURIComponent(currentUserPrincipal)}` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "dialog",
    {
      ref: dialogRef,
      "aria-label": "Event Pass",
      onClose,
      className: "fixed inset-0 m-auto p-0 w-full max-w-xs bg-transparent border-0 overflow-visible backdrop:bg-black/60 backdrop:backdrop-blur-md",
      "data-ocid": "event-pass-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.85, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.85, opacity: 0 },
          transition: { type: "spring", stiffness: 320, damping: 28 },
          className: "relative w-full rounded-3xl overflow-hidden",
          style: {
            background: "linear-gradient(160deg, oklch(0.14 0.04 280), oklch(0.08 0.03 300))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 pointer-events-none",
                style: {
                  background: "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.15) 0%, transparent 60%)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close event pass",
                className: "absolute top-3.5 right-3.5 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-smooth",
                style: {
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)"
                },
                "data-ocid": "event-pass-close-button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white/70" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                      boxShadow: "0 0 16px oklch(0.55 0.28 280 / 0.4)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        className: "w-4 h-4",
                        "aria-hidden": "true",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 12v.01" })
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-white text-lg leading-tight", children: "Event Pass" })
              ] }),
              attendanceInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-white/50 text-sm truncate pl-9", children: attendanceInfo.momentTitle })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-6 border-t border-dashed border-white/10 my-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 flex flex-col items-center gap-5", children: [
              isLoading || isFetchingActor ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-[180px] h-[180px] rounded-2xl" }) : !attendanceInfo || !qrPayload ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-[180px] h-[180px] rounded-2xl flex items-center justify-center",
                  style: { background: "rgba(255,255,255,0.06)" },
                  "data-ocid": "event-pass-error_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-body text-center px-4", children: "Could not load attendance info." })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0.9, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: {
                    delay: 0.15,
                    type: "spring",
                    stiffness: 280,
                    damping: 22
                  },
                  className: "p-3 rounded-2xl",
                  style: { background: "rgba(255,255,255,0.96)" },
                  "data-ocid": "event-pass-qr-container",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    QRCodeSVG,
                    {
                      value: qrPayload,
                      size: 180,
                      level: "M",
                      includeMargin: false,
                      className: "rounded-lg"
                    }
                  )
                }
              ),
              attendanceInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.25 },
                  className: "w-full space-y-2.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PassRow, { label: "Status", value: attendanceInfo.status, highlight: true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PassRow,
                      {
                        label: "RSVP'd",
                        value: formatTs(attendanceInfo.rsvpTime)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PassRow,
                      {
                        label: "Event date",
                        value: formatTs(attendanceInfo.momentDate)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PassRow, { label: "User", value: `@${attendanceInfo.username}` })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30 font-body text-center leading-snug", children: "Scan to verify attendance" })
            ] })
          ]
        }
      )
    }
  );
}
function PassRow({
  label,
  value,
  highlight = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 font-body flex-shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-xs font-body font-semibold text-right min-w-0 break-words ${highlight ? "text-accent" : "text-white/80"}`,
        style: highlight ? { color: "oklch(0.72 0.28 280)" } : void 0,
        children: value
      }
    )
  ] });
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const PAGE_SIZE$1 = 20n;
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4,audio/x-m4a";
function formatRelativeTime(ts) {
  const now = Date.now();
  const then = Number(ts / 1000000n);
  const diff = now - then;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: days > 365 ? "numeric" : void 0
  });
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function detectMediaKind(file) {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("video/")) return MemoryMediaKind.video;
  if (mime.startsWith("audio/")) return MemoryMediaKind.audio;
  return MemoryMediaKind.image;
}
function MemoryLightbox({
  blob,
  kind,
  onClose
}) {
  const url = blob.getDirectURL();
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      className: "fixed inset-0 z-[80] flex items-center justify-center",
      style: { background: "rgba(0,0,0,0.95)", backdropFilter: "blur(16px)" },
      onClick: onClose,
      "data-ocid": "memory-lightbox",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "aria-label": "Close",
            className: "absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-smooth",
            style: {
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)"
            },
            "data-ocid": "memory-lightbox-close",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "max-w-full max-h-full flex items-center justify-center p-4",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            role: "presentation",
            children: [
              kind === MemoryMediaKind.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.img,
                {
                  src: url,
                  alt: "Memory",
                  initial: { scale: 0.9 },
                  animate: { scale: 1 },
                  transition: { type: "spring", stiffness: 300, damping: 28 },
                  className: "max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl"
                }
              ),
              kind === MemoryMediaKind.video && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.video,
                {
                  src: url,
                  controls: true,
                  autoPlay: true,
                  initial: { scale: 0.9 },
                  animate: { scale: 1 },
                  transition: { type: "spring", stiffness: 300, damping: 28 },
                  className: "max-w-[95vw] max-h-[90vh] w-full h-auto rounded-xl",
                  playsInline: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
                }
              ),
              kind === MemoryMediaKind.audio && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6 p-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-24 h-24 rounded-full flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.55 0.28 280 / 0.25), oklch(0.45 0.22 300 / 0.25))",
                      border: "2px solid oklch(0.55 0.28 280 / 0.35)",
                      boxShadow: "0 0 40px oklch(0.55 0.28 280 / 0.25)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-10 h-10 text-white/80" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: url, controls: true, autoPlay: true, className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function MemoryMedia({
  blob,
  kind,
  isMine
}) {
  const url = blob.getDirectURL();
  const mediaKind = kind ?? MemoryMediaKind.image;
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  if (mediaKind === MemoryMediaKind.video) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setLightboxOpen(true),
          className: "mt-2 w-full rounded-xl overflow-hidden cursor-pointer",
          "aria-label": "View full screen video",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              src: url,
              className: "max-w-full max-h-56 w-full rounded-xl pointer-events-none",
              preload: "metadata",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MemoryLightbox,
        {
          blob,
          kind: mediaKind,
          onClose: () => setLightboxOpen(false)
        }
      ) })
    ] });
  }
  if (mediaKind === MemoryMediaKind.audio) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "audio",
      {
        src: url,
        controls: true,
        className: `mt-2 w-full max-w-xs rounded-lg ${isMine ? "opacity-90" : ""}`,
        preload: "metadata",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setLightboxOpen(true),
        className: "mt-1.5 w-full text-left",
        "aria-label": "View full screen image",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: url,
            alt: "Memory attachment",
            className: "rounded-xl max-w-full max-h-56 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity",
            loading: "lazy"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MemoryLightbox,
      {
        blob,
        kind: mediaKind,
        onClose: () => setLightboxOpen(false)
      }
    ) })
  ] });
}
function MemoryBubble({
  memory,
  isMine,
  onDelete,
  isDeleting,
  index
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.34, 1.56, 0.64, 1]
      },
      className: `flex gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"} items-end`,
      "data-ocid": "memory-bubble",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({
              to: "/profile/$username",
              params: { username: memory.authorUsername }
            }),
            className: "flex-shrink-0 mb-0.5",
            "aria-label": `View ${memory.authorUsername}'s profile`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-7 h-7 ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarFallback,
              {
                className: "text-[10px] font-body",
                style: {
                  background: isMine ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))" : void 0,
                  color: isMine ? "white" : void 0
                },
                children: getInitials(memory.authorDisplayName || memory.authorUsername)
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `group max-w-[75%] space-y-1 ${isMine ? "items-end" : "items-start"} flex flex-col`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-1.5 px-1 ${isMine ? "flex-row-reverse" : "flex-row"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => navigate({
                          to: "/profile/$username",
                          params: { username: memory.authorUsername }
                        }),
                        className: "text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors",
                        "data-ocid": `memory-author-${memory.id}`,
                        children: memory.authorUsername
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-body text-muted-foreground/60", children: formatRelativeTime(memory.createdAt) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: [
                    "rounded-2xl px-3.5 py-2.5 text-sm font-body leading-relaxed break-words",
                    isMine ? "rounded-br-sm text-white" : "glass-card rounded-bl-sm text-foreground"
                  ].join(" "),
                  style: isMine ? {
                    background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
                  } : void 0,
                  children: [
                    memory.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: memory.content }),
                    memory.mediaBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MemoryMedia,
                      {
                        blob: memory.mediaBlob,
                        kind: memory.mediaKind,
                        isMine
                      }
                    )
                  ]
                }
              ),
              isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onDelete(memory.id),
                  disabled: isDeleting,
                  className: "opacity-0 group-hover:opacity-100 transition-opacity px-1 flex items-center gap-1 text-[10px] font-body text-muted-foreground hover:text-destructive",
                  "aria-label": "Delete memory",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                    "Delete"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function MemoriesTab({ momentId }) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = reactExports.useState("");
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [pendingBlob, setPendingBlob] = reactExports.useState(null);
  const [pendingKind, setPendingKind] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [beforeCursor, setBeforeCursor] = reactExports.useState(null);
  const [allMemories, setAllMemories] = reactExports.useState([]);
  const hasLoadedOnceRef = reactExports.useRef(false);
  const feedRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const prevScrollHeightRef = reactExports.useRef(0);
  const beforeCursorRef = reactExports.useRef(null);
  const queryKey = ["memories", momentId, (beforeCursor == null ? void 0 : beforeCursor.toString()) ?? "latest"];
  const memoriesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMemories(momentId, PAGE_SIZE$1, beforeCursor);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  reactExports.useEffect(() => {
    const data = memoriesQuery.data;
    if (!data) return;
    if (!hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true;
      setAllMemories([...data].reverse());
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
      }, 50);
    } else if (beforeCursorRef.current !== null) {
      setAllMemories((existing) => {
        var _a;
        const existingIds = new Set(existing.map((m) => m.id));
        const newOnes = [...data].reverse().filter((m) => !existingIds.has(m.id));
        if (newOnes.length === 0) return existing;
        prevScrollHeightRef.current = ((_a = feedRef.current) == null ? void 0 : _a.scrollHeight) ?? 0;
        return [...newOnes, ...existing];
      });
    }
  }, [memoriesQuery.data]);
  reactExports.useEffect(() => {
    if (prevScrollHeightRef.current > 0 && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  });
  const handleFileChange = reactExports.useCallback(
    async (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        showError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setPendingFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
          (pct) => setUploadProgress(Math.round(pct))
        );
        const kind = detectMediaKind(file);
        setPendingBlob(blob);
        setPendingKind(kind);
        await blob.getBytes();
      } catch {
        showError("Could not read file. Please try again.");
        setPendingFile(null);
        setPendingBlob(null);
        setPendingKind(null);
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    []
  );
  const postMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.postMemory(
        momentId,
        content.trim(),
        pendingBlob,
        pendingKind
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      setContent("");
      setPendingFile(null);
      setPendingBlob(null);
      setPendingKind(null);
      queryClient.invalidateQueries({ queryKey: ["memories", momentId] });
      hasLoadedOnceRef.current = false;
      beforeCursorRef.current = null;
      setBeforeCursor(null);
    },
    onError: (err) => {
      showError(err.message || "Could not post memory. Try again.");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (memoryId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteMemory(memoryId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, memoryId) => {
      setAllMemories((prev) => prev.filter((m) => m.id !== memoryId));
      showSuccess("Memory deleted");
    },
    onError: (err) => {
      showError(err.message || "Could not delete memory.");
    }
  });
  const handleRefresh = () => {
    hasLoadedOnceRef.current = false;
    beforeCursorRef.current = null;
    setBeforeCursor(null);
    setAllMemories([]);
    queryClient.invalidateQueries({ queryKey: ["memories", momentId] });
  };
  const handleLoadMore = () => {
    if (allMemories.length === 0) return;
    const newCursor = allMemories[0].createdAt;
    beforeCursorRef.current = newCursor;
    setBeforeCursor(newCursor);
  };
  const handleSend = () => {
    if (!content.trim() && !pendingBlob) return;
    postMutation.mutate();
  };
  const canSend = !isUploading && (!!content.trim() || !!pendingBlob);
  const hasMore = allMemories.length > 0 && allMemories.length % Number(PAGE_SIZE$1) === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-[calc(100vh-380px)] min-h-[340px]",
      "data-ocid": "memories-tab",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: "Memories" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleRefresh,
              disabled: memoriesQuery.isFetching,
              className: "flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded-full glass-card",
              "aria-label": "Refresh memories",
              "data-ocid": "memories-refresh-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `w-3 h-3 ${memoriesQuery.isFetching ? "animate-spin" : ""}`
                  }
                ),
                "Refresh"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: feedRef,
            className: "flex-1 overflow-y-auto py-4 space-y-3 scroll-smooth",
            children: [
              hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleLoadMore,
                  disabled: memoriesQuery.isFetching,
                  className: "flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-smooth px-3 py-1.5 rounded-full glass-card",
                  "data-ocid": "memories-load-more-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }),
                    memoriesQuery.isFetching ? "Loading…" : "Load earlier"
                  ]
                }
              ) }),
              memoriesQuery.isLoading && allMemories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-muted-foreground" }) }),
              !memoriesQuery.isLoading && allMemories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4 },
                  className: "flex flex-col items-center justify-center py-12 text-center",
                  "data-ocid": "memories-empty-state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl glass-card flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 text-muted-foreground/60" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-foreground", children: "No memories yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground mt-0.5", children: "Be the first to share one!" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: allMemories.map((memory, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                MemoryBubble,
                {
                  memory,
                  index,
                  isMine: !!principal && memory.authorId.toText() === principal.toText(),
                  onDelete: (id) => deleteMutation.mutate(id),
                  isDeleting: deleteMutation.isPending
                },
                memory.id
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 space-y-2", "data-ocid": "memories-compose", children: [
          isUploading && uploadProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-body text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reading file…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                uploadProgress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full rounded-full",
                style: {
                  background: "linear-gradient(90deg, oklch(0.55 0.28 280), oklch(0.65 0.22 260))",
                  width: `${uploadProgress}%`
                },
                transition: { duration: 0.3 }
              }
            ) })
          ] }),
          !isUploading && pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-1.5 rounded-xl glass-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-foreground truncate flex-1 min-w-0", children: pendingFile.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-body text-muted-foreground flex-shrink-0", children: [
              (pendingFile.size / (1024 * 1024)).toFixed(1),
              " MB"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setPendingFile(null);
                  setPendingBlob(null);
                  setPendingKind(null);
                },
                className: "flex-shrink-0 p-0.5 rounded-full hover:bg-muted transition-colors",
                "aria-label": "Remove attachment",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 text-muted-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: ACCEPTED_TYPES,
                onChange: handleFileChange,
                className: "hidden",
                "aria-label": "Attach media",
                "data-ocid": "memories-file-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                disabled: isUploading || postMutation.isPending,
                className: "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full glass-card transition-smooth button-spring disabled:opacity-50",
                "aria-label": `Attach image, video or audio (max ${MAX_FILE_SIZE_MB} MB)`,
                "data-ocid": "memories-attach-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-4 h-4 text-muted-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: content,
                onChange: (e) => setContent(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                },
                placeholder: "Share a memory…",
                rows: 1,
                className: "flex-1 min-h-[38px] max-h-[120px] resize-none rounded-2xl text-sm font-body px-3.5 py-2 focus-visible:ring-1 focus-visible:ring-accent/50 glass-input border-transparent transition-smooth",
                "data-ocid": "memories-content-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                onClick: handleSend,
                disabled: postMutation.isPending || !canSend,
                whileTap: { scale: 0.9 },
                className: "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-40 transition-smooth",
                style: {
                  background: canSend ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))" : void 0
                },
                "aria-label": "Send memory",
                "data-ocid": "memories-send-btn",
                children: postMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Send,
                  {
                    className: `w-4 h-4 ${canSend ? "text-white" : "text-muted-foreground"}`
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-body text-muted-foreground/60 px-1", children: [
            "Images, videos & audio · Max ",
            MAX_FILE_SIZE_MB,
            " MB"
          ] })
        ] })
      ]
    }
  );
}
const KIND_ICONS$1 = {
  [MediaKind.image]: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-6 h-6 text-muted-foreground" }),
  [MediaKind.video]: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-6 h-6 text-muted-foreground" }),
  [MediaKind.audio]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-6 h-6 text-muted-foreground" }),
  [MediaKind.document_]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-muted-foreground" })
};
const KIND_LABELS$1 = {
  [MediaKind.image]: "Image",
  [MediaKind.video]: "Video",
  [MediaKind.audio]: "Audio",
  [MediaKind.document_]: "Document"
};
function formatTimestamp(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function MediaCard({ media, onClick, className }) {
  const thumbnailUrl = media.kind === MediaKind.image ? media.blob.getDirectURL() : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "media-card",
      onClick,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      } : void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      className: cn(
        "card-elevated overflow-hidden transition-smooth",
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.98]",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden", children: [
          thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: thumbnailUrl,
              alt: media.filename,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            KIND_ICONS$1[media.kind],
            media.kind === MediaKind.video && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-foreground/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-foreground/80 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-5 h-5 text-primary-foreground" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "absolute top-2 right-2 text-xs font-body",
              children: KIND_LABELS$1[media.kind]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm font-medium text-foreground truncate", children: media.filename }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: formatTimestamp(media.createdAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
                media.likeCount.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3 h-3" }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const KIND_ICONS = {
  [MediaKind.image]: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" }),
  [MediaKind.video]: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4" }),
  [MediaKind.audio]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-4 h-4" }),
  [MediaKind.document_]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" })
};
const KIND_LABELS = {
  [MediaKind.image]: "Image",
  [MediaKind.video]: "Video",
  [MediaKind.audio]: "Audio",
  [MediaKind.document_]: "Document"
};
function formatDate$1(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MediaDetailModal({
  media,
  isOwner,
  canDelete,
  folders,
  onClose,
  onDelete
}) {
  const overlayRef = reactExports.useRef(null);
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const showDeleteButton = canDelete !== void 0 ? canDelete : isOwner;
  const folder = folders.find((f) => f.id === media.folderId);
  const mediaUrl = media.blob.getDirectURL();
  const { data: uploaderProfile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(media.uploadedBy.toString()),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(media.uploadedBy);
    },
    enabled: !!actor
  });
  const { data: hasLiked, refetch: refetchLike } = useQuery({
    queryKey: QUERY_KEYS.hasLiked(media.id.toString()),
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasLikedMedia(media.id);
    },
    enabled: !!actor
  });
  const handleToggleLike = async () => {
    if (!actor) return;
    try {
      await actor.toggleLike(media.id);
      await refetchLike();
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(media.momentId.toString(), 0)
      });
    } catch {
      showError("Failed to update like.");
    }
  };
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: overlayRef,
      "data-ocid": "media-detail-overlay",
      onClick: handleOverlayClick,
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      "aria-modal": "true",
      "aria-label": "Media detail",
      tabIndex: -1,
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4",
      style: { background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "glass-modal w-full sm:max-w-3xl sm:rounded-3xl overflow-hidden max-h-[98dvh] sm:max-h-[96dvh] flex flex-col animate-scale-in rounded-t-3xl",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          role: "document",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "glass-card rounded-full flex items-center gap-1.5 px-3 py-1 text-xs font-body font-medium text-foreground", children: [
                  KIND_ICONS[media.kind],
                  KIND_LABELS[media.kind]
                ] }),
                folder && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground font-body", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5" }),
                  folder.name
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                showDeleteButton && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "delete-media-btn",
                    onClick: () => onDelete(media),
                    "aria-label": "Delete media",
                    className: "w-9 h-9 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/15 transition-smooth button-spring",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "close-media-modal-btn",
                    onClick: onClose,
                    "aria-label": "Close",
                    className: "w-9 h-9 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth button-spring",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 flex items-center justify-center overflow-hidden flex-1 min-h-[200px]", children: [
              media.kind === MediaKind.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: mediaUrl,
                  alt: media.filename,
                  className: "max-w-full max-h-[90vh] w-auto h-auto object-contain"
                }
              ),
              media.kind === MediaKind.video && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  src: mediaUrl,
                  controls: true,
                  autoPlay: false,
                  className: "max-w-full max-h-[90vh] w-full h-auto",
                  playsInline: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
                }
              ),
              media.kind === MediaKind.audio && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6 p-10 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-24 h-24 rounded-full flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.55 0.28 280 / 0.2), oklch(0.45 0.22 300 / 0.2))",
                      border: "2px solid oklch(0.55 0.28 280 / 0.3)",
                      boxShadow: "0 0 32px oklch(0.55 0.28 280 / 0.2)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-10 h-10 text-accent" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground text-center truncate max-w-[260px]", children: media.filename }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "audio",
                  {
                    src: mediaUrl,
                    controls: true,
                    className: "w-full max-w-md",
                    autoPlay: false,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
                  }
                )
              ] }),
              media.kind === MediaKind.document_ && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-5 p-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full glass-card glow-accent-sm flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-9 h-9 text-accent" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: mediaUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-sm font-body underline underline-offset-2 text-accent hover:opacity-80 transition-smooth",
                    children: "Open document"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3 overflow-y-auto flex-shrink-0 border-t border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-semibold text-foreground break-words", children: media.filename }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: (uploaderProfile == null ? void 0 : uploaderProfile.username) ?? "Unknown" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: formatDate$1(media.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "like-media-btn",
                  onClick: handleToggleLike,
                  "aria-label": hasLiked ? "Unlike" : "Like",
                  className: [
                    "flex items-center gap-2 text-sm font-body transition-smooth button-spring",
                    "px-4 py-2 rounded-full border",
                    hasLiked ? "bg-accent/20 text-accent border-accent/40 glow-accent-sm" : "glass-card text-muted-foreground border-white/10 hover:text-foreground"
                  ].join(" "),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: `w-4 h-4 ${hasLiked ? "fill-current text-accent" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: media.likeCount.toString() })
                  ]
                }
              ) })
            ] })
          ]
        }
      )
    }
  );
}
const PAGE_SIZE = 12n;
const ACCEPT_ALL = "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
function detectKind(file) {
  if (file.type.startsWith("image/")) return MediaKind.image;
  if (file.type.startsWith("video/")) return MediaKind.video;
  if (file.type.startsWith("audio/")) return MediaKind.audio;
  return MediaKind.document_;
}
const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const MAX_DOC_BYTES = 10 * 1024 * 1024;
function validateFileSize(file) {
  const kind = detectKind(file);
  const limit = kind === MediaKind.document_ ? MAX_DOC_BYTES : MAX_MEDIA_BYTES;
  if (file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return `File exceeds ${mb} MB limit.`;
  }
  return null;
}
function FolderPill({
  folder,
  selected,
  isOwner,
  onClick,
  onDelete
}) {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "folder-pill",
        onClick,
        className: [
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-smooth button-spring tap-target",
          selected ? "bg-accent text-accent-foreground glow-accent-sm" : "glass-card text-foreground hover:opacity-80",
          isOwner && !folder.isDefault ? "pr-2" : ""
        ].join(" "),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[120px] truncate", children: folder.name }),
          isOwner && !folder.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "folder-pill-menu-btn",
              "aria-label": `Options for ${folder.name}`,
              onClick: (e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }
              },
              className: "ml-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/20",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-3 h-3" })
            }
          )
        ]
      }
    ),
    menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          role: "button",
          tabIndex: -1,
          className: "fixed inset-0 z-10",
          onClick: () => setMenuOpen(false),
          onKeyDown: (e) => {
            if (e.key === "Escape") setMenuOpen(false);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1 z-20 glass-modal rounded-xl overflow-hidden min-w-[140px] shadow-xl animate-scale-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "delete-folder-menu-btn",
          onClick: () => {
            setMenuOpen(false);
            onDelete(folder);
          },
          className: "w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-destructive hover:bg-destructive/15 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 flex-shrink-0" }),
            "Delete folder"
          ]
        }
      ) })
    ] })
  ] });
}
function MomentMediaTab({
  momentId,
  isOwner,
  isAttending = false,
  currentUserId = null
}) {
  var _a;
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
  const [selectedFolderId, setSelectedFolderId] = reactExports.useState(
    null
  );
  const [selectedMedia, setSelectedMedia] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [deleteMediaTarget, setDeleteMediaTarget] = reactExports.useState(
    null
  );
  const [deleteFolderTarget, setDeleteFolderTarget] = reactExports.useState(
    null
  );
  const [showCreateFolder, setShowCreateFolder] = reactExports.useState(false);
  const [newFolderName, setNewFolderName] = reactExports.useState("");
  const { data: folders = [] } = useQuery({
    queryKey: QUERY_KEYS.folders(momentId.toString()),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders(momentId);
    },
    enabled: !!actor
  });
  const currentFolder = selectedFolderId ? folders.find((f) => f.id === selectedFolderId) ?? null : folders.find((f) => f.isDefault) ?? null;
  const isCurrentFolderDefault = (currentFolder == null ? void 0 : currentFolder.isDefault) ?? selectedFolderId === null;
  const canUpload = isOwner || isAttending && isCurrentFolderDefault;
  function canDeleteMedia(media) {
    if (isOwner) return true;
    if (!currentUserId) return false;
    if (!isCurrentFolderDefault) return false;
    return media.uploadedBy.toText() === currentUserId;
  }
  const createFolderMutation = useMutation({
    mutationFn: async (name) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFolder({ name: name.trim(), momentId });
    },
    onSuccess: async () => {
      showSuccess("Folder created.");
      setNewFolderName("");
      setShowCreateFolder(false);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString())
      });
    },
    onError: () => showError("Failed to create folder.")
  });
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFolder(folderId);
    },
    onSuccess: async () => {
      showSuccess("Folder deleted.");
      setDeleteFolderTarget(null);
      if (deleteFolderTarget && selectedFolderId === deleteFolderTarget.id) {
        setSelectedFolderId(null);
      }
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString())
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(momentId.toString(), 0)
      });
    },
    onError: () => showError("Failed to delete folder.")
  });
  const allMediaQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.media(momentId.toString(), 0),
    queryFn: async ({ pageParam = 0n }) => {
      if (!actor) return { items: [], total: 0n, nextOffset: void 0 };
      return actor.listMedia(momentId, pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? void 0,
    initialPageParam: 0n,
    enabled: !!actor && selectedFolderId === null
  });
  const folderMediaQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.mediaByFolder((selectedFolderId == null ? void 0 : selectedFolderId.toString()) ?? "", 0),
    queryFn: async ({ pageParam = 0n }) => {
      if (!actor || !selectedFolderId)
        return { items: [], total: 0n, nextOffset: void 0 };
      return actor.listMediaByFolder(
        selectedFolderId,
        pageParam,
        PAGE_SIZE
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? void 0,
    initialPageParam: 0n,
    enabled: !!actor && selectedFolderId !== null
  });
  const activeQuery = selectedFolderId !== null ? folderMediaQuery : allMediaQuery;
  const allItems = ((_a = activeQuery.data) == null ? void 0 : _a.pages.flatMap((p) => p.items)) ?? [];
  const isLoadingMedia = activeQuery.isLoading;
  const hasMore = activeQuery.hasNextPage;
  const handleUpload = reactExports.useCallback(
    async (file) => {
      var _a2;
      if (!actor) return;
      const sizeError = validateFileSize(file);
      if (sizeError) {
        showError(sizeError);
        return;
      }
      const targetFolderId = selectedFolderId ?? ((_a2 = folders.find((f) => f.isDefault)) == null ? void 0 : _a2.id);
      if (!targetFolderId) {
        showError("No folder available for upload.");
        return;
      }
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
        await actor.uploadMedia({
          blob,
          kind: detectKind(file),
          momentId,
          filename: file.name,
          folderId: targetFolderId
        });
        showSuccess("Media uploaded successfully.");
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.media(momentId.toString(), 0)
        });
        if (selectedFolderId) {
          await queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.mediaByFolder(selectedFolderId.toString(), 0)
          });
        }
      } catch {
        showError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [actor, momentId, selectedFolderId, folders, queryClient]
  );
  const handleFileChange = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (file) handleUpload(file);
  };
  const handleDeleteMedia = async () => {
    if (!actor || !deleteMediaTarget) return;
    try {
      await actor.deleteMedia(deleteMediaTarget.id);
      showSuccess("Media deleted.");
      setSelectedMedia(null);
      setDeleteMediaTarget(null);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(momentId.toString(), 0)
      });
      if (selectedFolderId) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.mediaByFolder(selectedFolderId.toString(), 0)
        });
      }
    } catch {
      showError("Failed to delete media.");
    }
  };
  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    createFolderMutation.mutate(trimmed);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "folder-pill-all",
          onClick: () => setSelectedFolderId(null),
          className: [
            "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-smooth button-spring tap-target",
            selectedFolderId === null ? "bg-accent text-accent-foreground glow-accent-sm" : "glass-card text-foreground hover:opacity-80"
          ].join(" "),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "w-3.5 h-3.5" }),
            "All"
          ]
        }
      ),
      folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FolderPill,
        {
          folder: f,
          selected: selectedFolderId === f.id,
          isOwner,
          onClick: () => setSelectedFolderId(f.id),
          onDelete: (folder) => setDeleteFolderTarget(folder)
        },
        f.id.toString()
      )),
      isOwner && !showCreateFolder && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "add-folder-pill-btn",
          onClick: () => setShowCreateFolder(true),
          "aria-label": "Create folder",
          className: "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium border border-dashed border-accent/30 text-muted-foreground hover:text-accent hover:border-accent/60 transition-smooth button-spring tap-target",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New folder" })
          ]
        }
      )
    ] }),
    isOwner && showCreateFolder && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        "data-ocid": "create-folder-form",
        onSubmit: handleCreateFolderSubmit,
        className: "glass-card rounded-2xl flex items-center gap-2 p-3 animate-slide-down",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-4 h-4 text-accent flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              autoFocus: true,
              placeholder: "Folder name",
              value: newFolderName,
              onChange: (e) => setNewFolderName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Escape") {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }
              },
              maxLength: 64,
              className: "flex-1 h-8 text-sm font-body bg-transparent border-0 shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground",
              "data-ocid": "folder-name-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !newFolderName.trim() || createFolderMutation.isPending,
              className: "px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-body font-semibold hover:opacity-90 transition-smooth button-spring disabled:opacity-50 min-h-0",
              "data-ocid": "create-folder-submit",
              children: createFolderMutation.isPending ? "Creating…" : "Create"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowCreateFolder(false);
                setNewFolderName("");
              },
              "aria-label": "Cancel",
              className: "w-7 h-7 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ]
      }
    ),
    canUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: ACCEPT_ALL,
          className: "hidden",
          onChange: handleFileChange
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "upload-media-btn",
          onClick: () => {
            var _a2;
            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
          },
          disabled: isUploading,
          className: "w-full glass-card rounded-2xl border-2 border-dashed border-accent/25 hover:border-accent/50 flex flex-col items-center gap-3 py-7 transition-smooth group disabled:opacity-60",
          children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-7 h-7 text-accent animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-muted-foreground", children: uploadProgress !== null ? `Uploading ${Math.round(uploadProgress)}%` : "Uploading…" }),
            uploadProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-accent transition-all duration-300",
                style: { width: `${uploadProgress}%` }
              }
            ) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl glass-card glow-accent-sm flex items-center justify-center group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold text-foreground", children: "Upload Media" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: "Photos, videos & audio up to 50 MB · Documents up to 10 MB" })
            ] })
          ] })
        }
      )
    ] }),
    isLoadingMedia ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: ["a", "b", "c", "d", "e", "f"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "aspect-[4/3] rounded-xl animate-shimmer"
      },
      id
    )) }) : allItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Images,
        title: "No media yet",
        description: canUpload ? "Upload your first photo, video, or file to this moment." : "No media has been added to this moment yet.",
        action: canUpload ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "upload-media-empty-btn",
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 min-h-12",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
              "Upload Media"
            ]
          }
        ) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: allItems.map((media) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MediaCard,
        {
          media,
          onClick: () => setSelectedMedia(media)
        },
        media.id.toString()
      )) }),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "load-more-btn",
          onClick: () => activeQuery.fetchNextPage(),
          disabled: activeQuery.isFetchingNextPage,
          className: "glass-card rounded-full px-6 py-2.5 text-sm font-body font-medium text-foreground flex items-center gap-2 hover:opacity-80 transition-smooth button-spring disabled:opacity-50",
          children: [
            activeQuery.isFetchingNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Load more"
          ]
        }
      ) })
    ] }),
    selectedMedia && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaDetailModal,
      {
        media: selectedMedia,
        isOwner,
        canDelete: canDeleteMedia(selectedMedia),
        folders,
        onClose: () => setSelectedMedia(null),
        onDelete: (m) => setDeleteMediaTarget(m)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteMediaTarget,
        onOpenChange: (open) => !open && setDeleteMediaTarget(null),
        title: "Delete Media",
        description: "This will permanently delete this file. This action cannot be undone.",
        confirmLabel: "Delete",
        destructive: true,
        onConfirm: handleDeleteMedia
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteFolderTarget,
        onOpenChange: (open) => !open && setDeleteFolderTarget(null),
        title: "Delete Folder",
        description: `Delete "${deleteFolderTarget == null ? void 0 : deleteFolderTarget.name}"? All media in this folder will be moved to the public folder.`,
        confirmLabel: "Delete",
        destructive: true,
        onConfirm: () => {
          if (deleteFolderTarget)
            deleteFolderMutation.mutate(deleteFolderTarget.id);
        }
      }
    )
  ] });
}
function PrivateMomentPreview({
  moment,
  ownerUsername
}) {
  const { actor } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const status = moment.callerAccessStatus ?? null;
  const [requestSent, setRequestSent] = reactExports.useState(false);
  const [inlineError, setInlineError] = reactExports.useState(null);
  const requestMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.requestMomentAccess(moment.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
    },
    onSuccess: () => {
      setRequestSent(true);
      setInlineError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(moment.id.toString())
      });
    },
    onError: (err) => {
      setInlineError(
        err.message || "Failed to request access, please try again"
      );
    }
  });
  const handleRequestAccess = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setInlineError(null);
    requestMutation.mutate();
  };
  const isDeniedOrRevoked = status === AccessStatus.denied || status === AccessStatus.revoked;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center text-center space-y-5",
      "data-ocid": "private-moment-preview",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-muted", children: [
          moment.coverImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: moment.coverImage.getDirectURL(),
              alt: moment.title,
              className: "w-full h-full object-cover",
              style: {
                filter: "brightness(0.3) blur(3px)",
                transform: "scale(1.06)"
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-14 h-14 rounded-full flex items-center justify-center glass-card glow-accent",
                style: { border: "1px solid rgba(255,255,255,0.2)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-accent" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-display font-bold text-xl leading-tight drop-shadow-lg", children: moment.title }),
            ownerUsername && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/60 text-sm font-body drop-shadow", children: [
              "by @",
              ownerUsername
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-2 pb-2 w-full max-w-xs", children: requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-2xl p-4 flex flex-col items-center gap-2 animate-scale-in",
            "data-ocid": "access-request-sent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-6 h-6 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold text-foreground", children: "Access request sent!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "The owner will review your request." })
            ]
          }
        ) : status === AccessStatus.pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-2xl px-4 py-3 flex items-center gap-2 justify-center",
            "data-ocid": "access-pending-badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-medium text-foreground", children: "Access Requested — Pending Approval" })
            ]
          }
        ) : isDeniedOrRevoked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: status === AccessStatus.revoked ? "Your access has been revoked." : "Your access request was denied." })
          ] }),
          inlineError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive font-body",
              "data-ocid": "access-request-error",
              children: inlineError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleRequestAccess,
              disabled: requestMutation.isPending,
              "data-ocid": "re-request-access-btn",
              className: "w-full glass-card rounded-2xl px-5 py-3 text-sm font-body font-semibold text-foreground button-spring transition-smooth hover:opacity-80 disabled:opacity-50 min-h-12",
              children: requestMutation.isPending ? "Requesting…" : "Re-request Access"
            }
          )
        ] }) : !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "This is a private moment. Sign in to request access." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: login,
              "data-ocid": "sign-in-to-request-access-btn",
              className: "w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 min-h-12",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
                "Sign in to Request Access"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "This is a private moment. Request access to view it." }),
          inlineError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive font-body",
              "data-ocid": "access-request-error",
              children: inlineError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleRequestAccess,
              disabled: requestMutation.isPending,
              "data-ocid": "request-access-btn",
              className: "w-full flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 disabled:opacity-50 min-h-12",
              children: requestMutation.isPending ? "Requesting…" : "Request Access"
            }
          )
        ] }) })
      ]
    }
  );
}
const RSVP_OPTIONS = [
  {
    status: RsvpStatus.attending,
    label: "Attending",
    icon: Check,
    activeClass: "bg-accent text-accent-foreground glow-accent-sm",
    inactiveClass: "glass-card text-muted-foreground hover:text-accent hover:border-accent/30"
  },
  {
    status: RsvpStatus.maybe,
    label: "Maybe",
    icon: CircleHelp,
    activeClass: "bg-yellow-400/20 text-yellow-500 border-yellow-400/40",
    inactiveClass: "glass-card text-muted-foreground hover:text-yellow-500 hover:border-yellow-400/30"
  },
  {
    status: RsvpStatus.notAttending,
    label: "Not Attending",
    icon: X,
    activeClass: "bg-destructive/20 text-destructive border-destructive/40",
    inactiveClass: "glass-card text-muted-foreground hover:text-destructive hover:border-destructive/30"
  }
];
function RsvpButton({ momentId }) {
  var _a, _b;
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, login, isLoggingIn } = useAuth();
  const queryClient = useQueryClient();
  const attendeesQuery = useQuery({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const currentRsvp = ((_b = (_a = attendeesQuery.data) == null ? void 0 : _a.find(
    (a) => principal && a.userId.toText() === principal.toText()
  )) == null ? void 0 : _b.rsvpStatus) ?? null;
  const rsvpMutation = useMutation({
    mutationFn: async (status) => {
      if (!actor) throw new Error("Not connected");
      await actor.setRsvp(momentId, status);
      return status;
    },
    onMutate: async (status) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.momentAttendees(momentId)
      });
      const previous = queryClient.getQueryData(
        QUERY_KEYS.momentAttendees(momentId)
      );
      queryClient.setQueryData(
        QUERY_KEYS.momentAttendees(momentId),
        (old) => {
          if (!old || !principal) return old ?? [];
          const existing = old.find(
            (a) => a.userId.toText() === principal.toText()
          );
          if (existing) {
            return old.map(
              (a) => a.userId.toText() === principal.toText() ? { ...a, rsvpStatus: status } : a
            );
          }
          return [
            ...old,
            {
              userId: principal,
              momentId,
              rsvpStatus: status,
              joinedAt: BigInt(Date.now()) * 1000000n
            }
          ];
        }
      );
      return { previous };
    },
    onSuccess: (status) => {
      const labels = {
        [RsvpStatus.attending]: "Marked as Attending",
        [RsvpStatus.maybe]: "Marked as Maybe",
        [RsvpStatus.notAttending]: "Marked as Not Attending"
      };
      showSuccess(labels[status]);
    },
    onError: (_err, _vars, context) => {
      if (context == null ? void 0 : context.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.momentAttendees(momentId),
          context.previous
        );
      }
      showError("Could not save RSVP. Try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAttendees(momentId)
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(momentId)
      });
    }
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "rsvp-login-prompt",
        onClick: () => login(),
        disabled: isLoggingIn,
        className: "glass-card rounded-full flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-smooth button-spring disabled:opacity-60 min-h-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3.5 h-3.5" }),
          isLoggingIn ? "Signing in…" : "Sign in to RSVP"
        ]
      }
    );
  }
  if (attendeesQuery.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", "data-ocid": "rsvp-buttons", children: RSVP_OPTIONS.map(({ status }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-9 rounded-full animate-shimmer px-4 py-2 min-w-[80px]"
      },
      status
    )) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", "data-ocid": "rsvp-buttons", children: RSVP_OPTIONS.map(
    ({ status, label, icon: Icon, activeClass, inactiveClass }) => {
      const isActive = currentRsvp === status;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => rsvpMutation.mutate(status),
          disabled: rsvpMutation.isPending,
          "data-ocid": `rsvp-${status}`,
          className: [
            "flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-body font-semibold",
            "transition-smooth button-spring",
            isActive ? activeClass : inactiveClass,
            rsvpMutation.isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          ].join(" "),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
          ]
        },
        status
      );
    }
  ) });
}
function formatDate(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function formatTime(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MomentDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-[60vh] rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" })
    ] })
  ] });
}
function ShareSection({ momentId }) {
  const [copied, setCopied] = reactExports.useState(false);
  const [qrOpen, setQrOpen] = reactExports.useState(false);
  const shareUrl = `${window.location.origin}/moment/${momentId}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass-card rounded-2xl p-4 space-y-3",
      "data-ocid": "share-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Share this Moment" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleCopy,
            className: "w-full gap-2 transition-smooth button-spring",
            "data-ocid": "copy-share-link-btn",
            children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: "Copied!" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: "Copy Link" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setQrOpen((v) => !v),
              className: "tap-target w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-smooth text-sm",
              "aria-expanded": qrOpen,
              "data-ocid": "qr-toggle-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-body text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-4 h-4" }),
                  qrOpen ? "Hide QR Code" : "Show QR Code"
                ] }),
                qrOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: qrOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              transition: { duration: 0.25, ease: "easeInOut" },
              className: "overflow-hidden",
              "data-ocid": "qr-code-container",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-4 bg-background rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                QRCodeSVG,
                {
                  value: shareUrl,
                  size: 160,
                  level: "M",
                  includeMargin: false,
                  className: "rounded"
                }
              ) })
            }
          ) })
        ] })
      ]
    }
  );
}
function GlassTabBar({ tabs, active, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "glass-card rounded-full p-1 flex w-fit mx-auto",
      "data-ocid": "moment-tabs",
      children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onChange(tab.id),
          className: "relative px-4 py-2 rounded-full text-xs font-body font-medium transition-colors z-10 flex items-center gap-1.5",
          style: {
            color: active === tab.id ? "oklch(var(--accent))" : void 0
          },
          "data-ocid": `moment-tab-${tab.id}`,
          "aria-selected": active === tab.id,
          children: [
            active === tab.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                layoutId: "tab-active",
                className: "absolute inset-0 glass-card rounded-full z-[-1]",
                transition: { type: "spring", stiffness: 380, damping: 30 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: active === tab.id ? "text-accent" : "text-muted-foreground",
                children: tab.icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: active === tab.id ? "text-accent" : "text-muted-foreground",
                children: tab.label
              }
            )
          ]
        },
        tab.id
      ))
    }
  );
}
function HeroImage({ src, alt }) {
  const ref = reactExports.useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 240]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: "relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-muted",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.img,
          {
            src,
            alt,
            className: "w-full h-[120%] object-cover absolute inset-0",
            style: { y, willChange: "transform" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" })
      ]
    }
  );
}
function HeroGradient() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-[60vh] md:h-[70vh] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" })
  ] });
}
function MomentDetailContent({ momentId }) {
  var _a, _b;
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const [showEventPass, setShowEventPass] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("memories");
  const { data: moment, isLoading } = useQuery({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      const effectiveActor = actor ? actor : await createActorWithConfig(createActor);
      return effectiveActor.getMomentDetail(momentId);
    },
    enabled: true
  });
  const { data: attendees } = useQuery({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const isPrivate = isPrivateVisibility(moment == null ? void 0 : moment.visibility);
  const hasAccess = !moment || !isPrivate || moment.isOwner || moment.callerAccessStatus === AccessStatus.approved;
  const showAccessTab = (moment == null ? void 0 : moment.isOwner) && isPrivate;
  const coverUrl = (_a = moment == null ? void 0 : moment.coverImage) == null ? void 0 : _a.getDirectURL();
  const myAttendance = attendees == null ? void 0 : attendees.find(
    (a) => principal && a.userId.toText() === principal.toText()
  );
  const isAttending = isAuthenticated && ((moment == null ? void 0 : moment.isOwner) || (myAttendance == null ? void 0 : myAttendance.rsvpStatus) === RsvpStatus.attending || (myAttendance == null ? void 0 : myAttendance.rsvpStatus) === RsvpStatus.maybe);
  const showShare = !!moment && isAuthenticated && (moment.isOwner || !isPrivate || moment.callerAccessStatus === AccessStatus.approved);
  const handleBack = () => {
    navigate({ to: "/explore" });
  };
  const tabs = [];
  if (isAttending) {
    tabs.push({
      id: "memories",
      label: "Memories",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "w-3.5 h-3.5" })
    });
  }
  tabs.push({
    id: "media",
    label: "Media",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "w-3.5 h-3.5" })
  });
  tabs.push({
    id: "people",
    label: "People",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" })
  });
  if (showAccessTab) {
    tabs.push({
      id: "access",
      label: "Access",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" })
    });
  }
  const validActiveTab = ((_b = tabs.find((t) => t.id === activeTab)) == null ? void 0 : _b.id) ?? (isAttending ? "memories" : "media");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthGuard, { requireAuth: false, currentPath: `/moments/${momentId}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MomentDetailSkeleton, {}) : !moment ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "Moment not found",
        description: "This moment may have been removed or is no longer available.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: handleBack,
            className: "tap-target",
            children: "Back to Explore"
          }
        )
      }
    ) }) : !hasAccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleBack,
          className: "tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-4 -ml-1",
          "aria-label": "Back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Back" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateMomentPreview, { moment })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative -mx-4 md:-mx-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleBack,
            className: "absolute top-4 left-4 z-20 flex items-center justify-center w-9 h-9 rounded-full glass-card transition-smooth button-spring",
            "data-ocid": "moment-back-btn",
            "aria-label": "Back",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 text-foreground" })
          }
        ),
        moment.isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({
              to: "/moments/$momentId/edit",
              params: { momentId }
            }),
            className: "absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full glass-card text-xs font-body font-medium text-foreground transition-smooth button-spring",
            "data-ocid": "edit-moment-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
              "Edit"
            ]
          }
        ),
        coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(HeroImage, { src: coverUrl, alt: moment.title }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HeroGradient, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { y: 80, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { type: "spring", stiffness: 200, damping: 25 },
          className: "glass-card rounded-t-3xl -mt-16 relative z-10 mx-0 px-5 pt-6 pb-5 space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground leading-tight flex-1 min-w-0", children: moment.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: isPrivate ? "outline" : "secondary",
                    className: "flex items-center gap-1 flex-shrink-0",
                    children: [
                      isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
                      isPrivate ? "Private" : "Public"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: formatDate(moment.eventDate) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: formatTime(moment.eventDate) })
                ] }),
                moment.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: moment.location })
                  ] }),
                  moment.locationLat !== void 0 && moment.locationLng !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "rounded-xl overflow-hidden border border-border",
                      "data-ocid": "moment-map-container",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "iframe",
                        {
                          title: `Map of ${moment.location}`,
                          width: "100%",
                          height: "180",
                          style: { border: 0, display: "block" },
                          loading: "lazy",
                          src: `https://www.openstreetmap.org/export/embed.html?bbox=${moment.locationLng - 0.01},${moment.locationLat - 0.01},${moment.locationLng + 0.01},${moment.locationLat + 0.01}&layer=mapnik&marker=${moment.locationLat},${moment.locationLng}`,
                          "data-ocid": "moment-map-iframe"
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body", children: [
                    moment.attendeeCount.toString(),
                    " attending"
                  ] })
                ] })
              ] }),
              moment.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-relaxed", children: moment.description }),
              moment.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: moment.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs font-body",
                  children: [
                    "#",
                    tag
                  ]
                },
                tag
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2 uppercase tracking-wide", children: "Your RSVP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(RsvpButton, { momentId })
            ] }),
            isAttending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                onClick: () => setShowEventPass(true),
                whileTap: { scale: 0.96 },
                className: "relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-display font-semibold text-sm text-accent-foreground overflow-hidden animate-glow-pulse",
                style: {
                  background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
                },
                "data-ocid": "event-pass-open_modal_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shimmer-sweep" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-4 h-4" }),
                  "Your Event Pass"
                ]
              }
            ),
            showShare && /* @__PURE__ */ jsxRuntimeExports.jsx(ShareSection, { momentId: moment.id })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-header py-3 bg-background/80 backdrop-blur-md -mx-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        GlassTabBar,
        {
          tabs,
          active: validActiveTab,
          onChange: (id) => setActiveTab(id)
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
          transition: { duration: 0.2, ease: "easeInOut" },
          children: [
            validActiveTab === "memories" && isAttending && /* @__PURE__ */ jsxRuntimeExports.jsx(MemoriesTab, { momentId: moment.id }),
            validActiveTab === "media" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              MomentMediaTab,
              {
                momentId: moment.id,
                isOwner: moment.isOwner,
                isAttending,
                currentUserId: (principal == null ? void 0 : principal.toText()) ?? null
              }
            ),
            validActiveTab === "people" && /* @__PURE__ */ jsxRuntimeExports.jsx(AttendeesTab, { momentId }),
            validActiveTab === "access" && showAccessTab && /* @__PURE__ */ jsxRuntimeExports.jsx(AccessRequestsPanel, { momentId: moment.id })
          ]
        },
        validActiveTab
      ) }) })
    ] }) }),
    showEventPass && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EventPassModal,
      {
        momentId,
        currentUserPrincipal: (principal == null ? void 0 : principal.toText()) ?? null,
        actor,
        isFetchingActor: isFetching,
        onClose: () => setShowEventPass(false)
      }
    )
  ] });
}
function MomentDetailPage() {
  const { momentId } = useParams({ from: "/moments/$momentId" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MomentDetailContent, { momentId });
}
export {
  MomentDetailContent,
  MomentDetailPage
};
