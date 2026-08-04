import type { NavigationItem } from "@/types";

export const APP_NAME = "Founder Hub" as const;
export const APP_DESCRIPTION = "The digital operating system for modern startups." as const;

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Pulse",
    href: "/pulse",
    icon: "pulse",
    description: "Your morning briefing",
  },
  {
    label: "Runway",
    href: "/runway",
    icon: "runway",
    description: "Financials & burn rate",
  },
  {
    label: "Metrics",
    href: "/metrics",
    icon: "metrics",
    description: "Company vital signs",
  },
  {
    label: "Team",
    href: "/team",
    icon: "team",
    description: "People & availability",
  },
  {
    label: "Decisions",
    href: "/decisions",
    icon: "decisions",
    description: "Decision journal",
  },
  {
    label: "Updates",
    href: "/updates",
    icon: "updates",
    description: "Investor updates",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: "updates",
    description: "Company knowledge base",
  },
  {
    label: "Files",
    href: "/files",
    icon: "pulse",
    description: "Shared file hub",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: "decisions",
    description: "Task center",
  },
  {
    label: "Meetings",
    href: "/meetings",
    icon: "team",
    description: "Agenda and notes",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "updates",
    description: "Team communication",
  },
  {
    label: "Wiki",
    href: "/wiki",
    icon: "pulse",
    description: "Company knowledge base",
  },
  {
    label: "Roles",
    href: "/roles",
    icon: "metrics",
    description: "Access control",
  },
] as const;

export const ROUTES = {
  PULSE: "/pulse",
  RUNWAY: "/runway",
  METRICS: "/metrics",
  TEAM: "/team",
  DECISIONS: "/decisions",
  UPDATES: "/updates",
  DOCUMENTS: "/documents",
  FILES: "/files",
  TASKS: "/tasks",
  MEETINGS: "/meetings",
  CHAT: "/chat",
  WIKI: "/wiki",
  ROLES: "/roles",
} as const;
