"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { ROLE_WORKSPACES } from "@/lib/constants";
import {
  Building2,
  Scale,
  Handshake,
  TrendingUp,
  Calculator,
  Receipt,
  BarChart3,
  Landmark,
  Megaphone,
  Rocket,
  PenTool,
  Palette,
  Cpu,
  Server,
  Map,
  Code,
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const workspaceIconMap: Record<string, LucideIcon> = {
  "building": Building2,
  "scale": Scale,
  "handshake": Handshake,
  "trending-up": TrendingUp,
  "calculator": Calculator,
  "receipt": Receipt,
  "bar-chart": BarChart3,
  "landmark": Landmark,
  "megaphone": Megaphone,
  "rocket": Rocket,
  "pen-tool": PenTool,
  "palette": Palette,
  "cpu": Cpu,
  "server": Server,
  "map": Map,
  "code": Code,
  "zap": Zap,
  "shield-check": ShieldCheck,
  "layers": Layers,
};

export default function WorkspacePage() {
  const { userRole } = useAppStore();
  const workspaces = ROLE_WORKSPACES[userRole] || [];

  return (
    <div className="w-full max-w-3xl">
      <PageHeader
        title="Workspaces"
        subtitle="Your dedicated rooms for focused work."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {workspaces.map((workspace) => {
          const Icon = workspaceIconMap[workspace.icon] || Layers;

          return (
            <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                transition={transitionMicro}
                className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-white/[0.04] p-6 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-white/50 transition-colors group-hover:text-purple-400" strokeWidth={1.5} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/0 transition-all group-hover:text-white/30 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors">
                    {workspace.name}
                  </h3>
                  <p className="text-[12px] text-white/35 leading-relaxed">
                    {workspace.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {workspace.modules.map((mod) => (
                    <span
                      key={mod}
                      className="font-mono text-[9px] uppercase tracking-wider text-white/20"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
