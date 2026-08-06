"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, APP_NAME } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";
import {
  LayoutDashboard,
  Layers,
  FileText,
  FolderOpen,
  CheckSquare,
  Calendar,
  MessageCircle,
  Settings,
  Search,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  workspace: Layers,
  documents: FileText,
  files: FolderOpen,
  tasks: CheckSquare,
  meetings: Calendar,
  chat: MessageCircle,
  settings: Settings,
  search: Search,
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setCommandMenuOpen, userName, userInitials, userTitle } = useAppStore();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-transparent transition-all duration-300",
        sidebarCollapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-7 pb-8">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-purple text-[10px] font-semibold text-surface-0">
          F
        </div>
        {!sidebarCollapsed && (
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-primary">
            {APP_NAME}
          </span>
        )}
      </div>

      {/* Primary Navigation — 7 core modules */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = iconMap[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-surface-2 text-text-primary"
                  : "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-[6px] bottom-[6px] w-[2px] bg-purple"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-all",
                  isActive ? "text-text-primary" : "opacity-50 group-hover:opacity-80"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {!sidebarCollapsed && (
                <span className="text-[13px] font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}


      </nav>

      {/* Bottom section — Settings + User */}
      <div className="flex flex-col gap-1 px-3 pb-4">
        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
            pathname.startsWith("/settings")
              ? "bg-surface-2 text-text-primary"
              : "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary"
          )}
        >
          <Settings
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-all",
              pathname.startsWith("/settings") ? "text-text-primary" : "opacity-50 group-hover:opacity-80"
            )}
            strokeWidth={1.5}
          />
          {!sidebarCollapsed && (
            <span className="text-[13px] font-medium">Settings</span>
          )}
        </Link>

        {/* Separator */}
        <div className="mx-2 my-2 h-px bg-border-subtle" />

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-2 cursor-pointer">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-medium text-text-primary ring-1 ring-border">
            {userInitials}
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-[13px] font-medium text-text-primary">{userName}</span>
              <span className="truncate font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {userTitle}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
