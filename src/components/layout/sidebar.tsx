"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, APP_NAME } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";
import {
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  GitBranch,
  Send,
  type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  pulse: Activity,
  runway: TrendingUp,
  metrics: BarChart3,
  team: Users,
  decisions: GitBranch,
  updates: Send,
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-transparent transition-all duration-300",
        sidebarCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo — geometric mark */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-12">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-[12px] font-semibold text-white shadow-lg shadow-purple-900/20">
          F
        </div>
        {!sidebarCollapsed && (
          <span className="font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-white">
            {APP_NAME}
          </span>
        )}
      </div>

      {/* Navigation — floating items */}
      <nav className="flex flex-1 flex-col gap-1.5 px-4">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = iconMap[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200",
                isActive
                  ? "bg-white/5 text-white"
                  : "text-white/40 hover:bg-white/5 hover:text-white/80"
              )}
            >
              {/* Active indicator — Deep Purple accent */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-[10px] bottom-[10px] w-1 rounded-r-full bg-purple-500"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-all",
                  isActive ? "text-purple-400 opacity-100" : "opacity-60 group-hover:opacity-100"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {!sidebarCollapsed && (
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — user indicator */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white ring-1 ring-white/20">
            AC
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-white/90">Alex Chen</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">CEO</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
