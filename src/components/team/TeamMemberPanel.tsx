"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { getMemberBook } from "@/lib/data";
import { formatCurrency, getScoreColor, getHealthLabel } from "@/lib/utils";
import NotifyAccountManager from "@/components/actions/NotifyAccountManager";
import CreateReviewTask from "@/components/actions/CreateReviewTask";
import { X, Mail, Gauge, Briefcase, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statusStyle: Record<string, string> = {
  available: "badge-success",
  busy: "badge-warning",
  overloaded: "badge-danger",
};

export default function TeamMemberPanel({ member: m, onClose }: { member: TeamMember; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const book = getMemberBook(m.name);

  const metrics: [string, string][] = [];
  if (m.accountsManaged > 0) metrics.push(["Accounts", `${m.accountsManaged}`]);
  if (m.arrManaged > 0) metrics.push(["ARR Managed", formatCurrency(m.arrManaged, true)]);
  if (m.avgHealthScore > 0) metrics.push(["Avg Health", `${m.avgHealthScore}`]);
  if (m.renewalsSecured != null) metrics.push(["Active Renewals", `${m.renewalsSecured}`]);
  if (m.expansionArr) metrics.push(["Expansion ARR", formatCurrency(m.expansionArr, true)]);
  if (m.dealsWon != null) metrics.push(["Deals Won", `${m.dealsWon}`]);
  if (m.quotaAttainment != null) metrics.push(["Quota", `${m.quotaAttainment}%`]);
  if (m.ticketsResolved != null) metrics.push(["Tickets Resolved", `${m.ticketsResolved}`]);
  if (m.avgResponseHours != null) metrics.push(["Avg Response", `${m.avgResponseHours}h`]);
  if (m.slaCompliance != null) metrics.push(["SLA Compliance", `${m.slaCompliance}%`]);
  if (m.csat != null) metrics.push(["CSAT", `${m.csat}%`]);
  if (m.sprintVelocity != null) metrics.push(["Sprint Velocity", `${m.sprintVelocity}`]);
  if (m.bugsResolved != null) metrics.push(["Bugs Resolved", `${m.bugsResolved}`]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.2 }}
      className="fixed right-0 top-0 h-screen w-[540px] max-w-[90vw] bg-white border-l border-surface-200 shadow-panel z-40 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-surface-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              {m.avatar}
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-900">{m.name}</h3>
              <p className="text-xs text-surface-500">{m.role} · {m.team}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status + Utilization */}
        <div className="flex items-center gap-3">
          <span className={`badge ${statusStyle[m.status]} capitalize`}>{m.status}</span>
          <div className="flex-1 flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-surface-400" />
            <div className="flex-1 h-2 rounded-full bg-surface-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${m.utilization >= 95 ? "bg-red-500" : m.utilization >= 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${m.utilization}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-surface-700">{m.utilization}%</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-surface-500" /> Performance
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {metrics.map(([label, val]) => (
              <div key={label} className="p-3 rounded-xl bg-surface-50 border border-surface-100">
                <div className="text-[10px] font-medium text-surface-500 uppercase tracking-wide truncate">{label}</div>
                <div className="text-base font-bold text-surface-900 mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Output trend */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-surface-500" /> Monthly Output
          </h4>
          <div className="h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.monthlyOutput} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2556eb" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#2556eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="value" stroke="#2556eb" fill="url(#memberGrad)" strokeWidth={2} name="Output" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Book of business */}
        {book.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-900 mb-3">Book of Business ({book.length})</h4>
            <div className="space-y-1.5">
              {book.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-100">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold shrink-0">
                    {c.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 truncate">{c.name}</div>
                    <div className="text-[11px] text-surface-500">{formatCurrency(c.arr, true)} ARR</div>
                  </div>
                  <span className={`text-[11px] font-semibold ${getScoreColor(c.healthScore)}`}>{getHealthLabel(c.healthScore)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3">Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setNotifyOpen(true)} className="btn-secondary text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Message {m.name.split(" ")[0]}
            </button>
            <button onClick={() => setTaskOpen(true)} className="btn-secondary text-xs">Assign Task</button>
          </div>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            <NotifyAccountManager open={notifyOpen} onClose={() => setNotifyOpen(false)} customerName={m.name} accountOwner={m.name} />
            <CreateReviewTask open={taskOpen} onClose={() => setTaskOpen(false)} customerName={book[0]?.name || "portfolio"} accountOwner={m.name} />
          </>,
          document.body
        )}
    </motion.div>
  );
}
