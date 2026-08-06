"use client";

import { motion } from "framer-motion";

export function AnimatedMeshGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
      
      {/* 
        PERFORMANCE FIX: 
        Applying blur directly to the container instead of using backdrop-blur over animated elements.
        Backdrop-blur forces continuous expensive background sampling, causing severe lag.
      */}
      <div className="absolute -inset-[50%] z-0 opacity-40 blur-[120px] will-change-transform">
        
        {/* Blob 1: Graphite */}
        <motion.div
          animate={{
            x: ["0%", "-10%", "10%", "0%"],
            y: ["0%", "10%", "-10%", "0%"],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/4 top-1/4 h-[60%] w-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(40,40,40,0.8) 0%, rgba(40,40,40,0) 60%)" }}
        />
        
        {/* Blob 2: Charcoal */}
        <motion.div
          animate={{
            x: ["0%", "15%", "-5%", "0%"],
            y: ["0%", "-15%", "5%", "0%"],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute right-1/4 top-1/3 h-[70%] w-[70%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(25,25,25,0.6) 0%, rgba(25,25,25,0) 60%)" }}
        />
        
        {/* Blob 3: Dark Gray */}
        <motion.div
          animate={{
            x: ["0%", "-20%", "20%", "0%"],
            y: ["0%", "20%", "-20%", "0%"],
            scale: [1, 1.3, 0.7, 1],
          }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/3 bottom-1/4 h-[50%] w-[50%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(50,50,50,0.4) 0%, rgba(50,50,50,0) 60%)" }}
        />

        {/* Blob 4: Tiny amount of purple (less than 10% intensity) */}
        <motion.div
          animate={{
            x: ["0%", "25%", "-25%", "0%"],
            y: ["0%", "-25%", "25%", "0%"],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="absolute right-1/3 bottom-1/3 h-[60%] w-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0) 70%)" }}
        />
        
      </div>
    </div>
  );
}
