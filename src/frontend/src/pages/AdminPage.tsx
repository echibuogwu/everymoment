import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  FileText,
  Image,
  Layers,
  Shield,
  Trash2,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import {
  type BulkImportMomentRow,
  type BulkImportResult,
  useAdminBulkImportMoments,
  useBackend,
} from "../hooks/use-backend";
import { useIsAdmin } from "../hooks/use-profile";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import {
  type AccessRequest,
  AccessStatus,
  type Media,
  type MediaId,
  MediaKind,
  type MomentId,
  type MomentListItem,
  type UserId,
  type UserProfilePublic,
  Visibility,
} from "../types";

// ── Types ────────────────────────────────────────────────────────────────────

type DeleteTarget =
  | { type: "user"; id: UserId; label: string }
  | { type: "moment"; id: MomentId; label: string }
  | { type: "media"; id: MediaId; label: string };

interface EnrichedAccessRequest extends AccessRequest {
  momentTitle: string;
  requesterUsername: string;
}

interface ParsedCsvRow {
  rowIndex: number;
  data: BulkImportMomentRow;
  errors: string[];
}

type ImportPhase =
  | "idle"
  | "selecting"
  | "validating"
  | "confirmed"
  | "importing"
  | "done";

// ── Helpers ──────────────────────────────────────────────────────────────────

const MAX_CSV_BYTES = 10 * 1024 * 1024; // 10 MB

function formatDate(ts: bigint) {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <Badge
      variant="outline"
      className={
        visibility === Visibility.private_
          ? "text-muted-foreground border-border text-xs"
          : "text-xs border-border"
      }
    >
      {visibility === Visibility.private_ ? "Private" : "Public"}
    </Badge>
  );
}

function KindBadge({ kind }: { kind: MediaKind }) {
  const labels: Record<MediaKind, string> = {
    [MediaKind.image]: "Image",
    [MediaKind.video]: "Video",
    [MediaKind.audio]: "Audio",
    [MediaKind.document_]: "Doc",
  };
  return (
    <Badge variant="secondary" className="text-xs font-mono capitalize">
      {labels[kind] ?? kind}
    </Badge>
  );
}

