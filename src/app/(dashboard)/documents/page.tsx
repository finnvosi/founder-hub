"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMacro } from "@/lib/motion";

const MOCK_DOCS = [
  { id: "1", title: "Q3 Board Deck Architecture", updatedAt: "2 hours ago" },
  { id: "2", title: "Product Requirements v2", updatedAt: "Yesterday" },
  { id: "3", title: "Engineering Onboarding", updatedAt: "3 days ago" },
];

export default function DocumentsPage() {
  const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleInput = () => {
    setIsSaving(true);
    // Simulate autosave
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex h-[calc(100vh-160px)] w-full gap-8">
      {/* Left Pane: Document List */}
      <div className="flex w-64 flex-col border-r border-border pr-8">
        <PageHeader title="Docs" />
        <div className="flex-1 space-y-2 overflow-y-auto">
          {MOCK_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className={`flex w-full flex-col items-start gap-1 rounded-md p-3 text-left transition-colors ${
                activeDoc.id === doc.id
                  ? "bg-surface-2"
                  : "hover:bg-surface-1"
              }`}
            >
              <span className={`text-sm ${activeDoc.id === doc.id ? "text-text-primary" : "text-text-secondary"}`}>
                {doc.title}
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">
                {doc.updatedAt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane: Active Document */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDoc.id}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={transitionMacro}
          className="flex flex-1 flex-col pt-12"
        >
          <div className="mb-8 flex items-center justify-between">
            <input
              type="text"
              defaultValue={activeDoc.title}
              onChange={handleInput}
              className="bg-transparent text-3xl font-medium tracking-tight text-text-primary outline-none placeholder:text-text-tertiary"
              placeholder="Document Title"
            />
            <div className="mono-label flex items-center gap-2 text-text-tertiary">
              {isSaving ? (
                <span className="text-amber">Saving...</span>
              ) : (
                <span>Saved to cloud</span>
              )}
            </div>
          </div>
          
          <textarea
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-text-secondary outline-none placeholder:text-text-tertiary"
            placeholder="Start typing..."
            defaultValue={`This is the initial content for ${activeDoc.title}.\n\nThe autosave architecture is built directly into the text area, providing an instantaneous feedback loop for the user.`}
            onChange={handleInput}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
