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
    <div className="flex h-[calc(100vh-140px)] w-full gap-8">
      {/* Left Pane: Channels */}
      <div className="flex w-64 flex-col border-r border-border-subtle pr-6 shrink-0">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[24px] font-medium tracking-tight text-text-primary">Chat</h1>
          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-purple-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            <span>Live</span>
          </div>
        </div>

        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
          Channels
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {MOCK_CHANNELS.map((channel) => {
            const isActive = activeChannel === channel.id;
            const count = messages.filter((m) => m.channelId === channel.id).length;

            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? "bg-surface-2 text-text-primary font-medium border border-border-subtle"
                    : "text-text-tertiary hover:bg-surface-1 hover:text-text-secondary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className={`h-3.5 w-3.5 ${isActive ? "text-purple-400" : "opacity-50"}`} />
                  <span className="text-[13px]">{channel.name}</span>
                </div>
                <span className="font-mono text-[9px] text-text-tertiary">
                  {count > 0 ? count : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* User Badge at bottom of channels */}
        <div className="mt-auto border-t border-border-subtle pt-4">
          <div className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 font-mono text-[10px] text-purple-400 font-medium">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-[12px] font-medium text-text-primary">{userName}</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                {ROLE_CONFIGS[userRole]?.label || userRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Active Channel Chat Room */}
      <div className="flex flex-1 flex-col relative h-full overflow-hidden">
        {/* Channel Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-purple-400" />
              <h2 className="text-[16px] font-medium text-text-primary">{currentChannel.name}</h2>
            </div>
            <p className="text-[11px] text-text-tertiary">{currentChannel.description}</p>
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            {channelMessages.length} messages
          </span>
        </div>

        {/* Message History Scroll Area */}
        <div className="flex-1 overflow-y-auto pb-28 pt-4 space-y-5">
          {channelMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-text-tertiary">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-[13px]">No messages in #{currentChannel.name} yet.</p>
              <p className="font-mono text-[10px] mt-1">Start the conversation below.</p>
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
                  className="group flex gap-3.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-mono text-[11px] font-semibold text-text-primary border border-border-subtle">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-text-primary">{msg.user}</span>
                      {roleLabel && (
                        <span className="font-mono text-[9px] uppercase tracking-wider rounded bg-surface-3 px-1.5 py-0.5 text-text-tertiary">
                          {roleLabel}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-text-tertiary">{msg.time}</span>
                    </div>
                    <p className="text-[13px] text-text-secondary leading-relaxed rounded-lg border border-border-subtle bg-surface-1 px-3.5 py-2">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Box */}
        <div className="absolute bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-background via-background/90 to-transparent">
          <form onSubmit={handleSend} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3 focus-within:border-border-hover transition-colors shadow-lg">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentChannel.name}...`}
              className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-background disabled:opacity-40 transition-all hover:opacity-90"
            >
              <span>Send</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
