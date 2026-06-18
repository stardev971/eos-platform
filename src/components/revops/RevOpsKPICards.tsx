"use client";

import { motion } from "framer-motion";
import { getRevenueMetrics } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import InfoPopover from "@/components/ui/InfoPopover";
import {
  Repeat,
  ShieldCheck,
  Filter,
  Target,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function RevOpsKPICards() {
  const m = getRevenueMetrics();

  const cards = [
    {
      label: "Net Revenue Retention",
      value: formatPercent(m.nrr),
      change: "+3.2pp",
      positive: true,
      icon: Repeat,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      info: "Starting MRR plus expansion, minus contraction and churn, over starting MRR. The single best gauge of recurring-revenue durability.",
    },
    {
      label: "Gross Revenue Retention",
      value: formatPercent(m.grr),
      change: "+0.8pp",
      positive: true,
      icon: ShieldCheck,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      info: "Starting MRR minus contraction and churn, over starting MRR. Measures revenue kept before any expansion.",
    },
    {
      label: "Open Pipeline",
      value: formatCurrency(m.totalPipeline, true),
      sub: `${m.openDealCount} active deals`,
      icon: Filter,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      info: "Total value of all open opportunities in HubSpot across new business, expansion, upsell and renewal.",
    },
    {
      label: "Weighted Pipeline",
      value: formatCurrency(m.weightedPipeline, true),
      icon: Target,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      info: "Pipeline value multiplied by each deal's win probability — the risk-adjusted forecast contribution.",
    },
    {
      label: "Quarter Forecast",
      value: formatCurrency(m.quarterlyForecast, true),
      change: "+9.1%",
      positive: true,
      icon: TrendingUp,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      info: "Projected recurring revenue for the current quarter: committed MRR plus weighted pipeline contribution.",
    },
    {
      label: "Revenue in Dunning",
      value: formatCurrency(m.revenueInDunning),
      sub: `${m.failedPaymentAccounts.length} accounts`,
      icon: AlertCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      info: "Monthly recurring revenue tied to accounts with one or more failed payments in Stripe — actively being recovered.",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
              <span className="text-[12px] font-medium text-surface-600 truncate">{card.label}</span>
            </div>
            <InfoPopover title={card.label}>
              <p>{card.info}</p>
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
          {card.sub && <div className="text-xs text-surface-500 mt-1 truncate">{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}
