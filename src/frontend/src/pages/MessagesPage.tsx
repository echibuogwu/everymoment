import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageCircle,
  PenSquare,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import {
  useConversation,
  useConversations,
  useMarkConversationRead,
  useSendMessage,
  useUnreadMessageCount,
} from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { ConversationSummary, Message, UserProfilePublic } from "../types";

// ── Time helpers ──────────────────────────────────────────────────────────────

function relativeTime(ts: bigint): string {
  const now = Date.now();
  const then = Number(ts) / 1_000_000;
  const diff = now - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(then).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Display name hook (scalable: looks up by userId, cached) ──────────────────

function useDisplayName(userId: string): string {
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
    staleTime: 5 * 60_000,
  });
  if (profile?.username) return `@${profile.username}`;
  if (profile?.name) return profile.name;
  return userId.length > 14 ? `${userId.slice(0, 12)}…` : userId;
}

// ── User search (by username prefix, debounced, API-driven) ──────────────────

function useUserSearch(query: string) {
  const { actor } = useBackend();
  return useQuery<UserProfilePublic | null>({
    queryKey: ["userSearch", query],
    queryFn: async () => {
      if (!actor || query.trim().length < 2) return null;
      // Search by exact username — scalable since backend indexes by username
      return actor.getUserProfileByUsername(query.trim().replace(/^@/, ""));
    },
    enabled: !!actor && query.trim().length >= 2,
    staleTime: 30_000,
  });
}

// ── New Conversation Modal ────────────────────────────────────────────────────

