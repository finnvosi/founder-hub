"use client";

import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/shared/metric-card";

// Mock data for Phase 2 UI building
const MOCK_METRICS = [
  {
    id: "mrr",
    label: "REVENUE",
    name: "Monthly Recurring",
    value: 128450,
    prefix: "$",
    trend: "up" as const,
    trendValue: 12.4,
    sparklineData: [60, 65, 75, 70, 85, 90, 110, 105, 120, 128],
  },
  {
    id: "runway",
    label: "RUNWAY",
    name: "Months Remaining",
    value: 18,
    suffix: "mo",
    trend: "neutral" as const,
    trendValue: 0,
    sparklineData: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
  },
  {
    id: "burn",
    label: "BURN RATE",
    name: "Monthly Burn",
    value: 45200,
    prefix: "$",
    trend: "down" as const,
    trendValue: 5.2,
    sparklineData: [55, 52, 53, 50, 48, 49, 47, 46, 45, 45],
  },
  {
    id: "users",
    label: "ACTIVE USERS",
    name: "30-Day Active",
    value: 4250,
    trend: "up" as const,
    trendValue: 8.1,
    sparklineData: [2000, 2200, 2500, 2800, 3100, 3000, 3500, 3800, 4000, 4250],
  },
];

const MOCK_ACTIVITY = [
  { id: 1, type: "decision", title: "Migrate to Vercel", author: "Finn", time: "2 hours ago" },
  { id: 2, type: "document", title: "Q3 Board Deck", author: "Sarah", time: "4 hours ago" },
  { id: 3, type: "file", title: "Brand_Assets.zip", author: "Alex", time: "1 day ago" },
];

export default function PulsePage() {
  return (
    <div className="w-full max-w-5xl">
      <PageHeader
        title="Pulse"
        subtitle="Morning Briefing"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_METRICS.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            name={metric.name}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            trend={metric.trend}
            trendValue={metric.trendValue}
            sparklineData={metric.sparklineData}
          />
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mono-label mb-6">Recent Activity</h2>
        <div className="space-y-1">
          {MOCK_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="group flex cursor-pointer items-center justify-between rounded-md border border-transparent p-3 transition-colors hover:border-[oklch(1_0_0/4%)] hover:bg-surface-2"
            >
              <div className="flex items-center gap-4">
                <span className="mono-label text-[10px] uppercase text-text-tertiary">
                  {activity.type}
                </span>
                <span className="text-sm text-text-primary group-hover:text-amber transition-colors">
                  {activity.title}
                </span>
              </div>
              <span className="font-mono text-[10px] text-text-tertiary">
                {activity.time} — {activity.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
