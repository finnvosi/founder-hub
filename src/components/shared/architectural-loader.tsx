"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro, transitionMicro } from "@/lib/motion";

interface ArchitecturalLoaderProps {
  messages: string[];
  fullScreen?: boolean;
}

export function ArchitecturalLoader({ messages, fullScreen = true }: ArchitecturalLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Sequential message timer
  useEffect(() => {
    if (messages.length <= 1) return;
    
    // Switch messages every 1.5 seconds, but stop at the last one
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [messages.length]);

  // Generate an imperfect architectural grid
  const gridLines = useMemo(() => {
    const lines = [];
    const size = 1000;
    const step = 40; // 40px grid

    // Vertical lines
    for (let x = 0; x <= size; x += step) {
      // 15% chance to skip a line entirely
      if (Math.random() < 0.15) continue;
      
      // Imperfections: slight offsets, terminating early, restarting
      const isOffset = Math.random() < 0.1;
      const actualX = isOffset ? x + (Math.random() * 4 - 2) : x;
      
      const isTruncated = Math.random() < 0.3;
      const y1 = isTruncated ? Math.random() * 200 : 0;
      const y2 = isTruncated ? size - Math.random() * 200 : size;

      lines.push({
        id: `v-${x}`,
        x1: actualX,
        y1,
        x2: actualX,
        y2,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 0.5,
      });
    }

    // Horizontal lines
    for (let y = 0; y <= size; y += step) {
      if (Math.random() < 0.15) continue;
      
      const isOffset = Math.random() < 0.1;
      const actualY = isOffset ? y + (Math.random() * 4 - 2) : y;
      
      const isTruncated = Math.random() < 0.3;
      const x1 = isTruncated ? Math.random() * 200 : 0;
      const x2 = isTruncated ? size - Math.random() * 200 : size;

      lines.push({
        id: `h-${y}`,
        x1,
        y1: actualY,
        x2,
        y2: actualY,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 0.5,
      });
    }

    return lines;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }}
      className={`z-50 flex flex-col items-center justify-center overflow-hidden bg-titanium-black ${
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-lg"
      }`}
    >
      {/* Blueprint Grid SVG */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 mix-blend-plus-lighter">
        <svg
          viewBox="0 0 1000 1000"
          className="h-full w-full max-w-[200vh] max-h-[200vw] object-cover opacity-20"
          preserveAspectRatio="xMidYMid slice"
        >
          {gridLines.map((line) => (
            <motion.line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-white"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: line.duration, delay: line.delay, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.5, delay: line.delay },
              }}
            />
          ))}
        </svg>
      </div>

      {/* Crosshairs & Target Box (Center piece) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          className="relative mb-12 h-16 w-16"
        >
          {/* Target box */}
          <div className="absolute inset-0 border-[0.5px] border-white/20" />
          
          {/* Crosshairs */}
          <motion.div 
            className="absolute top-1/2 -left-4 w-6 h-[0.5px] bg-white/40" 
            initial={{ scaleX: 0, originX: 1 }} 
            animate={{ scaleX: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }} 
          />
          <motion.div 
            className="absolute top-1/2 -right-4 w-6 h-[0.5px] bg-white/40" 
            initial={{ scaleX: 0, originX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }} 
          />
          <motion.div 
            className="absolute -top-4 left-1/2 h-6 w-[0.5px] bg-white/40" 
            initial={{ scaleY: 0, originY: 1 }} 
            animate={{ scaleY: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
          />
          <motion.div 
            className="absolute -bottom-4 left-1/2 h-6 w-[0.5px] bg-white/40" 
            initial={{ scaleY: 0, originY: 0 }} 
            animate={{ scaleY: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
          />
          
          {/* Center Point */}
          <motion.div 
            className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-white/80" 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }} 
          />
        </motion.div>

        {/* Status Messages */}
        <div className="relative h-6 w-full text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={transitionMacro}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50"
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Subtle paper grain texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </motion.div>
  );
}
