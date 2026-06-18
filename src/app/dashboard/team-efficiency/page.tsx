"use client";

import { motion } from "framer-motion";
import TeamKPICards from "@/components/team/TeamKPICards";
import { TeamUtilization, ArrManagedByTeam } from "@/components/team/TeamCharts";
import TeamRoster from "@/components/team/TeamRoster";
import { Users, Download, RefreshCw, Wifi } from "lucide-react";

export default function TeamEfficiencyPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm ring-1 ring-white/40">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 tracking-tight">Team Efficiency</h1>
            <p className="text-xs text-surface-500 mt-0.5">
              Workload, capacity & output across customer-facing teams — Zendesk & Jira
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
            { name: "Zendesk", color: "bg-green-500" },
            { name: "Jira", color: "bg-blue-500" },
            { name: "HubSpot", color: "bg-orange-500" },
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
      <TeamKPICards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeamUtilization />
        <ArrManagedByTeam />
      </div>

      {/* Roster */}
      <TeamRoster />
    </div>
  );
}
