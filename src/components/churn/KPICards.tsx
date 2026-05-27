"use client";

import { motion } from "framer-motion";
import { customers, getAggregateMetrics } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import InfoPopover from "@/components/ui/InfoPopover";
import {
  AlertTriangle,
  DollarSign,
  TrendingDown,
  CreditCard,
  Activity,
} from "lucide-react";

export default function ChurnKPICards() {
  const m = getAggregateMetrics();
  const atRiskCustomers = customers.filter((c) => c.churnRiskScore >= 50);
  const avgChurnProb = atRiskCustomers.length > 0
    ? atRiskCustomers.reduce((s, c) => s + c.churnRiskScore, 0) / atRiskCustomers.length
    : 0;

  const cards = [
    {
      label: "Accounts at Risk",
      value: m.atRiskCount.toString(),
      sub: `of ${m.totalCustomers} total`,
      icon: AlertTriangle,
      gradient: "from-rose-400 to-red-600",
      ringColor: "ring-red-500/10",
      info: {
        title: "Accounts at Risk — How It's Identified",
        content: (
          <>
            <p>Accounts with a composite churn risk score above 50%, calculated from 12 weighted signals.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span><strong>Mixpanel:</strong> Login frequency decline, feature drop-off</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Ticket escalations, CSAT decline</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Failed payments, plan downgrades</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span><strong>HubSpot:</strong> Champion departure, contract signals</span></div>
            </div>
          </>
        ),
      },
    },
    {
      label: "ARR at Risk",
      value: formatCurrency(m.arrAtRisk, true),
      sub: `${((m.arrAtRisk / m.totalARR) * 100).toFixed(1)}% of total ARR`,
      icon: DollarSign,
      gradient: "from-orange-400 to-orange-600",
      ringColor: "ring-orange-500/10",
      info: {
        title: "ARR at Risk — Revenue Impact",
        content: (
          <>
            <p>Total annual recurring revenue from at-risk accounts, weighted by churn probability.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Current subscription value per account</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span><strong>AI Engine:</strong> Risk probability weighting</span></div>
            </div>
            <p className="mt-2 text-surface-400">Formula: Sum of (Account ARR x Churn Probability) for all at-risk accounts.</p>
          </>
        ),
      },
    },
    {
      label: "Avg. Churn Probability",
      value: `${avgChurnProb.toFixed(0)}%`,
      sub: "Among at-risk accounts",
      icon: TrendingDown,
      gradient: "from-amber-400 to-amber-500",
      ringColor: "ring-amber-500/10",
      info: {
        title: "Average Churn Probability",
        content: (
          <>
            <p>Mean churn risk score across all accounts flagged as at-risk (score &gt; 50%).</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span><strong>AI Engine:</strong> ML model trained on historical churn patterns</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span><strong>Mixpanel:</strong> Engagement velocity and trend analysis</span></div>
            </div>
            <p className="mt-2 text-surface-400">Model accuracy: 89% on historical data. Recalibrated weekly.</p>
          </>
        ),
      },
    },
    {
      label: "Declining Engagement",
      value: m.declinedEngagement.toString(),
      sub: "Accounts with >15% decline",
      icon: Activity,
      gradient: "from-violet-400 to-purple-600",
      ringColor: "ring-purple-500/10",
      info: {
        title: "Declining Engagement — Early Warning",
        content: (
          <>
            <p>Accounts where product engagement has dropped more than 15% over the past 30 days.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span><strong>Mixpanel:</strong> DAU/MAU ratio, session duration, feature usage</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span><strong>HubSpot:</strong> Email open/click rates, meeting frequency</span></div>
            </div>
            <p className="mt-2 text-surface-400">Engagement decline is one of the strongest leading indicators of churn (precedes by ~45 days on average).</p>
          </>
        ),
      },
    },
    {
      label: "Failed Payments",
      value: m.failedPaymentAccounts.toString(),
      sub: "Accounts with failures",
      icon: CreditCard,
      gradient: "from-pink-400 to-rose-600",
      ringColor: "ring-rose-500/10",
      info: {
        title: "Failed Payments — Billing Risk",
        content: (
          <>
            <p>Accounts with at least one failed payment in the last 30 days.</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> Payment intent failures, retry status, dunning state</span></div>
            </div>
            <p className="mt-2 text-surface-400">Involuntary churn from payment failures accounts for ~20% of total churn. Auto-dunning sequences are triggered in Stripe.</p>
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
            <InfoPopover title={card.info.title}>
              {card.info.content}
            </InfoPopover>
          </div>
          <div className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1">{card.label}</div>
          <div className="text-xl font-bold text-surface-900">{card.value}</div>
          {card.sub && <div className="text-xs text-surface-500 mt-0.5">{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}
