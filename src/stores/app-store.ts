import { create } from "zustand";
import type { ExecutiveRole } from "@/types";

interface AppState {
  // UI
  sidebarCollapsed: boolean;
  commandMenuOpen: boolean;

  // Identity — detected from auth, never user-configurable
  userRole: ExecutiveRole;
  userName: string;
  userInitials: string;
  userTitle: string;

  // Workspace
  activeWorkspaceId: string | null;

  // Tasks
  tasks: import("@/types").Task[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setActiveWorkspace: (id: string | null) => void;
  
  // Task Actions
  addTask: (task: Omit<import("@/types").Task, "id">) => void;
  updateTask: (id: string, updates: Partial<import("@/types").Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // UI
  sidebarCollapsed: false,
  commandMenuOpen: false,

  // Identity — in production, this is hydrated from Supabase auth
  userRole: "ceo",
  userName: "Alex Chen",
  userInitials: "AC",
  userTitle: "Chief Executive Officer",

  // Workspace
  activeWorkspaceId: null,

  // Tasks
  tasks: [
    { id: "1", title: "Finalize Phase 3 Schema", status: "todo", priority: "high", assignee: "Finn", due: "Today" },
    { id: "2", title: "Implement Notification Popover", status: "todo", priority: "medium", assignee: "Finn", due: "Tomorrow" },
    { id: "3", title: "Review Board Deck", status: "todo", priority: "high", assignee: "Sarah", due: "In 2 days" },
    { id: "4", title: "Draft Engineering Onboarding", status: "todo", priority: "medium", assignee: "Alex", due: "Next week" },
  ],

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

  // Task Actions
  addTask: (task) => set((state) => ({
    tasks: [{ ...task, id: Math.random().toString(36).substring(7) }, ...state.tasks]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t)
  })),
}));
