import { h as useParams, a as useBackend, c as useNavigate, d as useQueryClient, r as reactExports, V as Visibility, R as RecurrenceFrequency, f as useQuery, e as useMutation, j as jsxRuntimeExports, Q as QUERY_KEYS, E as ExternalBlob } from "./index-CtLY6vs2.js";
import { S as Skeleton } from "./skeleton-DM4I-2Ld.js";
import { A as AuthGuard } from "./AuthGuard-DMUXLMEr.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DcfQYzk9.js";
import { L as Layout, S as Sparkles, A as AnimatePresence, P as Plus } from "./Layout--chq1LOo.js";
import { I as ImagePlus, L as LocationInput, T as Tag, A as ArrowRight } from "./LocationInput-iZJj8Sml.js";
import { i as isPrivateVisibility } from "./MomentCard-BN4hJRRA.js";
import { s as showError, a as showSuccess } from "./toast-pr95w7zI.js";
import { A as ArrowLeft } from "./arrow-left-D2oEGLC1.js";
import { T as Trash2 } from "./trash-2-CcAgwcGZ.js";
import { C as Calendar, G as Globe, L as Lock, M as MapPin } from "./map-pin-BZ9OY5eh.js";
import { C as CircleCheck } from "./circle-check-BN--EDMQ.js";
import { c as createLucideIcon, m as motion } from "./proxy-C4ENgEup.js";
import { U as Users } from "./users-Cc_IBNm5.js";
import { R as RefreshCw } from "./refresh-cw-D-Eb4WNx.js";
import { X } from "./x-ByUr0oC6.js";
import { A as AlarmClock, C as ChevronUp, a as ChevronDown } from "./chevron-up-D2orawq8.js";
import { U as Upload } from "./upload-Q6Ov63IK.js";
import "./index-DIX-OhXh.js";
import "./user-DWv8V36G.js";
import "./sun-Dp_dfXPb.js";
import "./search-_cZ3z0mp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function normalizeVisibility(v) {
  if (isPrivateVisibility(v)) return Visibility.private_;
  return Visibility.public_;
}
function dateToTimestamp(dateStr, timeStr) {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1000000n;
}
function tsToDateStr(ts) {
  return new Date(Number(ts / 1000000n)).toISOString().split("T")[0];
}
function tsToTimeStr(ts) {
  return new Date(Number(ts / 1000000n)).toTimeString().slice(0, 5);
}
const DAYS_OF_WEEK = [
  { label: "Mon", value: 1n },
  { label: "Tue", value: 2n },
  { label: "Wed", value: 3n },
  { label: "Thu", value: 4n },
  { label: "Fri", value: 5n },
  { label: "Sat", value: 6n },
  { label: "Sun", value: 0n }
];
const FREQUENCY_OPTIONS = [
  { label: "Daily", value: RecurrenceFrequency.daily },
  { label: "Weekly", value: RecurrenceFrequency.weekly },
  { label: "Monthly", value: RecurrenceFrequency.monthly },
  { label: "Yearly", value: RecurrenceFrequency.yearly }
];
function agendaFromBackend(items) {
  return items.map((item, i) => ({
    key: i + 1,
    time: item.time,
    title: item.title,
    description: item.description ?? ""
  }));
}
function buildRecurrenceRule(frequency, interval, daysOfWeek, endConditionType, endCount, endDate) {
  let endCondition;
  if (endConditionType === "count") {
    endCondition = { __kind__: "count", count: BigInt(endCount) };
  } else if (endConditionType === "endDate" && endDate) {
    endCondition = {
      __kind__: "endDate",
      endDate: BigInt(new Date(endDate).getTime()) * 1000000n
    };
  } else {
    endCondition = { __kind__: "never", never: null };
  }
  return {
    frequency,
    interval: BigInt(interval),
    daysOfWeek: frequency === RecurrenceFrequency.weekly ? daysOfWeek : [],
    endCondition
  };
}
const STEPS = [
  { number: 1, label: "Basics", icon: Sparkles },
  { number: 2, label: "When & Where", icon: Calendar },
  { number: 3, label: "Media & Tags", icon: ImagePlus }
];
const glassInput = "w-full h-12 px-4 rounded-xl font-body text-sm glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200";
const glassTextarea = "w-full px-4 py-3 rounded-xl font-body text-sm glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200 resize-none min-h-28";
function SectionLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-meta text-muted-foreground mb-3", children });
}
function EditFormSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
    ] })
  ] });
}
function AgendaEditor({
  items,
  onChange,
  nextKey,
  setNextKey
}) {
  const addItem = () => {
    onChange([
      ...items,
      { key: nextKey, time: "", title: "", description: "" }
    ]);
    setNextKey((k) => k + 1);
  };
  const removeItem = (key) => {
    onChange(items.filter((i) => i.key !== key));
  };
  const updateItem = (key, field, value) => {
    onChange(items.map((i) => i.key === key ? { ...i, [field]: value } : i));
  };
  const [expandedKeys, setExpandedKeys] = reactExports.useState(/* @__PURE__ */ new Set());
  const toggleExpand = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card rounded-xl border border-border overflow-hidden",
        "data-ocid": `agenda-item-row.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlarmClock, { className: "w-3.5 h-3.5 text-accent flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: item.time,
                onChange: (e) => updateItem(item.key, "time", e.target.value),
                placeholder: "7:00 PM",
                className: "w-20 h-8 px-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40",
                "aria-label": "Time",
                "data-ocid": `agenda-time-input.${i + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: item.title,
                onChange: (e) => updateItem(item.key, "title", e.target.value),
                placeholder: "e.g. Doors open",
                className: "flex-1 h-8 px-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40",
                "aria-label": "Title",
                "data-ocid": `agenda-title-input.${i + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleExpand(item.key),
                className: "w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0",
                "aria-label": "Toggle description",
                children: expandedKeys.has(item.key) ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeItem(item.key),
                className: "w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0",
                "aria-label": "Remove agenda item",
                "data-ocid": `agenda-remove-button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expandedKeys.has(item.key) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { height: 0, opacity: 0 },
              animate: { height: "auto", opacity: 1 },
              exit: { height: 0, opacity: 0 },
              transition: { duration: 0.2 },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: item.description,
                  onChange: (e) => updateItem(item.key, "description", e.target.value),
                  placeholder: "Optional description…",
                  rows: 2,
                  className: "w-full px-3 py-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none",
                  "data-ocid": `agenda-description-input.${i + 1}`
                }
              ) })
            }
          ) })
        ]
      },
      item.key
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: addItem,
        className: "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-accent/30 text-sm font-body text-accent hover:border-accent/60 hover:bg-accent/5 transition-all duration-200",
        "data-ocid": "agenda-add-button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "Add Agenda Item"
        ]
      }
    )
  ] });
}
function EditMomentPage() {
  const { momentId } = useParams({ from: "/moments/$momentId/edit" });
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [initialized, setInitialized] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(1);
  const [direction, setDirection] = reactExports.useState(1);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [locationLat, setLocationLat] = reactExports.useState(void 0);
  const [locationLng, setLocationLng] = reactExports.useState(void 0);
  const [date, setDate] = reactExports.useState("");
  const [time, setTime] = reactExports.useState("");
  const [visibility, setVisibility] = reactExports.useState(Visibility.public_);
  const [tags, setTags] = reactExports.useState([]);
  const [tagInput, setTagInput] = reactExports.useState("");
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = reactExports.useState(null);
  const [existingCoverBlob, setExistingCoverBlob] = reactExports.useState(null);
  const [maxAttendees, setMaxAttendees] = reactExports.useState("");
  const [isRecurring, setIsRecurring] = reactExports.useState(false);
  const [frequency, setFrequency] = reactExports.useState(
    RecurrenceFrequency.weekly
  );
  const [interval, setIntervalVal] = reactExports.useState(1);
  const [daysOfWeek, setDaysOfWeek] = reactExports.useState([]);
  const [endConditionType, setEndConditionType] = reactExports.useState("never");
  const [endCount, setEndCount] = reactExports.useState(10);
  const [endDate, setEndDate] = reactExports.useState("");
  const [agendaItems, setAgendaItems] = reactExports.useState([]);
  const [agendaNextKey, setAgendaNextKey] = reactExports.useState(100);
  const toggleDay = (val) => {
    setDaysOfWeek(
      (prev) => prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };
  const { data: moment, isLoading } = useQuery({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMomentDetail(momentId);
    },
    enabled: actor !== null
  });
  reactExports.useEffect(() => {
    if (moment && !initialized) {
      setTitle(moment.title);
      setDescription(moment.description);
      setLocation(moment.location);
      setLocationLat(moment.locationLat ?? void 0);
      setLocationLng(moment.locationLng ?? void 0);
      setDate(tsToDateStr(moment.eventDate));
      setTime(tsToTimeStr(moment.eventDate));
      setVisibility(normalizeVisibility(moment.visibility));
      setTags(moment.tags);
      setMaxAttendees(
        moment.maxAttendees ? moment.maxAttendees.toString() : ""
      );
      if (moment.coverImage) {
        setExistingCoverUrl(moment.coverImage.getDirectURL());
        setExistingCoverBlob(moment.coverImage);
      }
      if (moment.agendaItems.length > 0) {
        setAgendaItems(agendaFromBackend(moment.agendaItems));
        setAgendaNextKey(moment.agendaItems.length + 100);
      }
      if (moment.recurrence) {
        setIsRecurring(true);
        setFrequency(moment.recurrence.frequency);
        setIntervalVal(Number(moment.recurrence.interval));
        setDaysOfWeek(moment.recurrence.daysOfWeek);
        const ec = moment.recurrence.endCondition;
        if (ec.__kind__ === "count") {
          setEndConditionType("count");
          setEndCount(Number(ec.count));
        } else if (ec.__kind__ === "endDate") {
          setEndConditionType("endDate");
          setEndDate(tsToDateStr(ec.endDate));
        } else {
          setEndConditionType("never");
        }
      }
      setInitialized(true);
    }
  }, [moment, initialized]);
  const addTag = (raw) => {
    const val = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (val && !tags.includes(val) && tags.length < 10) {
      setTags((prev) => [...prev, val]);
    }
    setTagInput("");
  };
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };
  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));
  const handleCoverChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setExistingCoverUrl(null);
    setExistingCoverBlob(null);
  };
  const removeCover = () => {
    setCoverFile(null);
    setExistingCoverUrl(null);
    setExistingCoverBlob(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleLocationChange = (name, lat, lng) => {
    setLocation(name);
    setLocationLat(lat);
    setLocationLng(lng);
  };
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let coverImage;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverImage = ExternalBlob.fromBytes(bytes);
      } else if (existingCoverBlob) {
        coverImage = existingCoverBlob;
      }
      const recurrence = isRecurring ? buildRecurrenceRule(
        frequency,
        interval,
        daysOfWeek,
        endConditionType,
        endCount,
        endDate
      ) : void 0;
      const parsedMax = maxAttendees.trim() !== "" ? BigInt(maxAttendees) : void 0;
      await actor.updateMoment(momentId, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        locationLat: locationLat !== void 0 ? locationLat : void 0,
        locationLng: locationLng !== void 0 ? locationLng : void 0,
        eventDate: dateToTimestamp(date, time),
        tags,
        visibility,
        coverImage,
        recurrence,
        maxAttendees: parsedMax,
        agendaItems: agendaItems.filter((i) => i.title.trim()).map((i) => ({
          title: i.title.trim(),
          time: i.time.trim(),
          description: i.description.trim() || void 0
        }))
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(momentId)
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment updated!");
      navigate({ to: "/moments/$momentId", params: { momentId } });
    },
    onError: (err) => showError(err.message || "Failed to update moment")
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteMoment(momentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment deleted");
      navigate({ to: "/dashboard" });
    },
    onError: () => showError("Failed to delete moment")
  });
  const activeCoverUrl = coverPreview ?? existingCoverUrl;
  const canProceedStep1 = title.trim().length > 0;
  const canProceedStep2 = date.trim().length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2;
  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };
  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthGuard,
    {
      requireAuth: true,
      requireProfile: true,
      currentPath: `/moments/${momentId}/edit`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 pb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/moments/$momentId", params: { momentId } }),
                className: "tap-target flex items-center justify-center rounded-full w-10 h-10 glass-card hover:bg-accent/10 transition-colors",
                "aria-label": "Back",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight flex-1", children: "Edit Moment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowDeleteDialog(true),
                className: "tap-target flex items-center justify-center rounded-full w-10 h-10 glass-card hover:bg-destructive/10 transition-colors text-destructive",
                "aria-label": "Delete moment",
                "data-ocid": "edit-moment-delete-trigger",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5" })
              }
            )
          ] }),
          isLoading || !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditFormSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-8 glass-card rounded-2xl p-3", children: STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isDone = step > s.number;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (s.number < step) {
                        setDirection(-1);
                        setStep(s.number);
                      }
                    },
                    disabled: s.number > step,
                    className: `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${isActive ? "bg-accent text-accent-foreground" : isDone ? "bg-accent/20 text-accent cursor-pointer hover:bg-accent/30" : "text-muted-foreground cursor-default"}`,
                    "data-ocid": `edit-moment-step-${s.number}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 flex items-center justify-center", children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body font-semibold leading-none", children: s.label })
                    ]
                  }
                ),
                i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-4 h-0.5 mx-1 rounded-full transition-colors duration-300 ${step > s.number ? "bg-accent/50" : "bg-border"}`
                  }
                )
              ] }, s.number);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", custom: direction, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                custom: direction,
                variants,
                initial: "enter",
                animate: "center",
                exit: "exit",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [
                  step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Moment Title *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: title,
                          onChange: (e) => setTitle(e.target.value),
                          className: glassInput,
                          required: true,
                          "data-ocid": "edit-moment-title"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Description" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          value: description,
                          onChange: (e) => setDescription(e.target.value),
                          className: glassTextarea,
                          "data-ocid": "edit-moment-description"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                        "Max Attendees (optional)"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          value: maxAttendees,
                          min: 1,
                          onChange: (e) => setMaxAttendees(e.target.value),
                          placeholder: "Leave blank for unlimited",
                          className: glassInput,
                          "data-ocid": "edit-moment-max-attendees"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-1.5", children: "Once full, new RSVPs join a waitlist." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Visibility" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex rounded-xl overflow-hidden border border-white/20",
                          "data-ocid": "edit-moment-visibility",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => setVisibility(Visibility.public_),
                                className: `flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-all duration-200 tap-target ${visibility === Visibility.public_ ? "bg-accent text-accent-foreground shadow-lg" : "text-muted-foreground hover:bg-accent/10"}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }),
                                  "Public"
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => setVisibility(Visibility.private_),
                                className: `flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-all duration-200 tap-target border-l border-white/20 ${visibility === Visibility.private_ ? "bg-accent text-accent-foreground shadow-lg" : "text-muted-foreground hover:bg-accent/10"}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                                  "Private"
                                ]
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-2", children: visibility === Visibility.public_ ? "Anyone can view this moment." : "Access requires your approval." })
                    ] })
                  ] }),
                  step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Date & Time" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-1.5", children: "Date *" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "date",
                              value: date,
                              onChange: (e) => setDate(e.target.value),
                              className: glassInput,
                              required: true,
                              "data-ocid": "edit-moment-date"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-1.5", children: "Time" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "time",
                              value: time,
                              onChange: (e) => setTime(e.target.value),
                              className: glassInput,
                              "data-ocid": "edit-moment-time"
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Location" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LocationInput,
                        {
                          id: "em-location",
                          value: location,
                          lat: locationLat,
                          lng: locationLng,
                          onChange: handleLocationChange,
                          "data-ocid": "edit-moment-location"
                        }
                      ),
                      locationLat !== void 0 && locationLng !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.p,
                        {
                          initial: { opacity: 0, y: -4 },
                          animate: { opacity: 1, y: 0 },
                          className: "text-xs text-accent font-body flex items-center gap-1 mt-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                            "Location pinned"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Recurring Event" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setIsRecurring((v) => !v),
                          className: `w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 tap-target ${isRecurring ? "border-accent/40 bg-accent/10" : "border-white/20 hover:bg-accent/5"}`,
                          "data-ocid": "edit-moment-recurring-toggle",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: `w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isRecurring ? "bg-accent text-accent-foreground" : "bg-muted"}`,
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-medium text-sm text-foreground", children: "Repeating moment" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: `w-11 rounded-full transition-colors duration-300 relative flex-shrink-0 ${isRecurring ? "bg-accent" : "bg-muted"}`,
                                style: { height: "24px" },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  motion.span,
                                  {
                                    layout: true,
                                    transition: {
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30
                                    },
                                    className: "absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm",
                                    style: { left: isRecurring ? "22px" : "2px" }
                                  }
                                )
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isRecurring && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          initial: { height: 0, opacity: 0 },
                          animate: { height: "auto", opacity: 1 },
                          exit: { height: 0, opacity: 0 },
                          transition: {
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                          },
                          className: "overflow-hidden",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 space-y-4", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-xl bg-accent/10 border border-accent/20 px-3 py-2.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-accent mt-0.5 flex-shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-body text-foreground leading-relaxed", children: [
                                "Saving will update",
                                " ",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "all future occurrences" }),
                                " of this recurring event."
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2", children: "Repeats" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "grid grid-cols-2 gap-1.5",
                                  "data-ocid": "edit-moment-frequency",
                                  children: FREQUENCY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => setFrequency(opt.value),
                                      className: `py-2.5 px-3 rounded-xl text-sm font-body font-medium transition-all duration-200 tap-target ${frequency === opt.value ? "bg-accent text-accent-foreground" : "glass-input text-muted-foreground hover:bg-accent/10"}`,
                                      "data-ocid": `edit-moment-freq-${opt.value}`,
                                      children: opt.label
                                    },
                                    opt.value
                                  ))
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Every" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "number",
                                  min: 1,
                                  max: 99,
                                  value: interval,
                                  onChange: (e) => setIntervalVal(
                                    Math.max(1, Number(e.target.value))
                                  ),
                                  className: "w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
                                  "data-ocid": "edit-moment-interval"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground font-body", children: [
                                frequency === RecurrenceFrequency.daily && "day(s)",
                                frequency === RecurrenceFrequency.weekly && "week(s)",
                                frequency === RecurrenceFrequency.monthly && "month(s)",
                                frequency === RecurrenceFrequency.yearly && "year(s)"
                              ] })
                            ] }),
                            frequency === RecurrenceFrequency.weekly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2", children: "On days" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "flex flex-wrap gap-1.5",
                                  "data-ocid": "edit-moment-days-of-week",
                                  children: DAYS_OF_WEEK.map((day) => {
                                    const checked = daysOfWeek.includes(
                                      day.value
                                    );
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => toggleDay(day.value),
                                        className: `w-10 h-10 rounded-full text-xs font-body font-semibold transition-all duration-200 tap-target ${checked ? "bg-accent text-accent-foreground" : "glass-input text-muted-foreground hover:bg-accent/10"}`,
                                        "data-ocid": `edit-moment-day-${day.label.toLowerCase()}`,
                                        children: day.label
                                      },
                                      day.label
                                    );
                                  })
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2", children: "Ends" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "space-y-2",
                                  "data-ocid": "edit-moment-end-condition",
                                  children: [
                                    {
                                      type: "never",
                                      label: "Never"
                                    },
                                    {
                                      type: "count",
                                      label: "After N occurrences"
                                    },
                                    {
                                      type: "endDate",
                                      label: "On a date"
                                    }
                                  ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "label",
                                    {
                                      htmlFor: `em-end-${opt.type}`,
                                      className: `flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${endConditionType === opt.type ? "bg-accent/10 border border-accent/30" : "border border-white/10 hover:bg-accent/5"}`,
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "div",
                                          {
                                            className: `w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 pointer-events-none transition-colors ${endConditionType === opt.type ? "border-accent bg-accent" : "border-muted-foreground"}`,
                                            children: endConditionType === opt.type && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-accent-foreground" })
                                          }
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: opt.label }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "input",
                                          {
                                            type: "radio",
                                            id: `em-end-${opt.type}`,
                                            checked: endConditionType === opt.type,
                                            onChange: () => setEndConditionType(opt.type),
                                            className: "sr-only",
                                            "data-ocid": `edit-moment-end-${opt.type}`
                                          }
                                        )
                                      ]
                                    },
                                    opt.type
                                  ))
                                }
                              ),
                              endConditionType === "count" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "input",
                                  {
                                    type: "number",
                                    min: 1,
                                    max: 999,
                                    value: endCount,
                                    onChange: (e) => setEndCount(
                                      Math.max(
                                        1,
                                        Number(e.target.value)
                                      )
                                    ),
                                    className: "w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
                                    "data-ocid": "edit-moment-end-count"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-body", children: "occurrences" })
                              ] }),
                              endConditionType === "endDate" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "date",
                                  value: endDate,
                                  onChange: (e) => setEndDate(e.target.value),
                                  className: `${glassInput} mt-2`,
                                  min: date,
                                  "data-ocid": "edit-moment-end-date"
                                }
                              )
                            ] })
                          ] })
                        }
                      ) })
                    ] })
                  ] }),
                  step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Cover Image" }),
                      activeCoverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          initial: { scale: 1.05, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.3 },
                          className: "relative rounded-xl overflow-hidden aspect-[16/9] bg-muted",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: activeCoverUrl,
                                alt: "Cover preview",
                                className: "w-full h-full object-cover"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: removeCover,
                                className: "absolute top-2 right-2 w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-destructive/20 transition-colors shadow",
                                "aria-label": "Remove cover image",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                              }
                            )
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            var _a;
                            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                          },
                          className: "w-full h-48 rounded-2xl border-2 border-dashed border-white/20 glass-card flex flex-col items-center justify-center gap-3 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200",
                          "data-ocid": "edit-moment-cover-upload",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.div,
                              {
                                animate: { y: [0, -8, 0] },
                                transition: {
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ImagePlus,
                                  {
                                    className: "w-7 h-7 text-accent",
                                    strokeWidth: 1.5
                                  }
                                ) })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-foreground", children: "Click to upload cover image" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground mt-0.5", children: "JPG, PNG, WEBP up to 10 MB" })
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          ref: fileInputRef,
                          type: "file",
                          accept: "image/*",
                          onChange: handleCoverChange,
                          className: "hidden",
                          "data-ocid": "edit-moment-file-input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }),
                        "Tags"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: tagInput,
                          onChange: (e) => setTagInput(e.target.value),
                          onKeyDown: handleTagKeyDown,
                          onBlur: () => tagInput && addTag(tagInput),
                          placeholder: "Type a tag and press Enter…",
                          className: glassInput,
                          "data-ocid": "edit-moment-tag-input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-1.5", children: "Press Enter or comma to add · Max 10 tags" }),
                      tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex flex-wrap gap-1.5 mt-3",
                          "data-ocid": "edit-moment-tags",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            motion.div,
                            {
                              initial: { scale: 0.6, opacity: 0 },
                              animate: { scale: 1, opacity: 1 },
                              exit: { scale: 0.6, opacity: 0 },
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                              },
                              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-accent/30 text-xs font-body font-medium text-accent",
                              children: [
                                "#",
                                tag,
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => removeTag(tag),
                                    className: "w-4 h-4 rounded-full hover:bg-accent/20 flex items-center justify-center transition-colors",
                                    "aria-label": `Remove tag ${tag}`,
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                                  }
                                )
                              ]
                            },
                            tag
                          )) })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlarmClock, { className: "w-3.5 h-3.5" }),
                        "Agenda / Schedule (optional)"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AgendaEditor,
                        {
                          items: agendaItems,
                          onChange: setAgendaItems,
                          nextKey: agendaNextKey,
                          setNextKey: setAgendaNextKey
                        }
                      )
                    ] })
                  ] })
                ]
              },
              step
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
              step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: goBack,
                  className: "flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl glass-card border border-white/20 font-body font-medium text-foreground hover:bg-accent/10 transition-all duration-200 tap-target",
                  "data-ocid": "edit-moment-back",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                    "Back"
                  ]
                }
              ),
              step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: goNext,
                  disabled: step === 1 ? !canProceedStep1 : !canProceedStep2,
                  className: "flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 disabled:opacity-40 transition-all duration-200 tap-target glow-accent-sm",
                  "data-ocid": "edit-moment-next",
                  children: [
                    "Next",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateMutation.mutate(),
                  disabled: updateMutation.isPending || !canSubmit,
                  className: "flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 disabled:opacity-40 transition-all duration-200 tap-target glow-accent-sm",
                  "data-ocid": "edit-moment-submit",
                  children: updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 animate-pulse" }),
                    "Saving…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                    "Save Changes"
                  ] })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmDialog,
          {
            open: showDeleteDialog,
            onOpenChange: setShowDeleteDialog,
            title: "Delete moment?",
            description: "This will permanently delete the moment and all its media. This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Keep it",
            destructive: true,
            onConfirm: () => deleteMutation.mutate()
          }
        )
      ] })
    }
  );
}
export {
  EditMomentPage
};
