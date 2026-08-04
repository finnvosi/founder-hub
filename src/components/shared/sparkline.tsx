"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  animate?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  color = "oklch(0.38 0 0)",
  height = 32,
  strokeWidth = 1,
  fill = false,
  animate = false,
  className,
}: SparklineProps) {
  const gradientId = useId();
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const padding = 1;

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * (width - padding * 2) + padding,
    y: height - padding - ((value - min) / range) * (height - padding * 2),
  }));

  // Smooth cubic bezier path
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }

  const fillPath = `${path} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width: "100%", height }}
      preserveAspectRatio="none"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#${gradientId})`} />
        </>
      )}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </svg>
  );
}
