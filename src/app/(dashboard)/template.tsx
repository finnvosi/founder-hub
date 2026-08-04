"use client";

import { motion } from "framer-motion";
import { variants, transitionMacro } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants.fade}
      transition={transitionMacro}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
