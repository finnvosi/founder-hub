"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMacro } from "@/lib/motion";

const MOCK_FILES = [
  { id: "1", name: "Brand_Assets_Final.zip", type: "archive", size: "14.2 MB", date: "Today" },
  { id: "2", name: "Q3_Financials.xlsx", type: "document", size: "2.1 MB", date: "Yesterday" },
  { id: "3", name: "Pitch_Deck_v4.pdf", type: "pdf", size: "8.4 MB", date: "3 days ago" },
  { id: "4", name: "Architecture_Diagram.png", type: "image", size: "4.5 MB", date: "Last week" },
];

export default function FilesPage() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div className="w-full max-w-5xl relative">
      <PageHeader title="File Hub" subtitle="Shared Assets" />

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 0.98 : 1,
          borderColor: isDragging ? "oklch(1 0 0 / 20%)" : "oklch(1 0 0 / 4%)",
          backgroundColor: isDragging ? "var(--surface-2)" : "var(--surface-1)",
        }}
        transition={transitionMacro}
        className="mt-8 min-h-[400px] rounded-md border border-dashed border-border bg-card p-8 transition-colors"
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="mono-label text-text-primary text-sm tracking-widest">Drop files to upload</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid grid-cols-12 gap-4 border-b border-border pb-4 transition-opacity ${isDragging ? 'opacity-20' : 'opacity-100'}`}>
          <div className="col-span-6 mono-label">Name</div>
          <div className="col-span-3 mono-label">Size</div>
          <div className="col-span-3 mono-label text-right">Date</div>
        </div>

        <div className={`divide-y divide-border transition-opacity ${isDragging ? 'opacity-20' : 'opacity-100'}`}>
          {MOCK_FILES.map((file) => (
            <motion.div
              key={file.id}
              whileHover={{ scale: 0.99, x: 4 }}
              transition={{ duration: 0.15 }}
              className="group grid grid-cols-12 items-center gap-4 py-4 cursor-pointer"
            >
              <div className="col-span-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-3 font-mono text-[10px] uppercase text-text-secondary">
                  {file.type.substring(0, 3)}
                </div>
                <span className="text-sm font-medium text-text-primary transition-colors group-hover:text-purple-400">
                  {file.name}
                </span>
              </div>
              <div className="col-span-3 font-mono text-[11px] text-text-tertiary">
                {file.size}
              </div>
              <div className="col-span-3 text-right font-mono text-[11px] text-text-tertiary">
                {file.date}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
