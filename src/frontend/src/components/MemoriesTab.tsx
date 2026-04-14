import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronUp,
  Loader2,
  MessageCircle,
  Paperclip,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalBlob, MemoryMediaKind } from "../backend";
import type { MemoryWithAuthor } from "../backend";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { showError, showSuccess } from "../lib/toast";

const PAGE_SIZE = 20n;
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES =
  "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4,audio/x-m4a";

interface MemoriesTabProps {
  momentId: string;
}

function formatRelativeTime(ts: bigint): string {
  const now = Date.now();
  const then = Number(ts / 1_000_000n);
  const diff = now - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: days > 365 ? "numeric" : undefined,
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Detect MemoryMediaKind from MIME type or filename. */
function detectMediaKind(file: File): MemoryMediaKind {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("video/")) return MemoryMediaKind.video;
  if (mime.startsWith("audio/")) return MemoryMediaKind.audio;
  return MemoryMediaKind.image;
}

function MemoryMedia({
  blob,
  kind,
}: {
  blob: ExternalBlob;
  kind?: MemoryMediaKind;
}) {
  const url = blob.getDirectURL();
  const mediaKind = kind ?? MemoryMediaKind.image;

  if (mediaKind === MemoryMediaKind.video) {
    return (
      <video
        src={url}
        controls
        className="mt-2 rounded-xl max-w-full max-h-56 w-full"
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    );
  }
  if (mediaKind === MemoryMediaKind.audio) {
    return (
      <audio
        src={url}
        controls
        className="mt-2 w-full max-w-xs rounded-lg"
        preload="metadata"
      >
        <track kind="captions" />
      </audio>
    );
  }
  return (
    <img
      src={url}
      alt="Memory attachment"
      className="mt-1.5 rounded-xl max-w-full max-h-48 object-cover"
      loading="lazy"
    />
  );
}

