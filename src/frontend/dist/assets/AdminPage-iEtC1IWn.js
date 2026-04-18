import { j as jsxRuntimeExports, h as cn, r as reactExports, a as useBackend, i as useIsAdmin, d as useQueryClient, c as useNavigate, f as useQuery, e as useMutation, M as MediaKind, A as AccessStatus, V as Visibility, Q as QUERY_KEYS, k as useAdminBulkImportMoments } from "./index-CqHW4ujE.js";
import { X, u as useDirection, d as useControllableState, e as Primitive, f as useId, R as Root$1, I as Item, g as composeEventHandlers, h as Presence, i as createRovingFocusGroupScope, j as createContextScope, L as Layout, B as Button, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./Layout-BTHeHKiQ.js";
import { I as Image, F as FileText, B as Badge } from "./badge-CyW9Nxl8.js";
import { R as Root, a as Content$1, b as Close, T as Title, P as Portal, O as Overlay, C as ConfirmDialog } from "./ConfirmDialog-CqDyVMpw.js";
import { S as Skeleton } from "./skeleton-DB5QWWmW.js";
import { A as AuthGuard } from "./AuthGuard-BAH2Huar.js";
import { E as EmptyState } from "./EmptyState-DuDUmbiJ.js";
import { s as showError, a as showSuccess } from "./toast-DhazfeYI.js";
import { c as createLucideIcon, m as motion } from "./proxy-DHxO4phe.js";
import { U as Users } from "./users-BgOmMkth.js";
import { T as Trash2 } from "./trash-2-CJwH5tCl.js";
import { U as Upload } from "./upload-exvwhlyb.js";
import { C as CircleX } from "./circle-x-BYhKB_zE.js";
import { C as CircleCheck } from "./circle-check-DJhRV0wI.js";
import "./user-DyEDxtSt.js";
import "./sun-BIK3o8tY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content$1,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root$1,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const MAX_CSV_BYTES = 10 * 1024 * 1024;
function formatDate(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function VisibilityBadge({ visibility }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: visibility === Visibility.private_ ? "text-muted-foreground border-border text-xs" : "text-xs border-border",
      children: visibility === Visibility.private_ ? "Private" : "Public"
    }
  );
}
function KindBadge({ kind }) {
  const labels = {
    [MediaKind.image]: "Image",
    [MediaKind.video]: "Video",
    [MediaKind.audio]: "Audio",
    [MediaKind.document_]: "Doc"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-mono capitalize", children: labels[kind] ?? kind });
}
function StatusBadge({ status }) {
  const map = {
    [AccessStatus.pending]: {
      label: "Pending",
      className: "bg-muted text-muted-foreground border-border"
    },
    [AccessStatus.approved]: {
      label: "Approved",
      className: "bg-[oklch(var(--success)/0.1)] text-[oklch(var(--success))] border-[oklch(var(--success)/0.3)]"
    },
    [AccessStatus.denied]: {
      label: "Denied",
      className: "bg-destructive/10 text-destructive border-destructive/30"
    },
    [AccessStatus.revoked]: {
      label: "Revoked",
      className: "bg-muted text-muted-foreground border-border"
    }
  };
  const { label, className } = map[status] ?? map[AccessStatus.pending];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs ${className}`, children: label });
}
function GlassStatCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-accent", strokeWidth: 1.5 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground leading-none", children: value !== void 0 ? value.toLocaleString() : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: label })
    ] })
  ] });
}
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}
function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const idx = (name) => headers.indexOf(name);
  return lines.slice(1).map((line, i) => {
    const rowIndex = i + 2;
    const cols = parseCsvLine(line);
    const get = (name) => {
      const index = idx(name);
      return index >= 0 ? (cols[index] ?? "").trim() : "";
    };
    const title = get("title");
    const description = get("description");
    const location = get("location");
    const locationLatRaw = get("locationlat");
    const locationLngRaw = get("locationlng");
    const startDate = get("startdate") || get("eventdate");
    const tags = get("tags");
    const coverImage = get("coverimage");
    const visibility = get("visibility");
    const errors = [];
    if (!title) errors.push("title is required");
    const locationLat = locationLatRaw ? Number.parseFloat(locationLatRaw) : void 0;
    const locationLng = locationLngRaw ? Number.parseFloat(locationLngRaw) : void 0;
    if (locationLatRaw && Number.isNaN(locationLat))
      errors.push("locationLat must be a number");
    if (locationLngRaw && Number.isNaN(locationLng))
      errors.push("locationLng must be a number");
    if (startDate && Number.isNaN(Date.parse(startDate)))
      errors.push("startDate must be a valid date (e.g. 2025-06-15T18:00:00Z)");
    if (visibility && !["public", "private"].includes(visibility.toLowerCase()))
      errors.push('visibility must be "public" or "private"');
    return {
      rowIndex,
      data: {
        title,
        description: description || void 0,
        location: location || void 0,
        locationLat: locationLat !== void 0 && !Number.isNaN(locationLat) ? locationLat : void 0,
        locationLng: locationLng !== void 0 && !Number.isNaN(locationLng) ? locationLng : void 0,
        startDate: startDate || void 0,
        tags: tags || void 0,
        coverImage: coverImage || void 0,
        visibility: visibility || void 0
      },
      errors
    };
  });
}
function CsvImportDialog({
  open,
  onOpenChange
}) {
  const fileRef = reactExports.useRef(null);
  const [phase, setPhase] = reactExports.useState("idle");
  const [parsedRows, setParsedRows] = reactExports.useState([]);
  const [progress, setProgress] = reactExports.useState({
    current: 0,
    total: 0
  });
  const [importResults, setImportResults] = reactExports.useState([]);
  const [fileError, setFileError] = reactExports.useState(null);
  const bulkImport = useAdminBulkImportMoments();
  const reset = reactExports.useCallback(() => {
    setPhase("idle");
    setParsedRows([]);
    setProgress({ current: 0, total: 0 });
    setImportResults([]);
    setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);
  const handleClose = () => {
    onOpenChange(false);
    reset();
  };
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setFileError(null);
    if (!file.name.endsWith(".csv")) {
      setFileError("Please select a .csv file.");
      return;
    }
    if (file.size > MAX_CSV_BYTES) {
      setFileError("File exceeds the 10 MB limit. Please use a smaller file.");
      return;
    }
    setPhase("validating");
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
      const rows = parseCsv(text);
      if (rows.length === 0) {
        setFileError(
          "No data rows found. Ensure the CSV has a header row and at least one data row."
        );
        setPhase("idle");
        return;
      }
      setParsedRows(rows);
      setPhase("selecting");
    };
    reader.readAsText(file);
  };
  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const invalidRows = parsedRows.filter((r) => r.errors.length > 0);
  const handleConfirmImport = async () => {
    setPhase("importing");
    setProgress({ current: 0, total: validRows.length });
    try {
      const results = await bulkImport.mutateAsync({
        rows: validRows.map((r) => r.data),
        onProgress: (current, total) => setProgress({ current, total })
      });
      setImportResults(results);
      setPhase("done");
      const successCount2 = results.filter((r) => r.success).length;
      if (successCount2 > 0) {
        showSuccess(
          `${successCount2} moment${successCount2 !== 1 ? "s" : ""} imported successfully.`
        );
      }
    } catch {
      showError("Import failed. Please try again.");
      setPhase("selecting");
    }
  };
  const successCount = importResults.filter((r) => r.success).length;
  const errorCount = importResults.filter((r) => !r.success).length;
  const warningCount = importResults.filter(
    (r) => r.success && r.warning
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md w-full glass-modal border-white/10",
      "data-ocid": "csv-import-dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 text-accent" }),
          "Import Moments from CSV"
        ] }) }),
        (phase === "idle" || phase === "validating") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground", children: "Upload a CSV file with moment data. Max file size: 10 MB." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-3 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs font-medium text-foreground", children: "Expected columns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5", children: [
              ["title", "Required"],
              ["description", "Optional"],
              ["location", "Optional"],
              ["locationLat", "Optional"],
              ["locationLng", "Optional"],
              ["startDate", "Optional — ISO 8601"],
              ["tags", "Optional — semicolon-sep."],
              ["coverImage", "Optional — URL"],
              ["visibility", "Optional — public/private"]
            ].map(([col, hint]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-foreground truncate", children: col }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate", children: hint })
            ] }, col)) })
          ] }),
          fileError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-destructive", children: fileError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "csv-file-input",
              className: "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 cursor-pointer transition-smooth p-6",
              "data-ocid": "csv-file-drop-zone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-6 h-6 text-accent", strokeWidth: 1.5 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm font-medium text-foreground", children: "Click to select CSV file" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: ".csv only · max 10 MB" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "csv-file-input",
                    ref: fileRef,
                    type: "file",
                    accept: ".csv",
                    className: "sr-only",
                    onChange: handleFileChange,
                    "data-ocid": "csv-file-input"
                  }
                )
              ]
            }
          )
        ] }),
        phase === "selecting" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[oklch(var(--success)/0.3)] bg-[oklch(var(--success)/0.05)] p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: validRows.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: [
                "valid row",
                validRows.length !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border p-3 text-center ${invalidRows.length > 0 ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-display font-bold text-2xl ${invalidRows.length > 0 ? "text-destructive" : "text-foreground"}`,
                      children: invalidRows.length
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: [
                    "row",
                    invalidRows.length !== 1 ? "s" : "",
                    " with errors"
                  ] })
                ]
              }
            )
          ] }),
          invalidRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/20 bg-destructive/5 divide-y divide-destructive/10 max-h-44 overflow-y-auto", children: invalidRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-2.5 flex items-start gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] font-medium text-destructive", children: [
                    "Row ",
                    r.rowIndex
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[11px] text-muted-foreground ml-1", children: r.errors.join("; ") })
                ] })
              ]
            },
            r.rowIndex
          )) }),
          validRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground text-center py-2", children: "No valid rows to import. Fix the errors above and re-upload." }),
          validRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground", children: invalidRows.length > 0 ? `Only the ${validRows.length} valid row${validRows.length !== 1 ? "s" : ""} will be imported.` : `All ${validRows.length} row${validRows.length !== 1 ? "s" : ""} passed validation.` })
        ] }),
        phase === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Upload,
            {
              className: "w-6 h-6 text-accent animate-pulse",
              strokeWidth: 1.5
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm font-medium text-foreground", children: [
            "Importing row ",
            progress.current,
            " of ",
            progress.total,
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full transition-all duration-200",
              style: {
                width: progress.total > 0 ? `${progress.current / progress.total * 100}%` : "0%",
                background: "linear-gradient(90deg, oklch(0.65 0.25 280), oklch(0.72 0.28 300))"
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground", children: "Please keep this window open" })
        ] }) }),
        phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[oklch(var(--success)/0.3)] bg-[oklch(var(--success)/0.05)] p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1.5 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-[oklch(var(--success))]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: successCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: "created" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border p-3 text-center ${errorCount > 0 ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`,
                children: [
                  errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1.5 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-display font-bold text-2xl ${errorCount > 0 ? "text-destructive" : "text-foreground"}`,
                      children: errorCount
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-0.5", children: "failed" })
                ]
              }
            )
          ] }),
          errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/20 bg-destructive/5 divide-y divide-destructive/10 max-h-40 overflow-y-auto", children: importResults.filter((r) => !r.success).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-2.5 flex items-start gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] font-medium text-destructive", children: [
                    "Row ",
                    r.rowIndex + 2
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-[11px] text-muted-foreground ml-1 truncate block", children: [
                    r.title,
                    ": ",
                    r.error ?? "Unknown error"
                  ] })
                ] })
              ]
            },
            r.rowIndex
          )) }),
          warningCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/5 divide-y divide-amber-500/10 max-h-40 overflow-y-auto", children: importResults.filter((r) => r.success && r.warning).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-2.5 flex items-start gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] font-medium text-amber-700", children: [
                    "Warning on row ",
                    r.rowIndex + 2
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-[11px] text-muted-foreground ml-1 truncate block", children: [
                    r.title,
                    ": ",
                    r.warning
                  ] })
                ] })
              ]
            },
            r.rowIndex
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2 sm:gap-0", children: phase === "idle" || phase === "validating" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: handleClose,
            "data-ocid": "csv-import-cancel-btn",
            children: "Cancel"
          }
        ) : phase === "selecting" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: reset,
              "data-ocid": "csv-import-back-btn",
              children: "Choose different file"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleConfirmImport,
              disabled: validRows.length === 0,
              "data-ocid": "csv-import-confirm-btn",
              className: "text-white",
              style: {
                background: "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.28 290))"
              },
              children: [
                "Import ",
                validRows.length,
                " moment",
                validRows.length !== 1 ? "s" : ""
              ]
            }
          )
        ] }) : phase === "importing" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", disabled: true, children: "Importing…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleClose, "data-ocid": "csv-import-done-btn", children: "Done" }) })
      ]
    }
  ) });
}
function AdminPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const { actor } = useBackend();
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [csvImportOpen, setCsvImportOpen] = reactExports.useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = reactExports.useState(false);
  const usersQuery = useQuery({
    queryKey: QUERY_KEYS.adminUsers,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: actor !== null && isAdmin
  });
  const momentsQuery = useQuery({
    queryKey: QUERY_KEYS.adminMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListMoments();
    },
    enabled: actor !== null && isAdmin
  });
  const mediaQuery = useQuery({
    queryKey: QUERY_KEYS.adminMedia,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListMedia();
    },
    enabled: actor !== null && isAdmin
  });
  const userMap = new Map(
    (usersQuery.data ?? []).map((u) => [u.id.toText(), u.username])
  );
  const accessRequestsQuery = useQuery({
    queryKey: ["adminAccessRequests"],
    queryFn: async () => {
      if (!actor || !momentsQuery.data) return [];
      const results = await Promise.all(
        momentsQuery.data.map(async (m) => {
          const reqs = await actor.listMomentAccessRequests(m.id);
          return reqs.map((r) => ({
            ...r,
            momentTitle: m.title,
            requesterUsername: userMap.get(r.requester.toText()) ?? `${r.requester.toText().slice(0, 8)}…`
          }));
        })
      );
      return results.flat();
    },
    enabled: actor !== null && isAdmin && momentsQuery.isSuccess && usersQuery.isSuccess
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !deleteTarget) throw new Error("Not connected");
      if (deleteTarget.type === "user")
        await actor.adminDeleteUser(deleteTarget.id);
      if (deleteTarget.type === "moment")
        await actor.adminDeleteMoment(deleteTarget.id);
      if (deleteTarget.type === "media")
        await actor.adminDeleteMedia(deleteTarget.id);
    },
    onSuccess: async () => {
      if (!deleteTarget) return;
      const keyMap = {
        user: QUERY_KEYS.adminUsers,
        moment: QUERY_KEYS.adminMoments,
        media: QUERY_KEYS.adminMedia
      };
      await queryClient.invalidateQueries({
        queryKey: keyMap[deleteTarget.type]
      });
      showSuccess(`${deleteTarget.label} deleted.`);
      setDeleteTarget(null);
    },
    onError: () => showError("Delete failed. Please try again.")
  });
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.adminDeleteAllMoments();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminMoments
      });
      showSuccess("All moments deleted.");
      setDeleteAllOpen(false);
    },
    onError: () => showError("Failed to delete all moments.")
  });
  const resolveMutation = useMutation({
    mutationFn: async ({
      momentId,
      requester,
      approved
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.resolveAccessRequest(momentId, requester, approved);
    },
    onSuccess: async (_, { approved }) => {
      await queryClient.invalidateQueries({
        queryKey: ["adminAccessRequests"]
      });
      showSuccess(approved ? "Access approved." : "Access denied.");
    },
    onError: () => showError("Failed to resolve request.")
  });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, currentPath: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-8 h-8 text-accent", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-lg text-foreground", children: "Admin access required" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground", children: "You do not have permission to view this page." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "mt-2",
          onClick: () => navigate({ to: "/dashboard" }),
          children: "Back to Dashboard"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, currentPath: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-6 max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "flex items-center gap-3",
          initial: { opacity: 0, y: -8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-accent", strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-gradient-accent leading-tight", children: "Admin Dashboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground", children: "Manage users, moments, and media" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", "data-ocid": "admin-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlassStatCard,
          {
            icon: Users,
            label: "Users",
            value: (_a = usersQuery.data) == null ? void 0 : _a.length
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlassStatCard,
          {
            icon: Layers,
            label: "Moments",
            value: (_b = momentsQuery.data) == null ? void 0 : _b.length
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlassStatCard,
          {
            icon: Image,
            label: "Media",
            value: (_c = mediaQuery.data) == null ? void 0 : _c.length
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "users", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsList,
          {
            className: "w-full glass-card rounded-2xl p-1 h-auto border-white/10",
            "data-ocid": "admin-tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "users",
                  className: "flex-1 gap-1 text-xs rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-none transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                    "Users"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "moments",
                  className: "flex-1 gap-1 text-xs rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-none transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
                    "Moments"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "media",
                  className: "flex-1 gap-1 text-xs rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-none transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3.5 h-3.5" }),
                    "Media"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "requests",
                  className: "flex-1 gap-1 text-xs rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-none transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5" }),
                    "Requests"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsContent,
          {
            value: "users",
            className: "mt-4 space-y-2",
            "data-ocid": "admin-users-tab",
            children: usersQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, {}) : ((_d = usersQuery.data) == null ? void 0 : _d.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Users, title: "No users yet" }) : (_e = usersQuery.data) == null ? void 0 : _e.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: idx * 0.04 },
                className: "glass-card rounded-xl p-3 flex items-center justify-between gap-3",
                "data-ocid": `admin-users-tab.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "flex items-center gap-3 min-w-0 flex-1 text-left",
                      onClick: () => navigate({
                        to: "/profile/$username",
                        params: { username: user.username }
                      }),
                      "data-ocid": "admin-user-row",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-9 h-9 flex-shrink-0", children: [
                          user.photo && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.photo.getDirectURL() }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-display font-semibold bg-accent/20 text-accent", children: user.username.slice(0, 2).toUpperCase() })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body font-medium text-sm text-foreground truncate", children: [
                            "@",
                            user.username
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground", children: [
                            "Joined ",
                            formatDate(user.createdAt)
                          ] })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl",
                      onClick: () => setDeleteTarget({
                        type: "user",
                        id: user.id,
                        label: `@${user.username}`
                      }),
                      "aria-label": `Delete user @${user.username}`,
                      "data-ocid": "admin-delete-user-btn",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ]
              },
              user.id.toText()
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsContent,
          {
            value: "moments",
            className: "mt-4 space-y-2",
            "data-ocid": "admin-moments-tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDeleteAllOpen(true),
                    "data-ocid": "admin-delete-all-moments-btn",
                    className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-medium text-white transition-smooth hover:opacity-90",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.54 0.18 22), oklch(0.48 0.22 15))",
                      boxShadow: "0 0 12px oklch(0.54 0.18 22 / 0.3)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      "Delete All"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: () => setCsvImportOpen(true),
                    "data-ocid": "admin-import-csv-btn",
                    className: "gap-1.5 text-xs rounded-xl text-white",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.28 290))"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                      "Import CSV"
                    ]
                  }
                )
              ] }),
              momentsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, {}) : ((_f = momentsQuery.data) == null ? void 0 : _f.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Layers, title: "No moments yet" }) : (_g = momentsQuery.data) == null ? void 0 : _g.map((moment, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx * 0.04 },
                  className: "glass-card rounded-xl p-3 flex items-center justify-between gap-3",
                  "data-ocid": `admin-moments-tab.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center gap-3 min-w-0 flex-1 text-left",
                        onClick: () => navigate({
                          to: "/moments/$momentId",
                          params: { momentId: moment.id.toString() }
                        }),
                        "data-ocid": "admin-moment-row",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden", children: moment.coverImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: moment.coverImage.getDirectURL(),
                              alt: moment.title,
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Layers,
                            {
                              className: "w-5 h-5 text-muted-foreground",
                              strokeWidth: 1.5
                            }
                          ) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground truncate", children: moment.title }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityBadge, { visibility: moment.visibility })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground truncate", children: [
                              userMap.get(moment.owner.toText()) ? `@${userMap.get(moment.owner.toText())}` : `${moment.owner.toText().slice(0, 12)}…`,
                              " ",
                              "· ",
                              formatDate(moment.createdAt)
                            ] })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl",
                        onClick: () => setDeleteTarget({
                          type: "moment",
                          id: moment.id,
                          label: moment.title
                        }),
                        "aria-label": `Delete moment ${moment.title}`,
                        "data-ocid": "admin-delete-moment-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ]
                },
                moment.id.toString()
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsContent,
          {
            value: "media",
            className: "mt-4 space-y-2",
            "data-ocid": "admin-media-tab",
            children: mediaQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, {}) : ((_h = mediaQuery.data) == null ? void 0 : _h.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Image, title: "No media yet" }) : (_i = mediaQuery.data) == null ? void 0 : _i.map((item, idx) => {
              var _a2;
              const moment = (_a2 = momentsQuery.data) == null ? void 0 : _a2.find(
                (m) => m.id === item.momentId
              );
              const uploader = userMap.get(item.uploadedBy.toText());
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx * 0.04 },
                  className: "glass-card rounded-xl p-3 flex items-center justify-between gap-3",
                  "data-ocid": `admin-media-tab.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden", children: item.kind === MediaKind.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: item.blob.getDirectURL(),
                          alt: item.filename,
                          className: "w-full h-full object-cover"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FileText,
                        {
                          className: "w-5 h-5 text-muted-foreground",
                          strokeWidth: 1.5
                        }
                      ) }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground truncate", children: item.filename }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(KindBadge, { kind: item.kind })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground truncate", children: [
                          (moment == null ? void 0 : moment.title) ?? "Unknown moment",
                          uploader ? ` · @${uploader}` : "",
                          " ·",
                          " ",
                          formatDate(item.createdAt)
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl",
                        onClick: () => setDeleteTarget({
                          type: "media",
                          id: item.id,
                          label: item.filename
                        }),
                        "aria-label": `Delete media ${item.filename}`,
                        "data-ocid": "admin-delete-media-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ]
                },
                item.id.toString()
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsContent,
          {
            value: "requests",
            className: "mt-4 space-y-2",
            "data-ocid": "admin-requests-tab",
            children: accessRequestsQuery.isLoading || momentsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, {}) : ((_j = accessRequestsQuery.data) == null ? void 0 : _j.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: FileText,
                title: "No access requests",
                description: "Access requests for private moments will appear here."
              }
            ) : (_k = accessRequestsQuery.data) == null ? void 0 : _k.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: i * 0.04 },
                className: "glass-card rounded-xl p-3 space-y-2",
                "data-ocid": "admin-request-row",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body font-medium text-sm text-foreground", children: [
                        "@",
                        req.requesterUsername
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-muted-foreground mt-0.5 truncate", children: [
                      req.momentTitle,
                      " · ",
                      formatDate(req.requestedAt)
                    ] })
                  ] }),
                  req.status === AccessStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "w-8 h-8 text-[oklch(var(--success))] hover:bg-[oklch(var(--success)/0.1)] rounded-xl",
                        onClick: () => resolveMutation.mutate({
                          momentId: req.momentId,
                          requester: req.requester,
                          approved: true
                        }),
                        "aria-label": "Approve access request",
                        "data-ocid": "admin-approve-request-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "w-8 h-8 text-destructive hover:bg-destructive/10 rounded-xl",
                        onClick: () => resolveMutation.mutate({
                          momentId: req.momentId,
                          requester: req.requester,
                          approved: false
                        }),
                        "aria-label": "Deny access request",
                        "data-ocid": "admin-deny-request-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" })
                      }
                    )
                  ] })
                ] })
              },
              `${req.requester.toText()}-${req.momentId.toString()}-${i}`
            ))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => {
          if (!open) setDeleteTarget(null);
        },
        title: `Delete ${(deleteTarget == null ? void 0 : deleteTarget.label) ?? "item"}?`,
        description: "This action cannot be undone and will permanently remove this item.",
        confirmLabel: "Delete",
        onConfirm: () => deleteMutation.mutate(),
        destructive: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: deleteAllOpen,
        onOpenChange: (open) => {
          if (!open) setDeleteAllOpen(false);
        },
        title: "Delete all moments?",
        description: "This will permanently delete every moment in the app. This action cannot be undone.",
        confirmLabel: "Delete All",
        onConfirm: () => deleteAllMutation.mutate(),
        destructive: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CsvImportDialog, { open: csvImportOpen, onOpenChange: setCsvImportOpen })
  ] }) });
}
function LoadingRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) });
}
export {
  AdminPage
};
