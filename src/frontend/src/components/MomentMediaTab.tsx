import { Button } from "@/components/ui/button";
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

// Max file size: 50 MB for media, 10 MB for documents
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
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium
          transition-smooth tap-target border
          ${
            selected
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-foreground border-border hover:bg-muted"
          }
          ${isOwner && !folder.isDefault ? "pr-2" : ""}
        `}
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
            className={`
              ml-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
              transition-colors hover:bg-muted/60
              ${selected ? "text-background/70 hover:bg-background/20" : "text-muted-foreground"}
            `}
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>
        )}
      </button>

      {/* Dropdown menu */}
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
          <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-lg shadow-lg min-w-[140px] overflow-hidden">
            <button
              type="button"
              data-ocid="delete-folder-menu-btn"
              onClick={() => {
                setMenuOpen(false);
                onDelete(folder);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
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
}

export function MomentMediaTab({ momentId, isOwner }: MomentMediaTabProps) {
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

  // Create folder state
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Fetch folders
  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: QUERY_KEYS.folders(momentId.toString()),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders(momentId);
    },
    enabled: !!actor,
  });

  // Create folder mutation
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

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFolder(folderId);
    },
    onSuccess: async () => {
      showSuccess("Folder deleted.");
      setDeleteFolderTarget(null);
      // If the deleted folder was selected, go back to "All"
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

  // Infinite query for all media in moment
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

  // Infinite query for media in selected folder
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
          className={`
            flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium
            transition-smooth tap-target border
            ${
              selectedFolderId === null
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-foreground border-border hover:bg-muted"
            }
          `}
        >
          <Images className="w-3.5 h-3.5" />
          All
        </button>

        {/* Folder pills */}
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

        {/* Add folder button — owner only */}
        {isOwner && !showCreateFolder && (
          <button
            type="button"
            data-ocid="add-folder-pill-btn"
            onClick={() => setShowCreateFolder(true)}
            aria-label="Create folder"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-smooth tap-target"
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
          className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30"
        >
          <FolderPlus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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
          <Button
            type="submit"
            size="sm"
            disabled={!newFolderName.trim() || createFolderMutation.isPending}
            className="h-7 text-xs tap-target"
            data-ocid="create-folder-submit"
          >
            {createFolderMutation.isPending ? "Creating…" : "Create"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setShowCreateFolder(false);
              setNewFolderName("");
            }}
            aria-label="Cancel"
            className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Upload bar */}
      {isOwner && (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ALL}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            data-ocid="upload-media-btn"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2 tap-target"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading
              ? uploadProgress !== null
                ? `Uploading ${Math.round(uploadProgress)}%`
                : "Uploading…"
              : "Upload Media"}
          </Button>
          {isUploading && uploadProgress !== null && (
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* File size note */}
      {isOwner && (
        <p className="text-xs text-muted-foreground font-body -mt-1">
          Photos, videos &amp; audio up to 50 MB · Documents up to 10 MB
        </p>
      )}

      {/* Media grid */}
      {isLoadingMedia ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["a", "b", "c", "d", "e", "f"].map((id) => (
            <Skeleton key={id} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No media yet"
          description={
            isOwner
              ? "Upload your first photo, video, or file to this moment."
              : "No media has been added to this moment yet."
          }
          action={
            isOwner ? (
              <Button
                data-ocid="upload-media-empty-btn"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 tap-target"
              >
                <Upload className="w-4 h-4" />
                Upload Media
              </Button>
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
              <Button
                data-ocid="load-more-btn"
                variant="outline"
                size="sm"
                onClick={() => activeQuery.fetchNextPage()}
                disabled={activeQuery.isFetchingNextPage}
                className="gap-2 tap-target"
              >
                {activeQuery.isFetchingNextPage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      {/* Media detail modal */}
      {selectedMedia && (
        <MediaDetailModal
          media={selectedMedia}
          isOwner={isOwner}
          folders={folders}
          onClose={() => setSelectedMedia(null)}
          onDelete={(m) => setDeleteMediaTarget(m)}
        />
      )}

      {/* Delete media confirm */}
      <ConfirmDialog
        open={!!deleteMediaTarget}
        onOpenChange={(open) => !open && setDeleteMediaTarget(null)}
        title="Delete Media"
        description="This will permanently delete this file. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteMedia}
      />

      {/* Delete folder confirm */}
      <ConfirmDialog
        open={!!deleteFolderTarget}
        onOpenChange={(open) => !open && setDeleteFolderTarget(null)}
        title="Delete Folder"
        description={`Delete "${deleteFolderTarget?.name}"? All media in this folder will be moved to the default folder.`}
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
