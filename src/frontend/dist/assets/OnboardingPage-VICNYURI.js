import { r as reactExports, a as useBackend, d as useQueryClient, c as useNavigate, e as useMutation, j as jsxRuntimeExports, L as LoadingSpinner, Q as QUERY_KEYS, E as ExternalBlob } from "./index-CtLY6vs2.js";
import { I as Input } from "./input-2BuC702O.js";
import { L as Label } from "./label-OMLuZ2Yz.js";
import { A as AuthGuard } from "./AuthGuard-DMUXLMEr.js";
import { s as showError, a as showSuccess } from "./toast-pr95w7zI.js";
import { c as createLucideIcon, m as motion } from "./proxy-C4ENgEup.js";
import { C as CircleCheck } from "./circle-check-BN--EDMQ.js";
import { C as CircleX } from "./circle-x-CeJT0OfE.js";
import "./index-DIX-OhXh.js";
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
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode);
const USERNAME_REGEX = /^[a-z0-9_]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
function validateUsername(value) {
  if (value.length < MIN_LENGTH)
    return `At least ${MIN_LENGTH} characters required`;
  if (value.length > MAX_LENGTH)
    return `Maximum ${MAX_LENGTH} characters allowed`;
  if (!USERNAME_REGEX.test(value))
    return "Only letters, numbers, and underscores";
  return null;
}
function OnboardingPage() {
  const [username, setUsername] = reactExports.useState("");
  const [checking, setChecking] = reactExports.useState(false);
  const [available, setAvailable] = reactExports.useState(null);
  const [touched, setTouched] = reactExports.useState(false);
  const [photoPreview, setPhotoPreview] = reactExports.useState(null);
  const [photoFile, setPhotoFile] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const pendingCheckRef = reactExports.useRef(null);
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const localError = touched ? validateUsername(username) : null;
  const canSubmit = !localError && available === true && !checking && username.length >= MIN_LENGTH;
  const runAvailabilityCheck = reactExports.useCallback(
    async (value) => {
      if (!actor) return;
      const err = validateUsername(value);
      if (err) return;
      setChecking(true);
      setAvailable(null);
      try {
        const taken = await actor.isUsernameTaken(value);
        setAvailable(!taken);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    },
    [actor]
  );
  const checkUsername = (value) => {
    setTouched(true);
    const err = validateUsername(value);
    if (err) return;
    if (!actor) {
      pendingCheckRef.current = value;
      return;
    }
    pendingCheckRef.current = null;
    void runAvailabilityCheck(value);
  };
  reactExports.useEffect(() => {
    if (!actor) return;
    const pending = pendingCheckRef.current;
    if (!pending) return;
    pendingCheckRef.current = null;
    void runAvailabilityCheck(pending);
  }, [actor, runAvailabilityCheck]);
  const handleUsernameChange = (e) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(raw);
    setAvailable(null);
  };
  const handlePhotoChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please choose an image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      return setPhotoPreview((_a2 = ev.target) == null ? void 0 : _a2.result);
    };
    reader.readAsDataURL(file);
  };
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let photo;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        photo = ExternalBlob.fromBytes(bytes);
      }
      await actor.saveCallerUserProfile({
        username,
        photo,
        hideAttendingList: false,
        isPrivateProfile: false
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.callerProfile
      });
      showSuccess("Welcome to EveryMoment!");
      navigate({ to: "/dashboard" });
    },
    onError: () => showError("Failed to save profile. Please try again.")
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) saveMutation.mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, requireProfile: false, currentPath: "/onboarding", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen gradient-bg relative overflow-hidden flex flex-col",
      "data-ocid": "onboarding-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 overflow-hidden z-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-20 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-accent/15 blur-[90px] opacity-40" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative z-10 px-6 pt-8 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none", children: "EveryMoment" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "w-full max-w-xs",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { type: "spring", stiffness: 280, damping: 26 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2 mb-8", children: [0, 1, 2].map((dot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `rounded-full transition-all duration-300 ${dot === 0 ? "w-6 h-2 bg-accent glow-accent-sm" : "w-2 h-2 bg-muted/60"}`
                },
                dot
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-3xl p-7 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl tracking-tight text-gradient-accent", children: "Create your profile" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-relaxed", children: "Choose a username. Others will use it to find you." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.button,
                      {
                        type: "button",
                        "data-ocid": "photo-upload-btn",
                        onClick: () => {
                          var _a;
                          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                        },
                        className: "relative group w-20 h-20 rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "aria-label": photoPreview ? "Change profile photo" : "Upload profile photo",
                        whileTap: { scale: 0.95 },
                        whileHover: { scale: 1.04 },
                        transition: { type: "spring", stiffness: 400, damping: 20 },
                        children: [
                          photoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: photoPreview,
                              alt: "Profile preview",
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full glass-card flex items-center justify-center border-2 border-dashed border-accent/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-7 h-7 text-accent/70 group-hover:text-accent transition-colors duration-200" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 text-white" }) })
                        ]
                      }
                    ),
                    photoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: removePhoto,
                        className: "text-xs text-muted-foreground hover:text-destructive transition-colors duration-200 font-body underline underline-offset-2",
                        "aria-label": "Remove photo",
                        children: "Remove photo"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: "Optional profile photo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        accept: "image/*",
                        className: "sr-only",
                        "aria-label": "Upload profile photo",
                        "data-ocid": "photo-file-input",
                        onChange: handlePhotoChange
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "username",
                          className: "font-body font-medium text-sm",
                          children: "Username"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `text-[11px] font-mono tabular-nums ${username.length > MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`,
                          children: [
                            username.length,
                            "/",
                            MAX_LENGTH
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "username",
                          value: username,
                          placeholder: "e.g. janedoe_99",
                          autoComplete: "off",
                          autoCapitalize: "none",
                          spellCheck: false,
                          "data-ocid": "username-input",
                          "aria-describedby": "username-hint",
                          "aria-invalid": !!(touched && localError),
                          onChange: handleUsernameChange,
                          onBlur: () => checkUsername(username),
                          className: "font-body tap-target pr-8 glass-input rounded-xl border-white/20"
                        }
                      ),
                      username.length >= MIN_LENGTH && !localError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2.5 top-1/2 -translate-y-1/2", children: checking ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" }) : available === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheck,
                        {
                          className: "w-4 h-4 text-[oklch(var(--success))]",
                          "aria-hidden": "true"
                        }
                      ) : available === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleX,
                        {
                          className: "w-4 h-4 text-destructive",
                          "aria-hidden": "true"
                        }
                      ) : null })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        id: "username-hint",
                        className: `text-xs font-body min-h-[16px] ${touched && localError ? "text-destructive" : available === false ? "text-destructive" : available === true ? "text-[oklch(var(--success))]" : "text-muted-foreground"}`,
                        "data-ocid": "username-field-error",
                        children: touched && localError ? localError : checking ? "Checking availability…" : available === true ? `@${username} is available` : available === false ? "That username is already taken" : "Letters, numbers, and underscores only"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "submit",
                      disabled: !canSubmit || saveMutation.isPending,
                      "data-ocid": "save-profile-btn",
                      className: "w-full flex items-center justify-center gap-2.5 rounded-full px-5 py-3.5 font-body font-semibold text-sm min-h-[48px] text-white glow-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      style: {
                        background: canSubmit && !saveMutation.isPending ? "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.28 290))" : void 0
                      },
                      whileTap: { scale: canSubmit ? 0.96 : 1 },
                      whileHover: { scale: canSubmit ? 1.02 : 1 },
                      transition: { type: "spring", stiffness: 400, damping: 20 },
                      children: saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
                        "Saving…"
                      ] }) : "Get started →"
                    }
                  )
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 py-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-body", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline underline-offset-2 hover:text-foreground transition-colors duration-200",
              children: "Built with caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  ) });
}
export {
  OnboardingPage
};
