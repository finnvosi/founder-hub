import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Decisions" };

export default function DecisionsPage() {
  return (
    <div>
      <PageHeader title="Decisions" subtitle="Decision Journal" />
      <div className="divide-y divide-border">
        {["Pending", "Made", "Revisit"].map((status) => (
          <div key={status} className="flex items-center justify-between py-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              {status}
            </span>
            <span className="font-mono text-[13px] tabular-nums text-text-secondary">
              —
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
