"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  LogOut,
  CheckCheck,
  Trash2,
  Calendar,
  MessageCircle,
  CheckSquare,
  AtSign,
  LayoutDashboard,
  Layers,
  FileText,
  FolderOpen,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { signOut } from "@/app/actions";
import { ROLE_CONFIGS } from "@/lib/rbac";
import { NAVIGATION_ITEMS, APP_NAME } from "@/lib/constants";
import type { AppNotification } from "@/types";

const notifIconMap = {
  task: CheckSquare,
  mention: AtSign,
  meeting: Calendar,
  chat: MessageCircle,
};

const navIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  workspace: Layers,
  documents: FileText,
  files: FolderOpen,
  tasks: CheckSquare,
  meetings: Calendar,
  chat: MessageCircle,
  settings: SettingsIcon,
};

// Complete Navigation for Headbar
const HEADBAR_ITEMS = [
  ...NAVIGATION_ITEMS,
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
    description: "System preferences",
  },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    setCommandMenuOpen,
    userInitials,
    userRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "task" | "mention" | "meeting">("all");
  const notifRef = useRef<HTMLDivElement>(null);

  const roleConfig = ROLE_CONFIGS[userRole];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === "all") return true;
    return n.type === notifFilter;
  });

  // Click Outside Handler to dismiss notification popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotifClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.href) {
      router.push(n.href);
      setShowNotifications(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface-1/90 px-6 backdrop-blur-xl">
      {/* ── Left: Brand Logo & RBAC Clearance ─────────── */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground font-mono text-[11px] font-bold text-background">
            F
          </div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
            {APP_NAME}
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          <span className="font-mono font-semibold uppercase tracking-wider text-text-primary">
            {roleConfig?.label}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            LVL {roleConfig?.clearanceLevel}
          </span>
        </div>
      </div>

      {/* ── Center: Head Bar Navigation Menu ───────────── */}
      <nav className="hidden lg:flex items-center divide-x divide-border-subtle">
        {HEADBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = navIconMap[item.icon] || Layers;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? "text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-surface-2/60"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isActive ? "text-text-primary" : "opacity-60 group-hover:opacity-100"
                }`}
              />
              <span>{item.label}</span>

              {/* Active Indicator Underline */}
              {isActive && (
                <motion.div
                  layoutId="headbar-active-indicator"
                  className="absolute bottom-0 left-2 right-2 h-px bg-purple"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Right: Search, Notifications & User Actions ── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Command Search Trigger */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="group flex h-8 items-center gap-2 rounded-full border border-border-subtle bg-transparent px-3 text-sm text-text-tertiary transition-all hover:border-border-hover hover:bg-surface-2 hover:text-text-secondary"
        >
          <Search className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="font-mono text-[10px] tracking-wide opacity-60 transition-opacity group-hover:opacity-100">
            ⌘K
          </span>
        </button>

        {/* Notifications Popover Trigger */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`group relative flex h-8 w-8 items-center justify-center rounded-md border bg-transparent text-text-tertiary transition-all ${
              showNotifications || unreadCount > 0
                ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                : "border-border-subtle hover:border-border-hover hover:bg-surface-2 hover:text-text-secondary"
            }`}
            title="Notifications"
          >
            <Bell className="h-4 w-4 opacity-80 transition-opacity group-hover:opacity-100" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded bg-purple font-mono text-[9px] font-bold text-background ring-1 ring-background">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ duration: 0.12, ease: "linear" }}
                className="absolute right-0 top-10 w-96 overflow-hidden rounded-lg border border-border bg-surface-1 z-50 shadow-none"
              >
                {/* Header Controls */}
                <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5 bg-surface-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-primary">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[9px] text-text-secondary border border-border-subtle">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead()}
                        className="flex items-center gap-1 font-mono text-[10px] text-text-tertiary hover:text-text-primary transition-colors"
                        title="Mark all read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>Read All</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={() => clearNotifications()}
                        className="flex items-center gap-1 font-mono text-[10px] text-text-tertiary hover:text-red-400 transition-colors ml-1"
                        title="Clear all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 border-b border-border-subtle px-4 py-2 bg-surface-1">
                  {(["all", "task", "mention", "meeting"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setNotifFilter(tab)}
                      className={`rounded px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        notifFilter === tab
                          ? "bg-surface-3 text-text-primary font-medium"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center text-text-tertiary">
                      <Bell className="h-6 w-6 mx-auto mb-2 opacity-20" />
                      <p className="text-[12px]">No notifications in this filter.</p>
                    </div>
                  ) : (
                    filteredNotifications.map((note) => {
                      const Icon = notifIconMap[note.type] || Bell;

                      return (
                        <div
                          key={note.id}
                          onClick={() => handleNotifClick(note)}
                          className={`group flex items-start gap-3.5 p-4 transition-colors hover:bg-surface-2 cursor-pointer ${
                            !note.read ? "bg-surface-2/50" : ""
                          }`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border transition-colors ${
                            !note.read
                              ? "border-border bg-foreground text-background"
                              : "border-border-subtle bg-surface-3 text-text-tertiary"
                          }`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>

                          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className={`text-[13px] font-medium transition-colors ${!note.read ? "text-text-primary" : "text-text-secondary"}`}>
                                {note.title}
                              </span>
                              <span className="font-mono text-[9px] text-text-tertiary shrink-0 ml-2">
                                {note.time}
                              </span>
                            </div>
                            <p className="text-[11.5px] text-text-tertiary leading-relaxed truncate">
                              {note.description}
                            </p>
                          </div>

                          {!note.read && (
                            <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-transparent text-text-tertiary transition-all hover:border-border-hover hover:bg-surface-2 hover:text-text-secondary"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>

        {/* User Initials Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 font-mono text-[11px] text-text-primary ring-1 ring-border-subtle">
          {userInitials}
        </div>

        {/* Barcode Element */}
        <div className="ml-2 hidden lg:block h-6 w-12 barcode-element opacity-40" title="OS.ID.X" />
      </div>
    </header>
  );
}
