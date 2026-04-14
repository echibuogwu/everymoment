import { g as useParams, a as useBackend, c as useNavigate, d as useQueryClient, r as reactExports, V as Visibility, f as useQuery, e as useMutation, j as jsxRuntimeExports, Q as QUERY_KEYS, E as ExternalBlob } from "./index-DlqwQ7hd.js";
import { L as Layout, B as Badge } from "./badge-D1wUDQ0J.js";
import { A as AuthGuard, B as Button } from "./AuthGuard-DwWnaabs.js";
import { I as Input } from "./input-BrwhUD3l.js";
import { L as Label } from "./label-B14GUBSn.js";
import { S as Skeleton } from "./skeleton-B1svKeA7.js";
import { T as Textarea } from "./textarea-C16VtlRM.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DZqtFNPh.js";
import { L as LocationInput, T as Tag, I as ImagePlus } from "./LocationInput-CXANYvK6.js";
import { i as isPrivateVisibility } from "./MomentCard-yEIYveNg.js";
import { s as showError, a as showSuccess } from "./toast-DzJ_e1Ax.js";
import { A as ArrowLeft } from "./arrow-left-C0BV-BdB.js";
import { T as Trash2 } from "./trash-2-9qTn1pjp.js";
import { G as Globe, L as Lock } from "./map-pin-CyFtcmKR.js";
import { X } from "./x-D53dYmLV.js";
import { U as Upload } from "./upload-BmQBa2NC.js";
import "./createLucideIcon-BUPz7SPw.js";
import "./sun-DHiVM1rX.js";
import "./search-C6FDed3b.js";
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
function EditFormSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" })
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
      if (moment.coverImage) {
        setExistingCoverUrl(moment.coverImage.getDirectURL());
        setExistingCoverBlob(moment.coverImage);
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
      await actor.updateMoment(momentId, {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthGuard,
    {
      requireAuth: true,
      requireProfile: true,
      currentPath: `/moments/${momentId}/edit`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/moments/$momentId", params: { momentId } }),
                className: "tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors",
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
                className: "tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-destructive/10 transition-colors text-destructive",
                "aria-label": "Delete moment",
                "data-ocid": "edit-moment-delete-trigger",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5" })
              }
            )
          ] }),
          isLoading || !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditFormSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                updateMutation.mutate();
              },
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "em-title", className: "font-body font-medium", children: [
                    "Title ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "em-title",
                      value: title,
                      onChange: (e) => setTitle(e.target.value),
                      className: "font-body tap-target",
                      required: true,
                      "data-ocid": "edit-moment-title"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "em-desc", className: "font-body font-medium", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "em-desc",
                      value: description,
                      onChange: (e) => setDescription(e.target.value),
                      className: "font-body resize-none min-h-24",
                      "data-ocid": "edit-moment-description"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "em-location", className: "font-body font-medium", children: "Location" }),
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
                  locationLat !== void 0 && locationLng !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-foreground inline-block" }),
                    "Location pinned"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "em-date", className: "font-body font-medium", children: [
                      "Date ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "em-date",
                        type: "date",
                        value: date,
                        onChange: (e) => setDate(e.target.value),
                        className: "font-body tap-target",
                        required: true,
                        "data-ocid": "edit-moment-date"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "em-time", className: "font-body font-medium", children: "Time" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "em-time",
                        type: "time",
                        value: time,
                        onChange: (e) => setTime(e.target.value),
                        className: "font-body tap-target",
                        "data-ocid": "edit-moment-time"
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
                      "data-ocid": "edit-moment-visibility",
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
                      htmlFor: "em-tags",
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
                      "data-ocid": "edit-moment-tags",
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
                      id: "em-tags",
                      value: tagInput,
                      onChange: (e) => setTagInput(e.target.value),
                      onKeyDown: handleTagKeyDown,
                      onBlur: () => tagInput && addTag(tagInput),
                      placeholder: "Type a tag and press Enter or comma…",
                      className: "font-body tap-target",
                      "data-ocid": "edit-moment-tag-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body font-medium", children: "Cover Image" }),
                  activeCoverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-lg overflow-hidden aspect-[16/9] bg-muted", children: [
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
                      "data-ocid": "edit-moment-cover-upload",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8", strokeWidth: 1.5 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Click to upload cover image" })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "lg",
                    className: "w-full tap-target font-body font-semibold",
                    disabled: updateMutation.isPending || !title.trim() || !date,
                    "data-ocid": "edit-moment-submit",
                    children: updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 animate-pulse" }),
                      "Saving…"
                    ] }) : "Save Changes"
                  }
                )
              ]
            }
          )
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
