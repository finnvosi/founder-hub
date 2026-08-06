import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExecutiveRole, Task, ChatMessage, MeetingItem, AppNotification, DocumentItem, FileItem } from "@/types";

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

  // Shared Models
  tasks: Task[];
  messages: ChatMessage[];
  meetings: MeetingItem[];
  notifications: AppNotification[];
  notifications: AppNotification[];
  documents: DocumentItem[];
  files: FileItem[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setActiveWorkspace: (id: string | null) => void;
  
  // Profile Actions
  setUserRole: (role: ExecutiveRole) => void;
  setUserProfile: (profile: { name: string; role: ExecutiveRole }) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Chat Actions
  addChatMessage: (msg: Omit<ChatMessage, "id" | "time">) => void;

  // Meeting Actions
  addMeeting: (meeting: Omit<MeetingItem, "id">) => void;
  deleteMeeting: (id: string) => void;
  updateMeetingStatus: (id: string, status: MeetingItem["status"]) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, "id" | "time" | "read">) => void;

  // Document Actions
  addDocument: (doc: Omit<DocumentItem, "id" | "updatedAt">) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  // File Actions
  addFile: (file: Omit<FileItem, "id" | "date">) => void;
  deleteFile: (id: string) => void;
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

const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: "1",
    title: "Executive Product Sync",
    date: "Today",
    time: "10:00 AM - 11:00 AM",
    duration: "60 mins",
    host: "Alex Chen",
    attendees: ["Alex Chen", "Finn", "Sarah"],
    doc: "Product Requirements v2",
    link: "https://meet.google.com/xyz-hub-exec",
    status: "live",
    agenda: ["Review Q3 product roadmap", "System Architecture & RBAC overview", "Design system sign-off"],
  },
  {
    id: "2",
    title: "Series B Financial Update",
    date: "Today",
    time: "02:00 PM - 03:00 PM",
    duration: "60 mins",
    host: "Sarah",
    attendees: ["Sarah", "Alex Chen"],
    doc: "Financial Model 2028",
    link: "https://meet.google.com/abc-fin-sync",
    status: "upcoming",
    agenda: ["Runway calculation review", "Investor deck metrics", "Cap table sync"],
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    type: "mention",
    title: "Sarah mentioned you",
    description: "In 'Q3 Board Deck' document",
    time: "5m ago",
    read: false,
    href: "/documents",
  },
  {
    id: "2",
    type: "task",
    title: "New task assigned",
    description: "Finalize Phase 3 Schema assigned by Finn",
    time: "1h ago",
    read: false,
    href: "/tasks",
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting starting soon",
    description: "Executive Product Sync starting in 15 mins",
    time: "2h ago",
    read: true,
    href: "/meetings",
  },
  {
    id: "4",
    type: "chat",
    title: "New message in #general",
    description: "Finn: Next.js 16.3 Turbopack build checks passing",
    time: "3h ago",
    read: true,
    href: "/chat",
  },
];

const INITIAL_DOCS: DocumentItem[] = [
  { id: "1", title: "Q3 Board Deck Architecture", content: "This is the initial content for Q3 Board Deck Architecture.\n\nThe autosave architecture is built directly into the text area, providing an instantaneous feedback loop for the user.", updatedAt: "2 hours ago" },
  { id: "2", title: "Product Requirements v2", content: "This is the initial content for Product Requirements v2.\n\nThe autosave architecture is built directly into the text area, providing an instantaneous feedback loop for the user.", updatedAt: "Yesterday" },
  { id: "3", title: "Engineering Onboarding", content: "This is the initial content for Engineering Onboarding.\n\nThe autosave architecture is built directly into the text area, providing an instantaneous feedback loop for the user.", updatedAt: "3 days ago" },
];

const INITIAL_FILES: FileItem[] = [
  { id: "1", name: "Brand_Assets_Final.zip", type: "archive", size: "14.2 MB", date: "Today" },
  { id: "2", name: "Q3_Financials.xlsx", type: "document", size: "2.1 MB", date: "Yesterday" },
  { id: "3", name: "Pitch_Deck_v4.pdf", type: "pdf", size: "8.4 MB", date: "3 days ago" },
  { id: "4", name: "Architecture_Diagram.png", type: "image", size: "4.5 MB", date: "Last week" },
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

      // Domain Models
      tasks: INITIAL_TASKS,
      messages: INITIAL_MESSAGES,
      meetings: INITIAL_MEETINGS,
      notifications: INITIAL_NOTIFICATIONS,
      notifications: INITIAL_NOTIFICATIONS,
      documents: INITIAL_DOCS,
      files: INITIAL_FILES,

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

      // Task Actions
      addTask: (task) => set((state) => {
        const newTaskId = Math.random().toString(36).substring(7);
        const newTask: Task = { ...task, id: newTaskId };
        const newNotif: AppNotification = {
          id: Math.random().toString(36).substring(7),
          type: "task",
          title: "New task added",
          description: `"${task.title}" created for ${task.assignee}`,
          time: "Just now",
          read: false,
          href: "/tasks",
        };
        return {
          tasks: [newTask, ...state.tasks],
          notifications: [newNotif, ...state.notifications],
        };
      }),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t)
      })),

      // Chat Actions
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

      // Meeting Actions
      addMeeting: (meeting) => set((state) => {
        const newMeetingId = Math.random().toString(36).substring(7);
        const newMeeting: MeetingItem = { ...meeting, id: newMeetingId };
        const newNotif: AppNotification = {
          id: Math.random().toString(36).substring(7),
          type: "meeting",
          title: "New meeting scheduled",
          description: `"${meeting.title}" scheduled for ${meeting.date} at ${meeting.time}`,
          time: "Just now",
          read: false,
          href: "/meetings",
        };
        return {
          meetings: [newMeeting, ...state.meetings],
          notifications: [newNotif, ...state.notifications],
        };
      }),
      deleteMeeting: (id) => set((state) => ({
        meetings: state.meetings.filter(m => m.id !== id)
      })),
      updateMeetingStatus: (id, status) => set((state) => ({
        meetings: state.meetings.map(m => m.id === id ? { ...m, status } : m)
      })),

      // Notification Actions
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      clearNotifications: () => set({ notifications: [] }),
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            ...notif,
            id: Math.random().toString(36).substring(7),
            time: "Just now",
            read: false,
          },
          ...state.notifications,
        ],
      })),

      // Document Actions
      addDocument: (doc) => set((state) => {
        const newDoc: DocumentItem = {
          ...doc,
          id: Math.random().toString(36).substring(7),
          updatedAt: "Just now",
        };
        return { documents: [newDoc, ...state.documents] };
      }),
      updateDocument: (id, updates) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, ...updates, updatedAt: "Just now" } : d)
      })),
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),

      // File Actions
      addFile: (file) => set((state) => {
        const newFile: FileItem = {
          ...file,
          id: Math.random().toString(36).substring(7),
          date: "Just now",
        };
        return { files: [newFile, ...state.files] };
      }),
      deleteFile: (id) => set((state) => ({
        files: state.files.filter(f => f.id !== id)
      })),
    }),
    {
      name: "founder-hub-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        messages: state.messages,
        meetings: state.meetings,
        notifications: state.notifications,
        userRole: state.userRole,
        userName: state.userName,
        userInitials: state.userInitials,
        userTitle: state.userTitle,
        documents: state.documents,
        files: state.files,
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
