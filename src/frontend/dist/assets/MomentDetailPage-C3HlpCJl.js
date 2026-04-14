import { l as QueryObserver, m as infiniteQueryBehavior, n as hasPreviousPage, o as hasNextPage, p as useBaseQuery, r as reactExports, j as jsxRuntimeExports, h as cn, R as React, a as useBackend, d as useQueryClient, f as useQuery, e as useMutation, Q as QUERY_KEYS, A as AccessStatus, u as useAuth, c as useNavigate, q as RsvpStatus, E as ExternalBlob, s as MemoryMediaKind, M as MediaKind, g as useParams, t as createActorWithConfig, v as createActor } from "./index-DlqwQ7hd.js";
import { B as Badge, A as Avatar, a as AvatarImage, b as AvatarFallback, U as User, L as Layout, S as ShieldCheck } from "./badge-D1wUDQ0J.js";
import { P as Primitive, B as Button, A as AuthGuard } from "./AuthGuard-DwWnaabs.js";
import { S as Skeleton, U as Users } from "./skeleton-B1svKeA7.js";
import { F as FileText, I as Image, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DPWDZ8UT.js";
import { s as showError, a as showSuccess } from "./toast-DzJ_e1Ax.js";
import { C as Clock } from "./clock-BEGfysa9.js";
import { a as CircleX, C as CircleCheck } from "./circle-x-CDsQK_08.js";
import { E as EmptyState } from "./EmptyState-D402-w7e.js";
import { U as UserMinus, a as UserPlus, L as LogIn, C as Check } from "./user-plus-ztxaV_X4.js";
import { X } from "./x-D53dYmLV.js";
import { T as Textarea } from "./textarea-C16VtlRM.js";
import { c as createLucideIcon } from "./createLucideIcon-BUPz7SPw.js";
import { L as LoaderCircle } from "./loader-circle-Dyt4cXuT.js";
import { T as Trash2 } from "./trash-2-9qTn1pjp.js";
import { i as isPrivateVisibility, C as Calendar } from "./MomentCard-yEIYveNg.js";
import { I as Input } from "./input-BrwhUD3l.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DZqtFNPh.js";
import { U as Upload } from "./upload-BmQBa2NC.js";
import { L as Lock, G as Globe, M as MapPin } from "./map-pin-CyFtcmKR.js";
import { A as ArrowLeft } from "./arrow-left-C0BV-BdB.js";
import "./sun-DHiVM1rX.js";
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
const __iconNode$j = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$i);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode$h);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$g);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
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
const FileAudio = createLucideIcon("file-audio", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
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
const FolderPlus = createLucideIcon("folder-plus", __iconNode$b);
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
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6", key: "pblm9e" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18", key: "nf6bnh" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2", key: "12espp" }]
];
const Images = createLucideIcon("images", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  [
    "path",
    {
      d: "M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8",
      key: "1blaws"
    }
  ]
];
const MessageSquareHeart = createLucideIcon("message-square-heart", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
  ["path", { d: "M21 21v.01", key: "ents32" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M12 3h.01", key: "n36tog" }],
  ["path", { d: "M12 16v.01", key: "133mhm" }],
  ["path", { d: "M16 12h1", key: "1slzba" }],
  ["path", { d: "M21 12v.01", key: "1lwtk9" }],
  ["path", { d: "M12 21v-1", key: "1880an" }]
];
const QrCode = createLucideIcon("qr-code", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$3);
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
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */
var qrcodegen;
((qrcodegen2) => {
  const _QrCode = class _QrCode2 {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(version, errorCorrectionLevel, dataCodewords, msk) {
      this.version = version;
      this.errorCorrectionLevel = errorCorrectionLevel;
      this.modules = [];
      this.isFunction = [];
      if (version < _QrCode2.MIN_VERSION || version > _QrCode2.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (msk < -1 || msk > 7)
        throw new RangeError("Mask value out of range");
      this.size = version * 4 + 17;
      let row = [];
      for (let i = 0; i < this.size; i++)
        row.push(false);
      for (let i = 0; i < this.size; i++) {
        this.modules.push(row.slice());
        this.isFunction.push(row.slice());
      }
      this.drawFunctionPatterns();
      const allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords);
      if (msk == -1) {
        let minPenalty = 1e9;
        for (let i = 0; i < 8; i++) {
          this.applyMask(i);
          this.drawFormatBits(i);
          const penalty = this.getPenaltyScore();
          if (penalty < minPenalty) {
            msk = i;
            minPenalty = penalty;
          }
          this.applyMask(i);
        }
      }
      assert(0 <= msk && msk <= 7);
      this.mask = msk;
      this.applyMask(msk);
      this.drawFormatBits(msk);
      this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(text, ecl) {
      const segs = qrcodegen2.QrSegment.makeSegments(text);
      return _QrCode2.encodeSegments(segs, ecl);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(data, ecl) {
      const seg = qrcodegen2.QrSegment.makeBytes(data);
      return _QrCode2.encodeSegments([seg], ecl);
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a QR Code representing the given segments with the given encoding parameters.
    // The smallest possible QR Code version within the given range is automatically
    // chosen for the output. Iff boostEcl is true, then the ECC level of the result
    // may be higher than the ecl argument if it can be done without increasing the
    // version. The mask number is either between 0 to 7 (inclusive) to force that
    // mask, or -1 to automatically choose an appropriate mask (which may be slow).
    // This function allows the user to create a custom sequence of segments that switches
    // between modes (such as alphanumeric and byte) to encode text in less space.
    // This is a mid-level API; the high-level API is encodeText() and encodeBinary().
    static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
      if (!(_QrCode2.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode2.MAX_VERSION) || mask < -1 || mask > 7)
        throw new RangeError("Invalid value");
      let version;
      let dataUsedBits;
      for (version = minVersion; ; version++) {
        const dataCapacityBits2 = _QrCode2.getNumDataCodewords(version, ecl) * 8;
        const usedBits = QrSegment.getTotalBits(segs, version);
        if (usedBits <= dataCapacityBits2) {
          dataUsedBits = usedBits;
          break;
        }
        if (version >= maxVersion)
          throw new RangeError("Data too long");
      }
      for (const newEcl of [_QrCode2.Ecc.MEDIUM, _QrCode2.Ecc.QUARTILE, _QrCode2.Ecc.HIGH]) {
        if (boostEcl && dataUsedBits <= _QrCode2.getNumDataCodewords(version, newEcl) * 8)
          ecl = newEcl;
      }
      let bb = [];
      for (const seg of segs) {
        appendBits(seg.mode.modeBits, 4, bb);
        appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
        for (const b of seg.getData())
          bb.push(b);
      }
      assert(bb.length == dataUsedBits);
      const dataCapacityBits = _QrCode2.getNumDataCodewords(version, ecl) * 8;
      assert(bb.length <= dataCapacityBits);
      appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
      appendBits(0, (8 - bb.length % 8) % 8, bb);
      assert(bb.length % 8 == 0);
      for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)
        appendBits(padByte, 8, bb);
      let dataCodewords = [];
      while (dataCodewords.length * 8 < bb.length)
        dataCodewords.push(0);
      bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
      return new _QrCode2(version, ecl, dataCodewords, mask);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(x, y) {
      return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
    }
    // Modified to expose modules for easy access
    getModules() {
      return this.modules;
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 == 0);
        this.setFunctionModule(i, 6, i % 2 == 0);
      }
      this.drawFinderPattern(3, 3);
      this.drawFinderPattern(this.size - 4, 3);
      this.drawFinderPattern(3, this.size - 4);
      const alignPatPos = this.getAlignmentPatternPositions();
      const numAlign = alignPatPos.length;
      for (let i = 0; i < numAlign; i++) {
        for (let j = 0; j < numAlign; j++) {
          if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0))
            this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
        }
      }
      this.drawFormatBits(0);
      this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(mask) {
      const data = this.errorCorrectionLevel.formatBits << 3 | mask;
      let rem = data;
      for (let i = 0; i < 10; i++)
        rem = rem << 1 ^ (rem >>> 9) * 1335;
      const bits = (data << 10 | rem) ^ 21522;
      assert(bits >>> 15 == 0);
      for (let i = 0; i <= 5; i++)
        this.setFunctionModule(8, i, getBit(bits, i));
      this.setFunctionModule(8, 7, getBit(bits, 6));
      this.setFunctionModule(8, 8, getBit(bits, 7));
      this.setFunctionModule(7, 8, getBit(bits, 8));
      for (let i = 9; i < 15; i++)
        this.setFunctionModule(14 - i, 8, getBit(bits, i));
      for (let i = 0; i < 8; i++)
        this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
      for (let i = 8; i < 15; i++)
        this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
      this.setFunctionModule(8, this.size - 8, true);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let rem = this.version;
      for (let i = 0; i < 12; i++)
        rem = rem << 1 ^ (rem >>> 11) * 7973;
      const bits = this.version << 12 | rem;
      assert(bits >>> 18 == 0);
      for (let i = 0; i < 18; i++) {
        const color = getBit(bits, i);
        const a = this.size - 11 + i % 3;
        const b = Math.floor(i / 3);
        this.setFunctionModule(a, b, color);
        this.setFunctionModule(b, a, color);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(x, y) {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const xx = x + dx;
          const yy = y + dy;
          if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
            this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
        }
      }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(x, y) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++)
          this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
      }
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(x, y, isDark) {
      this.modules[y][x] = isDark;
      this.isFunction[y][x] = true;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(data) {
      const ver = this.version;
      const ecl = this.errorCorrectionLevel;
      if (data.length != _QrCode2.getNumDataCodewords(ver, ecl))
        throw new RangeError("Invalid argument");
      const numBlocks = _QrCode2.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
      const blockEccLen = _QrCode2.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
      const rawCodewords = Math.floor(_QrCode2.getNumRawDataModules(ver) / 8);
      const numShortBlocks = numBlocks - rawCodewords % numBlocks;
      const shortBlockLen = Math.floor(rawCodewords / numBlocks);
      let blocks = [];
      const rsDiv = _QrCode2.reedSolomonComputeDivisor(blockEccLen);
      for (let i = 0, k = 0; i < numBlocks; i++) {
        let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
        k += dat.length;
        const ecc = _QrCode2.reedSolomonComputeRemainder(dat, rsDiv);
        if (i < numShortBlocks)
          dat.push(0);
        blocks.push(dat.concat(ecc));
      }
      let result = [];
      for (let i = 0; i < blocks[0].length; i++) {
        blocks.forEach((block, j) => {
          if (i != shortBlockLen - blockEccLen || j >= numShortBlocks)
            result.push(block[i]);
        });
      }
      assert(result.length == rawCodewords);
      return result;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(data) {
      if (data.length != Math.floor(_QrCode2.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let i = 0;
      for (let right = this.size - 1; right >= 1; right -= 2) {
        if (right == 6)
          right = 5;
        for (let vert = 0; vert < this.size; vert++) {
          for (let j = 0; j < 2; j++) {
            const x = right - j;
            const upward = (right + 1 & 2) == 0;
            const y = upward ? this.size - 1 - vert : vert;
            if (!this.isFunction[y][x] && i < data.length * 8) {
              this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
              i++;
            }
          }
        }
      }
      assert(i == data.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(mask) {
      if (mask < 0 || mask > 7)
        throw new RangeError("Mask value out of range");
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          let invert;
          switch (mask) {
            case 0:
              invert = (x + y) % 2 == 0;
              break;
            case 1:
              invert = y % 2 == 0;
              break;
            case 2:
              invert = x % 3 == 0;
              break;
            case 3:
              invert = (x + y) % 3 == 0;
              break;
            case 4:
              invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
              break;
            case 5:
              invert = x * y % 2 + x * y % 3 == 0;
              break;
            case 6:
              invert = (x * y % 2 + x * y % 3) % 2 == 0;
              break;
            case 7:
              invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          if (!this.isFunction[y][x] && invert)
            this.modules[y][x] = !this.modules[y][x];
        }
      }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let result = 0;
      for (let y = 0; y < this.size; y++) {
        let runColor = false;
        let runX = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];
        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x] == runColor) {
            runX++;
            if (runX == 5)
              result += _QrCode2.PENALTY_N1;
            else if (runX > 5)
              result++;
          } else {
            this.finderPenaltyAddHistory(runX, runHistory);
            if (!runColor)
              result += this.finderPenaltyCountPatterns(runHistory) * _QrCode2.PENALTY_N3;
            runColor = this.modules[y][x];
            runX = 1;
          }
        }
        result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode2.PENALTY_N3;
      }
      for (let x = 0; x < this.size; x++) {
        let runColor = false;
        let runY = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];
        for (let y = 0; y < this.size; y++) {
          if (this.modules[y][x] == runColor) {
            runY++;
            if (runY == 5)
              result += _QrCode2.PENALTY_N1;
            else if (runY > 5)
              result++;
          } else {
            this.finderPenaltyAddHistory(runY, runHistory);
            if (!runColor)
              result += this.finderPenaltyCountPatterns(runHistory) * _QrCode2.PENALTY_N3;
            runColor = this.modules[y][x];
            runY = 1;
          }
        }
        result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode2.PENALTY_N3;
      }
      for (let y = 0; y < this.size - 1; y++) {
        for (let x = 0; x < this.size - 1; x++) {
          const color = this.modules[y][x];
          if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1])
            result += _QrCode2.PENALTY_N2;
        }
      }
      let dark = 0;
      for (const row of this.modules)
        dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
      const total = this.size * this.size;
      const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
      assert(0 <= k && k <= 9);
      result += k * _QrCode2.PENALTY_N4;
      assert(0 <= result && result <= 2568888);
      return result;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      else {
        const numAlign = Math.floor(this.version / 7) + 2;
        const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
        let result = [6];
        for (let pos = this.size - 7; result.length < numAlign; pos -= step)
          result.splice(1, 0, pos);
        return result;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(ver) {
      if (ver < _QrCode2.MIN_VERSION || ver > _QrCode2.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let result = (16 * ver + 128) * ver + 64;
      if (ver >= 2) {
        const numAlign = Math.floor(ver / 7) + 2;
        result -= (25 * numAlign - 10) * numAlign - 55;
        if (ver >= 7)
          result -= 36;
      }
      assert(208 <= result && result <= 29648);
      return result;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(ver, ecl) {
      return Math.floor(_QrCode2.getNumRawDataModules(ver) / 8) - _QrCode2.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode2.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(degree) {
      if (degree < 1 || degree > 255)
        throw new RangeError("Degree out of range");
      let result = [];
      for (let i = 0; i < degree - 1; i++)
        result.push(0);
      result.push(1);
      let root = 1;
      for (let i = 0; i < degree; i++) {
        for (let j = 0; j < result.length; j++) {
          result[j] = _QrCode2.reedSolomonMultiply(result[j], root);
          if (j + 1 < result.length)
            result[j] ^= result[j + 1];
        }
        root = _QrCode2.reedSolomonMultiply(root, 2);
      }
      return result;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(data, divisor) {
      let result = divisor.map((_) => 0);
      for (const b of data) {
        const factor = b ^ result.shift();
        result.push(0);
        divisor.forEach((coef, i) => result[i] ^= _QrCode2.reedSolomonMultiply(coef, factor));
      }
      return result;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(x, y) {
      if (x >>> 8 != 0 || y >>> 8 != 0)
        throw new RangeError("Byte out of range");
      let z = 0;
      for (let i = 7; i >= 0; i--) {
        z = z << 1 ^ (z >>> 7) * 285;
        z ^= (y >>> i & 1) * x;
      }
      assert(z >>> 8 == 0);
      return z;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(runHistory) {
      const n = runHistory[1];
      assert(n <= this.size * 3);
      const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
      return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
      if (currentRunColor) {
        this.finderPenaltyAddHistory(currentRunLength, runHistory);
        currentRunLength = 0;
      }
      currentRunLength += this.size;
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      return this.finderPenaltyCountPatterns(runHistory);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(currentRunLength, runHistory) {
      if (runHistory[0] == 0)
        currentRunLength += this.size;
      runHistory.pop();
      runHistory.unshift(currentRunLength);
    }
  };
  _QrCode.MIN_VERSION = 1;
  _QrCode.MAX_VERSION = 40;
  _QrCode.PENALTY_N1 = 3;
  _QrCode.PENALTY_N2 = 3;
  _QrCode.PENALTY_N3 = 40;
  _QrCode.PENALTY_N4 = 10;
  _QrCode.ECC_CODEWORDS_PER_BLOCK = [
    // Version: (note that index 0 is for padding, and is set to an illegal value)
    //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    // Low
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    // Medium
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    // Quartile
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    // High
  ];
  _QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
    // Version: (note that index 0 is for padding, and is set to an illegal value)
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    // Low
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    // Medium
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    // Quartile
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
    // High
  ];
  qrcodegen2.QrCode = _QrCode;
  function appendBits(val, len, bb) {
    if (len < 0 || len > 31 || val >>> len != 0)
      throw new RangeError("Value out of range");
    for (let i = len - 1; i >= 0; i--)
      bb.push(val >>> i & 1);
  }
  function getBit(x, i) {
    return (x >>> i & 1) != 0;
  }
  function assert(cond) {
    if (!cond)
      throw new Error("Assertion error");
  }
  const _QrSegment = class _QrSegment2 {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(mode, numChars, bitData) {
      this.mode = mode;
      this.numChars = numChars;
      this.bitData = bitData;
      if (numChars < 0)
        throw new RangeError("Invalid argument");
      this.bitData = bitData.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(data) {
      let bb = [];
      for (const b of data)
        appendBits(b, 8, bb);
      return new _QrSegment2(_QrSegment2.Mode.BYTE, data.length, bb);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(digits) {
      if (!_QrSegment2.isNumeric(digits))
        throw new RangeError("String contains non-numeric characters");
      let bb = [];
      for (let i = 0; i < digits.length; ) {
        const n = Math.min(digits.length - i, 3);
        appendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
        i += n;
      }
      return new _QrSegment2(_QrSegment2.Mode.NUMERIC, digits.length, bb);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(text) {
      if (!_QrSegment2.isAlphanumeric(text))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let bb = [];
      let i;
      for (i = 0; i + 2 <= text.length; i += 2) {
        let temp = _QrSegment2.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
        temp += _QrSegment2.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
        appendBits(temp, 11, bb);
      }
      if (i < text.length)
        appendBits(_QrSegment2.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
      return new _QrSegment2(_QrSegment2.Mode.ALPHANUMERIC, text.length, bb);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(text) {
      if (text == "")
        return [];
      else if (_QrSegment2.isNumeric(text))
        return [_QrSegment2.makeNumeric(text)];
      else if (_QrSegment2.isAlphanumeric(text))
        return [_QrSegment2.makeAlphanumeric(text)];
      else
        return [_QrSegment2.makeBytes(_QrSegment2.toUtf8ByteArray(text))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(assignVal) {
      let bb = [];
      if (assignVal < 0)
        throw new RangeError("ECI assignment value out of range");
      else if (assignVal < 1 << 7)
        appendBits(assignVal, 8, bb);
      else if (assignVal < 1 << 14) {
        appendBits(2, 2, bb);
        appendBits(assignVal, 14, bb);
      } else if (assignVal < 1e6) {
        appendBits(6, 3, bb);
        appendBits(assignVal, 21, bb);
      } else
        throw new RangeError("ECI assignment value out of range");
      return new _QrSegment2(_QrSegment2.Mode.ECI, 0, bb);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(text) {
      return _QrSegment2.NUMERIC_REGEX.test(text);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(text) {
      return _QrSegment2.ALPHANUMERIC_REGEX.test(text);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(segs, version) {
      let result = 0;
      for (const seg of segs) {
        const ccbits = seg.mode.numCharCountBits(version);
        if (seg.numChars >= 1 << ccbits)
          return Infinity;
        result += 4 + ccbits + seg.bitData.length;
      }
      return result;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(str) {
      str = encodeURI(str);
      let result = [];
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) != "%")
          result.push(str.charCodeAt(i));
        else {
          result.push(parseInt(str.substring(i + 1, i + 3), 16));
          i += 2;
        }
      }
      return result;
    }
  };
  _QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
  _QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
  _QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  let QrSegment = _QrSegment;
  qrcodegen2.QrSegment = _QrSegment;
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2) => {
  ((QrCode2) => {
    const _Ecc = class _Ecc {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(ordinal, formatBits) {
        this.ordinal = ordinal;
        this.formatBits = formatBits;
      }
    };
    _Ecc.LOW = new _Ecc(0, 1);
    _Ecc.MEDIUM = new _Ecc(1, 0);
    _Ecc.QUARTILE = new _Ecc(2, 3);
    _Ecc.HIGH = new _Ecc(3, 2);
    QrCode2.Ecc = _Ecc;
  })(qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2) => {
  ((QrSegment2) => {
    const _Mode = class _Mode {
      /*-- Constructor and fields --*/
      constructor(modeBits, numBitsCharCount) {
        this.modeBits = modeBits;
        this.numBitsCharCount = numBitsCharCount;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(ver) {
        return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
      }
    };
    _Mode.NUMERIC = new _Mode(1, [10, 12, 14]);
    _Mode.ALPHANUMERIC = new _Mode(2, [9, 11, 13]);
    _Mode.BYTE = new _Mode(4, [8, 16, 16]);
    _Mode.KANJI = new _Mode(8, [8, 10, 12]);
    _Mode.ECI = new _Mode(7, [0, 0, 0]);
    QrSegment2.Mode = _Mode;
  })(qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));
var qrcodegen_default = qrcodegen;
/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */
var ERROR_LEVEL_MAP = {
  L: qrcodegen_default.QrCode.Ecc.LOW,
  M: qrcodegen_default.QrCode.Ecc.MEDIUM,
  Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
  H: qrcodegen_default.QrCode.Ecc.HIGH
};
var DEFAULT_SIZE = 128;
var DEFAULT_LEVEL = "L";
var DEFAULT_BGCOLOR = "#FFFFFF";
var DEFAULT_FGCOLOR = "#000000";
var DEFAULT_INCLUDEMARGIN = false;
var DEFAULT_MINVERSION = 1;
var SPEC_MARGIN_SIZE = 4;
var DEFAULT_MARGIN_SIZE = 0;
var DEFAULT_IMG_SCALE = 0.1;
function generatePath(modules, margin = 0) {
  const ops = [];
  modules.forEach(function(row, y) {
    let start = null;
    row.forEach(function(cell, x) {
      if (!cell && start !== null) {
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
        );
        start = null;
        return;
      }
      if (x === row.length - 1) {
        if (!cell) {
          return;
        }
        if (start === null) {
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`
          );
        }
        return;
      }
      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join("");
}
function excavateModules(modules, excavation) {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }
      return false;
    });
  });
}
function getImageSettings(cells, size, margin, imageSettings) {
  if (imageSettings == null) {
    return null;
  }
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
  const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;
  let excavation = null;
  if (imageSettings.excavate) {
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);
    let ceilW = Math.ceil(w + x - floorX);
    let ceilH = Math.ceil(h + y - floorY);
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
  }
  const crossOrigin = imageSettings.crossOrigin;
  return { x, y, h, w, excavation, opacity, crossOrigin };
}
function getMarginSize(includeMargin, marginSize) {
  if (marginSize != null) {
    return Math.max(Math.floor(marginSize), 0);
  }
  return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
}
function useQRCode({
  value,
  level,
  minVersion,
  includeMargin,
  marginSize,
  imageSettings,
  size,
  boostLevel
}) {
  let qrcode = React.useMemo(() => {
    const values = Array.isArray(value) ? value : [value];
    const segments = values.reduce((accum, v) => {
      accum.push(...qrcodegen_default.QrSegment.makeSegments(v));
      return accum;
    }, []);
    return qrcodegen_default.QrCode.encodeSegments(
      segments,
      ERROR_LEVEL_MAP[level],
      minVersion,
      void 0,
      void 0,
      boostLevel
    );
  }, [value, level, minVersion, boostLevel]);
  const { cells, margin, numCells, calculatedImageSettings } = React.useMemo(() => {
    let cells2 = qrcode.getModules();
    const margin2 = getMarginSize(includeMargin, marginSize);
    const numCells2 = cells2.length + margin2 * 2;
    const calculatedImageSettings2 = getImageSettings(
      cells2,
      size,
      margin2,
      imageSettings
    );
    return {
      cells: cells2,
      margin: margin2,
      numCells: numCells2,
      calculatedImageSettings: calculatedImageSettings2
    };
  }, [qrcode, size, imageSettings, includeMargin, marginSize]);
  return {
    qrcode,
    margin,
    cells,
    numCells,
    calculatedImageSettings
  };
}
var SUPPORTS_PATH2D = function() {
  try {
    new Path2D().addPath(new Path2D());
  } catch (e) {
    return false;
  }
  return true;
}();
var QRCodeCanvas = React.forwardRef(
  function QRCodeCanvas2(props, forwardedRef) {
    const _a = props, {
      value,
      size = DEFAULT_SIZE,
      level = DEFAULT_LEVEL,
      bgColor = DEFAULT_BGCOLOR,
      fgColor = DEFAULT_FGCOLOR,
      includeMargin = DEFAULT_INCLUDEMARGIN,
      minVersion = DEFAULT_MINVERSION,
      boostLevel,
      marginSize,
      imageSettings
    } = _a, extraProps = __objRest(_a, [
      "value",
      "size",
      "level",
      "bgColor",
      "fgColor",
      "includeMargin",
      "minVersion",
      "boostLevel",
      "marginSize",
      "imageSettings"
    ]);
    const _b = extraProps, { style } = _b, otherProps = __objRest(_b, ["style"]);
    const imgSrc = imageSettings == null ? void 0 : imageSettings.src;
    const _canvas = React.useRef(null);
    const _image = React.useRef(null);
    const setCanvasRef = React.useCallback(
      (node) => {
        _canvas.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );
    const [isImgLoaded, setIsImageLoaded] = React.useState(false);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
      value,
      level,
      minVersion,
      boostLevel,
      includeMargin,
      marginSize,
      imageSettings,
      size
    });
    React.useEffect(() => {
      if (_canvas.current != null) {
        const canvas = _canvas.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        let cellsToDraw = cells;
        const image = _image.current;
        const haveImageToRender = calculatedImageSettings != null && image !== null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;
        if (haveImageToRender) {
          if (calculatedImageSettings.excavation != null) {
            cellsToDraw = excavateModules(
              cells,
              calculatedImageSettings.excavation
            );
          }
        }
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.height = canvas.width = size * pixelRatio;
        const scale = size / numCells * pixelRatio;
        ctx.scale(scale, scale);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, numCells, numCells);
        ctx.fillStyle = fgColor;
        if (SUPPORTS_PATH2D) {
          ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
        } else {
          cells.forEach(function(row, rdx) {
            row.forEach(function(cell, cdx) {
              if (cell) {
                ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
              }
            });
          });
        }
        if (calculatedImageSettings) {
          ctx.globalAlpha = calculatedImageSettings.opacity;
        }
        if (haveImageToRender) {
          ctx.drawImage(
            image,
            calculatedImageSettings.x + margin,
            calculatedImageSettings.y + margin,
            calculatedImageSettings.w,
            calculatedImageSettings.h
          );
        }
      }
    });
    React.useEffect(() => {
      setIsImageLoaded(false);
    }, [imgSrc]);
    const canvasStyle = __spreadValues({ height: size, width: size }, style);
    let img = null;
    if (imgSrc != null) {
      img = /* @__PURE__ */ React.createElement(
        "img",
        {
          src: imgSrc,
          key: imgSrc,
          style: { display: "none" },
          onLoad: () => {
            setIsImageLoaded(true);
          },
          ref: _image,
          crossOrigin: calculatedImageSettings == null ? void 0 : calculatedImageSettings.crossOrigin
        }
      );
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "canvas",
      __spreadValues({
        style: canvasStyle,
        height: size,
        width: size,
        ref: setCanvasRef,
        role: "img"
      }, otherProps)
    ), img);
  }
);
QRCodeCanvas.displayName = "QRCodeCanvas";
var QRCodeSVG = React.forwardRef(
  function QRCodeSVG2(props, forwardedRef) {
    const _a = props, {
      value,
      size = DEFAULT_SIZE,
      level = DEFAULT_LEVEL,
      bgColor = DEFAULT_BGCOLOR,
      fgColor = DEFAULT_FGCOLOR,
      includeMargin = DEFAULT_INCLUDEMARGIN,
      minVersion = DEFAULT_MINVERSION,
      boostLevel,
      title,
      marginSize,
      imageSettings
    } = _a, otherProps = __objRest(_a, [
      "value",
      "size",
      "level",
      "bgColor",
      "fgColor",
      "includeMargin",
      "minVersion",
      "boostLevel",
      "title",
      "marginSize",
      "imageSettings"
    ]);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
      value,
      level,
      minVersion,
      boostLevel,
      includeMargin,
      marginSize,
      imageSettings,
      size
    });
    let cellsToDraw = cells;
    let image = null;
    if (imageSettings != null && calculatedImageSettings != null) {
      if (calculatedImageSettings.excavation != null) {
        cellsToDraw = excavateModules(
          cells,
          calculatedImageSettings.excavation
        );
      }
      image = /* @__PURE__ */ React.createElement(
        "image",
        {
          href: imageSettings.src,
          height: calculatedImageSettings.h,
          width: calculatedImageSettings.w,
          x: calculatedImageSettings.x + margin,
          y: calculatedImageSettings.y + margin,
          preserveAspectRatio: "none",
          opacity: calculatedImageSettings.opacity,
          crossOrigin: calculatedImageSettings.crossOrigin
        }
      );
    }
    const fgPath = generatePath(cellsToDraw, margin);
    return /* @__PURE__ */ React.createElement(
      "svg",
      __spreadValues({
        height: size,
        width: size,
        viewBox: `0 0 ${numCells} ${numCells}`,
        ref: forwardedRef,
        role: "img"
      }, otherProps),
      !!title && /* @__PURE__ */ React.createElement("title", null, title),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: bgColor,
          d: `M0,0 h${numCells}v${numCells}H0z`,
          shapeRendering: "crispEdges"
        }
      ),
      /* @__PURE__ */ React.createElement("path", { fill: fgColor, d: fgPath, shapeRendering: "crispEdges" }),
      image
    );
  }
);
QRCodeSVG.displayName = "QRCodeSVG";
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", "data-ocid": "access-requests-panel", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "access-requests-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Pending Requests" }),
        pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: pending.length })
      ] }),
      pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body py-2", children: "No pending requests." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: pending.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
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
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => resolveMutation.mutate({
                    requester: req.requester,
                    approved: false
                  }),
                  disabled: resolveMutation.isPending,
                  "data-ocid": "deny-request-btn",
                  "aria-label": "Deny access",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-destructive" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => resolveMutation.mutate({
                    requester: req.requester,
                    approved: true
                  }),
                  disabled: resolveMutation.isPending,
                  "data-ocid": "approve-request-btn",
                  "aria-label": "Approve access",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Approved Access" }),
        approved.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: approved.length })
      ] }),
      approved.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body py-2", children: "No approved users yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: approved.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
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
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => revokeMutation.mutate(req.requester),
                disabled: revokeMutation.isPending,
                "data-ocid": "revoke-access-btn",
                className: "text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 flex-shrink-0",
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
const RSVP_VARIANT = {
  [RsvpStatus.attending]: "default",
  [RsvpStatus.maybe]: "secondary",
  [RsvpStatus.notAttending]: "destructive"
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
      className: "flex items-center justify-between gap-3 py-3 border-b border-border last:border-0",
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
            className: "flex items-center gap-3 flex-1 min-w-0 text-left tap-target",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-9 h-9 flex-shrink-0", children: [
                (profile == null ? void 0 : profile.photo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AvatarImage,
                  {
                    src: profile.photo.getDirectURL(),
                    alt: profile.username
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-semibold text-sm bg-secondary text-secondary-foreground", children: profile ? profile.username.slice(0, 2).toUpperCase() : "?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-medium text-sm text-foreground truncate", children: profile ? `@${profile.username}` : "Loading…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: RSVP_VARIANT[attendee.rsvpStatus],
                    className: "w-fit text-xs mt-0.5",
                    "data-ocid": "rsvp-badge",
                    children: RSVP_LABELS[attendee.rsvpStatus]
                  }
                )
              ] })
            ]
          }
        ),
        !isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: isFollowingQuery.data ? "outline" : "ghost",
            onClick: () => followMutation.mutate(),
            disabled: followMutation.isPending || isFollowingQuery.isLoading,
            className: "tap-target flex-shrink-0",
            "data-ocid": "attendee-follow-btn",
            "aria-label": isFollowingQuery.data ? "Unfollow" : "Follow",
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-28 h-4 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-3 rounded" })
      ] })
    ] }, i)) });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", "data-ocid": "attendees-list", children: attendeesQuery.data.map((attendee) => {
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
  const qrPayload = attendanceInfo ? JSON.stringify({
    username: attendanceInfo.username,
    momentTitle: attendanceInfo.momentTitle,
    momentDate: formatTs(attendanceInfo.momentDate),
    rsvpTime: formatTs(attendanceInfo.rsvpTime),
    status: attendanceInfo.status
  }) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      ref: dialogRef,
      "aria-label": "Event Pass",
      onClose,
      className: "\n        fixed inset-0 m-auto p-0 w-full max-w-xs\n        rounded-2xl border border-border bg-card shadow-2xl\n        backdrop:bg-foreground/60 backdrop:backdrop-blur-sm\n        overflow-hidden\n      ",
      "data-ocid": "event-pass-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "aria-label": "Close event pass",
            className: "absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors",
            "data-ocid": "event-pass-close-button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary px-5 pt-6 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-primary-foreground text-lg leading-tight", children: "Event Pass" }),
          attendanceInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-primary-foreground/70 text-sm mt-0.5 truncate", children: attendanceInfo.momentTitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-6 flex flex-col items-center gap-4", children: [
          isLoading || isFetchingActor ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-[180px] h-[180px] rounded-lg" }) : !attendanceInfo || !qrPayload ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-[180px] h-[180px] rounded-lg bg-muted flex items-center justify-center",
              "data-ocid": "event-pass-error_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body text-center px-4", children: "Could not load attendance info." })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 bg-background rounded-xl border border-border",
              "data-ocid": "event-pass-qr-container",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                QRCodeSVG,
                {
                  value: qrPayload,
                  size: 180,
                  level: "M",
                  includeMargin: false,
                  className: "rounded"
                }
              )
            }
          ),
          attendanceInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-1 border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PassRow, { label: "Status", value: attendanceInfo.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PassRow, { label: "RSVP'd", value: formatTs(attendanceInfo.rsvpTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PassRow,
              {
                label: "Event date",
                value: formatTs(attendanceInfo.momentDate)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PassRow, { label: "User", value: `@${attendanceInfo.username}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-body text-center leading-snug", children: "Scan this QR code to verify attendance" })
        ] })
      ]
    }
  );
}
function PassRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body flex-shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-foreground font-medium text-right min-w-0 break-words", children: value })
  ] });
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
function MemoryMedia({
  blob,
  kind
}) {
  const url = blob.getDirectURL();
  const mediaKind = kind ?? MemoryMediaKind.image;
  if (mediaKind === MemoryMediaKind.video) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: url,
        controls: true,
        className: "mt-2 rounded-xl max-w-full max-h-56 w-full",
        preload: "metadata",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
      }
    );
  }
  if (mediaKind === MemoryMediaKind.audio) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "audio",
      {
        src: url,
        controls: true,
        className: "mt-2 w-full max-w-xs rounded-lg",
        preload: "metadata",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: url,
      alt: "Memory attachment",
      className: "mt-1.5 rounded-xl max-w-full max-h-48 object-cover",
      loading: "lazy"
    }
  );
}
function MemoryBubble({
  memory,
  isMine,
  onDelete,
  isDeleting
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
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
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-7 h-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] font-body bg-muted text-muted-foreground", children: getInitials(memory.authorDisplayName || memory.authorUsername) }) })
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
                    isMine ? "bg-foreground text-background rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
                  ].join(" "),
                  children: [
                    memory.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: memory.content }),
                    memory.mediaBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryMedia, { blob: memory.mediaBlob, kind: memory.mediaKind })
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-border", children: [
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
              className: "tap-target flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Refresh memories",
              "data-ocid": "memories-refresh-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `w-3.5 h-3.5 ${memoriesQuery.isFetching ? "animate-spin" : ""}`
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
            className: "flex-1 overflow-y-auto py-3 space-y-3 scroll-smooth",
            children: [
              hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleLoadMore,
                  disabled: memoriesQuery.isFetching,
                  className: "flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors tap-target",
                  "data-ocid": "memories-load-more-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }),
                    memoriesQuery.isFetching ? "Loading…" : "Load earlier"
                  ]
                }
              ) }),
              memoriesQuery.isLoading && allMemories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-muted-foreground" }) }),
              !memoriesQuery.isLoading && allMemories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-10 text-center",
                  "data-ocid": "memories-empty-state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-8 h-8 text-muted-foreground/40 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-muted-foreground", children: "No memories yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground/60 mt-0.5", children: "Be the first to share one!" })
                  ]
                }
              ),
              allMemories.map((memory) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                MemoryBubble,
                {
                  memory,
                  isMine: !!principal && memory.authorId.toText() === principal.toText(),
                  onDelete: (id) => deleteMutation.mutate(id),
                  isDeleting: deleteMutation.isPending
                },
                memory.id
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-t border-border pt-3 space-y-2",
            "data-ocid": "memories-compose",
            children: [
              isUploading && uploadProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 px-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-body text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reading file…" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    uploadProgress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-foreground transition-all duration-300",
                    style: { width: `${uploadProgress}%` }
                  }
                ) })
              ] }),
              !isUploading && pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-foreground truncate flex-1 min-w-0", children: pendingFile.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-body text-muted-foreground flex-shrink-0", children: [
                  (pendingFile.size / (1024 * 1024)).toFixed(1),
                  " MB",
                  pendingKind && ` · ${pendingKind}`
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
                    className: "flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors",
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
                    className: "flex-shrink-0 tap-target p-2 rounded-lg hover:bg-muted transition-colors mb-0.5 disabled:opacity-50",
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
                    className: "flex-1 min-h-[38px] max-h-[120px] resize-none rounded-2xl border-border bg-muted/40 text-sm font-body px-3.5 py-2 focus:bg-card transition-colors",
                    "data-ocid": "memories-content-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "default",
                    onClick: handleSend,
                    disabled: postMutation.isPending || !canSend,
                    className: "flex-shrink-0 w-9 h-9 rounded-full mb-0.5",
                    "aria-label": "Send memory",
                    "data-ocid": "memories-send-btn",
                    children: postMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-body text-muted-foreground px-1", children: [
                "Images, videos & audio · Max ",
                MAX_FILE_SIZE_MB,
                " MB"
              ] })
            ]
          }
        )
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
  [MediaKind.image]: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-5 h-5" }),
  [MediaKind.video]: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-5 h-5" }),
  [MediaKind.audio]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-5 h-5" }),
  [MediaKind.document_]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" })
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
  folders,
  onClose,
  onDelete
}) {
  const overlayRef = reactExports.useRef(null);
  const { actor } = useBackend();
  const queryClient = useQueryClient();
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
    "dialog",
    {
      ref: overlayRef,
      "data-ocid": "media-detail-overlay",
      onClick: handleOverlayClick,
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      "aria-modal": "true",
      open: true,
      className: "fixed inset-0 z-50 m-0 p-0 w-full h-full max-w-none max-h-none bg-foreground/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 border-none",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-background w-full sm:max-w-2xl sm:rounded-xl overflow-hidden max-h-[96dvh] flex flex-col shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          role: "document",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1 font-body", children: [
                  KIND_ICONS[media.kind],
                  KIND_LABELS[media.kind]
                ] }),
                folder && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground font-body", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5" }),
                  folder.name
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "delete-media-btn",
                    variant: "ghost",
                    size: "icon",
                    className: "text-destructive hover:text-destructive hover:bg-destructive/10 tap-target",
                    onClick: () => onDelete(media),
                    "aria-label": "Delete media",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "close-media-modal-btn",
                    variant: "ghost",
                    size: "icon",
                    className: "tap-target",
                    onClick: onClose,
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 min-h-[200px] max-h-[50dvh]", children: [
              media.kind === MediaKind.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: mediaUrl,
                  alt: media.filename,
                  className: "max-w-full max-h-full object-contain"
                }
              ),
              media.kind === MediaKind.video && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  src: mediaUrl,
                  controls: true,
                  className: "max-w-full max-h-full",
                  playsInline: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
                }
              ),
              media.kind === MediaKind.audio && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 p-8 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileAudio, { className: "w-10 h-10 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: mediaUrl, controls: true, className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }) })
              ] }),
              media.kind === MediaKind.document_ && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 p-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-10 h-10 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: mediaUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-sm font-body underline underline-offset-2 text-foreground hover:text-muted-foreground",
                    children: "Open document"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-3 overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-foreground break-words", children: media.filename }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: (uploaderProfile == null ? void 0 : uploaderProfile.username) ?? "Unknown" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: formatDate$1(media.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "like-media-btn",
                  onClick: handleToggleLike,
                  className: `
                flex items-center gap-2 text-sm font-body transition-smooth tap-target
                px-3 py-1.5 rounded-full border
                ${hasLiked ? "bg-foreground text-background border-foreground" : "text-foreground border-border hover:bg-muted"}
              `,
                  "aria-label": hasLiked ? "Unlike" : "Like",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${hasLiked ? "fill-current" : ""}` }),
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
        className: `
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium
          transition-smooth tap-target border
          ${selected ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:bg-muted"}
          ${isOwner && !folder.isDefault ? "pr-2" : ""}
        `,
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
              className: `
              ml-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
              transition-colors hover:bg-muted/60
              ${selected ? "text-background/70 hover:bg-background/20" : "text-muted-foreground"}
            `,
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-lg shadow-lg min-w-[140px] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "delete-folder-menu-btn",
          onClick: () => {
            setMenuOpen(false);
            onDelete(folder);
          },
          className: "w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 flex-shrink-0" }),
            "Delete folder"
          ]
        }
      ) })
    ] })
  ] });
}
function MomentMediaTab({ momentId, isOwner }) {
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
          className: `
            flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium
            transition-smooth tap-target border
            ${selectedFolderId === null ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:bg-muted"}
          `,
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
          className: "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-smooth tap-target",
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
        className: "flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
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
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: !newFolderName.trim() || createFolderMutation.isPending,
              className: "h-7 text-xs tap-target",
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
              className: "w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ]
      }
    ),
    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "upload-media-btn",
          variant: "outline",
          size: "sm",
          onClick: () => {
            var _a2;
            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
          },
          disabled: isUploading,
          className: "gap-2 tap-target",
          children: [
            isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
            isUploading ? uploadProgress !== null ? `Uploading ${Math.round(uploadProgress)}%` : "Uploading…" : "Upload Media"
          ]
        }
      ),
      isUploading && uploadProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-foreground transition-all duration-300",
          style: { width: `${uploadProgress}%` }
        }
      ) })
    ] }),
    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body -mt-1", children: "Photos, videos & audio up to 50 MB · Documents up to 10 MB" }),
    isLoadingMedia ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: ["a", "b", "c", "d", "e", "f"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] rounded-lg" }, id)) }) : allItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Images,
        title: "No media yet",
        description: isOwner ? "Upload your first photo, video, or file to this moment." : "No media has been added to this moment yet.",
        action: isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "upload-media-empty-btn",
            variant: "outline",
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "gap-2 tap-target",
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
        Button,
        {
          "data-ocid": "load-more-btn",
          variant: "outline",
          size: "sm",
          onClick: () => activeQuery.fetchNextPage(),
          disabled: activeQuery.isFetchingNextPage,
          className: "gap-2 tap-target",
          children: [
            activeQuery.isFetchingNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : null,
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
        description: `Delete "${deleteFolderTarget == null ? void 0 : deleteFolderTarget.name}"? All media in this folder will be moved to the default folder.`,
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
      const msg = err.message || "Failed to request access, please try again";
      setInlineError(msg);
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted", children: [
          moment.coverImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: moment.coverImage.getDirectURL(),
              alt: moment.title,
              className: "w-full h-full object-cover",
              style: {
                filter: "brightness(0.35) blur(2px)",
                transform: "scale(1.05)"
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-display font-semibold text-lg leading-tight drop-shadow-md", children: moment.title }),
            ownerUsername && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70 text-sm font-body drop-shadow-sm", children: [
              "by @",
              ownerUsername
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-2 pb-2", children: requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-2",
            "data-ocid": "access-request-sent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-medium", children: "Access request sent!" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "The owner will review your request." })
            ]
          }
        ) : status === AccessStatus.pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-body",
            "data-ocid": "access-pending-badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
              "Access Requested — Pending Approval"
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
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: handleRequestAccess,
              disabled: requestMutation.isPending,
              "data-ocid": "re-request-access-btn",
              className: "tap-target",
              children: requestMutation.isPending ? "Requesting…" : "Re-request Access"
            }
          )
        ] }) : !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "This is a private moment. Sign in to request access." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              "data-ocid": "sign-in-to-request-access-btn",
              className: "tap-target gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
                "Sign in to Request Access"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
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
            Button,
            {
              onClick: handleRequestAccess,
              disabled: requestMutation.isPending,
              "data-ocid": "request-access-btn",
              className: "tap-target",
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
    activeClass: "bg-foreground text-background border-foreground",
    inactiveClass: "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
  },
  {
    status: RsvpStatus.maybe,
    label: "Maybe",
    icon: CircleHelp,
    activeClass: "bg-muted text-foreground border-foreground",
    inactiveClass: "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
  },
  {
    status: RsvpStatus.notAttending,
    label: "Not Attending",
    icon: X,
    activeClass: "bg-destructive/10 text-destructive border-destructive",
    inactiveClass: "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
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
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: () => login(),
        disabled: isLoggingIn,
        className: "gap-2 tap-target font-body",
        "data-ocid": "rsvp-login-prompt",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3.5 h-3.5" }),
          isLoggingIn ? "Signing in…" : "Sign in to RSVP"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", "data-ocid": "rsvp-buttons", children: RSVP_OPTIONS.map(
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
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body font-medium transition-all tap-target",
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[16/9] rounded-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
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
      className: "rounded-xl border border-border bg-card p-4 space-y-3",
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
            className: "w-full gap-2 transition-colors",
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
              className: "tap-target w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-sm",
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
          qrOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex justify-center p-4 bg-background rounded-lg border border-border",
              "data-ocid": "qr-code-container",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                QRCodeSVG,
                {
                  value: shareUrl,
                  size: 160,
                  level: "M",
                  includeMargin: false,
                  className: "rounded"
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function MomentDetailContent({ momentId }) {
  var _a;
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const [showEventPass, setShowEventPass] = reactExports.useState(false);
  const { data: moment, isLoading } = useQuery({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      const effectiveActor = actor ? actor : await createActorWithConfig(createActor);
      return effectiveActor.getMomentDetail(momentId);
    },
    // Always enabled — getMomentDetail is a public query that anonymous
    // principals can call. The actor is never null after the fallback above.
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthGuard, { requireAuth: false, currentPath: `/moments/${momentId}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MomentDetailSkeleton, {}) : !moment ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    ) }) : !hasAccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleBack,
          className: "tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1",
          "aria-label": "Back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Back" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateMomentPreview, { moment })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleBack,
          className: "tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1",
          "data-ocid": "moment-back-btn",
          "aria-label": "Back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Back" })
          ]
        }
      ),
      coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: coverUrl,
          alt: moment.title,
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground leading-tight flex-1 min-w-0", children: moment.title }),
          moment.isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => navigate({
                to: "/moments/$momentId/edit",
                params: { momentId }
              }),
              className: "flex-shrink-0 tap-target",
              "data-ocid": "edit-moment-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5 mr-1" }),
                "Edit"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: isPrivate ? "outline" : "secondary",
            className: "flex items-center gap-1 w-fit",
            children: [
              isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
              isPrivate ? "Private" : "Public"
            ]
          }
        ),
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
                className: "rounded-lg overflow-hidden border border-border",
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
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2 uppercase tracking-wide", children: "Your RSVP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RsvpButton, { momentId })
        ] }),
        isAttending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowEventPass(true),
            className: "w-full gap-2 tap-target",
            "data-ocid": "event-pass-open_modal_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-4 h-4" }),
              "Your Event Pass"
            ]
          }
        ) })
      ] }),
      showShare && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareSection, { momentId: moment.id }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Tabs,
        {
          defaultValue: isAttending ? "memories" : "media",
          className: "mt-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsList,
              {
                className: `w-full grid bg-muted/50 ${isAttending && showAccessTab ? "grid-cols-4" : isAttending || showAccessTab ? "grid-cols-3" : "grid-cols-2"}`,
                "data-ocid": "moment-tabs",
                children: [
                  isAttending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "memories",
                      className: "font-body text-xs gap-1.5",
                      "data-ocid": "moment-tab-memories",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "w-3.5 h-3.5" }),
                        "Memories"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "media",
                      className: "font-body text-xs gap-1.5",
                      "data-ocid": "moment-tab-media",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "w-3.5 h-3.5" }),
                        "Media"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "people",
                      className: "font-body text-xs gap-1.5",
                      "data-ocid": "moment-tab-people",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                        "People"
                      ]
                    }
                  ),
                  showAccessTab && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "access",
                      className: "font-body text-xs gap-1.5",
                      "data-ocid": "moment-tab-access",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                        "Access"
                      ]
                    }
                  )
                ]
              }
            ),
            isAttending && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "memories", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoriesTab, { momentId: moment.id }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "media", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MomentMediaTab, { momentId: moment.id, isOwner: moment.isOwner }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "people", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AttendeesTab, { momentId }) }),
            showAccessTab && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "access", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccessRequestsPanel, { momentId: moment.id }) })
          ]
        }
      )
    ] }) }),
    showEventPass && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EventPassModal,
      {
        momentId,
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