function NewConversationModal({
  onSelect,
  onClose,
  myPrincipal,
}: {
  onSelect: (userId: string) => void;
  onClose: () => void;
  myPrincipal: string | null;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: result, isLoading } = useUserSearch(debouncedQuery);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = (userId: string) => {
    if (userId === myPrincipal) return;
    onSelect(userId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      data-ocid="messages.new_conversation.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />

      <div className="relative w-full max-w-sm glass-card rounded-2xl p-5 space-y-4 shadow-2xl border border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground">
            New Message
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            data-ocid="messages.new_conversation.close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username…"
            className="pl-9 rounded-xl bg-muted/40 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm"
            data-ocid="messages.new_conversation.search_input"
          />
        </div>

        {/* Results */}
        <div className="min-h-[80px]">
          {isLoading && debouncedQuery.length >= 2 ? (
            <div className="flex items-center gap-3 py-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : result && result.id.toText() !== myPrincipal ? (
            <button
              type="button"
              onClick={() => handleSelect(result.id.toText())}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/10 transition-colors text-left"
              data-ocid="messages.new_conversation.user_result"
            >
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-accent/20 text-accent font-semibold text-xs">
                  {(result.username ?? "??").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                {result.name && (
                  <p className="text-sm font-semibold text-foreground truncate">
                    {result.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate">
                  @{result.username}
                </p>
              </div>
            </button>
          ) : debouncedQuery.length >= 2 && !isLoading ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="messages.new_conversation.empty_state"
            >
              No user found for "{debouncedQuery}"
            </p>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Type a username to search
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Conversation Row ──────────────────────────────────────────────────────────

function ConversationRow({
  summary,
  isActive,
  onClick,
}: {
  summary: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
}) {
  const userId = summary.userId.toString();
  const displayName = useDisplayName(userId);
  const initials = displayName.replace("@", "").slice(0, 2).toUpperCase();
  const unread = Number(summary.unreadCount);
  const lastText = summary.lastMessage?.text ?? "";
  const lastTs = summary.lastMessage?.createdAt;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150",
        "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isActive && "bg-accent/10 border-l-2 border-accent",
        !isActive && "border-l-2 border-transparent",
      )}
      data-ocid={`conversation.item.${userId}`}
    >
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarFallback className="bg-accent/20 text-accent font-semibold text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm truncate",
              unread > 0
                ? "font-semibold text-foreground"
                : "font-medium text-foreground",
            )}
          >
            {displayName}
          </span>
          {lastTs && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {relativeTime(lastTs)}
            </span>
          )}
        </div>
        {lastText && (
          <p
            className={cn(
              "text-xs truncate mt-0.5",
              unread > 0
                ? "text-foreground/80 font-medium"
                : "text-muted-foreground",
            )}
          >
            {lastText}
          </p>
        )}
      </div>
      {unread > 0 && (
        <Badge className="h-5 min-w-5 px-1 text-[10px] rounded-full bg-accent text-accent-foreground shrink-0">
          {unread > 99 ? "99+" : unread}
        </Badge>
      )}
    </button>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isMine,
  index,
}: {
  message: Message;
  isMine: boolean;
  index: number;
}) {
  return (
    <div
      className={cn("flex", isMine ? "justify-end" : "justify-start")}
      data-ocid={`messages.message.${index + 1}`}
    >
      <div className="max-w-[75%] space-y-0.5">
        <div
          className={cn(
            "px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words",
            isMine
              ? "text-white rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm",
          )}
          style={
            isMine
              ? {
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                }
              : undefined
          }
        >
          {message.text}
        </div>
        <div
          className={cn(
            "text-[10px] text-muted-foreground px-1",
            isMine ? "text-right" : "text-left",
          )}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

// ── Chat Thread ───────────────────────────────────────────────────────────────

function ChatThread({
  userId,
  myPrincipal,
  onBack,
}: {
  userId: string;
  myPrincipal: string | null;
  onBack: () => void;
}) {
  const { actor, isFetching: actorFetching } = useBackend();
  const { data: messages = [], isLoading } = useConversation(userId);
  const {
    mutate: sendMessage,
    isPending,
    isError: sendError,
    reset: resetSend,
  } = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();
  const displayName = useDisplayName(userId);
  const initials = displayName.replace("@", "").slice(0, 2).toUpperCase();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageCount = messages.length;
  const prevCountRef = useRef(0);
  if (messageCount !== prevCountRef.current) {
    prevCountRef.current = messageCount;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    try {
      markRead(Principal.fromText(userId));
    } catch {
      // invalid principal, skip
    }
  }, [userId, markRead]);

  const actorReady = !!actor && !actorFetching;

  const handleSend = () => {
    if (!actorReady) return;
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    // Clear any previous error state
    resetSend();
    let recipientPrincipal: Parameters<typeof sendMessage>[0]["recipientId"];
    try {
      recipientPrincipal = Principal.fromText(userId);
    } catch {
      return; // invalid userId
    }
    sendMessage(
      { recipientId: recipientPrincipal, text: trimmed },
      {
        onSuccess: () => {
          setText("");
          // Scroll to bottom after send
          setTimeout(
            () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
            50,
          );
        },
        // onError: mutation error state is set automatically, no manual reset needed
      },
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden -ml-1 h-8 w-8 rounded-full"
          aria-label="Back to conversations"
          data-ocid="messages.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="text-xs bg-accent/20 text-accent font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {displayName}
          </p>
          {!actorReady && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              Reconnecting…
            </p>
          )}
        </div>
      </div>

      {/* Message feed */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        data-ocid="messages.thread"
      >
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  i % 2 === 0 ? "justify-end" : "justify-start",
                )}
              >
                <Skeleton className="h-9 w-2/3 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
            data-ocid="messages.thread.empty_state"
          >
            <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={String(msg.id)}
              message={msg}
              isMine={
                myPrincipal !== null && msg.senderId.toString() === myPrincipal
              }
              index={i}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Send error inline */}
      {sendError && (
        <div
          className="mx-4 mb-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-body"
          data-ocid="messages.send_error_state"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Failed to send. Tap send to retry.</span>
          <button
            type="button"
            onClick={resetSend}
            className="ml-auto text-destructive/70 hover:text-destructive transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Compose */}
      <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // Clear error when user starts typing again
            if (sendError) resetSend();
          }}
          placeholder={actorReady ? "Type a message…" : "Reconnecting…"}
          disabled={!actorReady}
          className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm disabled:opacity-60"
          data-ocid="messages.compose.input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isPending && actorReady) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          size="icon"
          className="rounded-full shrink-0 w-9 h-9"
          onClick={handleSend}
          disabled={!actorReady || !text.trim() || isPending}
          data-ocid="messages.send_button"
          aria-label="Send message"
          style={{
            background:
              actorReady && text.trim() && !isPending
                ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
                : undefined,
          }}
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Conversations List (with tabs for Messages / Requests) ────────────────────

/**
 * The backend now returns ConversationInboxResult { accepted, requests }.
 * `accepted` = conversations user has engaged with (replied to or initiated).
 * `requests` = incoming DMs from users the recipient hasn't replied to yet.
 */
type InboxTab = "messages" | "requests";

function ConversationList({
  accepted,
  requests,
  isLoading,
  activeUserId,
  onSelect,
  tab,
  onTabChange,
}: {
  accepted: ConversationSummary[];
  requests: ConversationSummary[];
  isLoading: boolean;
  activeUserId: string | null;
  onSelect: (userId: string) => void;
  tab: InboxTab;
  onTabChange: (t: InboxTab) => void;
}) {
  const displayed = tab === "requests" ? requests : accepted;
  const requestCount = requests.length;

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex border-b border-border/30 shrink-0">
        <button
          type="button"
          onClick={() => onTabChange("messages")}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold transition-colors",
            tab === "messages"
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground",
          )}
          data-ocid="messages.tab.messages"
        >
          Messages
        </button>
        <button
          type="button"
          onClick={() => onTabChange("requests")}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold transition-colors relative",
            tab === "requests"
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground",
          )}
          data-ocid="messages.tab.requests"
        >
          Requests
          {requestCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold">
              {requestCount > 9 ? "9+" : requestCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-14 gap-3 text-center px-4 flex-1"
          data-ocid={
            tab === "requests"
              ? "messages.requests.empty_state"
              : "conversations.empty_state"
          }
        >
          <MessageCircle className="w-9 h-9 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {tab === "requests"
              ? "No message requests"
              : "No conversations yet"}
          </p>
          {tab === "messages" && (
            <p className="text-xs text-muted-foreground/70">
              Start one from a user's profile or use the compose button
            </p>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-border/20">
          {displayed.map((c) => (
            <ConversationRow
              key={c.userId.toString()}
              summary={c}
              isActive={activeUserId === c.userId.toString()}
              onClick={() => onSelect(c.userId.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function MessagesPage() {
  const { isAuthenticated, principal } = useAuth();
  const { data: inbox, isLoading } = useConversations();
  const { data: unreadCount = 0 } = useUnreadMessageCount();
  const myPrincipalStr = principal?.toText() ?? null;
  const navigate = useNavigate();

  // Read `?with=<userId>` query param to open a specific conversation
  const search = useSearch({ from: "/messages" });
  const preselectedUserId =
    "with" in search && typeof search.with === "string"
      ? search.with
      : undefined;

  const [activeUserId, setActiveUserId] = useState<string | null>(
    preselectedUserId ?? null,
  );
  const [inboxTab, setInboxTab] = useState<InboxTab>("messages");
  const [showNewModal, setShowNewModal] = useState(false);

  // When `?with=` param changes (e.g. from profile message button), open that conversation
  useEffect(() => {
    if (preselectedUserId) {
      setActiveUserId(preselectedUserId);
    }
  }, [preselectedUserId]);

  const showThread = activeUserId !== null;

  const acceptedConvs = inbox?.accepted ?? [];
  const requestConvs = inbox?.requests ?? [];

  const handleSelectConversation = (userId: string) => {
    setActiveUserId(userId);
    // Clear the ?with= param once we've opened the convo
    navigate({ to: "/messages" } as Parameters<typeof navigate>[0]);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="messages.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in to view messages
          </p>
          <Link
            to="/explore"
            className="text-xs text-accent hover:underline"
            data-ocid="messages.explore_link"
          >
            Browse moments →
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-6" data-ocid="messages.page">
        {/* Page header */}
        <div
          className={cn(
            "flex items-center justify-between mb-5",
            showThread && "hidden md:flex",
          )}
        >
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Messages
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {/* Compose / New Message button */}
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:ring-1 hover:ring-accent/40 transition-smooth"
            aria-label="New message"
            data-ocid="messages.compose_button"
          >
            <PenSquare className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Two-panel layout */}
        <div
          className="rounded-2xl border border-border/40 overflow-hidden md:grid md:grid-cols-[280px_1fr]"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor:
              "color-mix(in oklch, var(--card) 50%, transparent)",
            minHeight: "520px",
          }}
          data-ocid="messages.panel"
        >
          {/* Left panel: conversation list */}
          <div
            className={cn(
              "border-r border-border/40 flex flex-col",
              showThread ? "hidden md:flex" : "flex",
            )}
            data-ocid="conversations.list"
          >
            <ConversationList
              accepted={acceptedConvs}
              requests={requestConvs}
              isLoading={isLoading}
              activeUserId={activeUserId}
              onSelect={handleSelectConversation}
              tab={inboxTab}
              onTabChange={setInboxTab}
            />
          </div>

          {/* Right panel: chat thread */}
          <div className={cn("flex flex-col", !showThread && "hidden md:flex")}>
            {activeUserId ? (
              <ChatThread
                userId={activeUserId}
                myPrincipal={myPrincipalStr}
                onBack={() => setActiveUserId(null)}
              />
            ) : (
              <div
                className="hidden md:flex flex-col items-center justify-center flex-1 gap-4 text-center p-6"
                data-ocid="messages.no_selection"
              >
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a conversation to start messaging
                </p>
                <button
                  type="button"
                  onClick={() => setShowNewModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-smooth"
                  data-ocid="messages.start_conversation_button"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  New Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New conversation modal */}
      {showNewModal && (
        <NewConversationModal
          onSelect={handleSelectConversation}
          onClose={() => setShowNewModal(false)}
          myPrincipal={myPrincipalStr}
        />
      )}
    </Layout>
  );
}
