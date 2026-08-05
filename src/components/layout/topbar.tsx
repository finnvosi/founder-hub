"use client";

import { useState } from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { signOut } from "@/app/actions";

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Sarah mentioned you in 'Q3 Board Deck'", time: "2m ago", read: false },
  { id: 2, text: "New task assigned: Finalize Phase 3 Schema", time: "1h ago", read: false },
  { id: 3, text: "Meeting starting in 5 mins: Product Sync", time: "2h ago", read: true },
];

export function Topbar() {
  const { setCommandMenuOpen, userInitials } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end px-8">
      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="group flex h-8 items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-3 text-sm text-white/40 transition-all hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white/60"
        >
          <Search className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="font-mono text-[10px] tracking-wide opacity-60 transition-opacity group-hover:opacity-100">
            ⌘K
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.04] bg-white/[0.02] text-white/40 transition-all hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white/60"
          >
            <Bell className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
            <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(4px)" }}
                transition={transitionMacro}
                className="absolute right-0 top-12 w-80 overflow-hidden rounded-md border border-white/[0.06] bg-[oklch(0.13_0_0/90%)] shadow-2xl backdrop-blur-xl"
              >
                <div className="border-b border-white/[0.04] px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">Notifications</span>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.04]">
                  {MOCK_NOTIFICATIONS.map((note) => (
                    <div key={note.id} className={`flex items-start gap-3 p-4 transition-colors hover:bg-white/[0.03] cursor-pointer ${!note.read ? "bg-white/[0.02]" : ""}`}>
                      {!note.read && <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />}
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-white/70 leading-tight">{note.text}</span>
                        <span className="font-mono text-[10px] text-white/25">{note.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => signOut()}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.04] bg-white/[0.02] text-white/40 transition-all hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white/60"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[11px] text-white/70 ring-1 ring-white/[0.08]">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
