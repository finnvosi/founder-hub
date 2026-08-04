"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMicro, transitionMacro } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MOCK_TASKS = [
  { id: "1", title: "Finalize Phase 3 Schema", status: "done", assignee: "Finn", due: "Today" },
  { id: "2", title: "Implement Notification Popover", status: "in_progress", assignee: "Finn", due: "Tomorrow" },
  { id: "3", title: "Review Board Deck", status: "todo", assignee: "Sarah", due: "In 2 days" },
  { id: "4", title: "Draft Engineering Onboarding", status: "todo", assignee: "Alex", due: "Next week" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      )
    );
  };

  return (
    <div className="w-full max-w-5xl">
      <PageHeader title="Task Center" subtitle="Workflow & Execution" />

      <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-4">
          <div className="col-span-1 mono-label text-center">Status</div>
          <div className="col-span-6 mono-label">Task</div>
          <div className="col-span-2 mono-label">Assignee</div>
          <div className="col-span-3 mono-label text-right">Due</div>
        </div>

        <div className="divide-y divide-border">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                transition={transitionMacro}
                className={cn(
                  "group grid cursor-pointer grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2",
                  task.status === "done" && "opacity-50"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <div className="col-span-1 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    transition={transitionMicro}
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border transition-colors",
                      task.status === "done"
                        ? "border-text-primary bg-text-primary"
                        : "border-text-tertiary group-hover:border-text-secondary"
                    )}
                  >
                    {task.status === "done" && (
                      <motion.svg
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={transitionMicro}
                        className="h-3 w-3 text-titanium-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.div>
                </div>
                
                <div className="col-span-6">
                  <span
                    className={cn(
                      "text-sm font-medium transition-all",
                      task.status === "done"
                        ? "text-text-tertiary line-through"
                        : "text-text-primary group-hover:text-purple-400"
                    )}
                  >
                    {task.title}
                  </span>
                </div>
                
                <div className="col-span-2 font-mono text-[11px] text-text-secondary">
                  {task.assignee}
                </div>
                
                <div className="col-span-3 text-right font-mono text-[11px] text-text-secondary">
                  {task.due}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
