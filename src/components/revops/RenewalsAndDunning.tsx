"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRevenueMetrics } from "@/lib/data";
import { Customer } from "@/lib/types";
import { formatCurrency, daysUntil, getRiskLabel, getRiskColor } from "@/lib/utils";
import CustomerPanel from "@/components/profitability/CustomerPanel";
import { CalendarClock, CreditCard, ChevronRight } from "lucide-react";

export default function RenewalsAndDunning() {
  const m = getRevenueMetrics();
  const [selected, setSelected] = useState<Customer | null>(null);

  return (
    <>
      <div className="space-y-5">
        {/* Renewals Timeline */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="icon-chip w-7 h-7 bg-amber-50">
                <CalendarClock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900">Upcoming Renewals</h3>
                <p className="text-[11px] text-surface-500">Next 120 days · {formatCurrency(m.renewalsValue, true)} in play</p>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            {m.upcomingRenewals.map((c, i) => {
              const days = daysUntil(c.renewalDate);
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(c)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                    {c.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 truncate">{c.name}</div>
                    <div className="text-[11px] text-surface-500">
                      {new Date(c.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {formatCurrency(c.renewalValue, true)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold ${days <= 30 ? "text-red-600" : days <= 60 ? "text-amber-600" : "text-surface-700"}`}>{days}d</div>
                    <div className={`text-[10px] font-medium ${getRiskColor(c.churnRiskScore)}`}>{getRiskLabel(c.churnRiskScore)} risk</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Payment Health / Dunning */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="icon-chip w-7 h-7 bg-red-50">
                <CreditCard className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900">Payment Recovery</h3>
                <p className="text-[11px] text-surface-500">{m.failedPaymentAccounts.length} accounts in dunning · Stripe</p>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            {m.failedPaymentAccounts.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 ring-1 ring-red-100 flex items-center justify-center text-red-700 text-xs font-bold shrink-0">
                  {c.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-surface-900 truncate">{c.name}</div>
                  <div className="text-[11px] text-surface-500">{c.subscriptionStatus} · {formatCurrency(c.mrr)}/mo</div>
                </div>
                <span className="badge badge-danger text-[10px] shrink-0">{c.failedPayments} failed</span>
                <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
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
