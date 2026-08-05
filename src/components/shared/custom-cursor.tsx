"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  // Use motion values for raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Use spring physics for the trailing effect (minimal bounce, smooth glide)
  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16); // Center the 32px cursor
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over a clickable element
      const isClickable = !!target.closest("button, a, input, [role='button']");
      setIsHovering(isClickable);

      // Check for magnetic specific class
      const isMagneticEl = !!target.closest(".magnetic-cursor");
      setIsMagnetic(isMagneticEl);
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
      className="pointer-events-none fixed top-0 left-0 z-[100] flex h-8 w-8 items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        scale: isMagnetic ? 1.5 : isHovering ? 1.2 : 1,
        backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)",
        backdropFilter: isHovering ? "blur(0px)" : "blur(2px)",
      }}
      transition={{
        scale: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
        backgroundColor: { duration: 0.2 },
      }}
    >
      {/* Optional inner dot for extreme precision when not hovering */}
      <motion.div
        className="h-1 w-1 rounded-full bg-background"
        animate={{
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