function StatusBadge({ status }: { status: AccessStatus }) {
  const map: Record<AccessStatus, { label: string; className: string }> = {
    [AccessStatus.pending]: {
      label: "Pending",
      className: "bg-muted text-muted-foreground border-border",
    },
    [AccessStatus.approved]: {
      label: "Approved",
      className:
        "bg-[oklch(var(--success)/0.1)] text-[oklch(var(--success))] border-[oklch(var(--success)/0.3)]",
    },
    [AccessStatus.denied]: {
      label: "Denied",
      className: "bg-destructive/10 text-destructive border-destructive/30",
    },
    [AccessStatus.revoked]: {
      label: "Revoked",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  const { label, className } = map[status] ?? map[AccessStatus.pending];
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="card-elevated p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="font-display font-bold text-xl text-foreground leading-none">
          {value !== undefined ? value.toLocaleString() : "—"}
        </p>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}

// ── CSV Parsing ───────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(content: string): ParsedCsvRow[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());

  const idx = (name: string) => headers.indexOf(name);

  return lines.slice(1).map((line, i) => {
    const rowIndex = i + 2; // 1-indexed, skipping header row
    const cols = parseCsvLine(line);
    const get = (name: string) => {
      const index = idx(name);
      return index >= 0 ? (cols[index] ?? "").trim() : "";
    };

    const title = get("title");
    const description = get("description");
    const location = get("location");
    const locationLatRaw = get("locationlat");
    const locationLngRaw = get("locationlng");
    // Accept both "startdate" and "eventdate" column names
    const startDate = get("startdate") || get("eventdate");
    const tags = get("tags");
    const coverImage = get("coverimage");
    const visibility = get("visibility");

    const errors: string[] = [];

    if (!title) errors.push("title is required");

    const locationLat = locationLatRaw
      ? Number.parseFloat(locationLatRaw)
      : undefined;
    const locationLng = locationLngRaw
      ? Number.parseFloat(locationLngRaw)
      : undefined;

    if (locationLatRaw && Number.isNaN(locationLat))
      errors.push("locationLat must be a number");
    if (locationLngRaw && Number.isNaN(locationLng))
      errors.push("locationLng must be a number");

    if (startDate && Number.isNaN(Date.parse(startDate)))
      errors.push("startDate must be a valid date (e.g. 2025-06-15T18:00:00Z)");

    if (visibility && !["public", "private"].includes(visibility.toLowerCase()))
      errors.push('visibility must be "public" or "private"');

    return {
      rowIndex,
      data: {
        title,
        description: description || undefined,
        location: location || undefined,
        locationLat:
          locationLat !== undefined && !Number.isNaN(locationLat)
            ? locationLat
            : undefined,
        locationLng:
          locationLng !== undefined && !Number.isNaN(locationLng)
            ? locationLng
            : undefined,
        startDate: startDate || undefined,
        tags: tags || undefined,
        coverImage: coverImage || undefined,
        visibility: visibility || undefined,
      },
      errors,
    };
  });
}

// ── CSV Import Dialog ─────────────────────────────────────────────────────────

function CsvImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [parsedRows, setParsedRows] = useState<ParsedCsvRow[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [importResults, setImportResults] = useState<BulkImportResult[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const bulkImport = useAdminBulkImportMoments();

  const reset = useCallback(() => {
    setPhase("idle");
    setParsedRows([]);
    setProgress({ current: 0, total: 0 });
    setImportResults([]);
    setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    if (!file.name.endsWith(".csv")) {
      setFileError("Please select a .csv file.");
      return;
    }
    if (file.size > MAX_CSV_BYTES) {
      setFileError("File exceeds the 10 MB limit. Please use a smaller file.");
      return;
    }

    setPhase("validating");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCsv(text);
      if (rows.length === 0) {
        setFileError(
          "No data rows found. Ensure the CSV has a header row and at least one data row.",
        );
        setPhase("idle");
        return;
      }
      setParsedRows(rows);
      setPhase("selecting");
    };
    reader.readAsText(file);
  };

  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const invalidRows = parsedRows.filter((r) => r.errors.length > 0);

  const handleConfirmImport = async () => {
    setPhase("importing");
    setProgress({ current: 0, total: validRows.length });

    try {
      const results = await bulkImport.mutateAsync({
        rows: validRows.map((r) => r.data),
        onProgress: (current, total) => setProgress({ current, total }),
      });
      setImportResults(results);
      setPhase("done");
      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        showSuccess(
          `${successCount} moment${successCount !== 1 ? "s" : ""} imported successfully.`,
        );
      }
    } catch {
      showError("Import failed. Please try again.");
      setPhase("selecting");
    }
  };

  const successCount = importResults.filter((r) => r.success).length;
  const errorCount = importResults.filter((r) => !r.success).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full" data-ocid="csv-import-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-base flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Moments from CSV
          </DialogTitle>
        </DialogHeader>

        {/* ── Idle / File picker ── */}
        {(phase === "idle" || phase === "validating") && (
          <div className="space-y-4">
            <p className="font-body text-sm text-muted-foreground">
              Upload a CSV file with moment data. Max file size: 10 MB.
            </p>

            {/* Expected columns info */}
            <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1.5">
              <p className="font-body text-xs font-medium text-foreground">
                Expected columns
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                {[
                  ["title", "Required"],
                  ["description", "Optional"],
                  ["location", "Optional"],
                  ["locationLat", "Optional"],
                  ["locationLng", "Optional"],
                  ["startDate", "Optional — ISO 8601"],
                  ["tags", "Optional — semicolon-sep."],
                  ["coverImage", "Optional — URL"],
                  ["visibility", "Optional — public/private"],
                ].map(([col, hint]) => (
                  <div key={col} className="flex items-baseline gap-1 min-w-0">
                    <span className="font-mono text-[10px] text-foreground truncate">
                      {col}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {hint}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {fileError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="font-body text-xs text-destructive">
                  {fileError}
                </p>
              </div>
            )}

            <label
              htmlFor="csv-file-input"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors p-6"
              data-ocid="csv-file-drop-zone"
            >
              <Upload
                className="w-6 h-6 text-muted-foreground"
                strokeWidth={1.5}
              />
              <div className="text-center">
                <p className="font-body text-sm font-medium text-foreground">
                  Click to select CSV file
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  .csv only · max 10 MB
                </p>
              </div>
              <input
                id="csv-file-input"
                ref={fileRef}
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleFileChange}
                data-ocid="csv-file-input"
              />
            </label>
          </div>
        )}

        {/* ── Validation summary ── */}
        {phase === "selecting" && (
          <div className="space-y-3">
            {/* Summary row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <p className="font-display font-bold text-2xl text-foreground">
                  {validRows.length}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  valid row{validRows.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div
                className={`rounded-lg border p-3 text-center ${
                  invalidRows.length > 0
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <p
                  className={`font-display font-bold text-2xl ${
                    invalidRows.length > 0
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {invalidRows.length}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  row{invalidRows.length !== 1 ? "s" : ""} with errors
                </p>
              </div>
            </div>

            {/* Error detail list */}
            {invalidRows.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 divide-y divide-destructive/10 max-h-44 overflow-y-auto">
                {invalidRows.map((r) => (
                  <div
                    key={r.rowIndex}
                    className="p-2.5 flex items-start gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-mono text-[11px] font-medium text-destructive">
                        Row {r.rowIndex}
                      </span>
                      <span className="font-body text-[11px] text-muted-foreground ml-1">
                        {r.errors.join("; ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {validRows.length === 0 && (
              <p className="font-body text-sm text-muted-foreground text-center py-2">
                No valid rows to import. Fix the errors above and re-upload.
              </p>
            )}

            {validRows.length > 0 && (
              <p className="font-body text-sm text-muted-foreground">
                {invalidRows.length > 0
                  ? `Only the ${validRows.length} valid row${validRows.length !== 1 ? "s" : ""} will be imported. Rows with errors will be skipped.`
                  : `All ${validRows.length} row${validRows.length !== 1 ? "s" : ""} passed validation and are ready to import.`}
              </p>
            )}
          </div>
        )}

        {/* ── Importing progress ── */}
        {phase === "importing" && (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload
                  className="w-6 h-6 text-primary animate-pulse"
                  strokeWidth={1.5}
                />
              </div>
              <p className="font-body text-sm font-medium text-foreground">
                Importing row {progress.current} of {progress.total}…
              </p>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{
                    width:
                      progress.total > 0
                        ? `${(progress.current / progress.total) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Please keep this window open
              </p>
            </div>
          </div>
        )}

        {/* ── Done / Results ── */}
        {phase === "done" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(var(--success))]" />
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {successCount}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  created
                </p>
              </div>
              <div
                className={`rounded-lg border p-3 text-center ${
                  errorCount > 0
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-muted/30"
                }`}
              >
                {errorCount > 0 && (
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <XCircle className="w-4 h-4 text-destructive" />
                  </div>
                )}
                <p
                  className={`font-display font-bold text-2xl ${
                    errorCount > 0 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {errorCount}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  failed
                </p>
              </div>
            </div>

            {errorCount > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 divide-y divide-destructive/10 max-h-40 overflow-y-auto">
                {importResults
                  .filter((r) => !r.success)
                  .map((r) => (
                    <div
                      key={r.rowIndex}
                      className="p-2.5 flex items-start gap-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-mono text-[11px] font-medium text-destructive">
                          Row {r.rowIndex + 2}
                        </span>
                        <span className="font-body text-[11px] text-muted-foreground ml-1 truncate block">
                          {r.title}: {r.error ?? "Unknown error"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {phase === "idle" || phase === "validating" ? (
            <Button
              variant="outline"
              onClick={handleClose}
              data-ocid="csv-import-cancel-btn"
            >
              Cancel
            </Button>
          ) : phase === "selecting" ? (
            <>
              <Button
                variant="outline"
                onClick={reset}
                data-ocid="csv-import-back-btn"
              >
                Choose different file
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={validRows.length === 0}
                data-ocid="csv-import-confirm-btn"
              >
                Import {validRows.length} moment
                {validRows.length !== 1 ? "s" : ""}
              </Button>
            </>
          ) : phase === "importing" ? (
            <Button variant="outline" disabled>
              Importing…
            </Button>
          ) : (
            <Button onClick={handleClose} data-ocid="csv-import-done-btn">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AdminPage() {
  const { actor } = useBackend();
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  // ── Queries ─────────────────────────────────────────────────────────────────

  const usersQuery = useQuery<UserProfilePublic[]>({
    queryKey: QUERY_KEYS.adminUsers,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: actor !== null && isAdmin,
  });

  const momentsQuery = useQuery<MomentListItem[]>({
    queryKey: QUERY_KEYS.adminMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListMoments();
    },
    enabled: actor !== null && isAdmin,
  });

  const mediaQuery = useQuery<Media[]>({
    queryKey: QUERY_KEYS.adminMedia,
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListMedia();
    },
    enabled: actor !== null && isAdmin,
  });

  const userMap = new Map<string, string>(
    (usersQuery.data ?? []).map((u) => [u.id.toText(), u.username]),
  );

  const accessRequestsQuery = useQuery<EnrichedAccessRequest[]>({
    queryKey: ["adminAccessRequests"],
    queryFn: async () => {
      if (!actor || !momentsQuery.data) return [];
      const results = await Promise.all(
        momentsQuery.data.map(async (m) => {
          const reqs = await actor.listMomentAccessRequests(m.id);
          return reqs.map((r) => ({
            ...r,
            momentTitle: m.title,
            requesterUsername:
              userMap.get(r.requester.toText()) ??
              `${r.requester.toText().slice(0, 8)}…`,
          }));
        }),
      );
      return results.flat();
    },
    enabled:
      actor !== null &&
      isAdmin &&
      momentsQuery.isSuccess &&
      usersQuery.isSuccess,
  });

  // ── Mutations ────────────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !deleteTarget) throw new Error("Not connected");
      if (deleteTarget.type === "user")
        await actor.adminDeleteUser(deleteTarget.id);
      if (deleteTarget.type === "moment")
        await actor.adminDeleteMoment(deleteTarget.id);
      if (deleteTarget.type === "media")
        await actor.adminDeleteMedia(deleteTarget.id);
    },
    onSuccess: async () => {
      if (!deleteTarget) return;
      const keyMap = {
        user: QUERY_KEYS.adminUsers,
        moment: QUERY_KEYS.adminMoments,
        media: QUERY_KEYS.adminMedia,
      };
      await queryClient.invalidateQueries({
        queryKey: keyMap[deleteTarget.type],
      });
      showSuccess(`${deleteTarget.label} deleted.`);
      setDeleteTarget(null);
    },
    onError: () => showError("Delete failed. Please try again."),
  });

  const resolveMutation = useMutation({
    mutationFn: async ({
      momentId,
      requester,
      approved,
    }: {
      momentId: MomentId;
      requester: UserId;
      approved: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.resolveAccessRequest(momentId, requester, approved);
    },
    onSuccess: async (_, { approved }) => {
      await queryClient.invalidateQueries({
        queryKey: ["adminAccessRequests"],
      });
      showSuccess(approved ? "Access approved." : "Access denied.");
    },
    onError: () => showError("Failed to resolve request."),
  });

  // ── Access Denied ────────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <AuthGuard requireAuth currentPath="/admin">
        <Layout>
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Shield
                className="w-8 h-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <p className="font-display font-semibold text-lg text-foreground">
              Admin access required
            </p>
            <p className="font-body text-sm text-muted-foreground">
              You do not have permission to view this page.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Back to Dashboard
            </Button>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AuthGuard requireAuth currentPath="/admin">
      <Layout>
        <div className="py-6 space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h1 className="font-display font-bold text-2xl text-foreground">
              Admin
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3" data-ocid="admin-stats">
            <StatCard
              icon={Users}
              label="Users"
              value={usersQuery.data?.length}
            />
            <StatCard
              icon={Layers}
              label="Moments"
              value={momentsQuery.data?.length}
            />
            <StatCard
              icon={Image}
              label="Media"
              value={mediaQuery.data?.length}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users">
            <TabsList className="w-full" data-ocid="admin-tabs">
              <TabsTrigger value="users" className="flex-1 gap-1 text-xs">
                <Users className="w-3.5 h-3.5" />
                Users
              </TabsTrigger>
              <TabsTrigger value="moments" className="flex-1 gap-1 text-xs">
                <Layers className="w-3.5 h-3.5" />
                Moments
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1 gap-1 text-xs">
                <Image className="w-3.5 h-3.5" />
                Media
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex-1 gap-1 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Requests
              </TabsTrigger>
            </TabsList>

            {/* ── Users Tab ──────────────────────────────────────────────── */}
            <TabsContent
              value="users"
              className="mt-4 space-y-2"
              data-ocid="admin-users-tab"
            >
              {usersQuery.isLoading ? (
                <LoadingRows />
              ) : usersQuery.data?.length === 0 ? (
                <EmptyState icon={Users} title="No users yet" />
              ) : (
                usersQuery.data?.map((user) => (
                  <div
                    key={user.id.toText()}
                    className="card-elevated p-3 flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      onClick={() =>
                        navigate({
                          to: "/profile/$username",
                          params: { username: user.username },
                        })
                      }
                      data-ocid="admin-user-row"
                    >
                      <Avatar className="w-9 h-9 flex-shrink-0">
                        {user.photo && (
                          <AvatarImage src={user.photo.getDirectURL()} />
                        )}
                        <AvatarFallback className="text-xs font-display font-semibold bg-secondary text-secondary-foreground">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-body font-medium text-sm text-foreground truncate">
                          @{user.username}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          Joined {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setDeleteTarget({
                          type: "user",
                          id: user.id,
                          label: `@${user.username}`,
                        })
                      }
                      aria-label={`Delete user @${user.username}`}
                      data-ocid="admin-delete-user-btn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            {/* ── Moments Tab ────────────────────────────────────────────── */}
            <TabsContent
              value="moments"
              className="mt-4 space-y-2"
              data-ocid="admin-moments-tab"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => setCsvImportOpen(true)}
                  data-ocid="admin-import-csv-btn"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import CSV
                </Button>
              </div>

              {momentsQuery.isLoading ? (
                <LoadingRows />
              ) : momentsQuery.data?.length === 0 ? (
                <EmptyState icon={Layers} title="No moments yet" />
              ) : (
                momentsQuery.data?.map((moment) => (
                  <div
                    key={moment.id.toString()}
                    className="card-elevated p-3 flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      onClick={() =>
                        navigate({
                          to: "/moments/$momentId",
                          params: { momentId: moment.id.toString() },
                        })
                      }
                      data-ocid="admin-moment-row"
                    >
                      <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                        {moment.coverImage ? (
                          <img
                            src={moment.coverImage.getDirectURL()}
                            alt={moment.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers
                              className="w-5 h-5 text-muted-foreground"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="font-body font-medium text-sm text-foreground truncate">
                            {moment.title}
                          </p>
                          <VisibilityBadge visibility={moment.visibility} />
                        </div>
                        <p className="font-body text-xs text-muted-foreground truncate">
                          {userMap.get(moment.owner.toText())
                            ? `@${userMap.get(moment.owner.toText())}`
                            : `${moment.owner.toText().slice(0, 12)}…`}{" "}
                          · {formatDate(moment.createdAt)}
                        </p>
                      </div>
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setDeleteTarget({
                          type: "moment",
                          id: moment.id,
                          label: moment.title,
                        })
                      }
                      aria-label={`Delete moment ${moment.title}`}
                      data-ocid="admin-delete-moment-btn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            {/* ── Media Tab ──────────────────────────────────────────────── */}
            <TabsContent
              value="media"
              className="mt-4 space-y-2"
              data-ocid="admin-media-tab"
            >
              {mediaQuery.isLoading ? (
                <LoadingRows />
              ) : mediaQuery.data?.length === 0 ? (
                <EmptyState icon={Image} title="No media yet" />
              ) : (
                mediaQuery.data?.map((item) => {
                  const moment = momentsQuery.data?.find(
                    (m) => m.id === item.momentId,
                  );
                  const uploader = userMap.get(item.uploadedBy.toText());
                  return (
                    <div
                      key={item.id.toString()}
                      className="card-elevated p-3 flex items-center justify-between gap-3"
                      data-ocid="admin-media-row"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                          {item.kind === MediaKind.image ? (
                            <img
                              src={item.blob.getDirectURL()}
                              alt={item.filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText
                                className="w-5 h-5 text-muted-foreground"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-body font-medium text-sm text-foreground truncate">
                              {item.filename}
                            </p>
                            <KindBadge kind={item.kind} />
                          </div>
                          <p className="font-body text-xs text-muted-foreground truncate">
                            {moment?.title ?? "Unknown moment"}
                            {uploader ? ` · @${uploader}` : ""} ·{" "}
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setDeleteTarget({
                            type: "media",
                            id: item.id,
                            label: item.filename,
                          })
                        }
                        aria-label={`Delete media ${item.filename}`}
                        data-ocid="admin-delete-media-btn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </TabsContent>

            {/* ── Access Requests Tab ────────────────────────────────────── */}
            <TabsContent
              value="requests"
              className="mt-4 space-y-2"
              data-ocid="admin-requests-tab"
            >
              {accessRequestsQuery.isLoading || momentsQuery.isLoading ? (
                <LoadingRows />
              ) : accessRequestsQuery.data?.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No access requests"
                  description="Access requests for private moments will appear here."
                />
              ) : (
                accessRequestsQuery.data?.map((req, i) => (
                  <div
                    key={`${req.requester.toText()}-${req.momentId.toString()}-${i}`}
                    className="card-elevated p-3 space-y-2"
                    data-ocid="admin-request-row"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body font-medium text-sm text-foreground">
                            @{req.requesterUsername}
                          </p>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">
                          {req.momentTitle} · {formatDate(req.requestedAt)}
                        </p>
                      </div>
                      {req.status === AccessStatus.pending && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-[oklch(var(--success))] hover:bg-[oklch(var(--success)/0.1)]"
                            onClick={() =>
                              resolveMutation.mutate({
                                momentId: req.momentId,
                                requester: req.requester,
                                approved: true,
                              })
                            }
                            aria-label="Approve access request"
                            data-ocid="admin-approve-request-btn"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              resolveMutation.mutate({
                                momentId: req.momentId,
                                requester: req.requester,
                                approved: false,
                              })
                            }
                            aria-label="Deny access request"
                            data-ocid="admin-deny-request-btn"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title={`Delete ${deleteTarget?.label ?? "item"}?`}
          description="This action cannot be undone and will permanently remove this item."
          confirmLabel="Delete"
          onConfirm={() => deleteMutation.mutate()}
          destructive
        />

        {/* CSV Import Dialog */}
        <CsvImportDialog open={csvImportOpen} onOpenChange={setCsvImportOpen} />
      </Layout>
    </AuthGuard>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingRows() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
}
