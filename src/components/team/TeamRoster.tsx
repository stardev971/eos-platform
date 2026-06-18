"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teamMembers } from "@/lib/data";
import { TeamMember } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import TeamMemberPanel from "./TeamMemberPanel";
import { Users } from "lucide-react";

const teams = ["All", "Sales", "Customer Success", "Support", "Engineering"];

const statusDot: Record<string, string> = {
  available: "bg-emerald-500",
  busy: "bg-amber-500",
  overloaded: "bg-red-500",
};

export default function TeamRoster() {
  const [teamFilter, setTeamFilter] = useState("All");
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const filtered = useMemo(
    () => (teamFilter === "All" ? teamMembers : teamMembers.filter((m) => m.team === teamFilter)),
    [teamFilter]
  );

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="icon-chip w-7 h-7 bg-brand-50">
              <Users className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">Team Roster</h3>
              <p className="text-[11px] text-surface-500">Click any member for performance & workload detail</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
            {teams.map((t) => (
              <button
                key={t}
                onClick={() => setTeamFilter(t)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  teamFilter === t ? "bg-white text-surface-900 shadow-sm" : "text-surface-500 hover:text-surface-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
          {filtered.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(m)}
              className="p-4 rounded-xl border border-surface-200 hover:border-brand-200 hover:shadow-sm transition-all text-left bg-white group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                    {m.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${statusDot[m.status]}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-surface-900 truncate">{m.name}</div>
                  <div className="text-[11px] text-surface-500 truncate">{m.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.utilization >= 95 ? "bg-red-500" : m.utilization >= 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${m.utilization}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-surface-600">{m.utilization}%</span>
              </div>
              <div className="text-[11px] text-surface-500">
                {m.arrManaged > 0
                  ? `${m.accountsManaged} accounts · ${formatCurrency(m.arrManaged, true)} ARR`
                  : m.ticketsResolved != null
                  ? `${m.ticketsResolved} tickets · ${m.csat}% CSAT`
                  : `Velocity ${m.sprintVelocity} · ${m.bugsResolved} bugs resolved`}
              </div>
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
            <TeamMemberPanel member={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
