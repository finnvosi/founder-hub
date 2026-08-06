"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { Plus, Trash2, FileText, Search } from "lucide-react";

export default function DocumentsPage() {
  const { documents, addDocument, updateDocument, deleteDocument } = useAppStore();
  const [activeDocId, setActiveDocId] = useState<string | null>(documents[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // If active doc was deleted, select the first available one
  useEffect(() => {
    if (documents.length > 0 && !documents.find(d => d.id === activeDocId)) {
      setActiveDocId(documents[0].id);
    } else if (documents.length === 0 && activeDocId) {
      setActiveDocId(null);
    }
  }, [documents, activeDocId]);

  const activeDoc = documents.find(d => d.id === activeDocId) || null;
  
  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDoc) return;
    setIsSaving(true);
    updateDocument(activeDoc.id, { title: e.target.value });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleContentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeDoc) return;
    setIsSaving(true);
    updateDocument(activeDoc.id, { content: e.target.value });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleCreate = () => {
    addDocument({ title: "Untitled Document", content: "" });
    setTimeout(() => {
       const newest = useAppStore.getState().documents[0];
       if (newest) {
         setActiveDocId(newest.id);
         setSearchQuery("");
       }
    }, 50);
  };

  const handleDelete = () => {
    if (activeDoc) {
      deleteDocument(activeDoc.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.DOCS
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          STATUS: {isSaving ? "SYNCING..." : "SYNCED"}
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4 max-w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            DOCS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase max-w-[80%] truncate"
          >
            {activeDoc ? `ACTIVE: ${activeDoc.title.toUpperCase()}` : "NO ACTIVE DOCUMENT"}
          </motion.p>
        </div>
      </div>

      {/* ── MASTER-DETAIL TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[600px] xl:w-[700px] shrink-0 flex border border-border rounded-sm bg-surface-1/60 overflow-hidden relative glass-card backdrop-blur-md">
        
        {/* Left Column: Vertical Document List (Master) */}
        <div className="w-[240px] flex flex-col border-r border-border-subtle bg-surface-1 shrink-0">
          <div className="flex flex-col p-4 border-b border-border-subtle/50 gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
                Index
              </h2>
              <button 
                onClick={handleCreate}
                className="flex items-center gap-1.5 rounded bg-surface-3 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-text-primary transition-colors hover:bg-foreground hover:text-background"
              >
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center gap-2 rounded border border-border-subtle bg-background px-2.5 py-1.5 focus-within:border-border transition-colors">
              <Search className="h-3 w-3 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-tertiary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            {filteredDocs.length === 0 ? (
              <div className="p-4 text-center font-mono text-[9px] text-text-tertiary uppercase tracking-wider">No results</div>
            ) : filteredDocs.map((doc) => {
              const isActive = activeDoc?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`flex flex-col items-start w-full rounded p-3 text-left transition-colors ${
                    isActive
                      ? "bg-surface-3 border border-border-subtle shadow-sm"
                      : "hover:bg-surface-2 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full mb-1">
                    <FileText className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-text-primary' : 'text-text-tertiary'}`} />
                    <span className={`text-[12px] font-medium truncate ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {doc.title}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-text-tertiary pl-5.5">
                    {doc.updatedAt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Editor Area (Detail) */}
        <div className="flex flex-1 flex-col p-6 bg-background overflow-hidden relative">
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
            {isSaving ? (
              <span className="text-purple-400">Syncing...</span>
            ) : (
              <span>Cloud Synced</span>
            )}
          </div>

          {activeDoc ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDoc.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={transitionMacro}
                className="flex flex-1 flex-col h-full mt-4"
              >
                <div className="flex items-start justify-between mb-6 border-b border-border-subtle pb-4">
                  <input
                    type="text"
                    value={activeDoc.title}
                    onChange={handleTitleInput}
                    className="flex-1 bg-transparent text-[20px] font-medium tracking-tight text-text-primary outline-none placeholder:text-text-tertiary leading-tight"
                    placeholder="Document Title"
                  />
                  <button 
                    onClick={handleDelete}
                    className="p-1.5 mt-1 shrink-0 text-text-tertiary hover:text-destructive hover:bg-destructive/10 rounded transition-colors ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <textarea
                  className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-text-secondary outline-none placeholder:text-text-tertiary"
                  placeholder="Start typing..."
                  value={activeDoc.content}
                  onChange={handleContentInput}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-1 items-center justify-center font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
              Select or create a document
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
