"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExecutiveMetrics } from "@/lib/data";
import { Customer } from "@/lib/types";
import { formatCurrency, formatPercent, getScoreColor, getHealthLabel } from "@/lib/utils";
import CustomerPanel from "@/components/profitability/CustomerPanel";
import { Crown, ChevronRight } from "lucide-react";

export default function TopAccounts() {
  const m = getExecutiveMetrics();
  const [selected, setSelected] = useState<Customer | null>(null);

  return (
    <>
      <div className="glass-card p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="icon-chip w-7 h-7 bg-amber-50 shrink-0">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900 leading-tight">Top Accounts by ARR</h3>
            <p className="text-xs text-surface-500">Click any account for the full cross-platform profile</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {m.topAccounts.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(c)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors text-left group"
            >
              <span className="text-xs font-bold text-surface-400 w-4">{i + 1}</span>
              <div className="w-8 h-8 rounded-lg bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                {c.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-surface-900 truncate">{c.name}</div>
                <div className="text-xs text-surface-500 truncate">{c.segment} · {c.industry}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-surface-900">{formatCurrency(c.arr, true)}</div>
                <div className={`text-[10px] font-medium ${getScoreColor(c.healthScore)}`}>
                  {getHealthLabel(c.healthScore)} · {formatPercent(c.marginPercentage)}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 z-30"
              onClick={() => setSelected(null)}
            />
            <CustomerPanel customer={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
