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
        <Link href="/workspace" className="text-[13px] text-text-secondary hover:text-text-primary transition-colors">
          ← Back to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.WORKSPACE_NODE
        </div>
        
        <div className="absolute bottom-8 left-12 flex flex-col gap-1">
          <Link
            href="/workspace"
            className="group flex items-center gap-2 text-[10px] text-text-tertiary transition-colors hover:text-text-secondary"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
            <span className="font-mono uppercase tracking-widest">Back to Directory</span>
          </Link>
        </div>

        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          CLEARANCE: {userRole.toUpperCase()}
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4 max-w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[8vw] lg:text-[80px] font-medium tracking-tighter text-text-primary leading-[1] mix-blend-difference px-4"
          >
            {workspace.name.toUpperCase()}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase max-w-[80%] text-center"
          >
            {workspace.description}
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex flex-col border border-border rounded-sm bg-background p-5 overflow-y-auto">
        
        <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Workspace Modules
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
            {workspace.modules.length} Nodes
          </span>
        </div>

        {/* Workspace modules */}
        <div className="grid grid-cols-1 gap-3">
          {workspace.modules.map((mod) => {
            const Icon = moduleIconMap[mod] || FileText;

            return (
              <Link key={mod} href={`/${mod}`}>
                <motion.div
                  className="group flex cursor-pointer items-center gap-4 rounded border border-border-subtle bg-surface-1 p-5 transition-colors hover:bg-surface-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-2 transition-colors border border-border-subtle group-hover:bg-surface-3">
                    <Icon className="h-5 w-5 text-text-tertiary transition-colors group-hover:text-text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-[13px] font-medium uppercase tracking-wider text-text-primary group-hover:text-text-primary transition-colors">
                      {mod}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {moduleDescriptions[mod]}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    Enter
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
