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

// ─── AI Usage Types ─────────────────────────────────────────────────
export type AIModelProvider = "OpenAI" | "Anthropic" | "Stability AI" | "Google" | "Internal";

export interface AIModelUsage {
  id: string;
  model: string;
  provider: AIModelProvider;
  useCase: string;
  category: "Content Generation" | "Image Processing" | "Data Analysis" | "Churn Prediction" | "Recommendations" | "Summarization";
  status: "active" | "limited" | "deprecated";
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  requests: number;
  avgLatencyMs: number;
  costPerMille: number; // cost per 1K tokens
  totalCost: number;
  lastUsed: string;
}

export interface AIUsageSummary {
  totalTokensUsed: number;
  totalCost: number;
  totalRequests: number;
  activeModels: number;
  avgLatencyMs: number;
  costTrend: number; // percentage change from prior month
  tokensByCategory: { category: string; tokens: number; cost: number }[];
  dailyUsage: { date: string; tokens: number; cost: number; requests: number }[];
}

// ─── Team Efficiency Types ──────────────────────────────────────────
export type TeamName = "Sales" | "Customer Success" | "Support" | "Engineering";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: TeamName;
  avatar: string;
  email: string;
  status: "available" | "busy" | "overloaded";
  accountsManaged: number;
  arrManaged: number;
  avgHealthScore: number;
  utilization: number; // % capacity used
  // Role-specific (optional)
  ticketsResolved?: number;
  avgResponseHours?: number;
  csat?: number;
  slaCompliance?: number;
  sprintVelocity?: number;
  bugsResolved?: number;
  dealsWon?: number;
  quotaAttainment?: number;
  renewalsSecured?: number;
  expansionArr?: number;
  monthlyOutput: { month: string; value: number }[];
}

// ─── Revenue Operations Types ───────────────────────────────────────
export interface PipelineDeal {
  id: string;
  customer: string;
  logo: string;
  type: "New Business" | "Expansion" | "Renewal" | "Upsell";
  stage: "Discovery" | "Proposal" | "Negotiation" | "Closing" | "Closed Won";
  value: number;
  probability: number;
  owner: string;
  closeDate: string;
  source: string;
}

// ─── AI Recommendation Types ────────────────────────────────────────
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "Revenue" | "Retention" | "Cost" | "Efficiency" | "Growth";
  priority: "critical" | "high" | "medium" | "low";
  customer?: string;
  impact: string;
  impactValue: number;
  confidence: number;
  effort: "Low" | "Medium" | "High";
  sources: string[];
  actionType: "campaign" | "escalation" | "outreach" | "review";
  rationale: string[];
}
