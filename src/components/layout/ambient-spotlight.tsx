"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function AmbientSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  // Spring configuration tuned to lag only slightly without feeling sluggish
  const springConfig = { damping: 30, stiffness: 120, mass: 0.5 };
  
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    // Set initial position to center of screen
    mouseX.set(window.innerWidth / 2 - 400);
    mouseY.set(window.innerHeight / 2 - 400);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Prevent SSR hydration mismatch by only rendering on client
  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 h-[800px] w-[800px] rounded-full"
      style={{
        x: springX,
        y: springY,
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0) 70%)",
        filter: "blur(80px)",
      }}
    />
  );
}
