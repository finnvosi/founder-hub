"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro } from "@/lib/motion";

const MOCK_CHANNELS = [
  { id: "1", name: "general", unread: false },
  { id: "2", name: "engineering", unread: true },
  { id: "3", name: "design", unread: false },
];

const MOCK_MESSAGES = [
  { id: "1", user: "Finn", time: "10:00 AM", content: "Architecture draft is ready for review." },
  { id: "2", user: "Sarah", time: "10:05 AM", content: "Looks solid. The grid imperfections are a nice touch." },
  { id: "3", user: "Alex", time: "10:12 AM", content: "I'll start porting the framer motion physics over now." },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState(MOCK_CHANNELS[0].id);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-[calc(100vh-160px)] w-full gap-8">
      {/* Left Pane: Channels */}
      <div className="flex w-64 flex-col border-r border-border pr-8">
        <h1 className="text-[32px] font-medium tracking-tight text-text-primary mb-8">Chat</h1>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {MOCK_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                activeChannel === channel.id
                  ? "bg-surface-2 text-text-primary"
                  : "text-text-secondary hover:bg-surface-1"
              }`}
            >
              <span className="text-sm font-medium"># {channel.name}</span>
              {channel.unread && (
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane: Messages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChannel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transitionMacro}
          className="flex flex-1 flex-col relative"
        >
          {/* Message History */}
          <div className="flex-1 overflow-y-auto pb-24 space-y-6 pt-4">
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className="group flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-2 font-mono text-[11px] text-text-secondary">
                  {msg.user[0]}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-text-primary">{msg.user}</span>
                    <span className="font-mono text-[10px] text-text-tertiary">{msg.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Input */}
          <div className="absolute bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-titanium-black via-titanium-black/80 to-transparent">
            <div className="flex items-center gap-4 rounded-md border border-border bg-surface-1 px-4 py-3 focus-within:border-[oklch(1_0_0/10%)] transition-colors">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message #general..."
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <button className="mono-label text-text-tertiary hover:text-text-primary transition-colors">
                SEND
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
