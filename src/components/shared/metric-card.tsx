"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";
import { AnimatedNumber } from "./animated-number";
import type { TrendDirection } from "@/types";

interface MetricCardProps {
  label: string;
  name: string;
  value: number;
  trend: TrendDirection;
  trendValue: number;
  prefix?: string;
  suffix?: string;
  sparklineData?: number[];
  className?: string;
}

export function MetricCard({
  label,
  name,
  value,
  trend,
  trendValue,
  prefix = "",
  suffix = "",
  sparklineData,
  className,
}: MetricCardProps) {
  // For metrics where down is good (CAC, Churn), invert semantics
  const isDownGood = ["cac", "churn"].some((k) => name.toLowerCase().includes(k));
  const isPositive = isDownGood ? trend === "down" : trend === "up";
  const isNegative = isDownGood ? trend === "up" : trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 0.98, opacity: 0.8 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={cn(
        "group relative rounded-md border border-border bg-card p-5 transition-colors duration-120 hover:border-[oklch(1_0_0/6%)]",
        className
      )}
    >
      {/* Label — monospace technical label */}
      <div className="mono-label mb-4">{label}</div>

      {/* Value — the hero element */}
      <div className="font-mono text-[28px] font-medium tabular-nums tracking-tight text-text-primary">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>

      {/* Bottom row: name + trend */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-text-tertiary">{name}</span>
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums",
            isPositive && "text-positive",
            isNegative && "text-negative",
            !isPositive && !isNegative && "text-text-tertiary"
          )}
        >
          {trend === "up" ? "+" : trend === "down" ? "−" : ""}
          {Math.abs(trendValue)}%
        </span>
      </div>

      {/* Sparkline — subtle, bottom-aligned */}
      {sparklineData && (
        <div className="mt-4">
          <Sparkline
            data={sparklineData}
            color="oklch(0.38 0 0)"  /* text-tertiary — not colored */
            height={24}
            strokeWidth={1}
            fill={false}
            animate={false}
          />
        </div>
      )}
    </motion.div>
  );
}
