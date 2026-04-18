import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
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

  const checkUsername = (value: string) => {
    setTouched(true);
    const err = validateUsername(value);
    if (err) return;
    if (!actor) {
      pendingCheckRef.current = value;
      return;
    }
    pendingCheckRef.current = null;
    void runAvailabilityCheck(value);
  };

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
        className="min-h-screen gradient-bg relative overflow-hidden flex flex-col"
        data-ocid="onboarding-page"
      >
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden z-0"
        >
          <div className="absolute -top-40 -right-20 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] opacity-50" />
          <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-accent/15 blur-[90px] opacity-40" />
        </div>

        {/* Top bar */}
        <header className="relative z-10 px-6 pt-8 flex items-center justify-center">
          <span className="font-display font-semibold text-sm tracking-widest uppercase text-muted-foreground select-none">
            EveryMoment
          </span>
        </header>

        {/* Main */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10">
          <motion.div
            className="w-full max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className={`rounded-full transition-all duration-300 ${
                    dot === 0
                      ? "w-6 h-2 bg-accent glow-accent-sm"
                      : "w-2 h-2 bg-muted/60"
                  }`}
                />
              ))}
            </div>

            <div className="glass-card rounded-3xl p-7 space-y-6">
              {/* Heading */}
              <div className="text-center space-y-1.5">
                <h1 className="font-display font-bold text-2xl tracking-tight text-gradient-accent">
                  Create your profile
                </h1>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Choose a username. Others will use it to find you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Photo upload */}
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    type="button"
                    data-ocid="photo-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group w-20 h-20 rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={
                      photoPreview
                        ? "Change profile photo"
                        : "Upload profile photo"
                    }
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full glass-card flex items-center justify-center border-2 border-dashed border-accent/40">
                        <Camera className="w-7 h-7 text-accent/70 group-hover:text-accent transition-colors duration-200" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </motion.button>

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
                      className="font-body tap-target pr-8 glass-input rounded-xl border-white/20"
                    />

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
                    data-ocid="username-field-error"
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
                <motion.button
                  type="submit"
                  disabled={!canSubmit || saveMutation.isPending}
                  data-ocid="save-profile-btn"
                  className="w-full flex items-center justify-center gap-2.5 rounded-full px-5 py-3.5 font-body font-semibold text-sm min-h-[48px] text-white glow-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  style={{
                    background:
                      canSubmit && !saveMutation.isPending
                        ? "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.28 290))"
                        : undefined,
                  }}
                  whileTap={{ scale: canSubmit ? 0.96 : 1 }}
                  whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {saveMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Saving…
                    </span>
                  ) : (
                    "Get started →"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
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
