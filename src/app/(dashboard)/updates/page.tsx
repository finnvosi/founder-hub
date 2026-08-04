import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Updates" };

export default function UpdatesPage() {
  return (
    <div>
      <PageHeader title="Updates" subtitle="Investor Communications" />
      <div className="py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          Next update due
        </p>
        <p className="mt-2 text-[32px] font-light tracking-[-0.02em] text-text-primary">
          August 31
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
          Monthly · Series A
        </p>
      </div>
    </div>
  );
}
