import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";

const USERNAME_REGEX = /^[a-z0-9_]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

function validateUsername(value: string): string | null {
  if (value.length < MIN_LENGTH)
    return `At least ${MIN_LENGTH} characters required`;
  if (value.length > MAX_LENGTH)
    return `Maximum ${MAX_LENGTH} characters allowed`;
  if (!USERNAME_REGEX.test(value))
    return "Only letters, numbers, and underscores";
  return null;
}

export function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Stores the username that needs an availability check when actor is null.
   * When actor becomes available, the useEffect below retries automatically.
   */
  const pendingCheckRef = useRef<string | null>(null);

  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const localError = touched ? validateUsername(username) : null;
  const canSubmit =
    !localError &&
    available === true &&
    !checking &&
    username.length >= MIN_LENGTH;

  /**
   * Run the availability check against the backend.
   * Exposed as useCallback so the retry effect can call it directly.
   */
  const runAvailabilityCheck = useCallback(
    async (value: string) => {
      if (!actor) return;
      const err = validateUsername(value);
      if (err) return;
      setChecking(true);
      setAvailable(null);
      try {
        const taken = await actor.isUsernameTaken(value);
        setAvailable(!taken);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    },
    [actor],
  );

  /**
   * Called on input blur. If actor is not ready yet, stores the intent in
   * pendingCheckRef so the retry effect below can pick it up.
   */
  const checkUsername = (value: string) => {
    setTouched(true);
    const err = validateUsername(value);
    if (err) return;

    if (!actor) {
      // Record intent — the useEffect watching actor will retry
      pendingCheckRef.current = value;
      return;
    }

    pendingCheckRef.current = null;
    void runAvailabilityCheck(value);
  };

  /**
   * Retry availability check when actor becomes available after a delayed
   * initialization. This handles the incognito / fresh-session scenario where
   * the user types + blurs before actor is ready.
   */
  useEffect(() => {
    if (!actor) return;
    const pending = pendingCheckRef.current;
    if (!pending) return;
    pendingCheckRef.current = null;
    void runAvailabilityCheck(pending);
  }, [actor, runAvailabilityCheck]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(raw);
    // Reset availability — user must re-blur to trigger a fresh check
    setAvailable(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please choose an image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let photo: ExternalBlob | undefined;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        photo = ExternalBlob.fromBytes(bytes);
      }
      await actor.saveCallerUserProfile({ username, photo });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.callerProfile,
      });
      showSuccess("Welcome to EveryMoment!");
      navigate({ to: "/dashboard" });
    },
    onError: () => showError("Failed to save profile. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) saveMutation.mutate();
  };

  return (
    <AuthGuard requireAuth requireProfile={false} currentPath="/onboarding">
      <div
        className="min-h-screen bg-background flex flex-col"
        data-ocid="onboarding-page"
      >
        {/* Top bar */}
        <header className="px-6 pt-8 flex items-center justify-center">
          <span className="font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none">
            EveryMoment
          </span>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
          <div className="w-full max-w-xs space-y-8">
            {/* Heading */}
            <div className="text-center space-y-1.5">
              <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
                Create your profile
              </h1>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Choose a username. Others will use it to find you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Photo upload */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  data-ocid="photo-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    relative group w-20 h-20 rounded-full
                    bg-muted border-2 border-border border-dashed
                    flex items-center justify-center overflow-hidden
                    transition-smooth hover:border-foreground/40 hover:bg-muted/70
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  "
                  aria-label={
                    photoPreview
                      ? "Change profile photo"
                      : "Upload profile photo"
                  }
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-background" />
                  </div>
                </button>

                {photoPreview ? (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors duration-200 font-body underline underline-offset-2"
                    aria-label="Remove photo"
                  >
                    Remove photo
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground font-body">
                    Optional profile photo
                  </span>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-label="Upload profile photo"
                  data-ocid="photo-file-input"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Username field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="username"
                    className="font-body font-medium text-sm"
                  >
                    Username
                  </Label>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      username.length > MAX_LENGTH
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {username.length}/{MAX_LENGTH}
                  </span>
                </div>

                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    placeholder="e.g. janedoe_99"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-ocid="username-input"
                    aria-describedby="username-hint"
                    aria-invalid={!!(touched && localError)}
                    onChange={handleUsernameChange}
                    onBlur={() => checkUsername(username)}
                    className="font-body tap-target pr-8"
                  />

                  {/* Inline status indicator */}
                  {username.length >= MIN_LENGTH && !localError && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {checking ? (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
                      ) : available === true ? (
                        <CheckCircle2
                          className="w-4 h-4 text-[oklch(var(--success))]"
                          aria-hidden="true"
                        />
                      ) : available === false ? (
                        <XCircle
                          className="w-4 h-4 text-destructive"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  )}
                </div>

                {/* Hint / error */}
                <p
                  id="username-hint"
                  className={`text-xs font-body min-h-[16px] ${
                    touched && localError
                      ? "text-destructive"
                      : available === false
                        ? "text-destructive"
                        : available === true
                          ? "text-[oklch(var(--success))]"
                          : "text-muted-foreground"
                  }`}
                >
                  {touched && localError
                    ? localError
                    : checking
                      ? "Checking availability…"
                      : available === true
                        ? `@${username} is available`
                        : available === false
                          ? "That username is already taken"
                          : "Letters, numbers, and underscores only"}
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full tap-target font-body font-semibold"
                disabled={!canSubmit || saveMutation.isPending}
                data-ocid="save-profile-btn"
              >
                {saveMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Saving…
                  </span>
                ) : (
                  "Get started"
                )}
              </Button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-[11px] text-muted-foreground font-body">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
            >
              Built with caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </AuthGuard>
  );
}
