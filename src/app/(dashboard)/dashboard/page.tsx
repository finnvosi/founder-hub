"use client";

import { motion } from "framer-motion";
import { transitionMicro } from "@/lib/motion";
import { CheckSquare, Calendar, Clock } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

const UPCOMING_MEETINGS = [
  { id: 1, title: "Product Sync", time: "10:00 AM" },
  { id: 2, title: "Investor Call", time: "2:00 PM" },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "Sarah shared Q3 Deck", time: "2h" },
  { id: 2, text: "Task assigned: Phase 3", time: "4h" },
];

export default function DashboardPage() {
  const { tasks, toggleTask } = useAppStore();

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.FOCAL.PRIMARY
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          STATUS: OPERATIONAL
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            NOMINAL
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase"
          >
            ALL SYSTEMS ALIGNED // NO CRITICAL ALERTS
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col border border-border rounded-sm bg-background p-5 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Telemetry Stream
          </h2>
          <div className="h-1.5 w-1.5 rounded-full bg-purple animate-pulse" />
        </div>

        <div className="flex flex-col gap-8">
          {/* Tasks */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="h-3 w-3 text-text-tertiary" />
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Tasks</span>
            </div>
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`group flex cursor-pointer items-start justify-between gap-3 ${
                  task.status === "done" ? "opacity-40" : ""
                }`}
              >
                <div className={`mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center border transition-colors ${
                  task.status === "done" ? "border-text-primary bg-text-primary" : "border-border"
                }`}>
                  {task.status === "done" && (
                    <motion.svg className="h-2 w-2 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className={`text-[12px] leading-tight ${task.status === "done" ? "line-through text-text-tertiary" : "text-text-secondary group-hover:text-text-primary"}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>

          {/* Meetings */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3 w-3 text-text-tertiary" />
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Schedule</span>
            </div>
            {UPCOMING_MEETINGS.map((meeting) => (
              <div key={meeting.id} className="flex justify-between items-baseline">
                <span className="text-[12px] text-text-secondary">{meeting.title}</span>
                <span className="font-mono text-[9px] text-text-tertiary shrink-0">{meeting.time}</span>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3 text-text-tertiary" />
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Log</span>
            </div>
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex justify-between items-baseline">
                <span className="text-[12px] text-text-tertiary truncate mr-2">{activity.text}</span>
                <span className="font-mono text-[9px] text-text-tertiary/50 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
