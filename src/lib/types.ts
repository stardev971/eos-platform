export interface Customer {
  id: string;
  name: string;
  logo: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  industry: string;
  accountOwner: string;
  lifecycleStage: "Active" | "At Risk" | "Churning" | "New";
  onboardingStatus: "Complete" | "In Progress" | "Pending";
  companySize: number;
  leadSource: string;

  // Stripe — Billing
  arr: number;
  mrr: number;
  contractValue: number;
  subscriptionStatus: "Active" | "Past Due" | "Canceled" | "Trial";
  billingCycle: "Monthly" | "Annual";
  failedPayments: number;
  lastPaymentDate: string;
  paymentHistory: PaymentRecord[];
  upgrades: number;
  downgrades: number;

  // Zendesk — Support
  ticketCount: number;
  unresolvedTickets: number;
  escalations: number;
  slaBreaches: number;
  csatScore: number;
  supportHours: number;
  issueCategories: string[];

  // Jira — Engineering
  engineeringHours: number;
  activeProjects: number;
  delayedTasks: number;
  bugCount: number;
  sprintVelocity: number;

  // Mixpanel — Product
  activeUsers: number;
  featureAdoption: number;
  loginFrequency: number;
  engagementScore: number;
  featureUsageDecline: number;
  sessionActivity: number;

  // Computed
  supportCost: number;
  engineeringCost: number;
  operationalCost: number;
  profitabilityScore: number;
  marginPercentage: number;
  healthScore: number;
  churnRiskScore: number;
  renewalDate: string;
  renewalValue: number;
  recentActivity: ActivityItem[];
  churnSignals: ChurnSignal[];
  monthlyTrend: MonthlyMetric[];
}

export interface PaymentRecord {
  date: string;
  amount: number;
  status: "Paid" | "Failed" | "Pending";
}

export interface ActivityItem {
  date: string;
  type: "support" | "billing" | "product" | "engineering" | "account";
  description: string;
  severity: "info" | "warning" | "critical";
}

export interface ChurnSignal {
  signal: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  detectedDate: string;
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  supportCost: number;
  engineeringCost: number;
  engagement: number;
  tickets: number;
}

export interface AIInsight {
  id: string;
  type: "warning" | "critical" | "opportunity" | "info";
  title: string;
  description: string;
  customer?: string;
  source: string;
  timestamp: string;
  impact: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success";
  time: string;
  read: boolean;
}
