"use client";

import { PageHeader } from "@/components/layout/page-header";
import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import {
  CheckSquare,
  Calendar,
  FileText,
  MessageCircle,
  ArrowRight,
  Clock,
} from "lucide-react";

import { useAppStore } from "@/stores/app-store";

const UPCOMING_MEETINGS = [
  { id: 1, title: "Product Sync", time: "10:00 AM", attendees: 4 },
  { id: 2, title: "Investor Call — Series B", time: "2:00 PM", attendees: 3 },
];

const RECENT_DOCUMENTS = [
  { id: 1, title: "Q3 Board Deck", updated: "2 hours ago", author: "Sarah" },
  { id: 2, title: "Partnership Agreement — Stripe", updated: "Yesterday", author: "Legal" },
  { id: 3, title: "Technical Architecture v2", updated: "2 days ago", author: "Dev Team" },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "Sarah shared Q3 Board Deck", time: "2h ago" },
  { id: 2, text: "New task assigned: Finalize Phase 3 Schema", time: "4h ago" },
  { id: 3, text: "Meeting notes added for Product Sync", time: "Yesterday" },
  { id: 4, text: "Budget proposal submitted for review", time: "Yesterday" },
];

const UNREAD_MESSAGES = 3;

const priorityColor: Record<string, string> = {
  high: "bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  low: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
};

export default function DashboardPage() {
  const { tasks, toggleTask, userName } = useAppStore();

  return (
    <div className="w-full max-w-3xl">
      <PageHeader
        title={`Good morning, ${userName.split(" ")[0] || userName}`}
        subtitle="Here is what needs your attention today."
      />

      {/* ── Today's Tasks ─────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
            Today&apos;s Tasks
          </h2>
        </div>
        <div className="space-y-1">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-surface-2 ${
                task.status === "done" ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  task.status === "done"
                    ? "border-text-primary bg-text-primary"
                    : "border-border group-hover:border-border-hover"
                }`}>
                  {task.status === "done" && (
                    <motion.svg
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={transitionMicro}
                      className="h-3 w-3 text-background"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className={`text-[13px] transition-colors ${
                  task.status === "done"
                    ? "text-text-tertiary line-through"
                    : "text-text-secondary group-hover:text-text-primary"
                }`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${priorityColor[task.priority]}`}>
                  {task.priority}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">{task.due}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Upcoming Meetings ─────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
            Upcoming Meetings
          </h2>
        </div>
        <div className="space-y-1">
          {UPCOMING_MEETINGS.map((meeting) => (
            <motion.div
              key={meeting.id}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-purple-500/60" strokeWidth={1.5} />
                <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors">
                  {meeting.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-text-tertiary">
                  {meeting.attendees} attendees
                </span>
                <span className="font-mono text-[11px] text-text-secondary">{meeting.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Two-column: Recent Docs + Messages ────── */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Recent Documents */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Recent Documents
            </h2>
          </div>
          <div className="space-y-1">
            {RECENT_DOCUMENTS.map((doc) => (
              <motion.div
                key={doc.id}
                className="group flex cursor-pointer flex-col gap-1 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors">
                  {doc.title}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {doc.updated} · {doc.author}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Unread Messages */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Messages
            </h2>
          </div>
          <motion.div
            className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15">
                <MessageCircle className="h-4 w-4 text-purple-500" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors">
                  {UNREAD_MESSAGES} unread messages
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">across 2 channels</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-text-tertiary transition-all group-hover:text-text-secondary group-hover:translate-x-0.5" strokeWidth={1.5} />
          </motion.div>
        </section>
      </div>

      {/* ── Recent Activity ───────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-0">
          {RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-[13px] text-text-secondary">{activity.text}</span>
              <span className="font-mono text-[10px] text-text-tertiary shrink-0 ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
