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
            <motion.p variants={variants.fade} transition={transitionMacro} className="mono-label mb-3">
              {subtitle}
            </motion.p>
          )}
          <motion.h1
            variants={variants.slideUp}
            transition={transitionMacro}
            className="text-[32px] font-medium tracking-[-0.03em] text-text-primary"
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
