"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
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
                    ? "bg-white/[0.06] text-white"
                    : "text-white/35 hover:bg-white/[0.03] hover:text-white/60"
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
              <div className="flex items-center gap-4 rounded-xl border border-white/[0.04] p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] text-lg font-medium text-white/70 ring-1 ring-white/[0.08]">
                  AC
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-white/90">{userName}</span>
                  <span className="font-mono text-[11px] text-white/35">{userTitle}</span>
                </div>
              </div>

              <div className="space-y-4">
                <SettingsField label="Full Name" value={userName} />
                <SettingsField label="Email" value="alex@founderhub.com" />
                <SettingsField label="Time Zone" value="Pacific Time (PT)" />
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
              <SettingsRow label="Theme" description="Interface color scheme" value="Titanium Dark" />
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
                  <span className="text-[13px] text-white/60">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="flex h-6 min-w-[24px] items-center justify-center rounded border border-white/[0.08] bg-white/[0.04] px-1.5 font-mono text-[10px] text-white/50"
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
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">
        {label}
      </label>
      <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-[13px] text-white/70">
        {value}
      </div>
    </div>
  );
}

function SettingsRow({ label, description, value }: { label: string; description: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-white/80">{label}</span>
        <span className="text-[11px] text-white/30">{description}</span>
      </div>
      <span className="text-[12px] text-white/50">{value}</span>
    </div>
  );
}

function SettingsToggle({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-white/80">{label}</span>
        <span className="text-[11px] text-white/30">{description}</span>
      </div>
      <div className={`h-5 w-9 rounded-full transition-colors ${enabled ? "bg-purple-500/60" : "bg-white/10"}`}>
        <div className={`h-4 w-4 translate-y-0.5 rounded-full bg-white transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </div>
    </div>
  );
}
