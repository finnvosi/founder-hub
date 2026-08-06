"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy, highly responsive spring for a "technical/precision" feel
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      // Center the 32px wrapper
      mouseX.set(e.clientX - 16); 
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a clickable element
      const isClickable = !!target.closest("button, a, input, textarea, [role='button'], .cursor-pointer, select");
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] flex h-[32px] w-[32px] items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      {/* Resting State: Precision Crosshair */}
      <motion.div
        className="absolute flex items-center justify-center"
        animate={{
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 0.5 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="absolute h-[1px] w-[11px] bg-white opacity-80" />
        <div className="absolute h-[11px] w-[1px] bg-white opacity-80" />
      </motion.div>

      {/* Hover State: Technical Framing Brackets */}
      <motion.div
        className="absolute"
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative h-[22px] w-[22px] opacity-100">
          {/* Top Left Bracket */}
          <div className="absolute top-0 left-0 h-[1px] w-[6px] bg-white" />
          <div className="absolute top-0 left-0 h-[6px] w-[1px] bg-white" />
          
          {/* Top Right Bracket */}
          <div className="absolute top-0 right-0 h-[1px] w-[6px] bg-white" />
          <div className="absolute top-0 right-0 h-[6px] w-[1px] bg-white" />
          
          {/* Bottom Left Bracket */}
          <div className="absolute bottom-0 left-0 h-[1px] w-[6px] bg-white" />
          <div className="absolute bottom-0 left-0 h-[6px] w-[1px] bg-white" />
          
          {/* Bottom Right Bracket */}
          <div className="absolute bottom-0 right-0 h-[1px] w-[6px] bg-white" />
          <div className="absolute bottom-0 right-0 h-[6px] w-[1px] bg-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}
