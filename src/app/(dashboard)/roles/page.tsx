"use client";

import { PageHeader } from "@/components/layout/page-header";

const MOCK_ROLES = [
  { id: "owner", title: "Owner", description: "Full access to billing, settings, and destructive actions.", users: 1 },
  { id: "admin", title: "Admin", description: "Can manage team members, edit roles, and access all documents.", users: 2 },
  { id: "member", title: "Member", description: "Can view and edit documents, tasks, and files they have access to.", users: 8 },
  { id: "guest", title: "Guest", description: "View-only access to specifically shared resources.", users: 0 },
];

export default function RolesPage() {
  return (
    <div className="w-full max-w-5xl">
      <PageHeader title="Role Hub" subtitle="Access Control" />

      <div className="mt-8 rounded-md border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-4">
          <div className="col-span-3 mono-label">Role Level</div>
          <div className="col-span-7 mono-label">Permissions</div>
          <div className="col-span-2 mono-label text-right">Active Users</div>
        </div>

        <div className="divide-y divide-border">
          {MOCK_ROLES.map((role) => (
            <div
              key={role.id}
              className="group grid grid-cols-12 items-start gap-4 px-6 py-5 transition-colors hover:bg-surface-2 cursor-pointer"
            >
              <div className="col-span-3">
                <span className="inline-flex rounded-full border border-[oklch(1_0_0/10%)] bg-surface-1 px-2.5 py-0.5 font-mono text-[10px] uppercase text-text-primary transition-colors group-hover:border-purple-500/30 group-hover:text-purple-400">
                  {role.title}
                </span>
              </div>
              <div className="col-span-7 pr-8">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {role.description}
                </p>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-mono text-[11px] text-text-tertiary">
                  {role.users}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
