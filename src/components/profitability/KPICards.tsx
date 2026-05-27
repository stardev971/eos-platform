"use client";

import { motion } from "framer-motion";
import { getAggregateMetrics } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import InfoPopover from "@/components/ui/InfoPopover";
import {
  DollarSign,
  TrendingUp,
  Crown,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ProfitabilityKPICards() {
  const m = getAggregateMetrics();

  const cards = [
    {
      label: "Total ARR",
      value: formatCurrency(m.totalARR, true),
      change: "+12.4%",
      positive: true,
      icon: DollarSign,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      info: {
        title: "Total ARR — How It's Calculated",
        content: (
          <>
            <p>Total Annual Recurring Revenue aggregated from all active customer contracts.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Active subscription amounts, normalized to annual</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span><strong>HubSpot:</strong> Contract values and renewal terms for validation</span></div>
            </div>
            <p className="mt-2 text-surface-400">Change % compares to same period last quarter. Updated in real-time from Stripe webhooks.</p>
          </>
        ),
      },
    },
    {
      label: "Gross Margin",
      value: formatPercent(m.grossMargin),
      change: "+2.1pp",
      positive: true,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      info: {
        title: "Gross Margin — How It's Calculated",
        content: (
          <>
            <p>Revenue minus direct costs (support + engineering) divided by revenue, across all accounts.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Monthly revenue per account</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Support ticket costs (time x agent rate)</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span><strong>Jira:</strong> Engineering hours allocated per customer</span></div>
            </div>
          </>
        ),
      },
    },
    {
      label: "Most Profitable",
      value: m.mostProfitable.name,
      sub: formatCurrency(m.mostProfitable.arr, true) + " ARR",
      icon: Crown,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      info: {
        title: "Most Profitable Account",
        content: (
          <>
            <p>The customer with the highest net margin (revenue minus all servicing costs).</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Subscription revenue data</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Support cost allocation</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span><strong>Jira:</strong> Custom engineering effort hours</span></div>
            </div>
            <p className="mt-2 text-surface-400">Margin is calculated as: (MRR - Support Cost - Engineering Cost) / MRR</p>
          </>
        ),
      },
    },
    {
      label: "Highest Support Burden",
      value: m.highestSupportBurden.name,
      sub: formatCurrency(m.highestSupportBurden.supportCost) + "/mo",
      icon: AlertTriangle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      info: {
        title: "Highest Support Burden",
        content: (
          <>
            <p>The customer generating the most support cost relative to their revenue contribution.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Ticket volume, resolution time, agent hours</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span><strong>HubSpot:</strong> Account tier and SLA commitments</span></div>
            </div>
            <p className="mt-2 text-surface-400">Cost is computed using avg. agent hourly rate x total resolution hours this month.</p>
          </>
        ),
      },
    },
    {
      label: "Revenue at Risk",
      value: formatCurrency(m.arrAtRisk, true),
      sub: `${m.atRiskCount} accounts`,
      icon: ShieldAlert,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      info: {
        title: "Revenue at Risk — How It's Calculated",
        content: (
          <>
            <p>Total ARR from accounts with a churn risk score above 50%, weighted by risk probability.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span><strong>Mixpanel:</strong> Engagement decline, feature adoption drop</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Escalation frequency, declining CSAT</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Payment failures, downgrade signals</span></div>
            </div>
            <p className="mt-2 text-surface-400">Risk score is an AI-weighted composite of 12 signals across all platforms.</p>
          </>
        ),
      },
    },
  ];

  return (
    <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="kpi-card group"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`icon-chip w-8 h-8 ${card.iconBg} shrink-0`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-[13px] font-medium text-surface-600 truncate">{card.label}</span>
            </div>
            <InfoPopover title={card.info.title}>
              {card.info.content}
            </InfoPopover>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <div className="text-xl font-bold text-surface-900 nums truncate">{card.value}</div>
            {card.change && (
              <span className={`trend ${card.positive ? "text-emerald-600" : "text-red-600"}`}>
                {card.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {card.change}
              </span>
            )}
          </div>
          {card.sub && <div className="text-xs text-surface-500 mt-1">{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}
