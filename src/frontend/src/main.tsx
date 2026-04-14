import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import envConfig from "../env.json";
import { applyBackendPatches } from "./lib/patched-backend";

// Apply the Visibility variant encoding fix before anything runs
applyBackendPatches();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Only pass derivationOrigin when env.json has a real value injected by the platform.
// During dev/preview, ii_derivation_origin is the literal string "undefined" — passing
// it to II would cause a "disallowed origin" error. Omitting it lets II fall back to
// window.location.origin, which is always a valid origin.
const rawDerivationOrigin = envConfig.ii_derivation_origin;
const derivationOrigin =
  rawDerivationOrigin && rawDerivationOrigin !== "undefined"
    ? rawDerivationOrigin
    : undefined;

// 1 hour in nanoseconds — sets how long the II delegation is valid.
// Internet Identity's default is 30 days; we reduce to 1 hour for security.
const ONE_HOUR_NS = BigInt(3_600_000_000_000);

const iiCreateOptions = {
  loginOptions: {
    ...(derivationOrigin ? { derivationOrigin } : {}),
    maxTimeToLive: ONE_HOUR_NS,
  },
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider createOptions={iiCreateOptions}>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>
  </ThemeProvider>,
);
