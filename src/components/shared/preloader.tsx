"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import { ease } from "@/lib/motion";

export function ArchitecturalPreloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 2800); // 2.8 seconds total duration

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
        >
          {/* Construction Lines Container */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Horizontal sliding lines */}
              <motion.line
                x1="0" y1="30%" x2="100%" y2="30%"
                stroke="currentColor" strokeWidth="0.5"
                initial={{ pathLength: 0, x: "-100%" }}
                animate={{ pathLength: 1, x: "0%" }}
                transition={{ duration: 1.5, ease }}
              />
              <motion.line
                x1="0" y1="70%" x2="100%" y2="70%"
                stroke="currentColor" strokeWidth="0.5"
                initial={{ pathLength: 0, x: "100%" }}
                animate={{ pathLength: 1, x: "0%" }}
                transition={{ duration: 1.8, ease, delay: 0.2 }}
              />
              {/* Vertical sliding lines */}
              <motion.line
                x1="40%" y1="0" x2="40%" y2="100%"
                stroke="currentColor" strokeWidth="0.5"
                initial={{ pathLength: 0, y: "-100%" }}
                animate={{ pathLength: 1, y: "0%" }}
                transition={{ duration: 1.6, ease, delay: 0.1 }}
              />
              <motion.line
                x1="60%" y1="0" x2="60%" y2="100%"
                stroke="currentColor" strokeWidth="0.5"
                initial={{ pathLength: 0, y: "100%" }}
                animate={{ pathLength: 1, y: "0%" }}
                transition={{ duration: 1.4, ease, delay: 0.3 }}
              />
              
              {/* Intersecting Blueprint Node */}
              <motion.circle
                cx="40%" cy="30%" r="4"
                fill="none" stroke="currentColor" strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease, delay: 1.2 }}
              />
              <motion.circle
                cx="60%" cy="70%" r="4"
                fill="none" stroke="currentColor" strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease, delay: 1.4 }}
              />
            </svg>
          </div>

          {/* Core Brand Identity */}
          <div className="relative z-10 flex flex-col items-center">
            {/* The Monolith Mark */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
              className="flex h-12 w-12 origin-bottom items-center justify-center bg-foreground text-background"
            >
              <span className="font-sans text-xl font-medium tracking-tighter">F</span>
            </motion.div>

            {/* Swiss Typography Reveal */}
            <div className="mt-8 overflow-hidden">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.8 }}
                className="font-sans text-2xl font-light tracking-[0.2em] text-text-primary uppercase"
              >
                {APP_NAME}
              </motion.h1>
            </div>

            {/* Technical Labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease, delay: 1.4 }}
              className="absolute top-32 mt-4 flex gap-12 text-center"
            >
              <div className="flex flex-col gap-1">
                <span className="mono-label text-[8px] text-text-tertiary">System</span>
                <span className="font-mono text-[10px] text-text-secondary">SYS_01</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="mono-label text-[8px] text-text-tertiary">Status</span>
                <span className="font-mono text-[10px] text-text-secondary">BOOTING</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="mono-label text-[8px] text-text-tertiary">Build</span>
                <span className="font-mono text-[10px] text-text-secondary">2028.1</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
