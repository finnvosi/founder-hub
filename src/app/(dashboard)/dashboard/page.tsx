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

// ─── Morning Desk Data ─────────────────────────────────────
const TODAY_TASKS = [
  { id: 1, title: "Review Q3 board deck draft", priority: "high", due: "Today" },
  { id: 2, title: "Approve marketing budget proposal", priority: "medium", due: "Today" },
  { id: 3, title: "Sign partnership agreement", priority: "high", due: "Today" },
];

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
  high: "bg-red-500/20 text-red-400",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-emerald-500/20 text-emerald-400",
};

export default function DashboardPage() {
  return (
    <div className="w-full max-w-3xl">
      <PageHeader
        title="Good morning, Alex"
        subtitle="Here is what needs your attention today."
      />

      {/* ── Today's Tasks ─────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Today&apos;s Tasks
          </h2>
        </div>
        <div className="space-y-1">
          {TODAY_TASKS.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              transition={transitionMicro}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-white/10 transition-colors group-hover:border-white/20" />
                <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${priorityColor[task.priority]}`}>
                  {task.priority}
                </span>
                <span className="font-mono text-[10px] text-white/25">{task.due}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Upcoming Meetings ─────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Upcoming Meetings
          </h2>
        </div>
        <div className="space-y-1">
          {UPCOMING_MEETINGS.map((meeting) => (
            <motion.div
              key={meeting.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              transition={transitionMicro}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-purple-400/60" strokeWidth={1.5} />
                <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">
                  {meeting.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/25">
                  {meeting.attendees} attendees
                </span>
                <span className="font-mono text-[11px] text-white/50">{meeting.time}</span>
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
            <FileText className="h-4 w-4 text-white/30" strokeWidth={1.5} />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              Recent Documents
            </h2>
          </div>
          <div className="space-y-1">
            {RECENT_DOCUMENTS.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                transition={transitionMicro}
                className="group flex cursor-pointer flex-col gap-1 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">
                  {doc.title}
                </span>
                <span className="font-mono text-[10px] text-white/25">
                  {doc.updated} · {doc.author}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Unread Messages */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-white/30" strokeWidth={1.5} />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              Messages
            </h2>
          </div>
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            transition={transitionMicro}
            className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15">
                <MessageCircle className="h-4 w-4 text-purple-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-white/80">
                  {UNREAD_MESSAGES} unread messages
                </span>
                <span className="font-mono text-[10px] text-white/25">across 2 channels</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white/20 transition-all group-hover:text-white/50 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </motion.div>
        </section>
      </div>

      {/* ── Recent Activity ───────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-0">
          {RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-[13px] text-white/50">{activity.text}</span>
              <span className="font-mono text-[10px] text-white/20 shrink-0 ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
