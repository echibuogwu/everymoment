import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  ImagePlus,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ExternalBlob, RecurrenceFrequency } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { LocationInput } from "../components/LocationInput";
import { useBackend } from "../hooks/use-backend";
import type { CreateMomentInputWithEndDate } from "../lib/patched-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type { RecurrenceRule } from "../types";
import { Visibility } from "../types";

function dateToTimestamp(dateStr: string, timeStr: string): bigint {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1_000_000n;
}

const DAYS_OF_WEEK = [
  { label: "Mon", value: 1n },
  { label: "Tue", value: 2n },
  { label: "Wed", value: 3n },
  { label: "Thu", value: 4n },
  { label: "Fri", value: 5n },
  { label: "Sat", value: 6n },
  { label: "Sun", value: 0n },
];

const FREQUENCY_OPTIONS = [
  { label: "Daily", value: RecurrenceFrequency.daily },
  { label: "Weekly", value: RecurrenceFrequency.weekly },
  { label: "Monthly", value: RecurrenceFrequency.monthly },
  { label: "Yearly", value: RecurrenceFrequency.yearly },
];

type EndConditionType = "never" | "count" | "endDate";

interface AgendaItemDraft {
  key: number;
  time: string;
  title: string;
  description: string;
}

function buildRecurrenceRule(
  frequency: RecurrenceFrequency,
  interval: number,
  daysOfWeek: bigint[],
  endConditionType: EndConditionType,
  endCount: number,
  endDate: string,
): RecurrenceRule {
  let endCondition: RecurrenceRule["endCondition"];
  if (endConditionType === "count") {
    endCondition = { __kind__: "count", count: BigInt(endCount) };
  } else if (endConditionType === "endDate" && endDate) {
    endCondition = {
      __kind__: "endDate",
      endDate: BigInt(new Date(endDate).getTime()) * 1_000_000n,
    };
  } else {
    endCondition = { __kind__: "never", never: null };
  }
  return {
    frequency,
    interval: BigInt(interval),
    daysOfWeek: frequency === RecurrenceFrequency.weekly ? daysOfWeek : [],
    endCondition,
  };
}

const STEPS = [
  { number: 1, label: "Basics", icon: Sparkles },
  { number: 2, label: "When & Where", icon: Calendar },
  { number: 3, label: "Media & Tags", icon: ImagePlus },
];

const glassInput =
  "w-full h-12 px-4 rounded-xl font-body text-sm glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200";

const glassTextarea =
  "w-full px-4 py-3 rounded-xl font-body text-sm glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200 resize-none min-h-28";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-meta text-muted-foreground mb-3">{children}</p>;
}

// ── Agenda Editor ──────────────────────────────────────────────────────────────

interface AgendaEditorProps {
  items: AgendaItemDraft[];
  onChange: (items: AgendaItemDraft[]) => void;
}

