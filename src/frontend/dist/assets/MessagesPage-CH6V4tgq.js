import { u as useAuth, J as useConversations, K as useUnreadMessageCount, c as useNavigate, N as useSearch, r as reactExports, j as jsxRuntimeExports, g as Link, i as cn, a as useBackend, O as useConversation, S as useSendMessage, T as useMarkConversationRead, P as Principal, f as useQuery, Q as QUERY_KEYS } from "./index-DXT1CttK.js";
import { L as Layout, M as MessageCircle, B as Button, f as Avatar, h as AvatarFallback } from "./Layout-DiYsrWyj.js";
import { B as Badge } from "./badge-ClpeqgBf.js";
import { I as Input } from "./input-BroRf_VE.js";
import { S as Skeleton } from "./skeleton-bPGqVL12.js";
import { c as createLucideIcon } from "./proxy-BmYmrhIs.js";
import { A as ArrowLeft } from "./arrow-left-gmKIN_cV.js";
import { L as LoaderCircle } from "./loader-circle-AY39e_Fx.js";
import { C as CircleAlert } from "./circle-alert-C9CH0Yn-.js";
import { X } from "./x-CSvcjth4.js";
import { S as Send } from "./send-jeTjUoOj.js";
import { S as Search } from "./search-Dfz3MFVk.js";
import "./index-C1qqjek8.js";
import "./user--0LaG4fi.js";
import "./sun-BljhWh_d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
function relativeTime(ts) {
  const now = Date.now();
  const then = Number(ts) / 1e6;
  const diff = now - then;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(then).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function formatTime(ts) {
  return new Date(Number(ts) / 1e6).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function useDisplayName(userId) {
  const { actor } = useBackend();
  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        return actor.getUserProfile(Principal.fromText(userId));
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!userId,
    staleTime: 5 * 6e4
  });
  if (profile == null ? void 0 : profile.username) return `@${profile.username}`;
  if (profile == null ? void 0 : profile.name) return profile.name;
  return userId.length > 14 ? `${userId.slice(0, 12)}…` : userId;
}
function useUserSearch(query) {
  const { actor } = useBackend();
  return useQuery({
    queryKey: ["userSearch", query],
    queryFn: async () => {
      if (!actor || query.trim().length < 2) return null;
      return actor.getUserProfileByUsername(query.trim().replace(/^@/, ""));
    },
    enabled: !!actor && query.trim().length >= 2,
    staleTime: 3e4
  });
}
function NewConversationModal({
  onSelect,
  onClose,
  myPrincipal
}) {
  const [query, setQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);
  const { data: result, isLoading } = useUserSearch(debouncedQuery);
  reactExports.useEffect(() => {
    var _a;
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }, []);
  const handleSelect = (userId) => {
    if (userId === myPrincipal) return;
    onSelect(userId);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4",
      "data-ocid": "messages.new_conversation.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-background/60 backdrop-blur-sm",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose(),
            role: "button",
            tabIndex: -1,
            "aria-label": "Close"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm glass-card rounded-2xl p-5 space-y-4 shadow-2xl border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "New Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center",
                "data-ocid": "messages.new_conversation.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ref: inputRef,
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search by username…",
                className: "pl-9 rounded-xl bg-muted/40 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm",
                "data-ocid": "messages.new_conversation.search_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80px]", children: isLoading && debouncedQuery.length >= 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" })
            ] })
          ] }) : result && result.id.toText() !== myPrincipal ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleSelect(result.id.toText()),
              className: "w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/10 transition-colors text-left",
              "data-ocid": "messages.new_conversation.user_result",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent/20 text-accent font-semibold text-xs", children: (result.username ?? "??").slice(0, 2).toUpperCase() }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  result.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: result.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                    "@",
                    result.username
                  ] })
                ] })
              ]
            }
          ) : debouncedQuery.length >= 2 && !isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-sm text-muted-foreground text-center py-4",
              "data-ocid": "messages.new_conversation.empty_state",
              children: [
                'No user found for "',
                debouncedQuery,
                '"'
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: "Type a username to search" }) })
        ] })
      ]
    }
  );
}
function ConversationRow({
  summary,
  isActive,
  onClick
}) {
  var _a, _b;
  const userId = summary.userId.toString();
  const displayName = useDisplayName(userId);
  const initials = displayName.replace("@", "").slice(0, 2).toUpperCase();
  const unread = Number(summary.unreadCount);
  const lastText = ((_a = summary.lastMessage) == null ? void 0 : _a.text) ?? "";
  const lastTs = (_b = summary.lastMessage) == null ? void 0 : _b.createdAt;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150",
        "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isActive && "bg-accent/10 border-l-2 border-accent",
        !isActive && "border-l-2 border-transparent"
      ),
      "data-ocid": `conversation.item.${userId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent/20 text-accent font-semibold text-xs", children: initials }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-sm truncate",
                  unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground"
                ),
                children: displayName
              }
            ),
            lastTs && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: relativeTime(lastTs) })
          ] }),
          lastText && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-xs truncate mt-0.5",
                unread > 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"
              ),
              children: lastText
            }
          )
        ] }),
        unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-5 min-w-5 px-1 text-[10px] rounded-full bg-accent text-accent-foreground shrink-0", children: unread > 99 ? "99+" : unread })
      ]
    }
  );
}
function MessageBubble({
  message,
  isMine,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("flex", isMine ? "justify-end" : "justify-start"),
      "data-ocid": `messages.message.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[75%] space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words",
              isMine ? "text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
            ),
            style: isMine ? {
              background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
            } : void 0,
            children: message.text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "text-[10px] text-muted-foreground px-1",
              isMine ? "text-right" : "text-left"
            ),
            children: formatTime(message.createdAt)
          }
        )
      ] })
    }
  );
}
function ChatThread({
  userId,
  myPrincipal,
  onBack
}) {
  var _a;
  const { actor, isFetching: actorFetching } = useBackend();
  const { data: messages = [], isLoading } = useConversation(userId);
  const {
    mutate: sendMessage,
    isPending,
    isError: sendError,
    reset: resetSend
  } = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();
  const displayName = useDisplayName(userId);
  const initials = displayName.replace("@", "").slice(0, 2).toUpperCase();
  const [text, setText] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const messageCount = messages.length;
  const prevCountRef = reactExports.useRef(0);
  if (messageCount !== prevCountRef.current) {
    prevCountRef.current = messageCount;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }
  reactExports.useEffect(() => {
    try {
      markRead(Principal.fromText(userId));
    } catch {
    }
  }, [userId, markRead]);
  const actorReady = !!actor && !actorFetching;
  const handleSend = () => {
    if (!actorReady) return;
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    resetSend();
    let recipientPrincipal;
    try {
      recipientPrincipal = Principal.fromText(userId);
    } catch {
      return;
    }
    sendMessage(
      { recipientId: recipientPrincipal, text: trimmed },
      {
        onSuccess: () => {
          setText("");
          setTimeout(
            () => {
              var _a2;
              return (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
            },
            50
          );
        }
        // onError: mutation error state is set automatically, no manual reset needed
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border/40 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onBack,
          className: "md:hidden -ml-1 h-8 w-8 rounded-full",
          "aria-label": "Back to conversations",
          "data-ocid": "messages.back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-accent/20 text-accent font-semibold", children: initials }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: displayName }),
        !actorReady && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-2.5 h-2.5 animate-spin" }),
          "Reconnecting…"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 overflow-y-auto px-4 py-4 space-y-2",
        "data-ocid": "messages.thread",
        children: [
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "flex",
                i % 2 === 0 ? "justify-end" : "justify-start"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-2/3 rounded-2xl" })
            },
            i
          )) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full gap-3 text-center",
              "data-ocid": "messages.thread.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-muted-foreground/50" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No messages yet. Say hello!" })
              ]
            }
          ) : messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MessageBubble,
            {
              message: msg,
              isMine: myPrincipal !== null && msg.senderId.toString() === myPrincipal,
              index: i
            },
            String(msg.id)
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ]
      }
    ),
    sendError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mx-4 mb-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-body",
        "data-ocid": "messages.send_error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed to send. Tap send to retry." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: resetSend,
              className: "ml-auto text-destructive/70 hover:text-destructive transition-colors",
              "aria-label": "Dismiss error",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: text,
          onChange: (e) => {
            setText(e.target.value);
            if (sendError) resetSend();
          },
          placeholder: actorReady ? "Type a message…" : "Reconnecting…",
          disabled: !actorReady,
          className: "flex-1 rounded-full bg-muted/50 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm disabled:opacity-60",
          "data-ocid": "messages.compose.input",
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey && !isPending && actorReady) {
              e.preventDefault();
              handleSend();
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          className: "rounded-full shrink-0 w-9 h-9",
          onClick: handleSend,
          disabled: !actorReady || !text.trim() || isPending,
          "data-ocid": "messages.send_button",
          "aria-label": "Send message",
          style: {
            background: actorReady && text.trim() && !isPending ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))" : void 0
          },
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
function ConversationList({
  accepted,
  requests,
  isLoading,
  activeUserId,
  onSelect,
  tab,
  onTabChange
}) {
  const displayed = tab === "requests" ? requests : accepted;
  const requestCount = requests.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-border/30 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onTabChange("messages"),
          className: cn(
            "flex-1 py-2.5 text-xs font-semibold transition-colors",
            tab === "messages" ? "text-foreground border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
          ),
          "data-ocid": "messages.tab.messages",
          children: "Messages"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onTabChange("requests"),
          className: cn(
            "flex-1 py-2.5 text-xs font-semibold transition-colors relative",
            tab === "requests" ? "text-foreground border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
          ),
          "data-ocid": "messages.tab.requests",
          children: [
            "Requests",
            requestCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold", children: requestCount > 9 ? "9+" : requestCount })
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-40" })
      ] })
    ] }, i)) }) : displayed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-14 gap-3 text-center px-4 flex-1",
        "data-ocid": tab === "requests" ? "messages.requests.empty_state" : "conversations.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-9 h-9 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: tab === "requests" ? "No message requests" : "No conversations yet" }),
          tab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Start one from a user's profile or use the compose button" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-border/20", children: displayed.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConversationRow,
      {
        summary: c,
        isActive: activeUserId === c.userId.toString(),
        onClick: () => onSelect(c.userId.toString())
      },
      c.userId.toString()
    )) })
  ] });
}
function MessagesPage() {
  const { isAuthenticated, principal } = useAuth();
  const { data: inbox, isLoading } = useConversations();
  const { data: unreadCount = 0 } = useUnreadMessageCount();
  const myPrincipalStr = (principal == null ? void 0 : principal.toText()) ?? null;
  const navigate = useNavigate();
  const search = useSearch({ from: "/messages" });
  const preselectedUserId = "with" in search && typeof search.with === "string" ? search.with : void 0;
  const [activeUserId, setActiveUserId] = reactExports.useState(
    preselectedUserId ?? null
  );
  const [inboxTab, setInboxTab] = reactExports.useState("messages");
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (preselectedUserId) {
      setActiveUserId(preselectedUserId);
    }
  }, [preselectedUserId]);
  const showThread = activeUserId !== null;
  const acceptedConvs = (inbox == null ? void 0 : inbox.accepted) ?? [];
  const requestConvs = (inbox == null ? void 0 : inbox.requests) ?? [];
  const handleSelectConversation = (userId) => {
    setActiveUserId(userId);
    navigate({ to: "/messages" });
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 gap-4",
        "data-ocid": "messages.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in to view messages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/explore",
              className: "text-xs text-accent hover:underline",
              "data-ocid": "messages.explore_link",
              children: "Browse moments →"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", "data-ocid": "messages.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex items-center justify-between mb-5",
            showThread && "hidden md:flex"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Messages" }),
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                unreadCount,
                " unread"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowNewModal(true),
                className: "w-9 h-9 rounded-full glass-card flex items-center justify-center hover:ring-1 hover:ring-accent/40 transition-smooth",
                "aria-label": "New message",
                "data-ocid": "messages.compose_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 text-foreground" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-border/40 overflow-hidden md:grid md:grid-cols-[280px_1fr]",
          style: {
            backdropFilter: "blur(12px)",
            backgroundColor: "color-mix(in oklch, var(--card) 50%, transparent)",
            minHeight: "520px"
          },
          "data-ocid": "messages.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "border-r border-border/40 flex flex-col",
                  showThread ? "hidden md:flex" : "flex"
                ),
                "data-ocid": "conversations.list",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ConversationList,
                  {
                    accepted: acceptedConvs,
                    requests: requestConvs,
                    isLoading,
                    activeUserId,
                    onSelect: handleSelectConversation,
                    tab: inboxTab,
                    onTabChange: setInboxTab
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col", !showThread && "hidden md:flex"), children: activeUserId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChatThread,
              {
                userId: activeUserId,
                myPrincipal: myPrincipalStr,
                onBack: () => setActiveUserId(null)
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "hidden md:flex flex-col items-center justify-center flex-1 gap-4 text-center p-6",
                "data-ocid": "messages.no_selection",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 text-muted-foreground/40" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a conversation to start messaging" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowNewModal(true),
                      className: "flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-smooth",
                      "data-ocid": "messages.start_conversation_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3.5 h-3.5" }),
                        "New Message"
                      ]
                    }
                  )
                ]
              }
            ) })
          ]
        }
      )
    ] }),
    showNewModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewConversationModal,
      {
        onSelect: handleSelectConversation,
        onClose: () => setShowNewModal(false),
        myPrincipal: myPrincipalStr
      }
    )
  ] });
}
export {
  MessagesPage
};
