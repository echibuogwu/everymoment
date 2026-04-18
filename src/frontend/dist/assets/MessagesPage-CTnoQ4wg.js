import { u as useAuth, K as useConversations, N as useUnreadMessageCount, r as reactExports, j as jsxRuntimeExports, g as Link, i as cn, O as useConversation, S as useSendMessage, T as useMarkConversationRead, a as useBackend, f as useQuery, Q as QUERY_KEYS } from "./index-CtLY6vs2.js";
import { L as Layout, M as MessageCircle, f as Avatar, h as AvatarFallback, B as Button } from "./Layout--chq1LOo.js";
import { B as Badge } from "./badge-BxXztv-L.js";
import { I as Input } from "./input-2BuC702O.js";
import { S as Skeleton } from "./skeleton-DM4I-2Ld.js";
import { A as ArrowLeft } from "./arrow-left-D2oEGLC1.js";
import { S as Send } from "./send-JktRGE7Q.js";
import "./index-DIX-OhXh.js";
import "./proxy-C4ENgEup.js";
import "./user-DWv8V36G.js";
import "./sun-Dp_dfXPb.js";
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
        const principal = { toString: () => userId };
        return actor.getUserProfile(principal);
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
  const { data: messages = [], isLoading } = useConversation(userId);
  const { mutate: sendMessage, isPending } = useSendMessage();
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
    const principalLike = { toString: () => userId };
    markRead(principalLike);
  }, [userId, markRead]);
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const recipientId = {
      toString: () => userId
    };
    sendMessage(
      { recipientId, text: trimmed },
      { onSuccess: () => setText("") }
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: displayName }) })
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: text,
          onChange: (e) => setText(e.target.value),
          placeholder: "Type a message…",
          className: "flex-1 rounded-full bg-muted/50 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm",
          "data-ocid": "messages.compose.input",
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
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
          disabled: isPending || !text.trim(),
          "data-ocid": "messages.send_button",
          "aria-label": "Send message",
          style: {
            background: text.trim() ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))" : void 0
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
function MessagesPage() {
  const { isAuthenticated, principal } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();
  const { data: unreadCount = 0 } = useUnreadMessageCount();
  const [activeUserId, setActiveUserId] = reactExports.useState(null);
  const myPrincipalStr = (principal == null ? void 0 : principal.toText()) ?? null;
  const showThread = activeUserId !== null;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", "data-ocid": "messages.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "flex items-center justify-between mb-5",
          showThread && "hidden md:flex"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Messages" }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            unreadCount,
            " unread"
          ] })
        ] })
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "border-r border-border/40 flex flex-col",
                showThread ? "hidden md:flex" : "flex"
              ),
              "data-ocid": "conversations.list",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest", children: "Conversations" }) }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-40" })
                  ] })
                ] }, i)) }) : conversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center py-14 gap-3 text-center px-4 flex-1",
                    "data-ocid": "conversations.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-9 h-9 text-muted-foreground/40" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No conversations yet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Start one from a user's profile" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-border/20", children: conversations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ConversationRow,
                  {
                    summary: c,
                    isActive: activeUserId === c.userId.toString(),
                    onClick: () => setActiveUserId(c.userId.toString())
                  },
                  c.userId.toString()
                )) })
              ]
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
              className: "hidden md:flex flex-col items-center justify-center flex-1 gap-3 text-center p-6",
              "data-ocid": "messages.no_selection",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 text-muted-foreground/40" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a conversation to start messaging" })
              ]
            }
          ) })
        ]
      }
    )
  ] }) });
}
export {
  MessagesPage
};
