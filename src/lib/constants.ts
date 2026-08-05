import type { NavigationItem, Workspace, ExecutiveRole } from "@/types";

export const APP_NAME = "Founder Hub" as const;
export const APP_DESCRIPTION = "The digital operating system for modern startups." as const;

// ─── Navigation ────────────────────────────────────────────
// Exactly 9 items. Nothing else. Ever.
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    description: "Your morning desk",
  },
  {
    label: "Workspace",
    href: "/workspace",
    icon: "workspace",
    description: "Your workspaces",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: "documents",
    description: "Document management",
  },
  {
    label: "Files",
    href: "/files",
    icon: "files",
    description: "File explorer",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: "tasks",
    description: "Task management",
  },
  {
    label: "Meetings",
    href: "/meetings",
    icon: "meetings",
    description: "Meeting management",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "chat",
    description: "Team messaging",
  },
];

// Search (⌘K) is handled by the command palette, not a route.
// Settings is separated at the bottom of the sidebar.

// ─── Routes ────────────────────────────────────────────────
export const ROUTES = {
  DASHBOARD: "/dashboard",
  WORKSPACE: "/workspace",
  DOCUMENTS: "/documents",
  FILES: "/files",
  TASKS: "/tasks",
  MEETINGS: "/meetings",
  CHAT: "/chat",
  SETTINGS: "/settings",
} as const;

// ─── Workspaces per Role ───────────────────────────────────
// The application silently loads these based on the authenticated user's role.
// Users never see this mapping. They simply see "their" workspaces.

export const ROLE_WORKSPACES: Record<ExecutiveRole, Workspace[]> = {
  ceo: [
    { id: "company", name: "Company", icon: "building", description: "Company-wide operations and strategy", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "legal", name: "Legal", icon: "scale", description: "Legal affairs and compliance", modules: ["documents", "files", "tasks", "meetings"] },
    { id: "partnerships", name: "Partnerships", icon: "handshake", description: "Strategic partnerships and deals", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "finance-overview", name: "Finance Overview", icon: "trending-up", description: "Financial health and runway", modules: ["documents", "files", "tasks", "meetings"] },
  ],
  cfo: [
    { id: "budget", name: "Budget", icon: "calculator", description: "Budget planning and allocation", modules: ["documents", "files", "tasks", "meetings"] },
    { id: "expenses", name: "Expenses", icon: "receipt", description: "Expense tracking and approval", modules: ["documents", "files", "tasks"] },
    { id: "reports", name: "Reports", icon: "bar-chart", description: "Financial reports and analysis", modules: ["documents", "files", "meetings"] },
    { id: "funding", name: "Funding", icon: "landmark", description: "Fundraising and investor relations", modules: ["documents", "files", "tasks", "chat", "meetings"] },
  ],
  cmo: [
    { id: "marketing", name: "Marketing", icon: "megaphone", description: "Marketing strategy and execution", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "campaigns", name: "Campaigns", icon: "rocket", description: "Campaign planning and tracking", modules: ["documents", "files", "tasks", "chat"] },
    { id: "content", name: "Content", icon: "pen-tool", description: "Content creation and calendar", modules: ["documents", "files", "tasks", "chat"] },
    { id: "brand", name: "Brand", icon: "palette", description: "Brand identity and guidelines", modules: ["documents", "files", "tasks"] },
  ],
  cto: [
    { id: "architecture", name: "Architecture", icon: "cpu", description: "System architecture and design", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "infrastructure", name: "Infrastructure", icon: "server", description: "Infrastructure and DevOps", modules: ["documents", "files", "tasks", "chat"] },
    { id: "technical-roadmap", name: "Technical Roadmap", icon: "map", description: "Technical planning and roadmap", modules: ["documents", "files", "tasks", "meetings"] },
  ],
  "tech-lead": [
    { id: "development", name: "Development", icon: "code", description: "Active development and code", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "sprint", name: "Sprint", icon: "zap", description: "Current sprint and planning", modules: ["documents", "files", "tasks", "chat", "meetings"] },
    { id: "qa", name: "QA", icon: "shield-check", description: "Quality assurance and testing", modules: ["documents", "files", "tasks", "chat"] },
    { id: "backlog", name: "Backlog", icon: "layers", description: "Product backlog and prioritization", modules: ["documents", "files", "tasks"] },
  ],
};
