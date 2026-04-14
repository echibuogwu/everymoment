import { u as useAuth, g as useParams, a as useBackend, d as useQueryClient, c as useNavigate, r as reactExports, f as useQuery, Q as QUERY_KEYS, e as useMutation, j as jsxRuntimeExports, E as ExternalBlob } from "./index-DlqwQ7hd.js";
import { L as Layout, A as Avatar, a as AvatarImage, b as AvatarFallback, P as Plus } from "./badge-D1wUDQ0J.js";
import { A as AuthGuard, B as Button } from "./AuthGuard-DwWnaabs.js";
import { I as Input } from "./input-BrwhUD3l.js";
import { L as Label } from "./label-B14GUBSn.js";
import { S as Skeleton } from "./skeleton-B1svKeA7.js";
import { E as EmptyState } from "./EmptyState-D402-w7e.js";
import { C as Calendar, M as MomentCard } from "./MomentCard-yEIYveNg.js";
import { s as showError, a as showSuccess } from "./toast-DzJ_e1Ax.js";
import { A as ArrowLeft } from "./arrow-left-C0BV-BdB.js";
import { M as MapPin } from "./map-pin-CyFtcmKR.js";
import { c as createLucideIcon } from "./createLucideIcon-BUPz7SPw.js";
import { U as UserMinus, a as UserPlus, L as LogIn, C as Check } from "./user-plus-ztxaV_X4.js";
import { T as Trash2 } from "./trash-2-9qTn1pjp.js";
import { X } from "./x-D53dYmLV.js";
import "./sun-DHiVM1rX.js";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Socials" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: socials.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: s.url.startsWith("http") ? s.url : `https://${s.url}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "list-item hover:border-primary/40 transition-smooth group",
        "data-ocid": `profile.social.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-smooth", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate max-w-[140px]", children: s.url }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 flex-shrink-0" })
          ] })
        ]
      },
      `${s.name}-${i}`
    )) })
  ] });
}
function PaymentDetailsView({ details }) {
  if (!details.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Payment Details" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: details.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "list-item",
        "data-ocid": `profile.payment.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono truncate max-w-[160px]", children: d.value })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.edit_form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Profile Photo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-16 h-16", children: [
          state.photoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: state.photoPreview, alt: "Preview" }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-bold text-xl bg-secondary text-secondary-foreground", children: state.username.slice(0, 2).toUpperCase() })
        ] }) }),
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
              className: "tap-target",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Basic Info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", className: "text-sm font-medium", children: "Display Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-name",
            value: state.name,
            onChange: (e) => set({ name: e.target.value }),
            placeholder: "Your name",
            className: "bg-background",
            "data-ocid": "profile.name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-username", className: "text-sm font-medium", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-username",
            value: state.username,
            onChange: (e) => set({ username: e.target.value }),
            onBlur: handleUsernameBlur,
            placeholder: "username",
            className: "bg-background",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-location", className: "text-sm font-medium", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-location",
            value: state.location,
            onChange: (e) => set({ location: e.target.value }),
            placeholder: "City, Country",
            className: "bg-background",
            "data-ocid": "profile.location_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Socials" }),
        state.socials.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: addSocial,
            className: "add-button flex items-center gap-1",
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
                placeholder: "Platform (e.g. Twitter)",
                className: "bg-background flex-1 min-w-0",
                "data-ocid": `profile.social_name.${i + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: s.url,
                onChange: (e) => updateSocial(i, "url", e.target.value),
                placeholder: "URL",
                className: "bg-background flex-1 min-w-0",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-section space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Payment Details" }),
        state.paymentDetails.length < 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: addPayment,
            className: "add-button flex items-center gap-1",
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
                className: "bg-background flex-[0.6] min-w-0",
                "data-ocid": `profile.payment_name.${i + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: d.value,
                onChange: (e) => updatePayment(i, "value", e.target.value),
                placeholder: "Address / link / tag",
                className: "bg-background flex-1 min-w-0",
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
        Button,
        {
          type: "button",
          onClick: onSave,
          disabled: !canSave || isSaving,
          className: "flex-1 tap-target",
          "data-ocid": "profile.save_button",
          children: isSaving ? "Saving…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-1.5" }),
            " Save changes"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onCancel,
          disabled: isSaving,
          className: "tap-target",
          "data-ocid": "profile.cancel_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
            " Cancel"
          ]
        }
      )
    ] })
  ] });
}
function ProfilePage() {
  var _a, _b;
  const { username } = useParams({ from: "/profile/$username" });
  const { actor } = useBackend();
  const { principal, isAuthenticated, isLoggingIn } = useAuth();
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editState, setEditState] = reactExports.useState(null);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: false, currentPath: `/profile/${username}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
    ),
    profileQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-32 h-5 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-4 rounded" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-24 rounded-lg" })
    ] }) : !user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "User not found",
        description: "This profile doesn't exist."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-16 h-16", children: [
            user.photo && /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarImage,
              {
                src: user.photo.getDirectURL(),
                alt: user.username
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "font-display font-bold text-xl bg-secondary text-secondary-foreground", children: user.username.slice(0, 2).toUpperCase() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            user.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground truncate", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: `font-body text-muted-foreground truncate ${user.name ? "text-sm" : "font-display font-bold text-xl text-foreground"}`,
                children: [
                  "@",
                  user.username
                ]
              }
            ),
            user.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: user.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground font-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: user.followersCount.toString() }),
                " ",
                "followers"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground font-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: user.followingCount.toString() }),
                " ",
                "following"
              ] })
            ] })
          ] })
        ] }),
        isOwnProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: handleEditStart,
            className: "tap-target flex-shrink-0 gap-1.5",
            "data-ocid": "profile.edit_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" }),
              "Edit"
            ]
          }
        ) : isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: isFollowingQuery.data ? "outline" : "default",
            onClick: () => followMutation.mutate(),
            disabled: followMutation.isPending || isFollowingQuery.isLoading,
            className: "tap-target flex-shrink-0",
            "data-ocid": "profile.follow_button",
            children: isFollowingQuery.data ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-4 h-4 mr-1" }),
              " Unfollow"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 mr-1" }),
              " Follow"
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => requireAuth(() => {
            }),
            disabled: isLoggingIn,
            className: "tap-target flex-shrink-0 gap-1.5",
            "data-ocid": "profile.signin_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3.5 h-3.5" }),
              isLoggingIn ? "Signing in…" : "Sign in to follow"
            ]
          }
        )
      ] }),
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
        user.socials && user.socials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SocialLinksView, { socials: user.socials }),
        user.paymentDetails && user.paymentDetails.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentDetailsView, { details: user.paymentDetails })
      ] }),
      !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground mb-4", children: "Moments" }),
        momentsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-52 rounded-lg" }, i)) }) : ((_a = momentsQuery.data) == null ? void 0 : _a.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Calendar,
            title: "No moments yet",
            description: "This user hasn't created any moments."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: (_b = momentsQuery.data) == null ? void 0 : _b.map((moment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MomentCard,
          {
            moment,
            onClick: () => navigate({
              to: "/moments/$momentId",
              params: { momentId: moment.id.toString() }
            })
          },
          moment.id.toString()
        )) })
      ] })
    ] })
  ] }) }) });
}
export {
  ProfilePage
};
