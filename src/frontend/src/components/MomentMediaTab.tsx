import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FolderOpen,
  FolderPlus,
  Images,
  Loader2,
  MoreHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ExternalBlob, MediaKind } from "../backend";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type { Folder, FolderId, Media, MomentId } from "../types";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";
import { MediaCard } from "./MediaCard";
import { MediaDetailModal } from "./MediaDetailModal";

const PAGE_SIZE = 12n;
const ACCEPT_ALL =
  "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";

function detectKind(file: File): MediaKind {
  if (file.type.startsWith("image/")) return MediaKind.image;
  if (file.type.startsWith("video/")) return MediaKind.video;
  if (file.type.startsWith("audio/")) return MediaKind.audio;
  return MediaKind.document_;
}

const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const MAX_DOC_BYTES = 10 * 1024 * 1024;

function validateFileSize(file: File): string | null {
  const kind = detectKind(file);
  const limit = kind === MediaKind.document_ ? MAX_DOC_BYTES : MAX_MEDIA_BYTES;
  if (file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return `File exceeds ${mb} MB limit.`;
  }
  return null;
}

interface FolderPillProps {
  folder: Folder;
  selected: boolean;
  isOwner: boolean;
  onClick: () => void;
  onDelete: (folder: Folder) => void;
}

function FolderPill({
  folder,
  selected,
  isOwner,
  onClick,
  onDelete,
}: FolderPillProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        data-ocid="folder-pill"
        onClick={onClick}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-smooth button-spring tap-target",
          selected
            ? "bg-accent text-accent-foreground glow-accent-sm"
            : "glass-card text-foreground hover:opacity-80",
          isOwner && !folder.isDefault ? "pr-2" : "",
        ].join(" ")}
      >
        <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="max-w-[120px] truncate">{folder.name}</span>
        {isOwner && !folder.isDefault && (
          <button
            type="button"
            data-ocid="folder-pill-menu-btn"
            aria-label={`Options for ${folder.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }
            }}
            className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/20"
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>
        )}
      </button>

      {menuOpen && (
        <>
          <div
            role="button"
            tabIndex={-1}
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenuOpen(false);
            }}
          />
          <div className="absolute top-full left-0 mt-1 z-20 glass-modal rounded-xl overflow-hidden min-w-[140px] shadow-xl animate-scale-in">
            <button
              type="button"
              data-ocid="delete-folder-menu-btn"
              onClick={() => {
                setMenuOpen(false);
                onDelete(folder);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-destructive hover:bg-destructive/15 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
              Delete folder
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface MomentMediaTabProps {
  momentId: MomentId;
  isOwner: boolean;
  isAttending?: boolean;
  currentUserId?: string | null;
}

export function MomentMediaTab({
  momentId,
  isOwner,
  isAttending = false,
  currentUserId = null,
}: MomentMediaTabProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFolderId, setSelectedFolderId] = useState<FolderId | null>(
    null,
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteMediaTarget, setDeleteMediaTarget] = useState<Media | null>(
    null,
  );
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(
    null,
  );
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: QUERY_KEYS.folders(momentId.toString()),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders(momentId);
    },
    enabled: !!actor,
  });

  // Determine current folder context
  const currentFolder = selectedFolderId
    ? (folders.find((f) => f.id === selectedFolderId) ?? null)
    : (folders.find((f) => f.isDefault) ?? null);
  const isCurrentFolderDefault =
    currentFolder?.isDefault ?? selectedFolderId === null;

  // Upload is allowed for: owner always, attending users only in the default folder
  const canUpload = isOwner || (isAttending && isCurrentFolderDefault);

  // Whether a media item's delete button should show:
  // - Owner can delete anything
  // - Media uploader can delete their own media only in the default folder
  function canDeleteMedia(media: Media): boolean {
    if (isOwner) return true;
    if (!currentUserId) return false;
    if (!isCurrentFolderDefault) return false;
    return media.uploadedBy.toText() === currentUserId;
  }

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFolder({ name: name.trim(), momentId });
    },
    onSuccess: async () => {
      showSuccess("Folder created.");
      setNewFolderName("");
      setShowCreateFolder(false);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString()),
      });
    },
    onError: () => showError("Failed to create folder."),
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFolder(folderId);
    },
    onSuccess: async () => {
      showSuccess("Folder deleted.");
      setDeleteFolderTarget(null);
      if (deleteFolderTarget && selectedFolderId === deleteFolderTarget.id) {
        setSelectedFolderId(null);
      }
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString()),
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(momentId.toString(), 0),
      });
    },
    onError: () => showError("Failed to delete folder."),
  });

  const allMediaQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.media(momentId.toString(), 0),
    queryFn: async ({ pageParam = 0n }) => {
      if (!actor) return { items: [], total: 0n, nextOffset: undefined };
      return actor.listMedia(momentId, pageParam as bigint, PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0n as bigint,
    enabled: !!actor && selectedFolderId === null,
  });

  const folderMediaQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.mediaByFolder(selectedFolderId?.toString() ?? "", 0),
    queryFn: async ({ pageParam = 0n }) => {
      if (!actor || !selectedFolderId)
        return { items: [], total: 0n, nextOffset: undefined };
      return actor.listMediaByFolder(
        selectedFolderId,
        pageParam as bigint,
        PAGE_SIZE,
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0n as bigint,
    enabled: !!actor && selectedFolderId !== null,
  });

  const activeQuery =
    selectedFolderId !== null ? folderMediaQuery : allMediaQuery;
  const allItems = activeQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const isLoadingMedia = activeQuery.isLoading;
  const hasMore = activeQuery.hasNextPage;

  const handleUpload = useCallback(
    async (file: File) => {
      if (!actor) return;
      const sizeError = validateFileSize(file);
      if (sizeError) {
        showError(sizeError);
        return;
      }

      const targetFolderId =
        selectedFolderId ?? folders.find((f) => f.isDefault)?.id;
      if (!targetFolderId) {
        showError("No folder available for upload.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
        await actor.uploadMedia({
          blob,
          kind: detectKind(file),
          momentId,
          filename: file.name,
          folderId: targetFolderId,
        });
        showSuccess("Media uploaded successfully.");
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.media(momentId.toString(), 0),
        });
        if (selectedFolderId) {
          await queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.mediaByFolder(selectedFolderId.toString(), 0),
          });
        }
      } catch {
        showError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [actor, momentId, selectedFolderId, folders, queryClient],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDeleteMedia = async () => {
    if (!actor || !deleteMediaTarget) return;
    try {
      await actor.deleteMedia(deleteMediaTarget.id);
      showSuccess("Media deleted.");
      setSelectedMedia(null);
      setDeleteMediaTarget(null);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(momentId.toString(), 0),
      });
      if (selectedFolderId) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.mediaByFolder(selectedFolderId.toString(), 0),
        });
      }
    } catch {
      showError("Failed to delete media.");
    }
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    createFolderMutation.mutate(trimmed);
  };

  return (
    <div className="space-y-4">
      {/* Folder pills row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* All pill */}
        <button
          type="button"
          data-ocid="folder-pill-all"
          onClick={() => setSelectedFolderId(null)}
          className={[
            "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-smooth button-spring tap-target",
            selectedFolderId === null
              ? "bg-accent text-accent-foreground glow-accent-sm"
              : "glass-card text-foreground hover:opacity-80",
          ].join(" ")}
        >
          <Images className="w-3.5 h-3.5" />
          All
        </button>

        {folders.map((f) => (
          <FolderPill
            key={f.id.toString()}
            folder={f}
            selected={selectedFolderId === f.id}
            isOwner={isOwner}
            onClick={() => setSelectedFolderId(f.id)}
            onDelete={(folder) => setDeleteFolderTarget(folder)}
          />
        ))}

        {isOwner && !showCreateFolder && (
          <button
            type="button"
            data-ocid="add-folder-pill-btn"
            onClick={() => setShowCreateFolder(true)}
            aria-label="Create folder"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium border border-dashed border-accent/30 text-muted-foreground hover:text-accent hover:border-accent/60 transition-smooth button-spring tap-target"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New folder</span>
          </button>
        )}
      </div>

      {/* Inline create folder form */}
      {isOwner && showCreateFolder && (
        <form
          data-ocid="create-folder-form"
          onSubmit={handleCreateFolderSubmit}
          className="glass-card rounded-2xl flex items-center gap-2 p-3 animate-slide-down"
        >
          <FolderPlus className="w-4 h-4 text-accent flex-shrink-0" />
          <Input
            autoFocus
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowCreateFolder(false);
                setNewFolderName("");
              }
            }}
            maxLength={64}
            className="flex-1 h-8 text-sm font-body bg-transparent border-0 shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
            data-ocid="folder-name-input"
          />
          <button
            type="submit"
            disabled={!newFolderName.trim() || createFolderMutation.isPending}
            className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-body font-semibold hover:opacity-90 transition-smooth button-spring disabled:opacity-50 min-h-0"
            data-ocid="create-folder-submit"
          >
            {createFolderMutation.isPending ? "Creating…" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCreateFolder(false);
              setNewFolderName("");
            }}
            aria-label="Cancel"
            className="w-7 h-7 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Upload zone — owner always, attending users only in default folder */}
      {canUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ALL}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            data-ocid="upload-media-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full glass-card rounded-2xl border-2 border-dashed border-accent/25 hover:border-accent/50 flex flex-col items-center gap-3 py-7 transition-smooth group disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-7 h-7 text-accent animate-spin" />
                <span className="text-sm font-body text-muted-foreground">
                  {uploadProgress !== null
                    ? `Uploading ${Math.round(uploadProgress)}%`
                    : "Uploading…"}
                </span>
                {uploadProgress !== null && (
                  <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl glass-card glow-accent-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-body font-semibold text-foreground">
                    Upload Media
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    Photos, videos &amp; audio up to 50 MB · Documents up to 10
                    MB
                  </p>
                </div>
              </>
            )}
          </button>
        </div>
      )}

      {/* Media grid */}
      {isLoadingMedia ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["a", "b", "c", "d", "e", "f"].map((id) => (
            <Skeleton
              key={id}
              className="aspect-[4/3] rounded-xl animate-shimmer"
            />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No media yet"
          description={
            canUpload
              ? "Upload your first photo, video, or file to this moment."
              : "No media has been added to this moment yet."
          }
          action={
            canUpload ? (
              <button
                type="button"
                data-ocid="upload-media-empty-btn"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 min-h-12"
              >
                <Upload className="w-4 h-4" />
                Upload Media
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allItems.map((media) => (
              <MediaCard
                key={media.id.toString()}
                media={media}
                onClick={() => setSelectedMedia(media)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                data-ocid="load-more-btn"
                onClick={() => activeQuery.fetchNextPage()}
                disabled={activeQuery.isFetchingNextPage}
                className="glass-card rounded-full px-6 py-2.5 text-sm font-body font-medium text-foreground flex items-center gap-2 hover:opacity-80 transition-smooth button-spring disabled:opacity-50"
              >
                {activeQuery.isFetchingNextPage && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {/* Media detail modal */}
      {selectedMedia && (
        <MediaDetailModal
          media={selectedMedia}
          isOwner={isOwner}
          canDelete={canDeleteMedia(selectedMedia)}
          folders={folders}
          onClose={() => setSelectedMedia(null)}
          onDelete={(m) => setDeleteMediaTarget(m)}
        />
      )}

      <ConfirmDialog
        open={!!deleteMediaTarget}
        onOpenChange={(open) => !open && setDeleteMediaTarget(null)}
        title="Delete Media"
        description="This will permanently delete this file. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteMedia}
      />

      <ConfirmDialog
        open={!!deleteFolderTarget}
        onOpenChange={(open) => !open && setDeleteFolderTarget(null)}
        title="Delete Folder"
        description={`Delete "${deleteFolderTarget?.name}"? All media in this folder will be moved to the public folder.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteFolderTarget)
            deleteFolderMutation.mutate(deleteFolderTarget.id);
        }}
      />
    </div>
  );
}
