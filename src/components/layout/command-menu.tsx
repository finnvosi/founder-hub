"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppStore } from "@/stores/app-store";
import { NAVIGATION_ITEMS, ROLE_WORKSPACES } from "@/lib/constants";
import {
  LayoutDashboard,
  Layers,
  FileText,
  FolderOpen,
  CheckSquare,
  Calendar,
  MessageCircle,
  Settings,
  Plus,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  workspace: Layers,
  documents: FileText,
  files: FolderOpen,
  tasks: CheckSquare,
  meetings: Calendar,
  chat: MessageCircle,
  settings: Settings,
};

export function CommandMenu() {
  const router = useRouter();
  const { commandMenuOpen, setCommandMenuOpen, userRole } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen(!commandMenuOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandMenuOpen, setCommandMenuOpen]);

  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false);
    command();
  };

  const workspaces = ROLE_WORKSPACES[userRole] || [];

  return (
    <CommandDialog open={commandMenuOpen} onOpenChange={setCommandMenuOpen}>
      <CommandInput placeholder="Search everything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <Icon className="mr-2 h-4 w-4 opacity-50" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
          <CommandItem
            value="Settings"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4 opacity-50" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Workspaces">
          {workspaces.map((ws) => (
            <CommandItem
              key={ws.id}
              value={ws.name}
              onSelect={() => runCommand(() => router.push(`/workspace/${ws.id}`))}
            >
              <Layers className="mr-2 h-4 w-4 opacity-50" />
              <span>{ws.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            value="New document"
            onSelect={() => runCommand(() => router.push("/documents"))}
          >
            <Plus className="mr-2 h-4 w-4 opacity-50" />
            <span>New document</span>
          </CommandItem>
          <CommandItem
            value="New task"
            onSelect={() => runCommand(() => router.push("/tasks"))}
          >
            <Plus className="mr-2 h-4 w-4 opacity-50" />
            <span>New task</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
