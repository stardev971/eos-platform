"use client";

import { motion } from "framer-motion";
import ProfitabilityKPICards from "@/components/profitability/KPICards";
import ProfitabilityTable from "@/components/profitability/ProfitabilityTable";
import {
  ProfitabilityDistribution,
  RevenueVsSupport,
  TopLossMakers,
  SegmentBreakdown,
} from "@/components/profitability/Charts";
import AIInsightsSection from "@/components/profitability/AIInsights";
import ProfitabilityActionCenter from "@/components/profitability/ActionCenter";
import { DollarSign, Download, RefreshCw, Wifi } from "lucide-react";

export default function ProfitabilityPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-sm">
            <DollarSign className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 tracking-tight">Customer Profitability Intelligence</h1>
            <p className="text-xs text-surface-500 mt-0.5">
              Cross-platform analysis — HubSpot, Stripe, Zendesk & Jira
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync
          </button>
          <button className="btn-secondary flex items-center gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Connected Systems Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 px-3.5 py-2 bg-white rounded-xl border border-surface-200 shadow-sm"
      >
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-semibold text-surface-700">Live</span>
        </div>
        <div className="w-px h-3.5 bg-surface-200" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { name: "HubSpot", color: "bg-orange-500" },
            { name: "Stripe", color: "bg-purple-500" },
            { name: "Zendesk", color: "bg-green-500" },
            { name: "Jira", color: "bg-blue-500" },
          ].map((s) => (
            <span key={s.name} className="flex items-center gap-1 px-2 py-0.5 bg-surface-50 rounded text-[10px] font-medium text-surface-600 border border-surface-100">
              <span className={`w-1 h-1 rounded-full ${s.color}`} />
              {s.name}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-surface-400 ml-auto whitespace-nowrap">Synced 2m ago</span>
      </motion.div>

      {/* KPI Cards */}
      <ProfitabilityKPICards />

      {/* Charts Row — 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        <ProfitabilityDistribution />
        <RevenueVsSupport />
        <TopLossMakers />
        <SegmentBreakdown />
      </div>

      {/* Main Content: Table + AI Insights + Action Center */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <ProfitabilityTable />
        <div className="space-y-4">
          <AIInsightsSection />
          <ProfitabilityActionCenter />
        </div>
      </div>
    </div>
  );
}
