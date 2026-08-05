"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/layout/page-header";
import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { ROLE_CONFIGS } from "@/lib/rbac";
import type { ExecutiveRole } from "@/types";
import {
  User,
  Palette,
  Bell,
  Shield,
  Keyboard,
} from "lucide-react";

type SettingsTab = "profile" | "appearance" | "notifications" | "security" | "shortcuts";

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
];

const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["⌘", "B"], description: "Toggle sidebar" },
  { keys: ["⌘", "N"], description: "New document" },
  { keys: ["⌘", "⇧", "F"], description: "Global search" },
  { keys: ["Esc"], description: "Close panel" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { userName, userTitle } = useAppStore();

  return (
    <div className="w-full max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Your preferences."
      />

      <div className="flex gap-8">
        {/* Tab navigation */}
        <nav className="flex w-48 shrink-0 flex-col gap-0.5">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary"
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-purple-400" : "opacity-50"}`} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionMicro}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 rounded-xl border border-border-subtle p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-3 text-lg font-medium text-text-primary ring-1 ring-border-subtle">
                  AC
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-text-primary">{userName}</span>
                  <span className="font-mono text-[11px] text-text-tertiary">{userTitle}</span>
                </div>
              </div>

              <div className="space-y-4">
                <SettingsField label="Full Name" value={userName} />
                <SettingsField label="Email" value="alex@founderhub.com" />
                <SettingsField label="Time Zone" value="Pacific Time (PT)" />
                <SettingsRoleRow />
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionMicro}
              className="space-y-4"
            >
              <SettingsThemeRow />
              <SettingsRow label="Sidebar" description="Default sidebar state" value="Expanded" />
              <SettingsRow label="Motion" description="Interface animations" value="Enabled" />
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionMicro}
              className="space-y-4"
            >
              <SettingsToggle label="Task assignments" description="Get notified when a task is assigned to you" enabled />
              <SettingsToggle label="Meeting reminders" description="Receive reminders before meetings" enabled />
              <SettingsToggle label="Document mentions" description="Get notified when mentioned in a document" enabled />
              <SettingsToggle label="Chat messages" description="Notifications for new messages" enabled={false} />
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionMicro}
              className="space-y-4"
            >
              <SettingsRow label="Password" description="Last changed 30 days ago" value="••••••••" />
              <SettingsRow label="Two-factor" description="Additional security layer" value="Enabled" />
              <SettingsRow label="Sessions" description="Active login sessions" value="2 devices" />
            </motion.div>
          )}

          {activeTab === "shortcuts" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionMicro}
              className="space-y-1"
            >
              {SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.description}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-[13px] text-text-secondary">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="flex h-6 min-w-[24px] items-center justify-center rounded border border-border-hover bg-surface-2 px-1.5 font-mono text-[10px] text-text-tertiary"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings UI Primitives ────────────────────────────────

function SettingsField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </label>
      <div className="rounded-lg border border-border-subtle bg-surface-2 px-4 py-3 text-[13px] text-text-primary">
        {value}
      </div>
    </div>
  );
}

function SettingsRow({ label, description, value }: { label: string; description: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-surface-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-text-primary">{label}</span>
        <span className="text-[11px] text-text-tertiary">{description}</span>
      </div>
      <span className="text-[12px] text-text-secondary">{value}</span>
    </div>
  );
}

function SettingsToggle({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-surface-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-text-primary">{label}</span>
        <span className="text-[11px] text-text-tertiary">{description}</span>
      </div>
      <div className={`h-5 w-9 rounded-full transition-colors ${enabled ? "bg-purple-500/60" : "bg-surface-3"}`}>
        <div className={`h-4 w-4 translate-y-0.5 rounded-full bg-background transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </div>
    </div>
  );
}

function SettingsThemeRow() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-surface-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-text-primary">Theme</span>
        <span className="text-[11px] text-text-tertiary">Interface color scheme</span>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-1 p-0.5">
        {["light", "dark", "system"].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`rounded-md px-3 py-1 text-[11px] font-medium capitalize transition-colors ${
              theme === t
                ? "bg-surface-3 text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary hover:bg-surface-2"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsRoleRow() {
  const { userRole, setUserRole } = useAppStore();
  const roles: ExecutiveRole[] = ["ceo", "cfo", "cmo", "cto", "tech-lead"];
  const currentConfig = ROLE_CONFIGS[userRole];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-text-primary">Executive Role & Clearance</span>
          <span className="text-[11px] text-text-tertiary">
            Role-Based Access Control (RBAC) security level: <span className="font-mono text-purple-400">Level {currentConfig.clearanceLevel}</span> ({currentConfig.code})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {roles.map((r) => {
          const isSelected = userRole === r;
          const conf = ROLE_CONFIGS[r];

          return (
            <button
              key={r}
              onClick={() => setUserRole(r)}
              className={`flex flex-col items-center justify-center rounded-lg p-2.5 transition-all text-center border ${
                isSelected
                  ? "border-purple-500/40 bg-purple-500/10 text-text-primary shadow-sm"
                  : "border-border-subtle bg-surface-2 text-text-tertiary hover:border-border-hover hover:text-text-secondary"
              }`}
            >
              <span className="font-mono text-[11px] font-semibold">{conf.label}</span>
              <span className="font-mono text-[9px] opacity-60">Lvl {conf.clearanceLevel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1 rounded bg-surface-2 p-2.5 font-mono text-[10px] text-text-tertiary">
        <p className="text-text-secondary mb-1">{currentConfig.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentConfig.permissions.map((p) => (
            <span key={p} className="rounded bg-surface-3 px-1.5 py-0.5 text-[9px] text-text-primary">
              ✓ {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

