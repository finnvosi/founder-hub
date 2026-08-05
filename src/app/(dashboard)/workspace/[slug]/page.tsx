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

export default function WorkspaceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { userRole } = useAppStore();

  const workspaces = ROLE_WORKSPACES[userRole] || [];
  const workspace = workspaces.find((ws) => ws.id === slug);

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-[13px] text-white/40 mb-4">Workspace not found.</p>
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
        className="group mb-6 inline-flex items-center gap-2 text-[12px] text-white/30 transition-colors hover:text-white/60"
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
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              transition={transitionMicro}
              className="group flex cursor-pointer items-center gap-4 rounded-xl px-5 py-5 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] transition-colors group-hover:bg-white/[0.06]">
                <Icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-purple-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-medium capitalize text-white/80 group-hover:text-white transition-colors">
                  {mod}
                </span>
                <span className="text-[12px] text-white/30">
                  {moduleDescriptions[mod]}
                </span>
              </div>
              <span className="font-mono text-[10px] text-white/15 transition-colors group-hover:text-white/30">
                Open →
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
