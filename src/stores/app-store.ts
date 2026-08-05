import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExecutiveRole, Task, ChatMessage } from "@/types";

interface AppState {
  // UI
  sidebarCollapsed: boolean;
  commandMenuOpen: boolean;

  // Identity — detected from auth, persists across sessions
  userRole: ExecutiveRole;
  userName: string;
  userInitials: string;
  userTitle: string;

  // Workspace
  activeWorkspaceId: string | null;

  // Shared Synchronized Tasks
  tasks: Task[];

  // Shared Synchronized Chat Messages
  messages: ChatMessage[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setActiveWorkspace: (id: string | null) => void;
  
  // Profile Actions
  setUserRole: (role: ExecutiveRole) => void;
  setUserProfile: (profile: { name: string; role: ExecutiveRole }) => void;
  
  // Task Actions (Synced across team members)
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Chat Actions (Synced across team members)
  addChatMessage: (msg: Omit<ChatMessage, "id" | "time">) => void;
}

const titleMap: Record<ExecutiveRole, string> = {
  ceo: "Chief Executive Officer",
  cfo: "Chief Financial Officer",
  cmo: "Chief Marketing Officer",
  cto: "Chief Technology Officer",
  "tech-lead": "Technical Team Lead",
};

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Finalize Phase 3 Schema", status: "todo", priority: "high", assignee: "Finn", due: "Today" },
  { id: "2", title: "Implement Notification Popover", status: "todo", priority: "medium", assignee: "Finn", due: "Tomorrow" },
  { id: "3", title: "Review Board Deck", status: "todo", priority: "high", assignee: "Sarah", due: "In 2 days" },
  { id: "4", title: "Draft Engineering Onboarding", status: "todo", priority: "medium", assignee: "Alex", due: "Next week" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", channelId: "1", user: "Finn", userRole: "cto", time: "10:00 AM", content: "Architecture draft is ready for review." },
  { id: "2", channelId: "1", user: "Sarah", userRole: "cfo", time: "10:05 AM", content: "Looks solid. The grid imperfections are a nice touch." },
  { id: "3", channelId: "1", user: "Alex", userRole: "ceo", time: "10:12 AM", content: "I'll start porting the framer motion physics over now." },
  { id: "4", channelId: "2", user: "Finn", userRole: "cto", time: "11:30 AM", content: "Next.js 16.3 Turbopack build checks are passing cleanly." },
  { id: "5", channelId: "3", user: "Sarah", userRole: "cmo", time: "01:15 PM", content: "Swiss print light mode variables look super clean." },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI
      sidebarCollapsed: false,
      commandMenuOpen: false,

      // Identity
      userRole: "ceo",
      userName: "Alex Chen",
      userInitials: "AC",
      userTitle: "Chief Executive Officer",

      // Workspace
      activeWorkspaceId: null,

      // Tasks
      tasks: INITIAL_TASKS,

      // Chat Messages
      messages: INITIAL_MESSAGES,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      setUserRole: (role) => set({
        userRole: role,
        userTitle: titleMap[role],
      }),

      setUserProfile: ({ name, role }) => {
        const initials = name
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "U";

        set({
          userName: name,
          userInitials: initials,
          userRole: role,
          userTitle: titleMap[role] || "Executive",
        });
      },

      // Task Actions (Synced globally across users/tabs)
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

      // Chat Actions (Synced globally across users/tabs)
      addChatMessage: (msg) => set((state) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: ChatMessage = {
          ...msg,
          id: Math.random().toString(36).substring(7),
          time: timeString,
        };
        return { messages: [...state.messages, newMsg] };
      }),
    }),
    {
      name: "founder-hub-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        messages: state.messages,
        userRole: state.userRole,
        userName: state.userName,
        userInitials: state.userInitials,
        userTitle: state.userTitle,
      }),
    }
  )
);

// Cross-tab real-time sync listener
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "founder-hub-store") {
      useAppStore.persist.rehydrate();
    }
  });
}
