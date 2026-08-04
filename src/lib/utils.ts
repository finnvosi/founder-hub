import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number for display.
 * Handles currency ($), percentages (%), and compact notation (K, M).
 */
export function formatNumber(
  value: number,
  options: {
    style?: "currency" | "percent" | "decimal";
    compact?: boolean;
    decimals?: number;
    prefix?: string;
    suffix?: string;
  } = {}
): string {
  const { style = "decimal", compact = false, decimals, prefix = "", suffix = "" } = options;

  let formatted: string;

  if (style === "currency") {
    if (compact && Math.abs(value) >= 1000) {
      const tiers = [
        { threshold: 1_000_000_000, suffix: "B" },
        { threshold: 1_000_000, suffix: "M" },
        { threshold: 1_000, suffix: "K" },
      ];
      const tier = tiers.find((t) => Math.abs(value) >= t.threshold)!;
      const scaled = value / tier.threshold;
      formatted = `$${scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)}${tier.suffix}`;
    } else {
      formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 0,
      }).format(value);
    }
  } else if (style === "percent") {
    formatted = `${decimals !== undefined ? value.toFixed(decimals) : value}%`;
  } else {
    if (compact && Math.abs(value) >= 1000) {
      const tiers = [
        { threshold: 1_000_000_000, suffix: "B" },
        { threshold: 1_000_000, suffix: "M" },
        { threshold: 1_000, suffix: "K" },
      ];
      const tier = tiers.find((t) => Math.abs(value) >= t.threshold)!;
      const scaled = value / tier.threshold;
      formatted = `${scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)}${tier.suffix}`;
    } else {
      formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 2,
      }).format(value);
    }
  }

  return `${prefix}${formatted}${suffix}`;
}

/**
 * Format a date for display.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
): string {
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Get a time-aware greeting.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