interface MemoryBubbleProps {
  memory: MemoryWithAuthor;
  isMine: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function MemoryBubble({
  memory,
  isMine,
  onDelete,
  isDeleting,
}: MemoryBubbleProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"} items-end`}
      data-ocid="memory-bubble"
    >
      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/profile/$username",
            params: { username: memory.authorUsername },
          })
        }
        className="flex-shrink-0 mb-0.5"
        aria-label={`View ${memory.authorUsername}'s profile`}
      >
        <Avatar className="w-7 h-7">
          <AvatarFallback className="text-[10px] font-body bg-muted text-muted-foreground">
            {getInitials(memory.authorDisplayName || memory.authorUsername)}
          </AvatarFallback>
        </Avatar>
      </button>

      <div
        className={`group max-w-[75%] space-y-1 ${isMine ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`flex items-center gap-1.5 px-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/profile/$username",
                params: { username: memory.authorUsername },
              })
            }
            className="text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid={`memory-author-${memory.id}`}
          >
            {memory.authorUsername}
          </button>
          <span className="text-[10px] font-body text-muted-foreground/60">
            {formatRelativeTime(memory.createdAt)}
          </span>
        </div>

        <div
          className={[
            "rounded-2xl px-3.5 py-2.5 text-sm font-body leading-relaxed break-words",
            isMine
              ? "bg-foreground text-background rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm",
          ].join(" ")}
        >
          {memory.content && <p>{memory.content}</p>}
          {memory.mediaBlob && (
            <MemoryMedia blob={memory.mediaBlob} kind={memory.mediaKind} />
          )}
        </div>

        {isMine && (
          <button
            type="button"
            onClick={() => onDelete(memory.id)}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-1 flex items-center gap-1 text-[10px] font-body text-muted-foreground hover:text-destructive"
            aria-label="Delete memory"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function MemoriesTab({ momentId }: MemoriesTabProps) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  // Store the ExternalBlob itself — it holds the raw bytes needed for upload
  const [pendingBlob, setPendingBlob] = useState<ExternalBlob | null>(null);
  const [pendingKind, setPendingKind] = useState<MemoryMediaKind | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [beforeCursor, setBeforeCursor] = useState<bigint | null>(null);
  const [allMemories, setAllMemories] = useState<MemoryWithAuthor[]>([]);
  const hasLoadedOnceRef = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const beforeCursorRef = useRef<bigint | null>(null);

  const queryKey = ["memories", momentId, beforeCursor?.toString() ?? "latest"];

  const memoriesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMemories(momentId, PAGE_SIZE, beforeCursor);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  // Handle data — backend returns newest-first; we display oldest-at-top
  useEffect(() => {
    const data = memoriesQuery.data;
    if (!data) return;

    if (!hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true;
      setAllMemories([...data].reverse());
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
      }, 50);
    } else if (beforeCursorRef.current !== null) {
      setAllMemories((existing) => {
        const existingIds = new Set(existing.map((m) => m.id));
        const newOnes = [...data]
          .reverse()
          .filter((m) => !existingIds.has(m.id));
        if (newOnes.length === 0) return existing;
        prevScrollHeightRef.current = feedRef.current?.scrollHeight ?? 0;
        return [...newOnes, ...existing];
      });
    }
  }, [memoriesQuery.data]);

  // After older messages are prepended, restore scroll position
  useEffect(() => {
    if (prevScrollHeightRef.current > 0 && feedRef.current) {
      feedRef.current.scrollTop =
        feedRef.current.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        showError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setPendingFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        // Create ExternalBlob with the raw bytes.
        // When passed to postMemory, the generated bindings' to_candid_opt_n71
        // calls _uploadFile(blob) to upload to object-storage and get a
        // persistent URL — so we must NOT use getDirectURL() at this stage.
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(Math.round(pct)),
        );
        const kind = detectMediaKind(file);
        setPendingBlob(blob);
        setPendingKind(kind);
        // Trigger progress simulation by reading bytes
        await blob.getBytes();
      } catch {
        showError("Could not read file. Please try again.");
        setPendingFile(null);
        setPendingBlob(null);
        setPendingKind(null);
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [],
  );

  const postMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // Pass the ExternalBlob directly — the generated bindings upload it to
      // object-storage and persist it before calling the backend method.
      const result = await actor.postMemory(
        momentId,
        content.trim(),
        pendingBlob,
        pendingKind,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      setContent("");
      setPendingFile(null);
      setPendingBlob(null);
      setPendingKind(null);
      // Refresh feed to get the full MemoryWithAuthor object
      queryClient.invalidateQueries({ queryKey: ["memories", momentId] });
      hasLoadedOnceRef.current = false;
      beforeCursorRef.current = null;
      setBeforeCursor(null);
    },
    onError: (err: Error) => {
      showError(err.message || "Could not post memory. Try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteMemory(memoryId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, memoryId) => {
      setAllMemories((prev) => prev.filter((m) => m.id !== memoryId));
      showSuccess("Memory deleted");
    },
    onError: (err: Error) => {
      showError(err.message || "Could not delete memory.");
    },
  });

  const handleRefresh = () => {
    hasLoadedOnceRef.current = false;
    beforeCursorRef.current = null;
    setBeforeCursor(null);
    setAllMemories([]);
    queryClient.invalidateQueries({ queryKey: ["memories", momentId] });
  };

  const handleLoadMore = () => {
    if (allMemories.length === 0) return;
    const newCursor = allMemories[0].createdAt;
    beforeCursorRef.current = newCursor;
    setBeforeCursor(newCursor);
  };

  const handleSend = () => {
    if (!content.trim() && !pendingBlob) return;
    postMutation.mutate();
  };

  const canSend = !isUploading && (!!content.trim() || !!pendingBlob);
  const hasMore =
    allMemories.length > 0 && allMemories.length % Number(PAGE_SIZE) === 0;

  return (
    <div
      className="flex flex-col h-[calc(100vh-380px)] min-h-[340px]"
      data-ocid="memories-tab"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-body text-muted-foreground">
            Memories
          </span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={memoriesQuery.isFetching}
          className="tap-target flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Refresh memories"
          data-ocid="memories-refresh-btn"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${memoriesQuery.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Feed — oldest at top, newest at bottom */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto py-3 space-y-3 scroll-smooth"
      >
        {/* Load earlier — at top of feed */}
        {hasMore && (
          <div className="flex justify-center pt-1 pb-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={memoriesQuery.isFetching}
              className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors tap-target"
              data-ocid="memories-load-more-btn"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              {memoriesQuery.isFetching ? "Loading…" : "Load earlier"}
            </button>
          </div>
        )}

        {memoriesQuery.isLoading && allMemories.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!memoriesQuery.isLoading && allMemories.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            data-ocid="memories-empty-state"
          >
            <MessageCircle className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-body font-medium text-muted-foreground">
              No memories yet
            </p>
            <p className="text-xs font-body text-muted-foreground/60 mt-0.5">
              Be the first to share one!
            </p>
          </div>
        )}

        {allMemories.map((memory) => (
          <MemoryBubble
            key={memory.id}
            memory={memory}
            isMine={
              !!principal && memory.authorId.toText() === principal.toText()
            }
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>

      {/* Compose area */}
      <div
        className="border-t border-border pt-3 space-y-2"
        data-ocid="memories-compose"
      >
        {/* Upload progress bar */}
        {isUploading && uploadProgress !== null && (
          <div className="space-y-1 px-1">
            <div className="flex justify-between text-[10px] font-body text-muted-foreground">
              <span>Reading file…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Attached file indicator */}
        {!isUploading && pendingFile && (
          <div className="flex items-center gap-2 px-1">
            <Paperclip className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-body text-foreground truncate flex-1 min-w-0">
              {pendingFile.name}
            </span>
            <span className="text-[10px] font-body text-muted-foreground flex-shrink-0">
              {(pendingFile.size / (1024 * 1024)).toFixed(1)} MB
              {pendingKind && ` · ${pendingKind}`}
            </span>
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPendingBlob(null);
                setPendingKind(null);
              }}
              className="flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
              aria-label="Remove attachment"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Attach media"
            data-ocid="memories-file-input"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || postMutation.isPending}
            className="flex-shrink-0 tap-target p-2 rounded-lg hover:bg-muted transition-colors mb-0.5 disabled:opacity-50"
            aria-label={`Attach image, video or audio (max ${MAX_FILE_SIZE_MB} MB)`}
            data-ocid="memories-attach-btn"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share a memory…"
            rows={1}
            className="flex-1 min-h-[38px] max-h-[120px] resize-none rounded-2xl border-border bg-muted/40 text-sm font-body px-3.5 py-2 focus:bg-card transition-colors"
            data-ocid="memories-content-input"
          />

          <Button
            size="icon"
            variant="default"
            onClick={handleSend}
            disabled={postMutation.isPending || !canSend}
            className="flex-shrink-0 w-9 h-9 rounded-full mb-0.5"
            aria-label="Send memory"
            data-ocid="memories-send-btn"
          >
            {postMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] font-body text-muted-foreground px-1">
          Images, videos &amp; audio · Max {MAX_FILE_SIZE_MB} MB
        </p>
      </div>
    </div>
  );
}
