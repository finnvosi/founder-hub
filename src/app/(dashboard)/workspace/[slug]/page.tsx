"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { ROLE_WORKSPACES } from "@/lib/constants";
import {
  FileText,
  FolderOpen,
  CheckSquare,
  MessageCircle,
  Calendar,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

const moduleIconMap: Record<string, LucideIcon> = {
  documents: FileText,
  files: FolderOpen,
  tasks: CheckSquare,
  chat: MessageCircle,
  meetings: Calendar,
};

const moduleDescriptions: Record<string, string> = {
  documents: "Documents, specs, and written artifacts",
  files: "Shared files and assets",
  tasks: "Tasks and action items",
  chat: "Discussion and communication",
  meetings: "Scheduled meetings and notes",
};

import { isWorkspaceAllowed, ROLE_CONFIGS } from "@/lib/rbac";
import { AccessGuard } from "@/components/shared/access-guard";

// Helper to find workspace across all roles for RBAC checks
const ALL_WORKSPACES = Object.values(ROLE_WORKSPACES).flat();

export default function WorkspaceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { userRole } = useAppStore();

  const isAllowed = isWorkspaceAllowed(userRole, slug);
  const targetWorkspace = ALL_WORKSPACES.find((ws) => ws.id === slug);

  if (!isAllowed && targetWorkspace) {
    // Find which role owns this workspace
    const requiredEntry = Object.entries(ROLE_WORKSPACES).find(([, list]) =>
      list.some((w) => w.id === slug)
    );
    const requiredRole = (requiredEntry ? requiredEntry[0] : "ceo") as import("@/types").ExecutiveRole;

    return (
      <AccessGuard
        currentRole={userRole}
        requiredRole={requiredRole}
        resourceName={`the ${targetWorkspace.name} workspace`}
      />
    );
  }

  const workspaces = ROLE_WORKSPACES[userRole] || [];
  const workspace = workspaces.find((ws) => ws.id === slug);

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-[13px] text-text-tertiary mb-4">Workspace not found.</p>
        <Link href="/workspace" className="text-[13px] text-purple-400 hover:text-purple-300 transition-colors">
          ← Back to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Back navigation */}
      <Link
        href="/workspace"
        className="group mb-6 inline-flex items-center gap-2 text-[12px] text-text-tertiary transition-colors hover:text-text-secondary"
      >
        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
        <span className="font-mono uppercase tracking-wider">Workspaces</span>
      </Link>

      <PageHeader
        title={workspace.name}
        subtitle={workspace.description}
      />

      {/* Workspace modules */}
      <div className="grid grid-cols-1 gap-2">
        {workspace.modules.map((mod) => {
          const Icon = moduleIconMap[mod] || FileText;

          return (
            <motion.div
              key={mod}
              className="group flex cursor-pointer items-center gap-4 rounded-xl px-5 py-5 transition-colors hover:bg-surface-2"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 transition-colors group-hover:bg-surface-3">
                <Icon className="h-5 w-5 text-text-tertiary transition-colors group-hover:text-purple-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-medium capitalize text-text-primary group-hover:text-text-primary transition-colors">
                  {mod}
                </span>
                <span className="text-[12px] text-text-tertiary">
                  {moduleDescriptions[mod]}
                </span>
              </div>
              <span className="font-mono text-[10px] text-transparent transition-colors group-hover:text-text-tertiary">
                Open →
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
