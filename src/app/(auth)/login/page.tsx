"use client";

import { useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/app/actions";
import { useAppStore } from "@/stores/app-store";
import { ArchitecturalLoader } from "@/components/shared/architectural-loader";
import { AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (email) {
      const emailPrefix = email.split("@")[0] || "User";
      const name = emailPrefix
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      useAppStore.getState().setUserProfile({
        name,
        role: useAppStore.getState().userRole || "ceo",
      });
    }

    const action = mode === "signin" ? signIn : signUp;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-text-primary">
      <AnimatePresence>
        {loading && (
          <ArchitecturalLoader
            messages={
              mode === "signin"
                ? ["AUTHENTICATING IDENTITY", "CONNECTING DATABASE", "VERIFYING CREDENTIALS", "READY"]
                : ["PROVISIONING ACCOUNT", "PREPARING WORKSPACE", "INITIALIZING", "READY"]
            }
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-purple-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-purple-900/20">
            F
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary">
            {APP_NAME}
          </span>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="border-border-subtle bg-surface-2 h-12 text-[13px] text-text-primary placeholder:text-text-tertiary focus-visible:ring-purple-500/30 focus-visible:border-border-hover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="border-border-subtle bg-surface-2 h-12 text-[13px] text-text-primary focus-visible:ring-purple-500/30 focus-visible:border-border-hover"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="font-mono text-[11px] text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 font-medium text-[13px] transition-all"
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-secondary"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary opacity-50">
            System restricted. Authorized access only.
          </p>
        </div>
      </div>
    </div>
  );
}
