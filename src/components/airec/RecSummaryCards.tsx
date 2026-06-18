"use client";

import { motion } from "framer-motion";
import { getRecommendationSummary } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, AlertCircle, Target, Gauge } from "lucide-react";

export default function RecSummaryCards() {
  const s = getRecommendationSummary();
  const cards = [
    { label: "Open Recommendations", value: `${s.total}`, sub: `${s.high} high priority`, icon: Sparkles, bg: "bg-brand-50", color: "text-brand-600" },
    { label: "Critical Actions", value: `${s.critical}`, sub: "need attention now", icon: AlertCircle, bg: "bg-red-50", color: "text-red-600" },
    { label: "Revenue Impact", value: formatCurrency(s.totalImpact, true), sub: "ARR addressable", icon: Target, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Avg Confidence", value: `${s.avgConfidence}%`, sub: "model certainty", icon: Gauge, bg: "bg-amber-50", color: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="kpi-card"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`icon-chip w-8 h-8 ${c.bg} shrink-0`}>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <span className="text-[12px] font-medium text-surface-600 truncate">{c.label}</span>
          </div>
          <div className="text-xl font-bold text-surface-900 nums">{c.value}</div>
          <div className="text-xs text-surface-500 mt-1">{c.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
