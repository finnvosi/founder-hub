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
import { NAVIGATION_ITEMS } from "@/lib/constants";
import {
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  GitBranch,
  Send,
  Plus,
  FileEdit,
  type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  pulse: Activity,
  runway: TrendingUp,
  metrics: BarChart3,
  team: Users,
  decisions: GitBranch,
  updates: Send,
};

export function CommandMenu() {
  const router = useRouter();
  const { commandMenuOpen, setCommandMenuOpen } = useAppStore();

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

  return (
    <CommandDialog open={commandMenuOpen} onOpenChange={setCommandMenuOpen}>
      <CommandInput placeholder="Type a command or search..." />
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
                <Icon className="mr-2 h-4 w-4 opacity-60" />
                <span>Go to {item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            value="Log a new decision"
            onSelect={() => runCommand(() => router.push("/decisions"))}
          >
            <Plus className="mr-2 h-4 w-4 opacity-60" />
            <span>Log a new decision</span>
          </CommandItem>
          <CommandItem
            value="Draft investor update"
            onSelect={() => runCommand(() => router.push("/updates"))}
          >
            <FileEdit className="mr-2 h-4 w-4 opacity-60" />
            <span>Draft investor update</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
