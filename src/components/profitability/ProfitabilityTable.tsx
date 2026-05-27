"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customers } from "@/lib/data";
import { Customer } from "@/lib/types";
import { formatCurrency, formatPercent, getScoreColor, getHealthLabel } from "@/lib/utils";
import CustomerPanel from "./CustomerPanel";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronRight,
} from "lucide-react";

type SortKey = "name" | "arr" | "engineeringCost" | "supportCost" | "marginPercentage" | "profitabilityScore" | "healthScore";
type SortDir = "asc" | "desc";

export default function ProfitabilityTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("profitabilityScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [segmentFilter, setSegmentFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.accountOwner.toLowerCase().includes(q)
      );
    }
    if (segmentFilter !== "All") {
      list = list.filter((c) => c.segment === segmentFilter);
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
  }, [search, sortKey, sortDir, segmentFilter]);

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

  const segments = ["All", "Enterprise", "Mid-Market", "SMB"];

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
              {segments.map((s) => (
                <button
                  key={s}
                  onClick={() => setSegmentFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    segmentFilter === s
                      ? "bg-white text-surface-900 shadow-sm"
                      : "text-surface-500 hover:text-surface-700"
                  }`}
                >
                  {s}
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
                  { key: "arr" as SortKey, label: "ARR" },
                  { key: "engineeringCost" as SortKey, label: "Eng. Cost/mo" },
                  { key: "supportCost" as SortKey, label: "Support Cost/mo" },
                  { key: "marginPercentage" as SortKey, label: "Margin %" },
                  { key: "profitabilityScore" as SortKey, label: "Profitability" },
                  { key: "healthScore" as SortKey, label: "Health" },
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
                  className="border-b border-surface-50 hover:bg-surface-50/50 cursor-pointer transition-colors group"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                        {c.logo}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-surface-900">{c.name}</div>
                        <div className="text-xs text-surface-500">{c.segment} &middot; {c.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-semibold text-surface-900">
                    {formatCurrency(c.arr, true)}
                  </td>
                  <td className="table-cell">
                    <span className={c.engineeringCost > 10000 ? "text-orange-600 font-medium" : ""}>
                      {formatCurrency(c.engineeringCost)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={c.supportCost > 5000 ? "text-orange-600 font-medium" : ""}>
                      {formatCurrency(c.supportCost)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`font-semibold ${c.marginPercentage >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {formatPercent(c.marginPercentage)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            c.profitabilityScore >= 80 ? "bg-emerald-500" :
                            c.profitabilityScore >= 50 ? "bg-amber-500" :
                            c.profitabilityScore >= 25 ? "bg-orange-500" : "bg-red-500"
                          }`}
                          style={{ width: `${c.profitabilityScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${getScoreColor(c.profitabilityScore)}`}>
                        {c.profitabilityScore}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge gap-1.5 ring-1 ${
                      c.healthScore >= 80 ? "badge-success" :
                      c.healthScore >= 60 ? "badge-warning" :
                      "badge-danger"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.healthScore >= 80 ? "bg-emerald-500" :
                        c.healthScore >= 60 ? "bg-amber-500" :
                        "bg-red-500"
                      }`} />
                      {getHealthLabel(c.healthScore)}
                    </span>
                  </td>
                  <td className="table-cell text-xs text-surface-500">
                    {new Date(c.renewalDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
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
            <CustomerPanel customer={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
