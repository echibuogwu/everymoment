import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronUp,
  FileAudio,
  Loader2,
  MessageCircle,
  Paperclip,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

function detectMediaKind(file: File): MemoryMediaKind {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("video/")) return MemoryMediaKind.video;
  if (mime.startsWith("audio/")) return MemoryMediaKind.audio;
  return MemoryMediaKind.image;
}

/** Full-screen media lightbox for memories */
function MemoryLightbox({
  blob,
  kind,
  onClose,
}: {
  blob: ExternalBlob;
  kind: MemoryMediaKind;
  onClose: () => void;
}) {
  const url = blob.getDirectURL();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
      data-ocid="memory-lightbox"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-smooth"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        data-ocid="memory-lightbox-close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div
        className="max-w-full max-h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {kind === MemoryMediaKind.image && (
          <motion.img
            src={url}
            alt="Memory"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl"
          />
        )}
        {kind === MemoryMediaKind.video && (
          <motion.video
            src={url}
            controls
            autoPlay
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="max-w-[95vw] max-h-[90vh] w-full h-auto rounded-xl"
            playsInline
          >
            <track kind="captions" />
          </motion.video>
        )}
        {kind === MemoryMediaKind.audio && (
          <div className="flex flex-col items-center gap-6 p-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.28 280 / 0.25), oklch(0.45 0.22 300 / 0.25))",
                border: "2px solid oklch(0.55 0.28 280 / 0.35)",
                boxShadow: "0 0 40px oklch(0.55 0.28 280 / 0.25)",
              }}
            >
              <FileAudio className="w-10 h-10 text-white/80" />
            </div>
            <audio src={url} controls autoPlay className="w-full max-w-md">
              <track kind="captions" />
            </audio>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MemoryMedia({
  blob,
  kind,
  isMine,
}: {
  blob: ExternalBlob;
  kind?: MemoryMediaKind;
  isMine: boolean;
}) {
  const url = blob.getDirectURL();
  const mediaKind = kind ?? MemoryMediaKind.image;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (mediaKind === MemoryMediaKind.video) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="mt-2 w-full rounded-xl overflow-hidden cursor-pointer"
          aria-label="View full screen video"
        >
          <video
            src={url}
            className="max-w-full max-h-56 w-full rounded-xl pointer-events-none"
            preload="metadata"
          >
            <track kind="captions" />
          </video>
        </button>
        <AnimatePresence>
          {lightboxOpen && (
            <MemoryLightbox
              blob={blob}
              kind={mediaKind}
              onClose={() => setLightboxOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
  if (mediaKind === MemoryMediaKind.audio) {
    return (
      <audio
        src={url}
        controls
        className={`mt-2 w-full max-w-xs rounded-lg ${isMine ? "opacity-90" : ""}`}
        preload="metadata"
      >
        <track kind="captions" />
      </audio>
    );
  }
  // Image — clickable to open lightbox
  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="mt-1.5 w-full text-left"
        aria-label="View full screen image"
      >
        <img
          src={url}
          alt="Memory attachment"
          className="rounded-xl max-w-full max-h-56 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </button>
      <AnimatePresence>
        {lightboxOpen && (
          <MemoryLightbox
            blob={blob}
            kind={mediaKind}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface MemoryBubbleProps {
  memory: MemoryWithAuthor;
  isMine: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  index: number;
}

function MemoryBubble({
  memory,
  isMine,
  onDelete,
  isDeleting,
  index,
}: MemoryBubbleProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"} items-end`}
      data-ocid="memory-bubble"
    >
      {/* Avatar */}
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
        <Avatar className="w-7 h-7 ring-1 ring-border">
          <AvatarFallback
            className="text-[10px] font-body"
            style={{
              background: isMine
                ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
                : undefined,
              color: isMine ? "white" : undefined,
            }}
          >
            {getInitials(memory.authorDisplayName || memory.authorUsername)}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Bubble content */}
      <div
        className={`group max-w-[75%] space-y-1 ${isMine ? "items-end" : "items-start"} flex flex-col`}
      >
        {/* Author + time */}
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

        {/* Message bubble */}
        <div
          className={[
            "rounded-2xl px-3.5 py-2.5 text-sm font-body leading-relaxed break-words",
            isMine
              ? "rounded-br-sm text-white"
              : "glass-card rounded-bl-sm text-foreground",
          ].join(" ")}
          style={
            isMine
              ? {
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                }
              : undefined
          }
        >
          {memory.content && <p>{memory.content}</p>}
          {memory.mediaBlob && (
            <MemoryMedia
              blob={memory.mediaBlob}
              kind={memory.mediaKind}
              isMine={isMine}
            />
          )}
        </div>

        {/* Delete — own messages only */}
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
    </motion.div>
  );
}

export function MemoriesTab({ momentId }: MemoriesTabProps) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
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
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(Math.round(pct)),
        );
        const kind = detectMediaKind(file);
        setPendingBlob(blob);
        setPendingKind(kind);
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
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
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
          className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded-full glass-card"
          aria-label="Refresh memories"
          data-ocid="memories-refresh-btn"
        >
          <RefreshCw
            className={`w-3 h-3 ${memoriesQuery.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Feed — oldest at top, newest at bottom */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto py-4 space-y-3 scroll-smooth"
      >
        {/* Load earlier */}
        {hasMore && (
          <div className="flex justify-center pt-1 pb-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={memoriesQuery.isFetching}
              className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-smooth px-3 py-1.5 rounded-full glass-card"
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 text-center"
            data-ocid="memories-empty-state"
          >
            <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-body font-medium text-foreground">
              No memories yet
            </p>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              Be the first to share one!
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {allMemories.map((memory, index) => (
            <MemoryBubble
              key={memory.id}
              memory={memory}
              index={index}
              isMine={
                !!principal && memory.authorId.toText() === principal.toText()
              }
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Compose area */}
      <div className="pt-3 space-y-2" data-ocid="memories-compose">
        {/* Upload progress */}
        {isUploading && uploadProgress !== null && (
          <div className="space-y-1 px-1">
            <div className="flex justify-between text-[10px] font-body text-muted-foreground">
              <span>Reading file…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.28 280), oklch(0.65 0.22 260))",
                  width: `${uploadProgress}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Attached file indicator */}
        {!isUploading && pendingFile && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl glass-card">
            <Paperclip className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-body text-foreground truncate flex-1 min-w-0">
              {pendingFile.name}
            </span>
            <span className="text-[10px] font-body text-muted-foreground flex-shrink-0">
              {(pendingFile.size / (1024 * 1024)).toFixed(1)} MB
            </span>
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPendingBlob(null);
                setPendingKind(null);
              }}
              className="flex-shrink-0 p-0.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Remove attachment"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Input row */}
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

          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || postMutation.isPending}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full glass-card transition-smooth button-spring disabled:opacity-50"
            aria-label={`Attach image, video or audio (max ${MAX_FILE_SIZE_MB} MB)`}
            data-ocid="memories-attach-btn"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Text input */}
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
            className="flex-1 min-h-[38px] max-h-[120px] resize-none rounded-2xl text-sm font-body px-3.5 py-2 focus-visible:ring-1 focus-visible:ring-accent/50 glass-input border-transparent transition-smooth"
            data-ocid="memories-content-input"
          />

          {/* Send button */}
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={postMutation.isPending || !canSend}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-40 transition-smooth"
            style={{
              background: canSend
                ? "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))"
                : undefined,
            }}
            aria-label="Send memory"
            data-ocid="memories-send-btn"
          >
            {postMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send
                className={`w-4 h-4 ${canSend ? "text-white" : "text-muted-foreground"}`}
              />
            )}
          </motion.button>
        </div>

        <p className="text-[10px] font-body text-muted-foreground/60 px-1">
          Images, videos &amp; audio · Max {MAX_FILE_SIZE_MB} MB
        </p>
      </div>
    </div>
  );
}
