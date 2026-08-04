"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMacro } from "@/lib/motion";

const MOCK_WIKI = [
  {
    category: "Engineering",
    pages: [
      { id: "1", title: "Architecture Guidelines" },
      { id: "2", title: "Database Schema" },
    ]
  },
  {
    category: "Product",
    pages: [
      { id: "3", title: "Q3 Roadmap" },
      { id: "4", title: "User Personas" },
    ]
  }
];

export default function WikiPage() {
  const [activePage, setActivePage] = useState(MOCK_WIKI[0].pages[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleInput = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex h-[calc(100vh-160px)] w-full gap-8">
      {/* Left Pane: Tree View */}
      <div className="flex w-64 flex-col border-r border-border pr-8">
        <PageHeader title="Wiki" />
        <div className="flex-1 space-y-6 overflow-y-auto pt-2">
          {MOCK_WIKI.map((section) => (
            <div key={section.category} className="space-y-2">
              <span className="mono-label px-2 text-text-tertiary">{section.category}</span>
              <div className="space-y-1">
                {section.pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      activePage.id === page.id
                        ? "bg-surface-2 text-text-primary"
                        : "text-text-secondary hover:bg-surface-1"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-text-tertiary opacity-50">↳</span>
                    {page.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Active Page */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage.id}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={transitionMacro}
          className="flex flex-1 flex-col pt-12"
        >
          <div className="mb-8 flex items-center justify-between">
            <input
              type="text"
              defaultValue={activePage.title}
              onChange={handleInput}
              className="bg-transparent text-3xl font-medium tracking-tight text-text-primary outline-none placeholder:text-text-tertiary"
              placeholder="Page Title"
            />
            <div className="mono-label flex items-center gap-2 text-text-tertiary">
              {isSaving ? (
                <span className="text-amber">Saving...</span>
              ) : (
                <span>Global Sync</span>
              )}
            </div>
          </div>
          
          <textarea
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-text-secondary outline-none placeholder:text-text-tertiary"
            placeholder="Start writing..."
            defaultValue={`# ${activePage.title}\n\nThe company wiki utilizes the same autosave architecture as the Document hub, but organizes content into a centralized, hierarchical tree for global knowledge distribution.`}
            onChange={handleInput}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
