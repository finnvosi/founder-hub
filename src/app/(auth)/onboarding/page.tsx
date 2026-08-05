"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "@/app/actions";
import { transitionMicro } from "@/lib/motion";
import { ArchitecturalLoader } from "@/components/shared/architectural-loader";
import { AnimatePresence } from "framer-motion";

const EXECUTIVE_ROLES = [
  { value: "ceo", label: "CEO", description: "Chief Executive Officer" },
  { value: "cfo", label: "CFO", description: "Chief Financial Officer" },
  { value: "cmo", label: "CMO", description: "Chief Marketing Officer" },
  { value: "cto", label: "CTO", description: "Chief Technology Officer" },
  { value: "tech-lead", label: "Tech Lead", description: "Technical Team Lead" },
] as const;

import { useAppStore } from "@/stores/app-store";
import type { ExecutiveRole } from "@/types";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedRole) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("executiveRole", selectedRole);

    const fullName = formData.get("fullName") as string;
    if (fullName && selectedRole) {
      useAppStore.getState().setUserProfile({
        name: fullName,
        role: selectedRole as ExecutiveRole,
      });
    }

    const result = await completeOnboarding(formData);

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
            messages={["APPLYING PERMISSIONS", "PREPARING ENVIRONMENT", "SYNCHRONIZING MODULES", "READY"]}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-purple-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-purple-900/20">
            F
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary">
            {APP_NAME}
          </span>
        </div>

        {/* Welcome */}
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-medium tracking-tight text-text-primary mb-2">
            Welcome
          </h1>
          <p className="text-[13px] text-text-tertiary">
            Let&apos;s set up your workspace.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Your Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Alex Chen"
              required
              className="border-border-subtle bg-surface-2 h-12 text-[13px] text-text-primary placeholder:text-text-tertiary focus-visible:ring-purple-500/30 focus-visible:border-border-hover"
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              What&apos;s your role?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {EXECUTIVE_ROLES.map((role) => {
                const isSelected = selectedRole === role.value;

                return (
                  <motion.button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`flex items-center justify-between rounded-xl px-5 py-4 text-left transition-all duration-200 border hover:bg-surface-2 ${
                      isSelected
                        ? "border-purple-500/40 bg-purple-500/[0.06]"
                        : "border-border-subtle hover:border-border-hover"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[14px] font-medium transition-colors ${
                        isSelected ? "text-text-primary" : "text-text-secondary"
                      }`}>
                        {role.description}
                      </span>
                      <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                        {role.label}
                      </span>
                    </div>
                    <div className={`h-4 w-4 rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                        : "border-border-subtle"
                    }`} />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="font-mono text-[11px] text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!selectedRole || loading}
            className="h-12 w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 font-medium text-[13px] transition-all"
          >
            Enter Workspace
          </Button>
        </form>
      </div>
    </div>
  );
}
