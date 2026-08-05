"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { ROLE_CONFIGS } from "@/lib/rbac";
import type { ExecutiveRole } from "@/types";

interface AccessGuardProps {
  requiredRole?: ExecutiveRole;
  requiredClearance?: number;
  currentRole: ExecutiveRole;
  resourceName?: string;
}

export function AccessGuard({
  requiredRole,
  requiredClearance = 4,
  currentRole,
  resourceName = "this workspace",
}: AccessGuardProps) {
  const currentConfig = ROLE_CONFIGS[currentRole];
  const requiredConfig = requiredRole ? ROLE_CONFIGS[requiredRole] : null;

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-8"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <ShieldAlert className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
            RBAC Clearance Restricted
          </span>
          <h2 className="text-[18px] font-medium tracking-tight text-text-primary">
            Access Denied
          </h2>
          <p className="text-[12px] text-text-tertiary leading-relaxed">
            Your current role (<span className="font-mono text-text-secondary">{currentConfig?.label}</span> — Level {currentConfig?.clearanceLevel}) does not have security clearance to access {resourceName}.
          </p>
        </div>

        <div className="w-full rounded-lg border border-border-subtle bg-surface-2 p-3 font-mono text-[11px] text-text-tertiary">
          Required Clearance:{" "}
          <span className="text-text-primary">
            {requiredConfig ? `${requiredConfig.label} (Level ${requiredConfig.clearanceLevel})` : `Level ${requiredClearance}+`}
          </span>
        </div>

        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 text-[12px] font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Allowed Workspaces</span>
        </Link>
      </motion.div>
    </div>
  );
}
