// ─── Executive Roles ───────────────────────────────────────
// Detected invisibly from authentication. Never exposed in UI.
export type ExecutiveRole = "ceo" | "cfo" | "cmo" | "cto" | "tech-lead";

// ─── Navigation ────────────────────────────────────────────
export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  description: string;
};

// ─── Workspaces ────────────────────────────────────────────
export type WorkspaceModule = "documents" | "files" | "tasks" | "chat" | "meetings";

export type Workspace = {
  id: string;
  name: string;
  icon: string;
  description: string;
  modules: WorkspaceModule[];
};

// ─── Domain Types ──────────────────────────────────────────
export type TrendDirection = "up" | "down" | "neutral";

export type UserStatus = "available" | "focus" | "away" | "offline";

export type MetricData = {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: TrendDirection;
  unit: string;
  prefix?: string;
  suffix?: string;
  sparklineData: number[];
  category: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  location: string;
  timezone: string;
  status: UserStatus;
  joinedDate: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  due: string;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  user: string;
  userRole?: string;
  time: string;
  content: string;
};
