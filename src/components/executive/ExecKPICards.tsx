"use client";

import { motion } from "framer-motion";
import { getExecutiveMetrics } from "@/lib/data";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import InfoPopover from "@/components/ui/InfoPopover";
import {
  DollarSign,
  Repeat,
  HeartPulse,
  Users,
  ShieldAlert,
  Smile,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ExecKPICards() {
  const m = getExecutiveMetrics();

  const cards = [
    {
      label: "Total ARR",
      value: formatCurrency(m.totalARR, true),
      change: "+12.4%",
      positive: true,
      icon: DollarSign,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      info: "Annual Recurring Revenue across all active accounts, aggregated from Stripe subscriptions and validated against HubSpot contracts.",
    },
    {
      label: "Net Revenue Retention",
      value: formatPercent(m.nrr),
      change: "+3.2pp",
      positive: true,
      icon: Repeat,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      info: "Expansion minus contraction and churn over the starting revenue base. Above 100% means the existing book is growing on its own.",
    },
    {
      label: "Portfolio Health",
      value: `${Math.round(m.avgHealth)}`,
      change: "+1.8",
      positive: true,
      icon: HeartPulse,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      info: "Average AI health score across the portfolio — a composite of engagement, support load, billing status and product adoption.",
    },
    {
      label: "Active Customers",
      value: formatNumber(m.totalCustomers),
      sub: `${m.enterpriseCount} Ent · ${m.midMarketCount} MM · ${m.smbCount} SMB`,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      info: "Total customers with an active or trialing subscription, broken down by segment.",
    },
    {
      label: "Revenue at Risk",
      value: formatCurrency(m.arrAtRisk, true),
      sub: `${m.atRiskCount} accounts`,
      icon: ShieldAlert,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      info: "ARR from accounts with a churn risk score above 50%, weighted by AI risk probability across all platforms.",
    },
    {
      label: "NPS Score",
      value: `+${m.npsScore}`,
      change: "+5",
      positive: true,
      icon: Smile,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      info: "Net Promoter Score from the latest in-product and email surveys, correlated with Zendesk CSAT.",
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
