"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMacro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import { Send, Hash, Users, MessageSquare } from "lucide-react";
import { ROLE_CONFIGS } from "@/lib/rbac";

const MOCK_CHANNELS = [
  { id: "1", name: "general", description: "Company-wide general discussion" },
  { id: "2", name: "engineering", description: "Technical architecture and sprint updates" },
  { id: "3", name: "design", description: "Swiss print design system & UI iterations" },
  { id: "4", name: "strategy", description: "Executive roadmap & investor relations" },
];

export default function ChatPage() {
  const { messages, addChatMessage, userName, userRole } = useAppStore();
  const [activeChannel, setActiveChannel] = useState(MOCK_CHANNELS[0].id);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChannel = MOCK_CHANNELS.find((c) => c.id === activeChannel) || MOCK_CHANNELS[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannel);

  // Auto-scroll to bottom of messages when channel or message count changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length, activeChannel]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addChatMessage({
      channelId: activeChannel,
      user: userName || "Team Member",
      userRole: userRole,
      content: inputText.trim(),
    });

    setInputText("");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.COMM
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          STATUS: ONLINE
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            COMM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase"
          >
            CHANNEL: {currentChannel.name.toUpperCase()} // {channelMessages.length} MSGS
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 flex flex-col border border-border rounded-sm bg-background overflow-hidden relative">
        
        {/* Channel Header Tabs */}
        <div className="flex flex-col border-b border-border-subtle bg-surface-1">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle/50">
            <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
              Secure Channel
            </h2>
            <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-purple-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
              <span>Live</span>
            </div>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-1">
            {MOCK_CHANNELS.map((channel) => {
              const isActive = activeChannel === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-surface-3 text-text-primary border border-border-subtle shadow-sm"
                      : "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary border border-transparent"
                  }`}
                >
                  <Hash className="h-3 w-3 opacity-50" />
                  <span>{channel.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 pt-4 space-y-4 bg-background">
          {channelMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-text-tertiary">
              <MessageSquare className="h-6 w-6 mb-2 opacity-30" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">No messages</p>
            </div>
          ) : (
            channelMessages.map((msg) => {
              const roleLabel = msg.userRole ? (ROLE_CONFIGS[msg.userRole as keyof typeof ROLE_CONFIGS]?.label || msg.userRole) : "";
              const initials = msg.user.slice(0, 2).toUpperCase();

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transitionMacro}
                  className="group flex gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-surface-2 font-mono text-[9px] font-semibold text-text-primary border border-border-subtle">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-text-primary">{msg.user}</span>
                        {roleLabel && (
                          <span className="font-mono text-[8px] uppercase tracking-wider rounded border border-border-subtle bg-surface-1 px-1.5 py-0.5 text-text-tertiary">
                            {roleLabel}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-text-tertiary">{msg.time}</span>
                    </div>
                    <p className="text-[13px] text-text-secondary leading-relaxed bg-surface-1/50 border border-border-subtle/50 rounded-sm p-3 inline-block">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <form onSubmit={handleSend} className="flex items-center gap-2 rounded border border-border bg-surface-2 px-3 py-2 shadow-sm focus-within:border-border-hover transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Transmit to #${currentChannel.name}...`}
              className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 rounded bg-foreground px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-background disabled:opacity-40 transition-all hover:opacity-90"
            >
              <span>Tx</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
