import { a as useBackend, c as useNavigate, d as useQueryClient, r as reactExports, V as Visibility, e as useMutation, j as jsxRuntimeExports, Q as QUERY_KEYS, E as ExternalBlob } from "./index-DlqwQ7hd.js";
import { L as Layout, B as Badge } from "./badge-D1wUDQ0J.js";
import { A as AuthGuard, B as Button } from "./AuthGuard-DwWnaabs.js";
import { I as Input } from "./input-BrwhUD3l.js";
import { L as Label } from "./label-B14GUBSn.js";
import { T as Textarea } from "./textarea-C16VtlRM.js";
import { L as LocationInput, T as Tag, I as ImagePlus } from "./LocationInput-CXANYvK6.js";
import { s as showError, a as showSuccess } from "./toast-DzJ_e1Ax.js";
import { A as ArrowLeft } from "./arrow-left-C0BV-BdB.js";
import { G as Globe, L as Lock } from "./map-pin-CyFtcmKR.js";
import { X } from "./x-D53dYmLV.js";
import { U as Upload } from "./upload-BmQBa2NC.js";
import "./createLucideIcon-BUPz7SPw.js";
import "./sun-DHiVM1rX.js";
import "./search-C6FDed3b.js";
function dateToTimestamp(dateStr, timeStr) {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1000000n;
}
function NewMomentPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
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
      return actor.createMoment({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        locationLat: locationLat !== void 0 ? locationLat : void 0,
        locationLng: locationLng !== void 0 ? locationLng : void 0,
        eventDate: dateToTimestamp(date, time),
        tags,
        visibility,
        coverImage
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
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, requireProfile: true, currentPath: "/moments/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/dashboard" }),
          className: "tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors",
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "New Moment" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "nm-title", className: "font-body font-medium", children: [
          "Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nm-title",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: "e.g. Sarah & Tom's Wedding",
            className: "font-body tap-target",
            required: true,
            "data-ocid": "new-moment-title"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nm-desc", className: "font-body font-medium", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "nm-desc",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Tell people what this moment is about…",
            className: "font-body resize-none min-h-24",
            "data-ocid": "new-moment-description"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nm-location", className: "font-body font-medium", children: "Location" }),
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
        locationLat !== void 0 && locationLng !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-foreground inline-block" }),
          "Location pinned"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "nm-date", className: "font-body font-medium", children: [
            "Date ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nm-date",
              type: "date",
              value: date,
              onChange: (e) => setDate(e.target.value),
              className: "font-body tap-target",
              required: true,
              "data-ocid": "new-moment-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nm-time", className: "font-body font-medium", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nm-time",
              type: "time",
              value: time,
              onChange: (e) => setTime(e.target.value),
              className: "font-body tap-target",
              "data-ocid": "new-moment-time"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body font-medium", children: "Visibility" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex rounded-lg overflow-hidden border border-border",
            "data-ocid": "new-moment-visibility",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setVisibility(Visibility.public_),
                  className: `flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-colors tap-target ${visibility === Visibility.public_ ? "bg-foreground text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
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
                  className: `flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-colors tap-target border-l border-border ${visibility === Visibility.private_ ? "bg-foreground text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                    "Private"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: visibility === Visibility.public_ ? "Anyone can view this moment." : "Access requires your approval." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "nm-tags",
            className: "font-body font-medium flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }),
              "Tags"
            ]
          }
        ),
        tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-wrap gap-1.5",
            "data-ocid": "new-moment-tags",
            children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "gap-1 pl-2 pr-1 py-0.5 font-body text-xs",
                children: [
                  "#",
                  tag,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeTag(tag),
                      className: "rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors",
                      "aria-label": `Remove tag ${tag}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              tag
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nm-tags",
            value: tagInput,
            onChange: (e) => setTagInput(e.target.value),
            onKeyDown: handleTagKeyDown,
            onBlur: () => tagInput && addTag(tagInput),
            placeholder: "Type a tag and press Enter or comma…",
            className: "font-body tap-target",
            "data-ocid": "new-moment-tag-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Press Enter or comma to add. Max 10 tags." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body font-medium", children: "Cover Image" }),
        coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-lg overflow-hidden aspect-[16/9] bg-muted", children: [
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
              className: "absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow",
              "aria-label": "Remove cover image",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            className: "w-full aspect-[16/9] rounded-lg border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors text-muted-foreground",
            "data-ocid": "new-moment-cover-upload",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Click to upload cover image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body", children: "JPG, PNG, WEBP up to 10 MB" })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          size: "lg",
          className: "w-full tap-target font-body font-semibold",
          disabled: mutation.isPending || !title.trim() || !date,
          "data-ocid": "new-moment-submit",
          children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 animate-pulse" }),
            "Creating…"
          ] }) : "Create Moment"
        }
      )
    ] })
  ] }) }) });
}
export {
  NewMomentPage
};
