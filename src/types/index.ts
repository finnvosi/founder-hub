export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  description: string;
};

export type TrendDirection = "up" | "down" | "neutral";

export type UserStatus = "available" | "focus" | "away" | "offline";

export type DecisionStatus = "pending" | "made" | "revisit";

export type UpdateStatus = "draft" | "sent";

export type MetricData = {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: TrendDirection;
  unit: string;
  prefix?: string;
  suffix?: string;
  sparklineData: number[];
  category: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  location: string;
  timezone: string;
  status: UserStatus;
  joinedDate: string;
};

export type Decision = {
  id: string;
  title: string;
  date: string;
  status: DecisionStatus;
  category: string;
  context: string;
  outcome: string | null;
  author: string;
};

export type InvestorUpdate = {
  id: string;
  title: string;
  date: string;
  status: UpdateStatus;
  highlights: string[];
  metrics: Record<string, number | string | null>;
};

export type RunwayData = {
  cashRemaining: number;
  monthlyBurn: number;
  dailyBurn: number;
  runwayDays: number;
  runwayMonths: number;
  totalRaised: number;
  lastFunding: {
    round: string;
    amount: number;
    date: string;
    lead: string;
  };
  burnTrend: number[];
  revenueHistory: number[];
};
