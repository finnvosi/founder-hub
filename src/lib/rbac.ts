import type { ExecutiveRole } from "@/types";

export type PermissionAction =
  | "view_financials"
  | "edit_financials"
  | "view_architecture"
  | "edit_architecture"
  | "view_marketing"
  | "edit_marketing"
  | "manage_tasks"
  | "delete_tasks"
  | "manage_team"
  | "access_settings";

export interface RoleConfig {
  label: string;
  code: string;
  title: string;
  clearanceLevel: number;
  description: string;
  permissions: PermissionAction[];
  allowedWorkspaces: string[];
}

export const ROLE_CONFIGS: Record<ExecutiveRole, RoleConfig> = {
  ceo: {
    label: "CEO",
    code: "EXEC-01",
    title: "Chief Executive Officer",
    clearanceLevel: 5,
    description: "Unrestricted executive access across all company operations, strategy, and financials.",
    permissions: [
      "view_financials",
      "edit_financials",
      "view_architecture",
      "edit_architecture",
      "view_marketing",
      "edit_marketing",
      "manage_tasks",
      "delete_tasks",
      "manage_team",
      "access_settings",
    ],
    allowedWorkspaces: ["company", "legal", "partnerships", "finance-overview"],
  },
  cfo: {
    label: "CFO",
    code: "FIN-01",
    title: "Chief Financial Officer",
    clearanceLevel: 4,
    description: "Financial management, budget allocation, treasury, and investor communications.",
    permissions: [
      "view_financials",
      "edit_financials",
      "manage_tasks",
      "delete_tasks",
      "manage_team",
      "access_settings",
    ],
    allowedWorkspaces: ["budget", "expenses", "reports", "funding"],
  },
  cmo: {
    label: "CMO",
    code: "MKT-01",
    title: "Chief Marketing Officer",
    clearanceLevel: 4,
    description: "Brand identity, public communications, growth campaigns, and content strategy.",
    permissions: [
      "view_marketing",
      "edit_marketing",
      "manage_tasks",
      "delete_tasks",
      "access_settings",
    ],
    allowedWorkspaces: ["marketing", "campaigns", "content", "brand"],
  },
  cto: {
    label: "CTO",
    code: "ENG-01",
    title: "Chief Technology Officer",
    clearanceLevel: 4,
    description: "System architecture, infrastructure reliability, technical roadmap, and security.",
    permissions: [
      "view_architecture",
      "edit_architecture",
      "manage_tasks",
      "delete_tasks",
      "manage_team",
      "access_settings",
    ],
    allowedWorkspaces: ["architecture", "infrastructure", "technical-roadmap"],
  },
  "tech-lead": {
    label: "Tech Lead",
    code: "ENG-02",
    title: "Technical Team Lead",
    clearanceLevel: 3,
    description: "Sprint execution, codebase management, quality assurance, and team delivery.",
    permissions: [
      "view_architecture",
      "manage_tasks",
      "access_settings",
    ],
    allowedWorkspaces: ["development", "sprint", "qa", "backlog"],
  },
};

export function hasPermission(role: ExecutiveRole, action: PermissionAction): boolean {
  return ROLE_CONFIGS[role]?.permissions.includes(action) ?? false;
}

export function isWorkspaceAllowed(role: ExecutiveRole, workspaceId: string): boolean {
  if (role === "ceo") return true; // CEO has global access
  return ROLE_CONFIGS[role]?.allowedWorkspaces.includes(workspaceId) ?? false;
}
