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
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-1 lg:gap-6">
      {/* ── MASSIVE FOCAL POINT (HERO) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-2 group min-h-[50vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-50" />
        
        {/* Structural Fragments */}
        <div className="absolute top-6 left-6 ui-crosshair" />
        <div className="absolute top-6 right-6 ui-crosshair" />
        <div className="absolute bottom-6 left-6 ui-crosshair" />
        <div className="absolute bottom-6 right-6 ui-crosshair" />
        
        <div className="absolute top-8 left-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          // SYS.MODULE.SYNC
        </div>
        
        <div className="absolute bottom-8 right-12 font-mono text-[9px] text-text-tertiary tracking-widest uppercase hidden sm:block">
          STATUS: {liveMeeting ? "LIVE COMM LINK" : "STANDBY"}
        </div>

        {/* Large Typography Focal Point */}
        <div className="z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] lg:text-[140px] font-medium tracking-tighter text-text-primary leading-[0.85] mix-blend-difference"
          >
            SYNC
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 font-mono text-[10px] sm:text-[12px] text-text-secondary tracking-[0.3em] uppercase"
          >
            {liveMeeting ? `LIVE: ${liveMeeting.title.toUpperCase()}` : `${filteredMeetings.length} UPCOMING COMM LINKS`}
          </motion.p>
        </div>
      </div>

      {/* ── CONDENSED TELEMETRY (SUPPORTING) ───────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 flex flex-col border border-border rounded-sm bg-background p-5 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-[10px] text-text-tertiary tracking-[0.15em] uppercase">
            Comm Link Schedule
          </h2>
          <div className="flex items-center gap-2">
            {liveMeeting && (
              <div className="flex items-center gap-1.5 rounded border border-purple-500/40 bg-purple-500/10 px-2 py-0.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                <span className="font-mono text-[9px] font-medium uppercase text-purple-400">Live</span>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded bg-foreground px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-background transition-all hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
          <div className="flex items-center gap-1">
            {(["all", "today", "upcoming"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  filter === tab
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            {filteredMeetings.length} links
          </span>
        </div>

        {/* Meetings List */}
        <div className="flex flex-col gap-2">
          {filteredMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded border border-border bg-surface-1">
              <CalendarIcon className="h-6 w-6 text-text-tertiary mb-2 opacity-40" />
              <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">No scheduled links.</p>
            </div>
          ) : (
            filteredMeetings.map((meeting) => {
              const isExpanded = expandedId === meeting.id;

              return (
                <div
                  key={meeting.id}
                  className={`group rounded border transition-all ${
                    meeting.status === "live"
                      ? "border-purple-500/40 bg-purple-500/5"
                      : "border-border-subtle bg-surface-1 hover:bg-surface-2"
                  }`}
                >
                  {/* Main Summary Row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : meeting.id)}
                    className="flex cursor-pointer items-start justify-between p-3 gap-3"
                  >
                    <div className="flex flex-col shrink-0 items-center justify-center w-[50px] border-r border-border-subtle pr-3 mr-1">
                      {meeting.status === "live" ? (
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-purple-400">Live</span>
                      ) : meeting.status === "completed" ? (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">End</span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">{meeting.date}</span>
                      )}
                      <span className="font-mono text-[8px] text-text-tertiary mt-0.5">{meeting.duration.split(" ")[0]}m</span>
                    </div>

                    <div className="flex flex-col flex-1 gap-1">
                      <h3 className="text-[13px] font-medium text-text-primary leading-tight">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-text-tertiary font-mono">
                        <span>{meeting.time}</span>
                        <span>|</span>
                        <span>Host: {meeting.host.split(" ")[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {meeting.link && (
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded bg-surface-3 px-2 py-1 font-mono text-[9px] text-text-primary hover:bg-surface-4 transition-all"
                        >
                          Join
                        </a>
                      )}
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-text-tertiary" /> : <ChevronDown className="h-3 w-3 text-text-tertiary" />}
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
                        className="overflow-hidden border-t border-border-subtle bg-background"
                      >
                        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Agenda</div>
                            {meeting.agenda && meeting.agenda.length > 0 ? (
                              <ul className="space-y-1">
                                {meeting.agenda.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                                    <span className="font-mono text-[9px] text-text-tertiary mt-0.5">0{idx + 1}.</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[11px] text-text-tertiary italic">No agenda specified.</p>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-1.5">Attendees</div>
                              <div className="flex flex-wrap gap-1">
                                {meeting.attendees.map((att) => (
                                  <span key={att} className="rounded border border-border-subtle px-1.5 py-0.5 text-[10px] text-text-secondary">
                                    {att}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                                {meeting.status !== "live" && (
                                  <button onClick={() => updateMeetingStatus(meeting.id, "live")} className="rounded border border-purple-500/40 px-2 py-0.5 font-mono text-[9px] uppercase text-purple-400 hover:bg-purple-500/10 transition-colors">
                                    Mark Live
                                  </button>
                                )}
                                {meeting.status !== "completed" && (
                                  <button onClick={() => updateMeetingStatus(meeting.id, "completed")} className="rounded border border-border-subtle px-2 py-0.5 font-mono text-[9px] uppercase text-text-tertiary hover:text-text-primary transition-colors">
                                    End
                                  </button>
                                )}
                                <button onClick={() => deleteMeeting(meeting.id)} className="rounded border border-border-subtle px-2 py-0.5 font-mono text-[9px] uppercase text-red-400 hover:bg-red-400/10 transition-colors ml-auto">
                                  Del
                                </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
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
              className="w-full max-w-md rounded border border-border bg-surface-1 p-5"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">New Event</span>
                  <h3 className="text-[14px] font-medium text-text-primary mt-1">Schedule Sync</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-text-tertiary hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none focus:border-border-hover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Date</label>
                    <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none focus:border-border-hover" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Time</label>
                    <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none focus:border-border-hover" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Agenda</label>
                  <textarea rows={3} value={agendaInput} onChange={(e) => setAgendaInput(e.target.value)} className="rounded border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] text-text-primary outline-none resize-none focus:border-border-hover" />
                </div>
                <div className="flex justify-end pt-3 border-t border-border-subtle">
                  <button type="submit" className="rounded bg-foreground px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-background hover:opacity-90 transition-all">
                    Create
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
