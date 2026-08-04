"use client";

import { PageHeader } from "@/components/layout/page-header";

const MOCK_MEETINGS = [
  { id: "1", title: "Product Sync", time: "10:00 AM - 11:00 AM", doc: "Product Requirements v2" },
  { id: "2", title: "Investor Update Draft", time: "2:00 PM - 3:00 PM", doc: "None" },
  { id: "3", title: "Engineering Onboarding Sync", time: "4:00 PM - 4:30 PM", doc: "Engineering Onboarding" },
];

export default function MeetingsPage() {
  return (
    <div className="w-full max-w-5xl">
      <PageHeader title="Meetings" subtitle="Schedule & Agendas" />

      <div className="mt-8 rounded-md border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-4">
          <div className="col-span-3 mono-label">Time</div>
          <div className="col-span-5 mono-label">Meeting</div>
          <div className="col-span-4 mono-label">Linked Document</div>
        </div>

        <div className="divide-y divide-border">
          {MOCK_MEETINGS.map((meeting) => (
            <div
              key={meeting.id}
              className="group grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2 cursor-pointer"
            >
              <div className="col-span-3 font-mono text-[11px] text-text-tertiary">
                {meeting.time}
              </div>
              <div className="col-span-5 text-sm font-medium text-text-primary transition-colors group-hover:text-purple-400">
                {meeting.title}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-[10px] uppercase transition-colors ${meeting.doc !== "None" ? "border-[oklch(1_0_0/10%)] bg-surface-1 text-text-secondary group-hover:border-purple-500/30 group-hover:text-purple-400" : "border-transparent text-text-tertiary"}`}>
                  {meeting.doc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