function AgendaEditor({ items, onChange }: AgendaEditorProps) {
  const [nextKey, setNextKey] = useState(1);

  const addItem = () => {
    onChange([
      ...items,
      { key: nextKey, time: "", title: "", description: "" },
    ]);
    setNextKey((k) => k + 1);
  };

  const removeItem = (key: number) => {
    onChange(items.filter((i) => i.key !== key));
  };

  const updateItem = (
    key: number,
    field: keyof Omit<AgendaItemDraft, "key">,
    value: string,
  ) => {
    onChange(items.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
  };

  const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());
  const toggleExpand = (key: number) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.key}
          className="glass-card rounded-xl border border-border overflow-hidden"
          data-ocid={`agenda-item-row.${i + 1}`}
        >
          <div className="flex items-center gap-2 p-3">
            <AlarmClock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <input
              value={item.time}
              onChange={(e) => updateItem(item.key, "time", e.target.value)}
              placeholder="7:00 PM"
              className="w-20 h-8 px-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              aria-label="Time"
              data-ocid={`agenda-time-input.${i + 1}`}
            />
            <input
              value={item.title}
              onChange={(e) => updateItem(item.key, "title", e.target.value)}
              placeholder="e.g. Doors open"
              className="flex-1 h-8 px-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              aria-label="Title"
              data-ocid={`agenda-title-input.${i + 1}`}
            />
            <button
              type="button"
              onClick={() => toggleExpand(item.key)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0"
              aria-label="Toggle description"
            >
              {expandedKeys.has(item.key) ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={() => removeItem(item.key)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0"
              aria-label="Remove agenda item"
              data-ocid={`agenda-remove-button.${i + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>

          <AnimatePresence>
            {expandedKeys.has(item.key) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3">
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.key, "description", e.target.value)
                    }
                    placeholder="Optional description…"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg font-body text-xs glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                    data-ocid={`agenda-description-input.${i + 1}`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-accent/30 text-sm font-body text-accent hover:border-accent/60 hover:bg-accent/5 transition-all duration-200"
        data-ocid="agenda-add-button"
      >
        <Plus className="w-4 h-4" />
        Add Agenda Item
      </button>
    </div>
  );
}

// ── NewMomentPage ─────────────────────────────────────────────────────────────

export function NewMomentPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | undefined>(undefined);
  const [locationLng, setLocationLng] = useState<number | undefined>(undefined);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.public_);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [maxAttendees, setMaxAttendees] = useState<string>("");
  const [momentEndDate, setMomentEndDate] = useState("");

  // Recurrence state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(
    RecurrenceFrequency.weekly,
  );
  const [interval, setInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState<bigint[]>([]);
  const [endConditionType, setEndConditionType] =
    useState<EndConditionType>("never");
  const [endCount, setEndCount] = useState(10);
  const [endDate, setEndDate] = useState("");

  // Agenda state
  const [agendaItems, setAgendaItems] = useState<AgendaItemDraft[]>([]);

  const toggleDay = (val: bigint) => {
    setDaysOfWeek((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val],
    );
  };

  const addTag = (raw: string) => {
    const val = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    if (val && !tags.includes(val) && tags.length < 10) {
      setTags((prev) => [...prev, val]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleLocationChange = (
    name: string,
    lat: number | undefined,
    lng: number | undefined,
  ) => {
    setLocation(name);
    setLocationLat(lat);
    setLocationLng(lng);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let coverImage: ExternalBlob | undefined;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverImage = ExternalBlob.fromBytes(bytes);
      }
      const recurrence = isRecurring
        ? buildRecurrenceRule(
            frequency,
            interval,
            daysOfWeek,
            endConditionType,
            endCount,
            endDate,
          )
        : undefined;

      const parsedMax =
        maxAttendees.trim() !== "" ? BigInt(maxAttendees) : undefined;

      const parsedEndDate =
        momentEndDate.trim() !== ""
          ? BigInt(new Date(momentEndDate).getTime()) * 1_000_000n
          : undefined;

      return (
        actor.createMoment as (
          input: CreateMomentInputWithEndDate,
        ) => Promise<string>
      )({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        locationLat: locationLat !== undefined ? locationLat : undefined,
        locationLng: locationLng !== undefined ? locationLng : undefined,
        eventDate: dateToTimestamp(date, time),
        tags,
        visibility,
        coverImage,
        recurrence,
        maxAttendees: parsedMax,
        endDate: parsedEndDate,
        agendaItems: agendaItems
          .filter((i) => i.title.trim())
          .map((i) => ({
            title: i.title.trim(),
            time: i.time.trim(),
            description: i.description?.trim() || undefined,
          })),
      });
    },
    onSuccess: async (momentId) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment created!");
      navigate({
        to: "/moments/$momentId",
        params: { momentId: momentId.toString() },
      });
    },
    onError: (err: Error) =>
      showError(err.message || "Failed to create moment"),
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
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <AuthGuard requireAuth requireProfile currentPath="/moments/new">
      <Layout>
        <div className="py-6 pb-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="tap-target flex items-center justify-center rounded-full w-10 h-10 glass-card hover:bg-accent/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              New Moment
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8 glass-card rounded-2xl p-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isDone = step > s.number;
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.number < step) {
                        setDirection(-1);
                        setStep(s.number);
                      }
                    }}
                    disabled={s.number > step}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : isDone
                          ? "bg-accent/20 text-accent cursor-pointer hover:bg-accent/30"
                          : "text-muted-foreground cursor-default"
                    }`}
                    data-ocid={`new-moment-step-${s.number}`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-body font-semibold leading-none">
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-4 h-0.5 mx-1 rounded-full transition-colors duration-300 ${step > s.number ? "bg-accent/50" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* ── STEP 1: Basics ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Moment Title *</SectionLabel>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Sarah & Tom's Wedding"
                        className={glassInput}
                        required
                        data-ocid="new-moment-title"
                      />
                    </div>

                    {/* Description */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Description</SectionLabel>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell people what this moment is about…"
                        className={glassTextarea}
                        data-ocid="new-moment-description"
                      />
                    </div>

                    {/* Max Attendees */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Max Attendees (optional)
                        </span>
                      </SectionLabel>
                      <input
                        type="number"
                        value={maxAttendees}
                        min={1}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                        placeholder="Leave blank for unlimited"
                        className={glassInput}
                        data-ocid="new-moment-max-attendees"
                      />
                      <p className="text-xs text-muted-foreground font-body mt-1.5">
                        Once full, new RSVPs join a waitlist.
                      </p>
                    </div>

                    {/* Visibility */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Visibility</SectionLabel>
                      <div
                        className="flex rounded-xl overflow-hidden border border-white/20"
                        data-ocid="new-moment-visibility"
                      >
                        <button
                          type="button"
                          onClick={() => setVisibility(Visibility.public_)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-all duration-200 tap-target ${
                            visibility === Visibility.public_
                              ? "bg-accent text-accent-foreground shadow-lg"
                              : "text-muted-foreground hover:bg-accent/10"
                          }`}
                        >
                          <Globe className="w-4 h-4" />
                          Public
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisibility(Visibility.private_)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-all duration-200 tap-target border-l border-white/20 ${
                            visibility === Visibility.private_
                              ? "bg-accent text-accent-foreground shadow-lg"
                              : "text-muted-foreground hover:bg-accent/10"
                          }`}
                        >
                          <Lock className="w-4 h-4" />
                          Private
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-2">
                        {visibility === Visibility.public_
                          ? "Anyone can view this moment."
                          : "Access requires your approval."}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: When & Where ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Date & Time</SectionLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground font-body mb-1.5">
                            Start Date *
                          </p>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={glassInput}
                            required
                            data-ocid="new-moment-date"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-body mb-1.5">
                            Time
                          </p>
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={glassInput}
                            data-ocid="new-moment-time"
                          />
                        </div>
                      </div>
                      {/* End Date */}
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground font-body mb-1.5">
                          End Date (optional)
                        </p>
                        <input
                          type="date"
                          value={momentEndDate}
                          min={date}
                          onChange={(e) => setMomentEndDate(e.target.value)}
                          className={glassInput}
                          data-ocid="new-moment-end-date-field"
                        />
                        <p className="text-xs text-muted-foreground font-body mt-1">
                          For multi-day events. Leave blank if single-day.
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div
                      className="glass-card rounded-2xl p-4 relative z-10"
                      style={{ overflow: "visible" }}
                    >
                      <SectionLabel>Location</SectionLabel>
                      <LocationInput
                        id="nm-location"
                        value={location}
                        lat={locationLat}
                        lng={locationLng}
                        onChange={handleLocationChange}
                        placeholder="e.g. Central Park, New York"
                        data-ocid="new-moment-location"
                      />
                      {locationLat !== undefined &&
                        locationLng !== undefined && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-accent font-body flex items-center gap-1 mt-2"
                          >
                            <MapPin className="w-3 h-3" />
                            Location pinned
                          </motion.p>
                        )}
                    </div>

                    {/* Recurring toggle */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Recurring Event</SectionLabel>
                      <button
                        type="button"
                        onClick={() => setIsRecurring((v) => !v)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 tap-target ${
                          isRecurring
                            ? "border-accent/40 bg-accent/10"
                            : "border-white/20 hover:bg-accent/5"
                        }`}
                        data-ocid="new-moment-recurring-toggle"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isRecurring ? "bg-accent text-accent-foreground" : "bg-muted"}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <span className="font-body font-medium text-sm text-foreground">
                            Repeating moment
                          </span>
                        </div>
                        <div
                          className={`w-11 rounded-full transition-colors duration-300 relative flex-shrink-0 ${isRecurring ? "bg-accent" : "bg-muted"}`}
                          style={{ height: "24px" }}
                        >
                          <motion.span
                            layout
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm"
                            style={{ left: isRecurring ? "22px" : "2px" }}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isRecurring && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-4">
                              {/* Frequency */}
                              <div>
                                <p className="text-xs text-muted-foreground font-body mb-2">
                                  Repeats
                                </p>
                                <div
                                  className="grid grid-cols-2 gap-1.5"
                                  data-ocid="new-moment-frequency"
                                >
                                  {FREQUENCY_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setFrequency(opt.value)}
                                      className={`py-2.5 px-3 rounded-xl text-sm font-body font-medium transition-all duration-200 tap-target ${
                                        frequency === opt.value
                                          ? "bg-accent text-accent-foreground"
                                          : "glass-input text-muted-foreground hover:bg-accent/10"
                                      }`}
                                      data-ocid={`new-moment-freq-${opt.value}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Interval */}
                              <div className="flex items-center gap-3">
                                <p className="text-xs text-muted-foreground font-body">
                                  Every
                                </p>
                                <input
                                  type="number"
                                  min={1}
                                  max={99}
                                  value={interval}
                                  onChange={(e) =>
                                    setInterval(
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                                  data-ocid="new-moment-interval"
                                />
                                <span className="text-sm text-muted-foreground font-body">
                                  {frequency === RecurrenceFrequency.daily &&
                                    "day(s)"}
                                  {frequency === RecurrenceFrequency.weekly &&
                                    "week(s)"}
                                  {frequency === RecurrenceFrequency.monthly &&
                                    "month(s)"}
                                  {frequency === RecurrenceFrequency.yearly &&
                                    "year(s)"}
                                </span>
                              </div>

                              {/* Days of week */}
                              {frequency === RecurrenceFrequency.weekly && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-body mb-2">
                                    On days
                                  </p>
                                  <div
                                    className="flex flex-wrap gap-1.5"
                                    data-ocid="new-moment-days-of-week"
                                  >
                                    {DAYS_OF_WEEK.map((day) => {
                                      const checked = daysOfWeek.includes(
                                        day.value,
                                      );
                                      return (
                                        <button
                                          key={day.label}
                                          type="button"
                                          onClick={() => toggleDay(day.value)}
                                          className={`w-10 h-10 rounded-full text-xs font-body font-semibold transition-all duration-200 tap-target ${
                                            checked
                                              ? "bg-accent text-accent-foreground"
                                              : "glass-input text-muted-foreground hover:bg-accent/10"
                                          }`}
                                          data-ocid={`new-moment-day-${day.label.toLowerCase()}`}
                                        >
                                          {day.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* End condition */}
                              <div>
                                <p className="text-xs text-muted-foreground font-body mb-2">
                                  Ends
                                </p>
                                <div
                                  className="space-y-2"
                                  data-ocid="new-moment-end-condition"
                                >
                                  {(
                                    [
                                      {
                                        type: "never" as const,
                                        label: "Never",
                                      },
                                      {
                                        type: "count" as const,
                                        label: "After N occurrences",
                                      },
                                      {
                                        type: "endDate" as const,
                                        label: "On a date",
                                      },
                                    ] as {
                                      type: EndConditionType;
                                      label: string;
                                    }[]
                                  ).map((opt) => (
                                    <label
                                      key={opt.type}
                                      htmlFor={`nm-end-${opt.type}`}
                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${endConditionType === opt.type ? "bg-accent/10 border border-accent/30" : "border border-white/10 hover:bg-accent/5"}`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors pointer-events-none ${endConditionType === opt.type ? "border-accent bg-accent" : "border-muted-foreground"}`}
                                      >
                                        {endConditionType === opt.type && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                                        )}
                                      </div>
                                      <span className="text-sm font-body text-foreground">
                                        {opt.label}
                                      </span>
                                      <input
                                        type="radio"
                                        id={`nm-end-${opt.type}`}
                                        checked={endConditionType === opt.type}
                                        onChange={() =>
                                          setEndConditionType(opt.type)
                                        }
                                        className="sr-only"
                                        data-ocid={`new-moment-end-${opt.type}`}
                                      />
                                    </label>
                                  ))}
                                </div>

                                {endConditionType === "count" && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <input
                                      type="number"
                                      min={1}
                                      max={999}
                                      value={endCount}
                                      onChange={(e) =>
                                        setEndCount(
                                          Math.max(1, Number(e.target.value)),
                                        )
                                      }
                                      className="w-20 h-10 px-3 rounded-xl font-body text-sm glass-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                                      data-ocid="new-moment-end-count"
                                    />
                                    <span className="text-sm text-muted-foreground font-body">
                                      occurrences
                                    </span>
                                  </div>
                                )}
                                {endConditionType === "endDate" && (
                                  <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={`${glassInput} mt-2`}
                                    min={date}
                                    data-ocid="new-moment-end-date"
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Media & Tags ── */}
                {step === 3 && (
                  <div className="space-y-4">
                    {/* Cover image */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>Cover Image</SectionLabel>
                      {coverPreview ? (
                        <motion.div
                          initial={{ scale: 1.05, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="relative rounded-xl overflow-hidden aspect-[16/9] bg-muted"
                        >
                          <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeCover}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-destructive/20 transition-colors shadow"
                            aria-label="Remove cover image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-48 rounded-2xl border-2 border-dashed border-white/20 glass-card flex flex-col items-center justify-center gap-3 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
                          data-ocid="new-moment-cover-upload"
                        >
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
                              <ImagePlus
                                className="w-7 h-7 text-accent"
                                strokeWidth={1.5}
                              />
                            </div>
                          </motion.div>
                          <div className="text-center">
                            <p className="text-sm font-body font-medium text-foreground">
                              Click to upload cover image
                            </p>
                            <p className="text-xs font-body text-muted-foreground mt-0.5">
                              JPG, PNG, WEBP up to 10 MB
                            </p>
                          </div>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                        data-ocid="new-moment-file-input"
                      />
                    </div>

                    {/* Tags */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Tags
                        </span>
                      </SectionLabel>

                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={() => tagInput && addTag(tagInput)}
                        placeholder="Type a tag and press Enter…"
                        className={glassInput}
                        data-ocid="new-moment-tag-input"
                      />
                      <p className="text-xs text-muted-foreground font-body mt-1.5">
                        Press Enter or comma to add · Max 10 tags
                      </p>

                      {tags.length > 0 && (
                        <div
                          className="flex flex-wrap gap-1.5 mt-3"
                          data-ocid="new-moment-tags"
                        >
                          <AnimatePresence>
                            {tags.map((tag) => (
                              <motion.div
                                key={tag}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 25,
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-accent/30 text-xs font-body font-medium text-accent"
                              >
                                #{tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="w-4 h-4 rounded-full hover:bg-accent/20 flex items-center justify-center transition-colors"
                                  aria-label={`Remove tag ${tag}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Agenda */}
                    <div className="glass-card rounded-2xl p-4">
                      <SectionLabel>
                        <span className="flex items-center gap-1.5">
                          <AlarmClock className="w-3.5 h-3.5" />
                          Agenda / Schedule (optional)
                        </span>
                      </SectionLabel>
                      <AgendaEditor
                        items={agendaItems}
                        onChange={setAgendaItems}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl glass-card border border-white/20 font-body font-medium text-foreground hover:bg-accent/10 transition-all duration-200 tap-target"
                data-ocid="new-moment-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 disabled:opacity-40 transition-all duration-200 tap-target glow-accent-sm"
                data-ocid="new-moment-next"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending || !canSubmit}
                className="flex-1 flex items-center justify-center gap-2 h-13 rounded-2xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 disabled:opacity-40 transition-all duration-200 tap-target glow-accent-sm"
                data-ocid="new-moment-submit"
              >
                {mutation.isPending ? (
                  <>
                    <Upload className="w-4 h-4 animate-pulse" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Moment
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
