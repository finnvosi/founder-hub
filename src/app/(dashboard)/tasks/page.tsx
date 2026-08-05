"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMicro, transitionMacro } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setIsAdding(false);
      return;
    }
    addTask({
      title: newTaskTitle.trim(),
      status: "todo",
      priority: "medium",
      assignee: "Unassigned",
      due: "Pending",
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

  return (
    <div className="w-full max-w-5xl">
      <PageHeader title="Task Center" subtitle="Workflow & Execution" />

      <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-4">
          <div className="col-span-1 mono-label text-center">Status</div>
          <div className="col-span-6 mono-label">Task</div>
          <div className="col-span-2 mono-label">Assignee</div>
          <div className="col-span-3 mono-label text-right">Due / Actions</div>
        </div>

        <div className="divide-y divide-border">
          
          {/* Add Task Row */}
          <AnimatePresence>
            {isAdding ? (
              <motion.div
                key="add-task-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={transitionMicro}
                className="overflow-hidden bg-surface-2"
              >
                <form onSubmit={handleAddSubmit} className="grid grid-cols-12 items-center gap-4 px-6 py-3">
                  <div className="col-span-1 flex justify-center">
                    <div className="h-4 w-4 rounded-sm border border-text-tertiary border-dashed" />
                  </div>
                  <div className="col-span-10">
                    <input
                      autoFocus
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Type a new task and press Enter..."
                      className="w-full bg-transparent text-sm font-medium text-text-primary outline-none placeholder:font-mono placeholder:text-text-tertiary placeholder:uppercase placeholder:tracking-wider placeholder:text-[10px]"
                      onBlur={() => {
                        if (!newTaskTitle.trim()) setIsAdding(false);
                      }}
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button type="button" onClick={() => setIsAdding(false)} className="text-text-tertiary hover:text-text-secondary transition-colors p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="add-task-trigger"
                layout
                className="group flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2 border-b border-border"
                onClick={() => setIsAdding(true)}
              >
                <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-transparent text-text-tertiary transition-colors group-hover:bg-white/[0.04] group-hover:text-text-secondary">
                  <Plus className="h-3 w-3" />
                </div>
                <span className="mono-label group-hover:text-text-secondary">Add new task</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List */}
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                transition={transitionMacro}
                className={cn(
                  "group grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2",
                  task.status === "done" && "opacity-50"
                )}
              >
                <div className="col-span-1 flex justify-center cursor-pointer" onClick={() => toggleTask(task.id)}>
                  <motion.div
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    transition={transitionMicro}
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border transition-colors",
                      task.status === "done"
                        ? "border-text-primary bg-text-primary"
                        : "border-text-tertiary hover:border-text-secondary"
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
                  {editingId === task.id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, task.id)} className="w-full">
                      <input
                        autoFocus
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={(e) => handleEditSubmit(e, task.id)}
                        className="w-full bg-surface-3 px-2 py-1 -ml-2 rounded text-sm font-medium text-text-primary outline-none"
                      />
                    </form>
                  ) : (
                    <span
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "text-sm font-medium transition-all cursor-pointer",
                        task.status === "done"
                          ? "text-text-tertiary line-through"
                          : "text-text-primary group-hover:text-purple-400"
                      )}
                    >
                      {task.title}
                    </span>
                  )}
                </div>
                
                <div className="col-span-2 font-mono text-[11px] text-text-secondary">
                  {task.assignee}
                </div>
                
                <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                  <span className="font-mono text-[11px] text-text-secondary group-hover:hidden transition-all">
                    {task.due}
                  </span>
                  
                  {/* Hover Actions */}
                  <div className="hidden group-hover:flex items-center justify-end gap-2 text-text-tertiary">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditTitle(task.title); setEditingId(task.id); }}
                      className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className="p-1 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
