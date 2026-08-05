"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { transitionMicro, transitionMacro } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileText,
  Plus,
  X,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { MeetingItem } from "@/types";

export default function MeetingsPage() {
  const { meetings, addMeeting, deleteMeeting, updateMeetingStatus, userName } = useAppStore();
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");
  const [expandedId, setExpandedId] = useState<string | null>(meetings[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Meeting Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("Today");
  const [time, setTime] = useState("03:00 PM - 04:00 PM");
  const [duration, setDuration] = useState("60 mins");
  const [doc, setDoc] = useState("");
  const [link, setLink] = useState("");
  const [agendaInput, setAgendaInput] = useState("");

  const filteredMeetings = meetings.filter((m) => {
    if (filter === "today") return m.date === "Today" || m.status === "live";
    if (filter === "upcoming") return m.status === "upcoming";
    return true;
  });

  const liveMeeting = meetings.find((m) => m.status === "live");

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const agendaList = agendaInput
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    addMeeting({
      title: title.trim(),
      date,
      time,
      duration,
      host: userName || "Alex Chen",
      attendees: [userName || "Alex Chen", "Team"],
      doc: doc.trim() || undefined,
      link: link.trim() || `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
      status: "upcoming",
      agenda: agendaList.length > 0 ? agendaList : ["Sync & alignment"],
    });

    setTitle("");
    setDoc("");
    setLink("");
    setAgendaInput("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-5xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <div className="mono-label mb-2">Schedule & Agendas</div>
          <h1 className="text-[32px] font-medium tracking-tight text-text-primary">Meetings</h1>
        </div>

        <div className="flex items-center gap-3">
          {liveMeeting && (
            <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
              <span className="font-mono text-[11px] font-medium text-purple-300">
                LIVE: {liveMeeting.title}
              </span>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
        <div className="flex items-center gap-2">
          {(["all", "today", "upcoming"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                filter === tab
                  ? "bg-surface-2 text-text-primary border border-border-subtle"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-text-tertiary">
          {filteredMeetings.length} scheduled
        </span>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        {filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-border-subtle bg-surface-1">
            <CalendarIcon className="h-8 w-8 text-text-tertiary mb-2 opacity-40" />
            <p className="text-[13px] text-text-secondary">No meetings found.</p>
            <p className="font-mono text-[10px] text-text-tertiary mt-1">Schedule a meeting to get started.</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isExpanded = expandedId === meeting.id;

            return (
              <motion.div
                key={meeting.id}
                layout
                transition={transitionMacro}
                className={`group rounded-xl border transition-all ${
                  meeting.status === "live"
                    ? "border-purple-500/40 bg-purple-500/[0.04]"
                    : "border-border-subtle bg-card hover:border-border-hover"
                }`}
              >
                {/* Main Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : meeting.id)}
                  className="flex cursor-pointer items-center justify-between px-6 py-5"
                >
                  <div className="flex items-center gap-5">
                    {/* Status Badge */}
                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                      {meeting.status === "live" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/20 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-purple-300">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                          Live Now
                        </span>
                      ) : meeting.status === "completed" ? (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                          Ended
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                          {meeting.date}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-text-tertiary mt-1">
                        {meeting.duration}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-border-subtle" />

                    {/* Details */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[15px] font-medium text-text-primary group-hover:text-purple-400 transition-colors">
                          {meeting.title}
                        </h3>
                        {meeting.doc && (
                          <span className="inline-flex items-center gap-1 rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-tertiary border border-border-subtle">
                            <FileText className="h-3 w-3" />
                            {meeting.doc}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
                        <span className="font-mono">{meeting.time}</span>
                        <span>·</span>
                        <span>Host: <strong className="font-normal text-text-secondary">{meeting.host}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-3">
                    {meeting.link && (
                      <a
                        href={meeting.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-2 px-3 py-1.5 font-mono text-[11px] text-text-primary hover:border-purple-500/40 hover:text-purple-400 transition-all"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join</span>
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMeeting(meeting.id);
                      }}
                      className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete meeting"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-text-tertiary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Expanded Agenda & Details Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transitionMicro}
                      className="overflow-hidden border-t border-border-subtle bg-surface-1 px-6 py-5"
                    >
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Agenda Items */}
                        <div className="col-span-2 space-y-2">
                          <div className="mono-label text-[10px] text-text-tertiary mb-2">Meeting Agenda</div>
                          {meeting.agenda && meeting.agenda.length > 0 ? (
                            <ul className="space-y-1.5">
                              {meeting.agenda.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text.sm text-text-secondary">
                                  <span className="font-mono text-[10px] text-purple-400 mt-0.5">0{idx + 1}.</span>
                                  <span className="text-[13px]">{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[12px] text-text-tertiary italic">No agenda specified.</p>
                          )}
                        </div>

                        {/* Attendees & Status Controls */}
                        <div className="space-y-4">
                          <div>
                            <div className="mono-label text-[10px] text-text-tertiary mb-2">Attendees</div>
                            <div className="flex flex-wrap gap-1.5">
                              {meeting.attendees.map((att) => (
                                <span
                                  key={att}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary"
                                >
                                  <User className="h-3 w-3 text-text-tertiary" />
                                  {att}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border-subtle">
                            <div className="mono-label text-[10px] text-text-tertiary mb-2">Status Control</div>
                            <div className="flex items-center gap-2">
                              {meeting.status !== "live" && (
                                <button
                                  onClick={() => updateMeetingStatus(meeting.id, "live")}
                                  className="rounded border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-purple-300 hover:bg-purple-500/20 transition-colors"
                                >
                                  Mark Live
                                </button>
                              )}
                              {meeting.status !== "completed" && (
                                <button
                                  onClick={() => updateMeetingStatus(meeting.id, "completed")}
                                  className="rounded border border-border-subtle bg-surface-2 px-2.5 py-1 font-mono text-[10px] uppercase text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                  Mark Ended
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transitionMicro}
              className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
                <div className="flex flex-col">
                  <span className="mono-label">New Event</span>
                  <h3 className="text-[18px] font-medium text-text-primary">Schedule Meeting</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="mono-label text-[10px]">Meeting Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Q4 Growth & Product Alignment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2.5 text-[13px] text-text-primary outline-none focus:border-border-hover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="mono-label text-[10px]">Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2 text-[13px] text-text-primary outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="mono-label text-[10px]">Time</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2 text-[13px] text-text-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="mono-label text-[10px]">Linked Document (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Technical Roadmap v3"
                    value={doc}
                    onChange={(e) => setDoc(e.target.value)}
                    className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2 text-[13px] text-text-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="mono-label text-[10px]">Agenda Items (1 per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Review roadmap&#10;Discuss RBAC clearance&#10;Q&A"
                    value={agendaInput}
                    onChange={(e) => setAgendaInput(e.target.value)}
                    className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-2 text-[13px] text-text-primary outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-[13px] text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-foreground px-5 py-2 text-[13px] font-medium text-background hover:opacity-90 transition-all"
                  >
                    Create Meeting
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
