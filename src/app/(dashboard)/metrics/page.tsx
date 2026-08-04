import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Metrics" };

export default function MetricsPage() {
  return (
    <div>
      <PageHeader title="Metrics" subtitle="Vital Signs" />
      <div className="grid grid-cols-3 gap-px bg-border">
        {["WAU", "MRR", "CAC", "Churn", "NPS", "LTV"].map((metric) => (
          <div key={metric} className="bg-surface-0 p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
              {metric}
            </p>
            <p className="mt-3 font-mono text-[20px] tabular-nums text-text-tertiary">
              —
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
