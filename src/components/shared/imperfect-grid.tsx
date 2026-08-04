"use client";

import { useEffect, useState } from "react";

type MaskRect = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  op: number;
};

type StructLine = {
  id: number;
  isHorizontal: boolean;
  start: number;
  length: number;
  pos: number;
  misalignment: number;
  op: number;
};

export function ImperfectGrid() {
  const [mounted, setMounted] = useState(false);
  const [maskRects, setMaskRects] = useState<MaskRect[]>([]);
  const [structLines, setStructLines] = useState<StructLine[]>([]);

  useEffect(() => {
    // Generate random values only once on the client
    const generatedMasks = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: Math.random() * 5 + 1,
      h: Math.random() * 5 + 1,
      op: Math.random() * 0.8 + 0.2,
    }));

    const generatedLines = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      isHorizontal: Math.random() > 0.5,
      start: Math.random() * 100,
      length: Math.random() * 30 + 10,
      pos: Math.floor(Math.random() * 20) * 5,
      misalignment: (Math.random() - 0.5) * 2,
      op: Math.random() * 0.5 + 0.2,
    }));

    setMaskRects(generatedMasks);
    setStructLines(generatedLines);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.025] mix-blend-plus-lighter">
      <svg
        className="absolute h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-base"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          
          {/* Mask to create disappearing segments and empty areas */}
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="white" />
            
            {/* Large empty voids */}
            <circle cx="20%" cy="30%" r="15%" fill="black" opacity="0.8" />
            <ellipse cx="80%" cy="70%" rx="20%" ry="10%" fill="black" opacity="0.6" />
            <rect x="40%" y="40%" width="20%" height="20%" fill="black" opacity="0.7" />
            
            {/* Random disappearing segments (noise-like) */}
            {maskRects.map((rect) => (
              <rect
                key={`mask-rect-${rect.id}`}
                x={`${rect.x}%`}
                y={`${rect.y}%`}
                width={`${rect.w}%`}
                height={`${rect.h}%`}
                fill="black"
                opacity={rect.op}
              />
            ))}
          </mask>
        </defs>

        {/* Base Grid with Mask */}
        <rect width="100%" height="100%" fill="url(#grid-base)" mask="url(#grid-mask)" />

        {/* Structural Imperfections: Lines that stop unexpectedly or misalign */}
        {structLines.map((line) => {
          return line.isHorizontal ? (
            <line
              key={`line-${line.id}`}
              x1={`${line.start}%`}
              y1={`calc(${line.pos}% + ${line.misalignment}px)`}
              x2={`${line.start + line.length}%`}
              y2={`calc(${line.pos}% + ${line.misalignment}px)`}
              stroke="currentColor"
              strokeWidth="0.75"
              opacity={line.op}
            />
          ) : (
            <line
              key={`line-${line.id}`}
              x1={`calc(${line.pos}% + ${line.misalignment}px)`}
              y1={`${line.start}%`}
              x2={`calc(${line.pos}% + ${line.misalignment}px)`}
              y2={`${line.start + line.length}%`}
              stroke="currentColor"
              strokeWidth="0.75"
              opacity={line.op}
            />
          );
        })}
      </svg>
    </div>
  );
}
