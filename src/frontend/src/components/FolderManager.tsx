import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FolderPlus, Lock, Trash2 } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type { Folder, MomentId } from "../types";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";

interface FolderRowProps {
  folder: Folder;
  isOwner: boolean;
  onDelete: (folder: Folder) => void;
}

function FolderRow({ folder, isOwner, onDelete }: FolderRowProps) {
  return (
    <div
      data-ocid="folder-row"
      className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card transition-smooth"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {folder.isDefault ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : (
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-body font-medium text-foreground text-sm truncate">
            {folder.name}
          </p>
          {folder.isDefault && (
            <p className="text-xs text-muted-foreground font-body">
              All attendees can upload here
            </p>
          )}
        </div>
      </div>

      {isOwner && !folder.isDefault && (
        <Button
          data-ocid="delete-folder-btn"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 tap-target flex-shrink-0"
          onClick={() => onDelete(folder)}
          aria-label={`Delete ${folder.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

interface FolderManagerProps {
  momentId: MomentId;
  isOwner: boolean;
}

export function FolderManager({ momentId, isOwner }: FolderManagerProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const [newFolderName, setNewFolderName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null);

  const { data: folders = [], isLoading } = useQuery<Folder[]>({
    queryKey: QUERY_KEYS.folders(momentId.toString()),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders(momentId);
    },
    enabled: !!actor,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFolder({ name: name.trim(), momentId });
    },
    onSuccess: async () => {
      showSuccess("Folder created.");
      setNewFolderName("");
      setShowInput(false);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString()),
      });
    },
    onError: () => showError("Failed to create folder."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (folderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFolder(folderId);
    },
    onSuccess: async () => {
      showSuccess("Folder deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.folders(momentId.toString()),
      });
    },
    onError: () => showError("Failed to delete folder."),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowInput(false);
      setNewFolderName("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      {isOwner && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-body text-muted-foreground">
            {folders.length} folder{folders.length !== 1 ? "s" : ""}
          </span>
          {!showInput && (
            <Button
              data-ocid="add-folder-btn"
              variant="outline"
              size="sm"
              onClick={() => setShowInput(true)}
              className="gap-2 tap-target"
            >
              <FolderPlus className="w-4 h-4" />
              Add Folder
            </Button>
          )}
        </div>
      )}

      {/* Inline creation form */}
      {showInput && (
        <form
          data-ocid="create-folder-form"
          onSubmit={handleCreateSubmit}
          className="flex gap-2"
        >
          <Input
            autoFocus
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={64}
            className="flex-1 tap-target font-body"
            data-ocid="folder-name-input"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newFolderName.trim() || createMutation.isPending}
            className="tap-target"
            data-ocid="create-folder-submit"
          >
            {createMutation.isPending ? "Creating…" : "Create"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowInput(false);
              setNewFolderName("");
            }}
            className="tap-target"
          >
            Cancel
          </Button>
        </form>
      )}

      {/* Folder list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No folders yet"
          description="Create folders to organize your media."
          action={
            isOwner && !showInput ? (
              <Button
                data-ocid="add-folder-empty-btn"
                variant="outline"
                onClick={() => setShowInput(true)}
                className="gap-2 tap-target"
              >
                <FolderPlus className="w-4 h-4" />
                Add Folder
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {folders.map((folder) => (
            <FolderRow
              key={folder.id.toString()}
              folder={folder}
              isOwner={isOwner}
              onDelete={(f) => setDeleteTarget(f)}
            />
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Folder"
        description={`Delete "${deleteTarget?.name}"? All media in this folder will be moved to the public folder.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
