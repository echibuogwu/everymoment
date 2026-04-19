import { a as useBackend, c as useNavigate, d as useQueryClient, r as reactExports, V as Visibility, R as RecurrenceFrequency, e as useMutation, j as jsxRuntimeExports, Q as QUERY_KEYS, E as ExternalBlob } from "./index-DXT1CttK.js";
import { A as AuthGuard } from "./AuthGuard-gfNxNNhB.js";
import { L as Layout, S as Sparkles, A as AnimatePresence, P as Plus } from "./Layout-DiYsrWyj.js";
import { I as ImagePlus, L as LocationInput, T as Tag, A as ArrowRight, C as ChevronDown } from "./LocationInput-C9hmptgX.js";
import { s as showError, a as showSuccess } from "./toast-XnL6fFhF.js";
import { A as ArrowLeft } from "./arrow-left-gmKIN_cV.js";
import { C as Calendar, G as Globe, L as Lock, M as MapPin } from "./map-pin-Dhjj-nbW.js";
import { C as CircleCheck } from "./circle-check-QE7bzDIx.js";
import { m as motion } from "./proxy-BmYmrhIs.js";
import { U as Users } from "./users-Dx63TV8c.js";
import { R as RefreshCw } from "./refresh-cw-hMIBzGt8.js";
import { X } from "./x-CSvcjth4.js";
import { A as AlarmClock, C as ChevronUp } from "./chevron-up-B53wVorS.js";
import { U as Upload } from "./upload-DhKExZrS.js";
import { T as Trash2 } from "./trash-2-DaGR6aRF.js";
import "./index-C1qqjek8.js";
import "./user--0LaG4fi.js";
import "./sun-BljhWh_d.js";
import "./search-Dfz3MFVk.js";
function dateToTimestamp(dateStr, timeStr) {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1000000n;
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
function AgendaEditor({ items, onChange }) {
  const [nextKey, setNextKey] = reactExports.useState(1);
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
function NewMomentPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
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
  const [maxAttendees, setMaxAttendees] = reactExports.useState("");
  const [momentEndDate, setMomentEndDate] = reactExports.useState("");
  const [isRecurring, setIsRecurring] = reactExports.useState(false);
  const [frequency, setFrequency] = reactExports.useState(
    RecurrenceFrequency.weekly
  );
  const [interval, setInterval] = reactExports.useState(1);
  const [daysOfWeek, setDaysOfWeek] = reactExports.useState([]);
  const [endConditionType, setEndConditionType] = reactExports.useState("never");
  const [endCount, setEndCount] = reactExports.useState(10);
  const [endDate, setEndDate] = reactExports.useState("");
  const [agendaItems, setAgendaItems] = reactExports.useState([]);
  const toggleDay = (val) => {
    setDaysOfWeek(
      (prev) => prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };
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
  };
  const removeCover = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleLocationChange = (name, lat, lng) => {
    setLocation(name);
    setLocationLat(lat);
    setLocationLng(lng);
  };
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let coverImage;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverImage = ExternalBlob.fromBytes(bytes);
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
      const parsedEndDate = momentEndDate.trim() !== "" ? BigInt(new Date(momentEndDate).getTime()) * 1000000n : void 0;
      return actor.createMoment({
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
        endDate: parsedEndDate,
        agendaItems: agendaItems.filter((i) => i.title.trim()).map((i) => {
          var _a;
          return {
            title: i.title.trim(),
            time: i.time.trim(),
            description: ((_a = i.description) == null ? void 0 : _a.trim()) || void 0
          };
        })
      });
    },
    onSuccess: async (momentId) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment created!");
      navigate({
        to: "/moments/$momentId",
        params: { momentId: momentId.toString() }
      });
    },
    onError: (err) => showError(err.message || "Failed to create moment")
  });
  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };
  const canProceedStep1 = title.trim().length > 0;
  const canProceedStep2 = date.trim().length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2;
  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, requireProfile: true, currentPath: "/moments/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/dashboard" }),
          className: "tap-target flex items-center justify-center rounded-full w-10 h-10 glass-card hover:bg-accent/10 transition-colors",
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "New Moment" })
    ] }),
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
            "data-ocid": `new-moment-step-${s.number}`,
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", custom: direction, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        custom: direction,
        variants,
        initial: "enter",
        animate: "center",
        exit: "exit",
        transition: { type: "spring", stiffness: 300, damping: 30 },
        children: [
          step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Moment Title *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  placeholder: "e.g. Sarah & Tom's Wedding",
                  className: glassInput,
                  required: true,
                  "data-ocid": "new-moment-title"
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
                  placeholder: "Tell people what this moment is about…",
                  className: glassTextarea,
                  "data-ocid": "new-moment-description"
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
                  "data-ocid": "new-moment-max-attendees"
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
                  "data-ocid": "new-moment-visibility",
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-1.5", children: "Start Date *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "date",
                      value: date,
                      onChange: (e) => setDate(e.target.value),
                      className: glassInput,
                      required: true,
                      "data-ocid": "new-moment-date"
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
                      "data-ocid": "new-moment-time"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-1.5", children: "End Date (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    value: momentEndDate,
                    min: date,
                    onChange: (e) => setMomentEndDate(e.target.value),
                    className: glassInput,
                    "data-ocid": "new-moment-end-date-field"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-1", children: "For multi-day events. Leave blank if single-day." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card rounded-2xl p-4 relative z-10",
                style: { overflow: "visible" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Location" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LocationInput,
                    {
                      id: "nm-location",
                      value: location,
                      lat: locationLat,
                      lng: locationLng,
                      onChange: handleLocationChange,
                      placeholder: "e.g. Central Park, New York",
                      "data-ocid": "new-moment-location"
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
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Recurring Event" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsRecurring((v) => !v),
                  className: `w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 tap-target ${isRecurring ? "border-accent/40 bg-accent/10" : "border-white/20 hover:bg-accent/5"}`,
                  "data-ocid": "new-moment-recurring-toggle",
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
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2", children: "Repeats" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "grid grid-cols-2 gap-1.5",
                          "data-ocid": "new-moment-frequency",
                          children: FREQUENCY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setFrequency(opt.value),
                              className: `py-2.5 px-3 rounded-xl text-sm font-body font-medium transition-all duration-200 tap-target ${frequency === opt.value ? "bg-accent text-accent-foreground" : "glass-input text-muted-foreground hover:bg-accent/10"}`,
                              "data-ocid": `new-moment-freq-${opt.value}`,
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
                          onChange: (e) => setInterval(
                            Math.max(1, Number(e.target.value))
                          ),
                          className: "w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
                          "data-ocid": "new-moment-interval"
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
                          "data-ocid": "new-moment-days-of-week",
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
                                "data-ocid": `new-moment-day-${day.label.toLowerCase()}`,
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
                          "data-ocid": "new-moment-end-condition",
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
                              htmlFor: `nm-end-${opt.type}`,
                              className: `flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${endConditionType === opt.type ? "bg-accent/10 border border-accent/30" : "border border-white/10 hover:bg-accent/5"}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: `w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors pointer-events-none ${endConditionType === opt.type ? "border-accent bg-accent" : "border-muted-foreground"}`,
                                    children: endConditionType === opt.type && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-accent-foreground" })
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: opt.label }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "input",
                                  {
                                    type: "radio",
                                    id: `nm-end-${opt.type}`,
                                    checked: endConditionType === opt.type,
                                    onChange: () => setEndConditionType(opt.type),
                                    className: "sr-only",
                                    "data-ocid": `new-moment-end-${opt.type}`
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
                              Math.max(1, Number(e.target.value))
                            ),
                            className: "w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
                            "data-ocid": "new-moment-end-count"
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
                          "data-ocid": "new-moment-end-date"
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
              coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                        src: coverPreview,
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
                  "data-ocid": "new-moment-cover-upload",
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
                  "data-ocid": "new-moment-file-input"
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
                  "data-ocid": "new-moment-tag-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-1.5", children: "Press Enter or comma to add · Max 10 tags" }),
              tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-wrap gap-1.5 mt-3",
                  "data-ocid": "new-moment-tags",
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
                  onChange: setAgendaItems
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
          "data-ocid": "new-moment-back",
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
          "data-ocid": "new-moment-next",
          children: [
            "Next",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => mutation.mutate(),
          disabled: mutation.isPending || !canSubmit,
          className: "flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 disabled:opacity-40 transition-all duration-200 tap-target glow-accent-sm",
          "data-ocid": "new-moment-submit",
          children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 animate-pulse" }),
            "Creating…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
            "Create Moment"
          ] })
        }
      )
    ] })
  ] }) }) });
}
export {
  NewMomentPage
};
