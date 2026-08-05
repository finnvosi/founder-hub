"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMicro, transitionMacro } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Kanban,
  List as ListIcon,
  CheckSquare,
  Clock,
  User,
  Upload,
  ExternalLink,
  FileCheck,
  Eye,
} from "lucide-react";
import type { TaskPriority, TaskStatus, Task } from "@/types";

const priorityConfig: Record<TaskPriority, { label: string; badgeStyle: string }> = {
  high: { label: "High", badgeStyle: "border-red-500/30 bg-red-500/10 text-red-400" },
  medium: { label: "Medium", badgeStyle: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  low: { label: "Low", badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, userName } = useAppStore();
  
  // UI State
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Creation Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskDue, setNewTaskDue] = useState("Today");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Deliverable Submission & View State
  const [deliveringTask, setDeliveringTask] = useState<Task | null>(null);
  const [deliverableNote, setDeliverableNote] = useState("");
  const [deliverableLink, setDeliverableLink] = useState("");
  const [viewingDeliverableTask, setViewingDeliverableTask] = useState<Task | null>(null);

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "active" && t.status === "done") return false;
    if (filterStatus === "done" && t.status !== "done") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      status: "todo",
      priority: newTaskPriority,
      assignee: userName || "Alex Chen",
      due: newTaskDue || "Today",
    });

    setNewTaskTitle("");
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateTask(id, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const cyclePriority = (id: string, currentPriority: TaskPriority) => {
    const nextPriority: Record<TaskPriority, TaskPriority> = {
      low: "medium",
      medium: "high",
      high: "low",
    };
    updateTask(id, { priority: nextPriority[currentPriority] });
  };

  const handleDeliverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringTask) return;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    updateTask(deliveringTask.id, {
      status: "done",
      deliverableNote: deliverableNote.trim() || "Task result delivered successfully.",
      deliverableLink: deliverableLink.trim() || undefined,
      deliveredAt: formattedDate,
    });

    setDeliveringTask(null);
    setDeliverableNote("");
    setDeliverableLink("");
  };

  return (
    <div className="w-full max-w-5xl">
      {/* Top Header & Metrics */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <div className="mono-label mb-2">Workflow & Execution</div>
          <h1 className="text-[32px] font-medium tracking-tight text-text-primary">Task Center</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Pill */}
          <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-4 py-2">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">Execution Rate</span>
              <span className="font-mono text-[12px] font-semibold text-text-primary">
                {completedCount}/{tasks.length} ({progressPercent}%)
              </span>
            </div>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={transitionMacro}
              />
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-all hover:opacity-90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters & View Mode */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border-subtle pb-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks by title or assignee..."
              className="w-full rounded-lg border border-border-subtle bg-surface-1 pl-9 pr-3 py-1.5 text-[13px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-hover"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-1 p-0.5">
            {(["all", "active", "done"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  filterStatus === st
                    ? "bg-surface-3 text-text-primary shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-1 p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              viewMode === "list"
                ? "bg-surface-3 text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <ListIcon className="h-3 w-3" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              viewMode === "board"
                ? "bg-surface-3 text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <Kanban className="h-3 w-3" />
            <span>Board</span>
          </button>
        </div>
      </div>

      {/* Inline Creation Drawer Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitionMicro}
            className="overflow-hidden mb-6 rounded-xl border border-purple-500/30 bg-surface-1 p-4 shadow-lg"
          >
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="mono-label text-[10px] text-purple-400">Quick Task Creation</span>
                <button type="button" onClick={() => setIsAdding(false)} className="text-text-tertiary hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-transparent text-[14px] font-medium text-text-primary outline-none placeholder:text-text-tertiary"
              />

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-text-tertiary">Priority:</span>
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTaskPriority(p)}
                        className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider border ${
                          newTaskPriority === p
                            ? priorityConfig[p].badgeStyle
                            : "border-border-subtle text-text-tertiary hover:text-text-secondary"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-text-tertiary">Due:</span>
                    <input
                      type="text"
                      value={newTaskDue}
                      onChange={(e) => setNewTaskDue(e.target.value)}
                      className="rounded border border-border-subtle bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-secondary outline-none w-24"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="rounded-lg bg-foreground px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-background disabled:opacity-40 transition-all hover:opacity-90"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LIST VIEW ── */}
      {viewMode === "list" ? (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
          <div className="grid grid-cols-12 gap-4 border-b border-border-subtle px-6 py-3 bg-surface-1">
            <div className="col-span-1 mono-label text-center">Done</div>
            <div className="col-span-5 mono-label">Task Title</div>
            <div className="col-span-2 mono-label text-center">Priority</div>
            <div className="col-span-2 mono-label">Assignee</div>
            <div className="col-span-2 mono-label text-right">Deliver / Actions</div>
          </div>

          <div className="divide-y divide-border-subtle">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-text-tertiary">
                <CheckSquare className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p className="text-[13px]">No tasks found.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  transition={transitionMacro}
                  className={cn(
                    "group grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2",
                    task.status === "done" && "opacity-60"
                  )}
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex justify-center cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <motion.div
                      whileHover={{ scale: 0.9 }}
                      whileTap={{ scale: 0.8 }}
                      transition={transitionMicro}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        task.status === "done"
                          ? "border-text-primary bg-text-primary"
                          : "border-border-hover hover:border-text-primary"
                      )}
                    >
                      {task.status === "done" && (
                        <Check className="h-3 w-3 text-background" strokeWidth={3} />
                      )}
                    </motion.div>
                  </div>

                  {/* Title & Deliverable Info */}
                  <div className="col-span-5 flex flex-col gap-0.5">
                    {editingId === task.id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, task.id)} className="w-full">
                        <input
                          autoFocus
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={(e) => handleEditSubmit(e, task.id)}
                          className="w-full bg-surface-3 px-2 py-1 rounded text-[13px] font-medium text-text-primary outline-none"
                        />
                      </form>
                    ) : (
                      <span
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "text-[13.5px] font-medium transition-colors cursor-pointer",
                          task.status === "done"
                            ? "text-text-tertiary line-through"
                            : "text-text-primary group-hover:text-purple-400"
                        )}
                      >
                        {task.title}
                      </span>
                    )}

                    {task.deliverableNote && (
                      <button
                        onClick={() => setViewingDeliverableTask(task)}
                        className="flex items-center gap-1 font-mono text-[10px] text-purple-400 hover:text-purple-300 transition-colors w-fit"
                      >
                        <FileCheck className="h-3 w-3" />
                        <span>Deliverable Attached →</span>
                      </button>
                    )}
                  </div>

                  {/* Priority Badge */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => cyclePriority(task.id, task.priority)}
                      className={`inline-flex items-center rounded border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-all hover:scale-105 ${
                        priorityConfig[task.priority].badgeStyle
                      }`}
                      title="Click to change priority"
                    >
                      {priorityConfig[task.priority].label}
                    </button>
                  </div>

                  {/* Assignee */}
                  <div className="col-span-2 flex items-center gap-2 font-mono text-[11px] text-text-secondary">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[9px] font-medium text-text-primary">
                      {task.assignee.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="truncate">{task.assignee}</span>
                  </div>

                  {/* Deliver Result & Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                    {task.status !== "done" ? (
                      <button
                        onClick={() => setDeliveringTask(task)}
                        className="flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-purple-300 hover:bg-purple-500/20 transition-all"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Deliver</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewingDeliverableTask(task)}
                        className="flex items-center gap-1 rounded border border-border-subtle bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-text-tertiary hover:text-text-primary transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Result</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setEditTitle(task.title); setEditingId(task.id); }}
                      className="p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-3 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ── KANBAN BOARD VIEW ── */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Column: To Do */}
          <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-1 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-primary font-medium">
                To Do ({filteredTasks.filter(t => t.status !== "done").length})
              </span>
            </div>

            <div className="space-y-2.5 min-h-[300px]">
              {filteredTasks
                .filter((t) => t.status !== "done")
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    transition={transitionMacro}
                    className="group flex flex-col gap-3 rounded-lg border border-border-subtle bg-card p-4 transition-all hover:border-border-hover shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-medium text-text-primary leading-snug">
                        {task.title}
                      </span>
                      <button
                        onClick={() => cyclePriority(task.id, task.priority)}
                        className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                          priorityConfig[task.priority].badgeStyle
                        }`}
                      >
                        {task.priority}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-[10px] text-text-tertiary">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>

                      <button
                        onClick={() => setDeliveringTask(task)}
                        className="flex items-center gap-1 rounded bg-purple-500/10 px-2.5 py-1 text-purple-300 hover:bg-purple-500/20 transition-colors font-semibold"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Deliver Result</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Column: Completed & Delivered */}
          <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-1 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-primary font-medium">
                Delivered & Done ({filteredTasks.filter(t => t.status === "done").length})
              </span>
            </div>

            <div className="space-y-2.5 min-h-[300px]">
              {filteredTasks
                .filter((t) => t.status === "done")
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    transition={transitionMacro}
                    className="group flex flex-col gap-3 rounded-lg border border-border-subtle bg-card p-4 opacity-80 transition-all hover:opacity-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-medium text-text-secondary line-through leading-snug">
                        {task.title}
                      </span>
                      <Check className="h-4 w-4 text-purple-400 shrink-0" />
                    </div>

                    {task.deliverableNote && (
                      <p className="text-[11px] text-text-tertiary line-clamp-2 bg-surface-2 p-2 rounded border border-border-subtle italic">
                        &quot;{task.deliverableNote}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-[10px] text-text-tertiary">
                      <span>Delivered by {task.assignee}</span>
                      <button
                        onClick={() => setViewingDeliverableTask(task)}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        View Proof →
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMIT DELIVERABLE RESULT MODAL ── */}
      <AnimatePresence>
        {deliveringTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transitionMicro}
              className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                <div>
                  <span className="mono-label text-purple-400">Deliverable Submission</span>
                  <h3 className="text-[16px] font-medium text-text-primary">
                    Deliver Task Result
                  </h3>
                </div>
                <button
                  onClick={() => setDeliveringTask(null)}
                  className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 rounded-lg border border-border-subtle bg-surface-2 p-3 font-mono text-[11px] text-text-secondary">
                Task: <strong className="text-text-primary">{deliveringTask.title}</strong>
              </div>

              <form onSubmit={handleDeliverSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="mono-label text-[10px]">Proof of Work / Result Summary</label>
                  <textarea
                    required
                    rows={4}
                    value={deliverableNote}
                    onChange={(e) => setDeliverableNote(e.target.value)}
                    placeholder="Describe the output, accomplishments, or details of the completed task..."
                    className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2.5 text-[13px] text-text-primary outline-none focus:border-border-hover resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="mono-label text-[10px]">Deliverable Artifact Link (Optional)</label>
                  <input
                    type="url"
                    value={deliverableLink}
                    onChange={(e) => setDeliverableLink(e.target.value)}
                    placeholder="https://github.com/... or https://figma.com/..."
                    className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2.5 text-[13px] text-text-primary outline-none focus:border-border-hover"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setDeliveringTask(null)}
                    className="rounded-lg px-4 py-2 text-[13px] text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2 text-[13px] font-medium text-background hover:opacity-90 transition-all shadow-md"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Submit & Deliver Result</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── VIEW DELIVERABLE RESULT MODAL ── */}
      <AnimatePresence>
        {viewingDeliverableTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transitionMicro}
              className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                <div>
                  <span className="mono-label text-purple-400">Delivered Result</span>
                  <h3 className="text-[16px] font-medium text-text-primary">
                    {viewingDeliverableTask.title}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingDeliverableTask(null)}
                  className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-text-tertiary rounded-lg bg-surface-2 px-3 py-2 border border-border-subtle">
                  <span>Delivered by: <strong className="text-text-secondary">{viewingDeliverableTask.assignee}</strong></span>
                  <span>{viewingDeliverableTask.deliveredAt || "Completed"}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="mono-label text-[10px]">Deliverable Summary</span>
                  <div className="rounded-lg border border-border-subtle bg-surface-2 p-3.5 text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
                    {viewingDeliverableTask.deliverableNote || "No note attached."}
                  </div>
                </div>

                {viewingDeliverableTask.deliverableLink && (
                  <div className="flex flex-col gap-1.5">
                    <span className="mono-label text-[10px]">Artifact Link</span>
                    <a
                      href={viewingDeliverableTask.deliverableLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 font-mono text-[11px] text-purple-300 hover:bg-purple-500/20 transition-all"
                    >
                      <span className="truncate">{viewingDeliverableTask.deliverableLink}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-2" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-6 border-t border-border-subtle">
                <button
                  onClick={() => setViewingDeliverableTask(null)}
                  className="rounded-lg bg-foreground px-5 py-2 text-[13px] font-medium text-background hover:opacity-90 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
