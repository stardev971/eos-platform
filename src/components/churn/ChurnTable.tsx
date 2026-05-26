"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customers } from "@/lib/data";
import { Customer } from "@/lib/types";
import { formatCurrency, getRiskLabel, getRiskColor } from "@/lib/utils";
import CustomerHealthPanel from "./CustomerHealthPanel";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";

type SortKey = "name" | "churnRiskScore" | "arr" | "engagementScore" | "failedPayments" | "csatScore";
type SortDir = "asc" | "desc";

export default function ChurnTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("churnRiskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== "All") {
      list = list.filter((c) => {
        if (riskFilter === "Critical") return c.churnRiskScore >= 75;
        if (riskFilter === "High") return c.churnRiskScore >= 50 && c.churnRiskScore < 75;
        if (riskFilter === "Medium") return c.churnRiskScore >= 25 && c.churnRiskScore < 50;
        return c.churnRiskScore < 25;
      });
    }
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return list;
  }, [search, sortKey, sortDir, riskFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-surface-400" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />;
  };

  const riskLevels = ["All", "Critical", "High", "Medium", "Low"];

  return (
    <>
      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-surface-50 border border-surface-200 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
              {riskLevels.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    riskFilter === r
                      ? "bg-white text-surface-900 shadow-sm"
                      : "text-surface-500 hover:text-surface-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-surface-500">
            {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50/50">
                {[
                  { key: "name" as SortKey, label: "Customer" },
                  { key: "churnRiskScore" as SortKey, label: "Risk Score" },
                  { key: "arr" as SortKey, label: "ARR" },
                  { key: "engagementScore" as SortKey, label: "Engagement" },
                  { key: "failedPayments" as SortKey, label: "Payment Status" },
                  { key: "csatScore" as SortKey, label: "Support Sentiment" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="table-header px-4 py-3 text-left cursor-pointer hover:bg-surface-100/50 transition-colors select-none"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      <SortIcon col={key} />
                    </div>
                  </th>
                ))}
                <th className="table-header px-4 py-3 text-left">Renewal</th>
                <th className="table-header px-4 py-3 text-left">Health</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(c)}
                  className={`border-b border-surface-50 hover:bg-surface-50/50 cursor-pointer transition-colors group ${
                    c.churnRiskScore >= 75 ? "bg-red-50/20" : ""
                  }`}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        c.churnRiskScore >= 75 ? "bg-gradient-to-br from-red-500 to-red-600" :
                        c.churnRiskScore >= 50 ? "bg-gradient-to-br from-orange-500 to-orange-600" :
                        c.churnRiskScore >= 25 ? "bg-gradient-to-br from-amber-500 to-amber-600" :
                        "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      }`}>
                        {c.logo}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-surface-900">{c.name}</div>
                        <div className="text-xs text-surface-500">{c.segment} &middot; {c.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-surface-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.churnRiskScore >= 75 ? "bg-red-500" :
                            c.churnRiskScore >= 50 ? "bg-orange-500" :
                            c.churnRiskScore >= 25 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${c.churnRiskScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getRiskColor(c.churnRiskScore)}`}>
                        {c.churnRiskScore}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell font-semibold text-surface-900">
                    {formatCurrency(c.arr, true)}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        c.engagementScore >= 70 ? "text-emerald-600" :
                        c.engagementScore >= 40 ? "text-amber-600" :
                        "text-red-600"
                      }`}>
                        {c.engagementScore}%
                      </span>
                      {c.featureUsageDecline > 15 && (
                        <span className="text-[10px] text-red-500 font-medium">-{c.featureUsageDecline}%</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {c.failedPayments > 0 ? (
                      <span className="badge badge-danger">{c.failedPayments} Failed</span>
                    ) : (
                      <span className="badge badge-success">Current</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={`text-sm font-medium ${
                      c.csatScore >= 80 ? "text-emerald-600" :
                      c.csatScore >= 60 ? "text-amber-600" :
                      "text-red-600"
                    }`}>
                      {c.csatScore}%
                    </span>
                  </td>
                  <td className="table-cell text-xs text-surface-500">
                    {new Date(c.renewalDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ring-1 ${
                      c.healthScore >= 80 ? "badge-success" :
                      c.healthScore >= 60 ? "badge-warning" :
                      "badge-danger"
                    }`}>
                      {c.healthScore >= 80 ? "Healthy" : c.healthScore >= 60 ? "Warning" : "Critical"}
                    </span>
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

      {/* Detail Panel */}
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
            <CustomerHealthPanel customer={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
