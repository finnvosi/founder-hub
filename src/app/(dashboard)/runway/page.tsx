import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Runway" };

export default function RunwayPage() {
  return (
    <div>
      <PageHeader title="Runway" subtitle="Financials" />
      <div className="py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          Days remaining
        </p>
        <p className="mt-2 font-mono text-[80px] font-light tabular-nums tracking-[-0.04em] text-text-primary">
          247
        </p>
      </div>
    </div>
  );
}
