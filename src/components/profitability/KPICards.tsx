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
      gradient: "from-brand-400 to-brand-600",
      ringColor: "ring-brand-500/10",
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
      gradient: "from-emerald-400 to-emerald-600",
      ringColor: "ring-emerald-500/10",
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
      gradient: "from-amber-400 to-amber-500",
      ringColor: "ring-amber-500/10",
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
      gradient: "from-orange-400 to-orange-600",
      ringColor: "ring-orange-500/10",
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
      gradient: "from-rose-400 to-red-600",
      ringColor: "ring-red-500/10",
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
          className={`kpi-card group ring-1 ${card.ringColor}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
              <card.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              {card.change && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {card.change}
                </span>
              )}
              <InfoPopover title={card.info.title}>
                {card.info.content}
              </InfoPopover>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1">{card.label}</div>
          <div className="text-lg font-bold text-surface-900 truncate">{card.value}</div>
          {card.sub && <div className="text-xs text-surface-500 mt-0.5">{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}
