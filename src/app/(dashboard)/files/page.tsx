"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { transitionMacro } from "@/lib/motion";
import { Trash2, FilePlus, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilesPage() {
  const { files, addFile, deleteFile } = useAppStore();
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
    
    // Process dropped files or fallback to a dummy if none
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        addFile({
          name: file.name,
          type: file.type || "unknown",
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        });
      });
    } else {
      addFile({
        name: `Injected_Asset_${Math.floor(Math.random() * 1000)}.dat`,
        type: "binary",
        size: `${(Math.random() * 50).toFixed(1)} MB`,
      });
    }
  };

  // Allow clicking an 'Upload' button if user prefers click over drag
  const simulateUpload = () => {
    addFile({
      name: `Manual_Upload_${Math.floor(Math.random() * 1000)}.pdf`,
      type: "pdf",
      size: `${(Math.random() * 10).toFixed(1)} MB`,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558487661-9d4f01e2ad64?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.STORAGE
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          CAPACITY: 8.4TB / 10TB
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            FILES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase max-w-[80%] truncate"
          >
            {files.length} ASSETS // DROP ZONE READY
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 flex flex-col border border-border rounded-sm bg-surface-1/60 overflow-hidden relative glass-card backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface-1/40">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Asset Directory
          </h2>
          <button
            onClick={simulateUpload}
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <FilePlus className="h-3 w-3" />
            Add File
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragging ? "var(--color-surface-2)" : "transparent",
          }}
          transition={transitionMacro}
          className={cn(
            "flex-1 overflow-y-auto relative p-5 transition-colors",
            isDragging && "border-2 border-dashed border-border"
          )}
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-surface-1/50 backdrop-blur-sm"
              >
                <div className="px-4 py-2 bg-surface-2 border border-border rounded shadow-sm">
                  <span className="font-mono text-[10px] text-text-primary uppercase tracking-widest">Drop files to transmit</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-12 gap-4 border-b border-border-subtle pb-3 mb-2">
            <div className="col-span-6 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">Name</div>
            <div className="col-span-3 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">Size</div>
            <div className="col-span-3 font-mono text-[9px] uppercase tracking-wider text-text-tertiary text-right">Date</div>
          </div>

          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group grid grid-cols-12 items-center gap-4 py-3 px-2 -mx-2 rounded cursor-pointer hover:bg-surface-2 glass-card transition-colors"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-subtle bg-surface-2 font-mono text-[9px] uppercase text-text-secondary group-hover:bg-surface-3 transition-colors">
                      {file.type.substring(0, 3)}
                    </div>
                    <span className="text-[12px] font-medium text-text-primary truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-3 font-mono text-[10px] text-text-tertiary truncate">
                    {file.size}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2 text-right font-mono text-[10px] text-text-tertiary">
                    <span className="group-hover:hidden truncate">{file.date}</span>
                    <div className="hidden group-hover:flex items-center gap-2">
                      <button className="p-1 hover:text-text-primary transition-colors cursor-pointer text-text-tertiary">
                        <Download className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                        className="p-1 hover:text-destructive transition-colors cursor-pointer text-text-tertiary"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {files.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">No assets found in directory</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
