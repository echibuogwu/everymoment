import { u as useAuth, g as useParams, a as useBackend, d as useQueryClient, c as useNavigate, r as reactExports, f as useQuery, Q as QUERY_KEYS, e as useMutation, j as jsxRuntimeExports, E as ExternalBlob } from "./index-CqHW4ujE.js";
import { L as Layout, a as Avatar, b as AvatarImage, c as AvatarFallback, B as Button, P as Plus, X } from "./Layout-BTHeHKiQ.js";
import { I as Input } from "./input-BP1S6uwD.js";
import { L as Label } from "./label-K0fgyMBE.js";
import { S as Skeleton } from "./skeleton-DB5QWWmW.js";
import { A as AuthGuard } from "./AuthGuard-BAH2Huar.js";
import { E as EmptyState } from "./EmptyState-DuDUmbiJ.js";
import { M as MomentCard } from "./MomentCard-CPRs-D8K.js";
import { s as showError, a as showSuccess } from "./toast-DhazfeYI.js";
import { u as useScroll, a as useTransform, U as UserMinus, b as UserPlus, L as LogIn, C as Check } from "./use-transform-TO4M05vm.js";
import { A as ArrowLeft } from "./arrow-left-B8wE4UoI.js";
import { c as createLucideIcon, m as motion } from "./proxy-DHxO4phe.js";
import { M as MapPin, C as Calendar } from "./map-pin-C-IuSehz.js";
import { T as Trash2 } from "./trash-2-CJwH5tCl.js";
import "./user-DyEDxtSt.js";
import "./sun-BIK3o8tY.js";
import "./users-BgOmMkth.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
function useRequireAuth() {
  const { isAuthenticated, login } = useAuth();
  return function requireAuth(action) {
    if (isAuthenticated) {
      action();
    } else {
      login();
    }
  };
}
let _uidCounter = 0;
const nextUid = () => `uid-${++_uidCounter}`;
function initEditState(user) {
  return {
    name: user.name ?? "",
    username: user.username,
    location: user.location ?? "",
    socials: user.socials ? user.socials.map((s) => ({ ...s, _uid: nextUid() })) : [],
    paymentDetails: user.paymentDetails ? user.paymentDetails.map((d) => ({ ...d, _uid: nextUid() })) : [],
    photoFile: null,
    photoPreview: null
  };
}
function SocialLinksView({ socials }) {
  if (!socials.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Socials" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: socials.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: s.url.startsWith("http") ? s.url : `https://${s.url}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "glass-card flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth group",
        "data-ocid": `profile.social.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3 text-muted-foreground group-hover:text-accent transition-smooth" })
        ]
      },
      `${s.name}-${i}`
    )) })
  ] });
}
function PaymentDetailsView({ details }) {
  if (!details.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Payment Details" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: details.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl",
        "data-ocid": `profile.payment.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono truncate max-w-[180px]", children: d.value })
        ]
      },
      `${d.name}-${i}`
    )) })
  ] });
}
function EditForm({
  state,
  onChange,
  onSave,
  onCancel,
  isSaving,
  currentUsername
}) {
  const { actor } = useBackend();
  const photoInputRef = reactExports.useRef(null);
  const [usernameError, setUsernameError] = reactExports.useState(null);
  const [checkingUsername, setCheckingUsername] = reactExports.useState(false);
  const set = reactExports.useCallback(
    (patch) => onChange({ ...state, ...patch }),
    [state, onChange]
  );
  const addSocial = () => {
    if (state.socials.length >= 5) return;
    set({
      socials: [...state.socials, { name: "", url: "", _uid: nextUid() }]
    });
  };
  const removeSocial = (i) => set({ socials: state.socials.filter((_, idx) => idx !== i) });
  const updateSocial = (i, field, value) => {
    const updated = state.socials.map(
      (s, idx) => idx === i ? { ...s, [field]: value } : s
    );
    set({ socials: updated });
  };
  const addPayment = () => {
    if (state.paymentDetails.length >= 10) return;
    set({
      paymentDetails: [
        ...state.paymentDetails,
        { name: "", value: "", _uid: nextUid() }
      ]
    });
  };
  const removePayment = (i) => set({ paymentDetails: state.paymentDetails.filter((_, idx) => idx !== i) });
  const updatePayment = (i, field, value) => {
    const updated = state.paymentDetails.map(
      (d, idx) => idx === i ? { ...d, [field]: value } : d
    );
    set({ paymentDetails: updated });
  };
  const handleUsernameBlur = async () => {
    const val = state.username.trim();
    if (!val || val === currentUsername) {
      setUsernameError(null);
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(val)) {
      setUsernameError("3–30 characters, letters, numbers, underscores only");
      return;
    }
    if (!actor) return;
    setCheckingUsername(true);
    try {
      const taken = await actor.isUsernameTaken(val);
      setUsernameError(taken ? "Username is already taken" : null);
    } catch {
      setUsernameError(null);
    } finally {
      setCheckingUsername(false);
    }
  };
  const handlePhotoChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    set({ photoFile: file, photoPreview: url });
  };
  const canSave = !usernameError && !checkingUsername && state.username.trim().length >= 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.34, 1.3, 0.64, 1] },
      className: "space-y-4 animate-slide-down",
      "data-ocid": "profile.edit_form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Profile Photo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-16 h-16 ring-2 ring-white/30 shadow-lg glow-accent-sm", children: [
              state.photoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: state.photoPreview, alt: "Preview" }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-bold text-xl bg-secondary text-secondary-foreground", children: state.username.slice(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    var _a;
                    return (_a = photoInputRef.current) == null ? void 0 : _a.click();
                  },
                  className: "glass-card border-white/20 tap-target",
                  "data-ocid": "profile.photo_upload_button",
                  children: "Change photo"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPG, PNG or WebP" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: photoInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handlePhotoChange,
                "data-ocid": "profile.photo_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Basic Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "edit-name",
                className: "text-sm font-medium text-foreground",
                children: "Display Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-name",
                value: state.name,
                onChange: (e) => set({ name: e.target.value }),
                placeholder: "Your name",
                className: "glass-input rounded-xl border-white/20 bg-transparent",
                "data-ocid": "profile.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "edit-username",
                className: "text-sm font-medium text-foreground",
                children: "Username"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-username",
                value: state.username,
                onChange: (e) => set({ username: e.target.value }),
                onBlur: handleUsernameBlur,
                placeholder: "username",
                className: "glass-input rounded-xl border-white/20 bg-transparent",
                "data-ocid": "profile.username_input"
              }
            ),
            usernameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "profile.username_field_error",
                children: usernameError
              }
            ),
            checkingUsername && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Checking…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "edit-location",
                className: "text-sm font-medium text-foreground",
                children: "Location"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-location",
                value: state.location,
                onChange: (e) => set({ location: e.target.value }),
                placeholder: "City, Country",
                className: "glass-input rounded-xl border-white/20 bg-transparent",
                "data-ocid": "profile.location_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Socials" }),
            state.socials.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addSocial,
                className: "flex items-center gap-1 px-3 py-1.5 glass-card rounded-full text-xs font-medium text-accent hover:ring-1 hover:ring-accent/40 transition-smooth",
                "data-ocid": "profile.add_social_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Add"
                ]
              }
            )
          ] }),
          state.socials.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-1", children: "No socials added yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: state.socials.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              "data-ocid": `profile.social_row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: s.name,
                    onChange: (e) => updateSocial(i, "name", e.target.value),
                    placeholder: "Platform",
                    className: "glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0",
                    "data-ocid": `profile.social_name.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: s.url,
                    onChange: (e) => updateSocial(i, "url", e.target.value),
                    placeholder: "URL",
                    className: "glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0",
                    "data-ocid": `profile.social_url.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeSocial(i),
                    className: "list-item-remove flex-shrink-0 text-destructive/70 hover:text-destructive",
                    "data-ocid": `profile.remove_social.${i + 1}`,
                    "aria-label": "Remove social",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ]
            },
            s._uid
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Payment Details" }),
            state.paymentDetails.length < 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addPayment,
                className: "flex items-center gap-1 px-3 py-1.5 glass-card rounded-full text-xs font-medium text-accent hover:ring-1 hover:ring-accent/40 transition-smooth",
                "data-ocid": "profile.add_payment_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Add"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add any payment method — PayPal, Revolut, Bitcoin, ETH wallet, etc." }),
          state.paymentDetails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-1", children: "No payment details added yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: state.paymentDetails.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              "data-ocid": `profile.payment_row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: d.name,
                    onChange: (e) => updatePayment(i, "name", e.target.value),
                    placeholder: "Type (e.g. Bitcoin)",
                    className: "glass-input rounded-xl border-white/20 bg-transparent flex-[0.6] min-w-0",
                    "data-ocid": `profile.payment_name.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: d.value,
                    onChange: (e) => updatePayment(i, "value", e.target.value),
                    placeholder: "Address / link / tag",
                    className: "glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0",
                    "data-ocid": `profile.payment_value.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removePayment(i),
                    className: "list-item-remove flex-shrink-0 text-destructive/70 hover:text-destructive",
                    "data-ocid": `profile.remove_payment.${i + 1}`,
                    "aria-label": "Remove payment detail",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ]
            },
            d._uid
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "flex-1",
              whileTap: { scale: 0.97 },
              transition: { type: "spring", stiffness: 500, damping: 30 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: onSave,
                  disabled: !canSave || isSaving,
                  className: "w-full tap-target rounded-2xl bg-accent text-accent-foreground hover:opacity-90",
                  "data-ocid": "profile.save_button",
                  children: isSaving ? "Saving…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-1.5" }),
                    " Save changes"
                  ] })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              whileTap: { scale: 0.97 },
              transition: { type: "spring", stiffness: 500, damping: 30 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: onCancel,
                  disabled: isSaving,
                  className: "tap-target glass-card border-white/20 rounded-2xl",
                  "data-ocid": "profile.cancel_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
                    " Cancel"
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 w-full animate-shimmer rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center -mt-12 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-full ring-4 ring-background" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-40 h-6 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-28 h-4 rounded-lg" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-16 rounded-2xl mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-10 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-10 rounded-xl" })
      ] })
    ] })
  ] });
}
function StatItem({
  value,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 flex-1 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent font-display font-bold text-lg leading-tight", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: label })
  ] });
}
function ProfilePage() {
  var _a, _b, _c;
  const { username } = useParams({ from: "/profile/$username" });
  const { actor } = useBackend();
  const { principal, isAuthenticated, isLoggingIn } = useAuth();
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editState, setEditState] = reactExports.useState(null);
  const heroRef = reactExports.useRef(null);
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 300], [0, 90]);
  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.userProfileByUsername(username),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfileByUsername(username);
    },
    enabled: actor !== null
  });
  const user = profileQuery.data ?? null;
  const isOwnProfile = !!user && !!principal && user.id.toText() === principal.toText();
  const momentsQuery = useQuery({
    queryKey: QUERY_KEYS.momentsForUser((user == null ? void 0 : user.id.toText()) ?? ""),
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getMomentsForUser(user.id);
    },
    enabled: !!actor && !!user
  });
  const isFollowingQuery = useQuery({
    queryKey: QUERY_KEYS.isFollowing((user == null ? void 0 : user.id.toText()) ?? ""),
    queryFn: async () => {
      if (!actor || !user || isOwnProfile) return false;
      return actor.isFollowingUser(user.id);
    },
    enabled: isAuthenticated && !!actor && !!user && !isOwnProfile
  });
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !user) throw new Error("Not connected");
      if (isFollowingQuery.data) {
        await actor.unfollowUser(user.id);
      } else {
        await actor.followUser(user.id);
      }
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.isFollowing(user.id.toText())
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfileByUsername(username)
      });
      showSuccess(isFollowingQuery.data ? "Unfollowed" : "Now following!");
    },
    onError: () => showError("Action failed. Try again.")
  });
  const saveMutation = useMutation({
    mutationFn: async (state) => {
      if (!actor) throw new Error("Not connected");
      const input = {
        username: state.username.trim(),
        name: state.name.trim() || void 0,
        location: state.location.trim() || void 0,
        socials: state.socials.filter((s) => s.name && s.url).length > 0 ? state.socials.filter((s) => s.name && s.url).map(({ name, url }) => ({ name, url })) : void 0,
        paymentDetails: state.paymentDetails.filter((d) => d.name && d.value).length > 0 ? state.paymentDetails.filter((d) => d.name && d.value).map(({ name, value }) => ({ name, value })) : void 0,
        photo: state.photoFile ? ExternalBlob.fromBytes(
          new Uint8Array(await state.photoFile.arrayBuffer())
        ) : void 0
      };
      await actor.saveCallerUserProfile(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfileByUsername(username)
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.callerProfile
      });
      setIsEditing(false);
      setEditState(null);
      showSuccess("Profile saved!");
    },
    onError: () => showError("Could not save profile. Try again.")
  });
  const handleEditStart = () => {
    if (!user) return;
    setEditState(initEditState(user));
    setIsEditing(true);
  };
  const handleSave = () => {
    if (editState) saveMutation.mutate(editState);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditState(null);
  };
  const avatarSrc = (user == null ? void 0 : user.photo) ? user.photo.getDirectURL() : void 0;
  const avatarFallback = ((user == null ? void 0 : user.username) ?? "??").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: false, currentPath: `/profile/${username}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/explore" }),
        className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target -ml-1",
        "data-ocid": "profile.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body", children: "Back" })
        ]
      }
    ) }),
    profileQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {}) : !user ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "User not found",
        description: "This profile doesn't exist."
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: heroRef,
          className: "relative h-48 md:h-64 w-full overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                style: { y: bannerY },
                className: "absolute inset-0 w-full h-[130%] -top-[15%]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "w-full h-full",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.18 0.08 300) 0%, oklch(0.10 0.05 260) 40%, oklch(0.14 0.06 280) 100%)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20",
                          style: {
                            background: "radial-gradient(circle, oklch(0.72 0.28 280), transparent 70%)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute bottom-0 left-8 w-32 h-32 rounded-full opacity-15",
                          style: {
                            background: "radial-gradient(circle, oklch(0.72 0.18 300), transparent 70%)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10",
                          style: {
                            background: "radial-gradient(circle, oklch(0.82 0.25 260), transparent 70%)"
                          }
                        }
                      )
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-x-0 bottom-0 h-24",
                style: {
                  background: "linear-gradient(to bottom, transparent, oklch(var(--background)))"
                }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 -mt-12 flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0.85, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
            className: "relative",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full ring-2 ring-white/30 shadow-xl glow-accent-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-full h-full", children: [
              avatarSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc, alt: user.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-bold text-2xl bg-secondary text-secondary-foreground w-full h-full flex items-center justify-center", children: avatarFallback })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.12, duration: 0.35 },
            className: "text-center mt-3 space-y-0.5",
            children: [
              user.name && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-gradient-accent font-display font-bold text-2xl leading-tight", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `font-body text-muted-foreground ${!user.name ? "font-display font-bold text-2xl text-gradient-accent" : "text-sm"}`,
                  children: [
                    "@",
                    user.username
                  ]
                }
              ),
              user.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: user.location })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2, duration: 0.35 },
            className: "w-full mt-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl px-4 py-3 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatItem,
                {
                  value: ((_a = momentsQuery.data) == null ? void 0 : _a.length) ?? 0,
                  label: "Moments"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-8 bg-border/50 self-center" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatItem,
                {
                  value: user.followersCount.toString(),
                  label: "Followers"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-8 bg-border/50 self-center" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatItem,
                {
                  value: user.followingCount.toString(),
                  label: "Following"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.28, duration: 0.3 },
            className: "mt-4 w-full flex justify-center",
            children: isOwnProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.95 },
                transition: { type: "spring", stiffness: 500, damping: 30 },
                onClick: isEditing ? handleCancel : handleEditStart,
                className: "glass-card flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth",
                "data-ocid": "profile.edit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { rotate: isEditing ? 45 : 0 },
                      transition: { duration: 0.25 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                    }
                  ),
                  isEditing ? "Cancel" : "Edit Profile"
                ]
              }
            ) : isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.95 },
                transition: { type: "spring", stiffness: 500, damping: 30 },
                onClick: () => followMutation.mutate(),
                disabled: followMutation.isPending || isFollowingQuery.isLoading,
                className: `flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-smooth ${isFollowingQuery.data ? "glass-card text-foreground hover:ring-1 hover:ring-border" : "bg-accent text-accent-foreground hover:opacity-90"}`,
                "data-ocid": "profile.follow_button",
                children: isFollowingQuery.data ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-4 h-4" }),
                  " Following"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
                  " Follow"
                ] })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.95 },
                transition: { type: "spring", stiffness: 500, damping: 30 },
                onClick: () => requireAuth(() => {
                }),
                disabled: isLoggingIn,
                className: "glass-card flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth",
                "data-ocid": "profile.signin_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3.5 h-3.5" }),
                  isLoggingIn ? "Signing in…" : "Sign in to follow"
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 mt-6 pb-8 space-y-6", children: [
        isEditing && editState ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditForm,
          {
            state: editState,
            onChange: setEditState,
            onSave: handleSave,
            onCancel: handleCancel,
            isSaving: saveMutation.isPending,
            currentUsername: user.username
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          user.socials && user.socials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.32, duration: 0.3 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SocialLinksView, { socials: user.socials })
            }
          ),
          user.paymentDetails && user.paymentDetails.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.38, duration: 0.3 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentDetailsView, { details: user.paymentDetails })
            }
          )
        ] }),
        !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.44, duration: 0.35 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-gradient-accent font-display font-bold text-xl mb-4", children: "Moments" }),
              momentsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-52 rounded-2xl" }, i)) }) : ((_b = momentsQuery.data) == null ? void 0 : _b.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "glass-card rounded-2xl p-8 flex flex-col items-center",
                  "data-ocid": "profile.moments_empty_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    EmptyState,
                    {
                      icon: Calendar,
                      title: "No moments yet",
                      description: "This user hasn't created any moments."
                    }
                  )
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: (_c = momentsQuery.data) == null ? void 0 : _c.map((moment, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: {
                    delay: index * 0.08,
                    duration: 0.35,
                    ease: [0.34, 1.2, 0.64, 1]
                  },
                  "data-ocid": `profile.moment.item.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MomentCard,
                    {
                      moment,
                      onClick: () => navigate({
                        to: "/moments/$momentId",
                        params: { momentId: moment.id.toString() }
                      })
                    }
                  )
                },
                moment.id.toString()
              )) })
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  ProfilePage
};
