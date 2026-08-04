import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";

const statusConfig: Record<UserStatus, { color: string; label: string }> = {
  available: { color: "bg-positive", label: "Available" },
  focus: { color: "bg-text-secondary", label: "Focus" },
  away: { color: "bg-text-tertiary", label: "Away" },
  offline: { color: "bg-surface-3", label: "Offline" },
};

export function StatusDot({
  status,
  showLabel = false,
  className,
}: {
  status: UserStatus;
  showLabel?: boolean;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-block h-1 w-1 rounded-full",
          config.color
        )}
      />
      {showLabel && (
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
          {config.label}
        </span>
      )}
    </span>
  );
}
