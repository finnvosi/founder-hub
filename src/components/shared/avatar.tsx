import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 text-[8px]",
  md: "h-8 w-8 text-[10px]",
  lg: "h-10 w-10 text-xs",
  xl: "h-14 w-14 text-sm",
};

export function UserAvatar({
  initials,
  color,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-mono font-medium text-text-secondary",
        !color && "bg-surface-3",
        sizeClasses[size],
        className
      )}
      style={color ? { background: color, color: "oklch(0.11 0 0)" } : undefined}
    >
      {initials}
    </div>
  );
}
