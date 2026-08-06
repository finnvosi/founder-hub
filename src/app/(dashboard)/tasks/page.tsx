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
  high: { label: "[ HIGH ]", badgeStyle: "border-border-subtle bg-surface-2 text-text-primary font-bold" },
  medium: { label: "[ MED ]", badgeStyle: "border-border-subtle bg-surface-2 text-text-secondary" },
  low: { label: "[ LOW ]", badgeStyle: "border-border-subtle bg-surface-2 text-text-tertiary" },
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
  const [newTaskAssignee, setNewTaskAssignee] = useState(userName || "Alex Chen");

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
    if (!newTaskTitle.trim() || !newTaskAssignee.trim() || !newTaskDue.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      status: "todo",
      priority: newTaskPriority,
      assignee: newTaskAssignee.trim(),
      due: newTaskDue.trim(),
    });

    setNewTaskTitle("");
    setNewTaskAssignee(userName || "Alex Chen");
    setNewTaskDue("Today");
    setNewTaskPriority("medium");
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
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541123437800-1bb1317bc951?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.TASKS
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          STATUS: {progressPercent}% EXECUTED
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            EXECUTE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase"
          >
            ACTIVE MISSIONS // {tasks.length - completedCount} PENDING
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 flex flex-col border border-border rounded-sm bg-surface-1/60 overflow-y-auto relative glass-card backdrop-blur-md p-5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Task Execution Stream
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded bg-foreground px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-background transition-all hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-md border border-border-subtle bg-surface-1 pl-9 pr-3 py-1.5 text-[12px] font-mono text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-hover"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded border border-border-subtle bg-surface-1 p-0.5">
              {(["all", "active", "done"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`rounded px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    filterStatus === st
                      ? "bg-surface-3 text-text-primary"
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded border border-border-subtle bg-surface-1 p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  viewMode === "list"
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <ListIcon className="h-3 w-3" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  viewMode === "board"
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <Kanban className="h-3 w-3" />
                <span>Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Creation Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transitionMicro}
              className="overflow-hidden mb-6 rounded border border-border bg-surface-1/60 p-4 glass-card backdrop-blur-md"
            >
              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-primary">Create New Task</span>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-text-tertiary hover:text-text-primary">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Task Title</label>
                    <input
                      autoFocus
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g., Finalize Q3 Architecture"
                      className="w-full bg-surface-2 border border-border-subtle px-3 py-2 rounded text-[13px] font-medium text-text-primary outline-none focus:border-border-hover placeholder:text-text-tertiary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Assignee</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                        <input
                          type="text"
                          value={newTaskAssignee}
                          onChange={(e) => setNewTaskAssignee(e.target.value)}
                          placeholder="e.g., Alex Chen"
                          className="w-full bg-surface-2 border border-border-subtle pl-8 pr-3 py-2 rounded text-[12px] font-mono text-text-primary outline-none focus:border-border-hover placeholder:text-text-tertiary"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Due Date</label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                        <input
                          type="text"
                          value={newTaskDue}
                          onChange={(e) => setNewTaskDue(e.target.value)}
                          placeholder="e.g., Tomorrow, Next Week"
                          className="w-full bg-surface-2 border border-border-subtle pl-8 pr-3 py-2 rounded text-[12px] font-mono text-text-primary outline-none focus:border-border-hover placeholder:text-text-tertiary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mr-2">Priority:</span>
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTaskPriority(p)}
                        className={`rounded px-2 py-1 font-mono text-[9px] uppercase tracking-wider border transition-colors ${
                          newTaskPriority === p
                            ? priorityConfig[p].badgeStyle
                            : "border-border-subtle text-text-tertiary hover:text-text-secondary"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!newTaskTitle.trim() || !newTaskAssignee.trim() || !newTaskDue.trim()}
                    className="rounded bg-foreground px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-background disabled:opacity-40 transition-all hover:opacity-90"
                  >
                    Execute Task
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LIST VIEW ── */}
        {viewMode === "list" ? (
          <div className="flex flex-col gap-1">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-text-tertiary">
                <CheckSquare className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p className="font-mono text-[10px] uppercase">No tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "group flex flex-col gap-2 rounded border border-border-subtle p-3 transition-colors hover:bg-surface-2 glass-card backdrop-blur-sm bg-surface-1/40",
                    task.status === "done" && "opacity-50 grayscale hover:grayscale-0"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex justify-center cursor-pointer" onClick={() => toggleTask(task.id)}>
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                            task.status === "done"
                              ? "border-text-primary bg-text-primary"
                              : "border-border-hover hover:border-text-primary"
                          )}
                        >
                          {task.status === "done" && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {editingId === task.id ? (
                          <form onSubmit={(e) => handleEditSubmit(e, task.id)} className="w-full">
                            <input
                              autoFocus
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={(e) => handleEditSubmit(e, task.id)}
                              className="w-full bg-surface-3 px-2 py-0.5 rounded text-[13px] font-medium text-text-primary outline-none"
                            />
                          </form>
                        ) : (
                          <span
                            onClick={() => toggleTask(task.id)}
                            className={cn(
                              "text-[13px] font-medium leading-snug cursor-pointer",
                              task.status === "done" ? "text-text-tertiary line-through" : "text-text-primary hover:text-text-secondary"
                            )}
                          >
                            {task.title}
                          </span>
                        )}
                        {task.deliverableNote && (
                          <button
                            onClick={() => setViewingDeliverableTask(task)}
                            className="mt-1 flex items-center gap-1 font-mono text-[9px] text-text-secondary hover:text-text-primary transition-colors w-fit"
                          >
                            <FileCheck className="h-3 w-3" />
                            <span>Proof Attached →</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => cyclePriority(task.id, task.priority)}
                      className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-all hover:scale-105 ${priorityConfig[task.priority].badgeStyle}`}
                    >
                      {priorityConfig[task.priority].label}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle font-mono text-[10px] text-text-tertiary">
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-3 text-[8px] text-text-primary">
                        {task.assignee.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[80px]">{task.assignee}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.status !== "done" ? (
                        <button
                          onClick={() => setDeliveringTask(task)}
                          className="hover:text-text-primary transition-colors"
                        >
                          Deliver
                        </button>
                      ) : (
                        <button
                          onClick={() => setViewingDeliverableTask(task)}
                          className="hover:text-text-primary transition-colors"
                        >
                          View Result
                        </button>
                      )}
                      <span className="opacity-30">|</span>
                      <button onClick={() => { setEditTitle(task.title); setEditingId(task.id); }} className="hover:text-text-primary transition-colors">Edit</button>
                      <span className="opacity-30">|</span>
                      <button onClick={() => deleteTask(task.id)} className="hover:text-red-400 transition-colors">Del</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ── KANBAN BOARD VIEW ── */
          <div className="flex flex-col gap-6">
            {/* Column: To Do */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-primary">To Do</span>
                <span className="font-mono text-[9px] text-text-tertiary">{filteredTasks.filter(t => t.status !== "done").length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {filteredTasks.filter((t) => t.status !== "done").map((task) => (
                  <div key={task.id} className="flex flex-col gap-2 rounded border border-border-subtle bg-surface-1 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[12px] font-medium text-text-primary leading-snug">{task.title}</span>
                      <button onClick={() => cyclePriority(task.id, task.priority)} className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase ${priorityConfig[task.priority].badgeStyle}`}>
                        {priorityConfig[task.priority].label}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-[9px] text-text-tertiary">
                      <span className="truncate max-w-[80px]">{task.assignee}</span>
                      <button onClick={() => setDeliveringTask(task)} className="text-text-primary hover:underline">Deliver →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column: Done */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-1 opacity-60">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-primary">Done</span>
                <span className="font-mono text-[9px] text-text-tertiary">{filteredTasks.filter(t => t.status === "done").length}</span>
              </div>
              <div className="flex flex-col gap-2 opacity-60">
                {filteredTasks.filter((t) => t.status === "done").map((task) => (
                  <div key={task.id} className="flex flex-col gap-2 rounded border border-border-subtle bg-surface-1 p-3">
                    <span className="text-[12px] font-medium text-text-secondary line-through leading-snug">{task.title}</span>
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-[9px] text-text-tertiary">
                      <span>{task.assignee}</span>
                      {task.deliverableNote && (
                        <button onClick={() => setViewingDeliverableTask(task)} className="text-text-primary hover:underline">Proof</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {/* Submit Deliverable */}
      <AnimatePresence>
        {deliveringTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transitionMicro}
              className="w-full max-w-md rounded border border-border bg-surface-1 p-5"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Deliverable</span>
                  <h3 className="text-[14px] font-medium text-text-primary mt-1">Submit Result</h3>
                </div>
                <button onClick={() => setDeliveringTask(null)} className="text-text-tertiary hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleDeliverSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Summary</label>
                  <textarea
                    required
                    rows={3}
                    value={deliverableNote}
                    onChange={(e) => setDeliverableNote(e.target.value)}
                    className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none focus:border-border-hover resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Link (Optional)</label>
                  <input
                    type="url"
                    value={deliverableLink}
                    onChange={(e) => setDeliverableLink(e.target.value)}
                    className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none focus:border-border-hover"
                  />
                </div>
                <div className="flex justify-end pt-2 border-t border-border-subtle">
                  <button type="submit" className="rounded bg-foreground px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-background hover:opacity-90">
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Deliverable */}
      <AnimatePresence>
        {viewingDeliverableTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transitionMicro}
              className="w-full max-w-md rounded border border-border bg-surface-1 p-5"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Delivered</span>
                  <h3 className="text-[14px] font-medium text-text-primary mt-1">{viewingDeliverableTask.title}</h3>
                </div>
                <button onClick={() => setViewingDeliverableTask(null)} className="text-text-tertiary hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Summary</span>
                  <div className="rounded border border-border-subtle bg-surface-2 p-3 text-[12px] text-text-primary whitespace-pre-wrap">
                    {viewingDeliverableTask.deliverableNote}
                  </div>
                </div>
                {viewingDeliverableTask.deliverableLink && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Link</span>
                    <a href={viewingDeliverableTask.deliverableLink} target="_blank" rel="noreferrer" className="truncate rounded border border-border bg-surface-2 px-3 py-2 font-mono text-[10px] text-text-primary hover:bg-surface-3">
                      {viewingDeliverableTask.deliverableLink}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
