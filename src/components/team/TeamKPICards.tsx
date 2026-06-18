"use client";

import { motion } from "framer-motion";
import { getTeamSummary } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import InfoPopover from "@/components/ui/InfoPopover";
import { Users, Gauge, AlertTriangle, CheckCircle2, Smile } from "lucide-react";

export default function TeamKPICards() {
  const s = getTeamSummary();

  const cards = [
    {
      label: "Headcount",
      value: `${s.headcount}`,
      sub: `${s.byTeam.length} teams`,
      icon: Users,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      info: "Total active team members across Sales, Customer Success, Support and Engineering.",
    },
    {
      label: "Avg Utilization",
      value: `${s.avgUtilization}%`,
      icon: Gauge,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      info: "Average share of capacity in use across the team, derived from assigned accounts, ticket load and sprint commitments.",
    },
    {
      label: "Overloaded",
      value: `${s.overloaded}`,
      sub: "members > 95%",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      info: "Members operating above 95% utilization. Sustained overload correlates with lower CSAT and slower response times.",
    },
    {
      label: "Tickets Resolved",
      value: formatNumber(s.totalTicketsResolved),
      sub: "last 30 days",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      info: "Total Zendesk tickets resolved by the support team over the trailing 30 days.",
    },
    {
      label: "Avg CSAT",
      value: `${s.avgCsat}%`,
      icon: Smile,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      info: "Average customer satisfaction score across customer-facing team members.",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
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
          <div className="text-xl font-bold text-surface-900 nums truncate">{card.value}</div>
          {card.sub && <div className="text-xs text-surface-500 mt-1 truncate">{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}
