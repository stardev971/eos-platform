"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { pipelineDeals } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import OutreachScheduler from "@/components/actions/OutreachScheduler";
import { Filter, ChevronRight } from "lucide-react";

const typeBadge: Record<string, string> = {
  "New Business": "badge-info",
  Expansion: "badge-success",
  Upsell: "badge-warning",
  Renewal: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/60",
};

const stageColor: Record<string, string> = {
  Discovery: "bg-surface-200 text-surface-600",
  Proposal: "bg-sky-100 text-sky-700",
  Negotiation: "bg-blue-100 text-blue-700",
  Closing: "bg-emerald-100 text-emerald-700",
  "Closed Won": "bg-emerald-500 text-white",
};

const stages = ["All", "Discovery", "Proposal", "Negotiation", "Closing"];

export default function PipelineTable() {
  const [stageFilter, setStageFilter] = useState("All");
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState("");

  const filtered = useMemo(() => {
    const list = stageFilter === "All" ? pipelineDeals : pipelineDeals.filter((d) => d.stage === stageFilter);
    return [...list].sort((a, b) => b.value - a.value);
  }, [stageFilter]);

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="icon-chip w-7 h-7 bg-brand-50">
              <Filter className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">Sales Pipeline</h3>
              <p className="text-[11px] text-surface-500">Synced from HubSpot · click a deal to schedule outreach</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
            {stages.map((s) => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  stageFilter === s ? "bg-white text-surface-900 shadow-sm" : "text-surface-500 hover:text-surface-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50/50">
                {["Deal", "Type", "Stage", "Value", "Probability", "Owner", "Close"].map((h) => (
                  <th key={h} className="table-header px-4 py-3 text-left">{h}</th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => { setActiveCustomer(d.customer); setOutreachOpen(true); }}
                  className="border-b border-surface-50 hover:bg-surface-50/50 cursor-pointer transition-colors group"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                        {d.logo}
                      </div>
                      <span className="text-sm font-medium text-surface-900">{d.customer}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge text-[10px] ${typeBadge[d.type]}`}>{d.type}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${stageColor[d.stage]}`}>{d.stage}</span>
                  </td>
                  <td className="table-cell font-semibold text-surface-900">{formatCurrency(d.value, true)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.probability >= 70 ? "bg-emerald-500" : d.probability >= 45 ? "bg-amber-500" : "bg-orange-400"}`}
                          style={{ width: `${d.probability}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-surface-600">{d.probability}%</span>
                    </div>
                  </td>
                  <td className="table-cell text-xs text-surface-600">{d.owner}</td>
                  <td className="table-cell text-xs text-surface-500">
                    {new Date(d.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="table-cell">
                    <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OutreachScheduler open={outreachOpen} onClose={() => setOutreachOpen(false)} customerName={activeCustomer} />
    </>
  );
}
