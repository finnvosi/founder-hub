"use client";

import { PageHeader } from "@/components/layout/page-header";

const MOCK_TEAM = [
  { id: "1", name: "Finn", role: "owner", status: "focus", avatar: "F" },
  { id: "2", name: "Sarah", role: "admin", status: "available", avatar: "S" },
  { id: "3", name: "Alex", role: "member", status: "offline", avatar: "A" },
];

export default function TeamPage() {
  return (
    <div className="w-full max-w-5xl">
      <PageHeader title="Workspace" subtitle="Team & Access" />

      <div className="mt-8 rounded-md border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-4">
          <div className="col-span-6 mono-label">Member</div>
          <div className="col-span-3 mono-label">Role</div>
          <div className="col-span-3 mono-label text-right">Status</div>
        </div>
        
        <div className="divide-y divide-border">
          {MOCK_TEAM.map((member) => (
            <div key={member.id} className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2">
              <div className="col-span-6 flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 font-mono text-[11px] text-text-primary">
                  {member.avatar}
                </div>
                <span className="text-sm font-medium text-text-primary">{member.name}</span>
              </div>
              <div className="col-span-3">
                <span className="inline-flex rounded-full border border-border bg-surface-1 px-2.5 py-0.5 font-mono text-[10px] uppercase text-text-secondary">
                  {member.role}
                </span>
              </div>
              <div className="col-span-3 flex justify-end">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'available' ? 'bg-positive' : member.status === 'focus' ? 'bg-purple-500' : 'bg-text-tertiary'}`} />
                  <span className="font-mono text-[10px] uppercase text-text-secondary">
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
