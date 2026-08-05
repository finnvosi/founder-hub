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

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setActiveWorkspace: (id: string | null) => void;
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

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
}));
