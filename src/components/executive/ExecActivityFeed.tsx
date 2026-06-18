"use client";

import { motion } from "framer-motion";
import { getPortfolioActivity } from "@/lib/data";
import { relativeTime } from "@/lib/utils";
import { Activity, Headphones, CreditCard, Box, Code2, Building2 } from "lucide-react";

const typeIcon = {
  support: Headphones,
  billing: CreditCard,
  product: Box,
  engineering: Code2,
  account: Building2,
};

export default function ExecActivityFeed() {
  const items = getPortfolioActivity();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="icon-chip w-7 h-7 bg-surface-100 shrink-0">
          <Activity className="w-3.5 h-3.5 text-surface-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-surface-900 leading-tight">Portfolio Activity</h3>
          <p className="text-xs text-surface-500">Live cross-platform event stream</p>
        </div>
      </div>
      <div className="space-y-1 max-h-[420px] overflow-y-auto scrollbar-hide">
        {items.map((a, i) => {
          const Icon = typeIcon[a.type] || Activity;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                a.severity === "critical" ? "bg-red-50 text-red-600" :
                a.severity === "warning" ? "bg-amber-50 text-amber-600" :
                "bg-blue-50 text-blue-600"
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-800 leading-snug">{a.description}</p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  <span className="font-medium text-surface-600">{a.customer}</span> · {a.type} · {relativeTime(a.date)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
