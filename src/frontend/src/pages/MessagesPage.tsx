import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
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
import type { ConversationSummary, Message } from "../types";

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

/** Fetch a display name for a userId (principal string). Falls back to truncated ID. */
function useDisplayName(userId: string): string {
  const { actor } = useBackend();
  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        const principal = { toString: () => userId } as Parameters<
          typeof actor.getUserProfile
        >[0];
        return actor.getUserProfile(principal);
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

function ChatThread({
  userId,
  myPrincipal,
  onBack,
}: {
  userId: string;
  myPrincipal: string | null;
  onBack: () => void;
}) {
  const { data: messages = [], isLoading } = useConversation(userId);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();
  const displayName = useDisplayName(userId);
  const initials = displayName.replace("@", "").slice(0, 2).toUpperCase();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageCount = messages.length;
  const prevCountRef = useRef(0);
  // Scroll to bottom when message count increases
  if (messageCount !== prevCountRef.current) {
    prevCountRef.current = messageCount;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Mark as read when thread opens
  useEffect(() => {
    const principalLike = { toString: () => userId } as Parameters<
      typeof markRead
    >[0];
    markRead(principalLike);
  }, [userId, markRead]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const recipientId = {
      toString: () => userId,
    } as Parameters<typeof sendMessage>[0]["recipientId"];
    sendMessage(
      { recipientId, text: trimmed },
      { onSuccess: () => setText("") },
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

      {/* Compose */}
      <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:border-accent focus-visible:ring-0 text-sm"
          data-ocid="messages.compose.input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          size="icon"
          className="rounded-full shrink-0 w-9 h-9"
          onClick={handleSend}
          disabled={isPending || !text.trim()}
          data-ocid="messages.send_button"
          aria-label="Send message"
          style={{
            background: text.trim()
              ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
              : undefined,
          }}
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const { isAuthenticated, principal } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();
  const { data: unreadCount = 0 } = useUnreadMessageCount();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const myPrincipalStr = principal?.toText() ?? null;

  // On mobile: show thread if active, else show list
  const showThread = activeUserId !== null;

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
        {/* Page header — only show when no thread open on mobile */}
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
            <div className="px-4 py-3 border-b border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Conversations
              </p>
            </div>

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
            ) : conversations.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 gap-3 text-center px-4 flex-1"
                data-ocid="conversations.empty_state"
              >
                <MessageCircle className="w-9 h-9 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Start one from a user's profile
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-border/20">
                {conversations.map((c) => (
                  <ConversationRow
                    key={c.userId.toString()}
                    summary={c}
                    isActive={activeUserId === c.userId.toString()}
                    onClick={() => setActiveUserId(c.userId.toString())}
                  />
                ))}
              </div>
            )}
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
                className="hidden md:flex flex-col items-center justify-center flex-1 gap-3 text-center p-6"
                data-ocid="messages.no_selection"
              >
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
