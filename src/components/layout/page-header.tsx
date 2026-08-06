"use client";

import { motion } from "framer-motion";
import { variants, transitionMacro } from "@/lib/motion";

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-end justify-between">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {subtitle && (
            <motion.div variants={variants.fade} transition={transitionMacro} className="flex items-center gap-4 mb-3">
              <p className="mono-label">
                {subtitle}
              </p>
              <div className="h-px w-8 bg-border" />
              <span className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
                REV.01 // {new Date().getFullYear()}
              </span>
            </motion.div>
          )}
          <motion.h1
            variants={variants.slideUp}
            transition={transitionMacro}
            className="title-huge mt-1"
          >
            {title}
          </motion.h1>
        </motion.div>
        {children && (
          <motion.div
            variants={variants.fade}
            initial="initial"
            animate="animate"
            transition={transitionMacro}
            className="flex items-center gap-2"
          >
            {children}
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ ...transitionMacro, delay: 0.2 }}
        className="mt-6 h-px origin-left bg-border"
      />
    </div>
  );
}
