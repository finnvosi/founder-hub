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
          // SYS.MODULE.SPACES
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          CLEARANCE: {userRole.toUpperCase()}
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            SPACES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase"
          >
            {workspaces.length} ACTIVE ROOMS // SECURE
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex flex-col border border-border rounded-sm bg-background p-5 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Access Directory
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
            {userRole}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {workspaces.map((workspace) => {
            const Icon = workspaceIconMap[workspace.icon] || Layers;

            return (
              <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
                <motion.div
                  className="group relative flex cursor-pointer flex-col gap-4 rounded border border-border-subtle bg-surface-1 p-5 transition-colors hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-border-subtle bg-surface-2">
                        <Icon className="h-4 w-4 text-text-secondary group-hover:text-text-primary transition-colors" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[13px] font-medium text-text-primary mt-1">
                        {workspace.name}
                      </h3>
                      <p className="text-[11px] text-text-tertiary leading-snug pr-6">
                        {workspace.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-transparent transition-all group-hover:text-text-tertiary group-hover:translate-x-1" strokeWidth={1.5} />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border-subtle">
                    {workspace.modules.map((mod) => (
                      <span
                        key={mod}
                        className="font-mono text-[8px] uppercase tracking-wider text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded"
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
    </div>
  );
}
