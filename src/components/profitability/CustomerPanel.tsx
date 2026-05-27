"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Customer } from "@/lib/types";
import AccountReviewCreator from "@/components/actions/AccountReviewCreator";
import ExportSummary from "@/components/actions/ExportSummary";
import NotifyAccountManager from "@/components/actions/NotifyAccountManager";
import CreateReviewTask from "@/components/actions/CreateReviewTask";
import { formatCurrency, formatPercent, getScoreColor, getHealthLabel, daysUntil, relativeTime } from "@/lib/utils";
import {
  X,
  Building2,
  DollarSign,
  HeadphonesIcon,
  Code2,
  Activity,
  Calendar,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerPanel({ customer: c, onClose }: Props) {
  const days = daysUntil(c.renewalDate);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const actions = [
    { label: "Assign Account Review", onClick: () => setReviewOpen(true) },
    { label: "Export Summary", onClick: () => setExportOpen(true) },
    { label: "Notify Account Manager", onClick: () => setNotifyOpen(true) },
    { label: "Create Review Task", onClick: () => setTaskOpen(true) },
  ];

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
            <div className="w-10 h-10 rounded-xl bg-brand-50 ring-1 ring-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
              {c.logo}
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-900">{c.name}</h3>
              <p className="text-xs text-surface-500">{c.segment} &middot; {c.industry}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "ARR", value: formatCurrency(c.arr, true), icon: DollarSign },
            { label: "Health Score", value: `${c.healthScore}`, icon: Activity },
            { label: "Margin", value: formatPercent(c.marginPercentage), icon: BarChart3 },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-surface-50 border border-surface-100">
              <div className="text-[10px] font-medium text-surface-500 uppercase tracking-wide">{s.label}</div>
              <div className={`text-lg font-bold ${s.label === 'Health Score' ? getScoreColor(c.healthScore) : s.label === 'Margin' ? (c.marginPercentage >= 0 ? 'text-emerald-600' : 'text-red-600') : 'text-surface-900'}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Overview */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-surface-500" />
            Customer Overview
          </h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 text-sm">
            {[
              ["Account Owner", c.accountOwner],
              ["Company Size", `${c.companySize} employees`],
              ["Lifecycle", c.lifecycleStage],
              ["Billing Cycle", c.billingCycle],
              ["Contract Value", formatCurrency(c.contractValue)],
              ["Lead Source", c.leadSource],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-surface-500">{label}</span>
                <span className="font-medium text-surface-900">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-surface-500" />
            Revenue & Cost Trend
          </h4>
          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.monthlyTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4c6ef5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4c6ef5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(val: number) => [formatCurrency(val), ""]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4c6ef5" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="supportCost" stroke="#ef4444" fill="url(#costGrad)" strokeWidth={2} name="Support Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support & Engineering */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <h5 className="text-xs font-semibold text-surface-500 mb-3 flex items-center gap-1.5">
              <HeadphonesIcon className="w-3.5 h-3.5" /> Support (Zendesk)
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Tickets</span><span className="font-medium">{c.ticketCount}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Unresolved</span><span className="font-medium text-amber-600">{c.unresolvedTickets}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Escalations</span><span className={`font-medium ${c.escalations > 2 ? "text-red-600" : ""}`}>{c.escalations}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">CSAT</span><span className={`font-medium ${getScoreColor(c.csatScore)}`}>{c.csatScore}%</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Cost/mo</span><span className="font-medium">{formatCurrency(c.supportCost)}</span></div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <h5 className="text-xs font-semibold text-surface-500 mb-3 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Engineering (Jira)
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Hours</span><span className="font-medium">{c.engineeringHours}h</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Projects</span><span className="font-medium">{c.activeProjects}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Delayed</span><span className={`font-medium ${c.delayedTasks > 3 ? "text-red-600" : ""}`}>{c.delayedTasks}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Bugs</span><span className={`font-medium ${c.bugCount > 10 ? "text-red-600" : ""}`}>{c.bugCount}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Cost/mo</span><span className="font-medium">{formatCurrency(c.engineeringCost)}</span></div>
            </div>
          </div>
        </div>

        {/* Renewal */}
        <div className="p-4 rounded-xl border border-surface-200 bg-surface-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-surface-500 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Renewal Timeline
              </div>
              <div className="text-sm font-semibold text-surface-900">
                {new Date(c.renewalDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${days < 60 ? "text-amber-600" : "text-surface-900"}`}>
                {days} days
              </div>
              <div className="text-xs text-surface-500">until renewal</div>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-surface-500">Renewal Value:</span>{" "}
            <span className="font-semibold text-surface-900">{formatCurrency(c.renewalValue)}</span>
          </div>
        </div>

        {/* Active Risks */}
        {c.churnSignals.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Active Risks
            </h4>
            <div className="space-y-2">
              {c.churnSignals.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50/50 border border-red-100">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.severity === "critical" ? "bg-red-500" : s.severity === "high" ? "bg-orange-500" : "bg-amber-500"}`} />
                  <div>
                    <p className="text-sm text-surface-800">{s.signal}</p>
                    <p className="text-[10px] text-surface-500 mt-0.5">{s.source} &middot; {relativeTime(s.detectedDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-surface-500" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {c.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-50 border border-surface-100">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div>
                  <p className="text-sm text-surface-800">{a.description}</p>
                  <p className="text-[10px] text-surface-500 mt-0.5">{a.type} &middot; {relativeTime(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3">Suggested Actions</h4>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button key={a.label} onClick={a.onClick} className="btn-secondary text-xs">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Modals — portaled to body so the panel's transform doesn't trap their fixed positioning */}
      {mounted &&
        createPortal(
          <>
            <AccountReviewCreator open={reviewOpen} onClose={() => setReviewOpen(false)} customerName={c.name} />
            <ExportSummary open={exportOpen} onClose={() => setExportOpen(false)} customerName={c.name} />
            <NotifyAccountManager open={notifyOpen} onClose={() => setNotifyOpen(false)} customerName={c.name} accountOwner={c.accountOwner} />
            <CreateReviewTask open={taskOpen} onClose={() => setTaskOpen(false)} customerName={c.name} accountOwner={c.accountOwner} />
          </>,
          document.body
        )}
    </motion.div>
  );
}
