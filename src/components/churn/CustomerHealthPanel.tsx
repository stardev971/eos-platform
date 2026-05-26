"use client";

import { motion } from "framer-motion";
import { Customer } from "@/lib/types";
import { formatCurrency, formatPercent, getScoreColor, getRiskColor, getRiskLabel, daysUntil, relativeTime } from "@/lib/utils";
import {
  X,
  Activity,
  TrendingDown,
  CreditCard,
  HeadphonesIcon,
  BarChart3,
  Calendar,
  AlertTriangle,
  Sparkles,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface Props {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerHealthPanel({ customer: c, onClose }: Props) {
  const days = daysUntil(c.renewalDate);

  // AI-generated risk explanation
  const riskExplanation = c.churnRiskScore >= 75
    ? `${c.name} shows critical churn indicators. ${c.churnSignals.length} active risk signals detected across multiple systems. Immediate executive intervention recommended.`
    : c.churnRiskScore >= 50
    ? `${c.name} has elevated churn risk due to declining engagement and support patterns. Proactive outreach recommended within 2 weeks.`
    : c.churnRiskScore >= 25
    ? `${c.name} shows mild warning signs. Monitoring recommended with periodic check-ins.`
    : `${c.name} is in good health with no significant churn indicators detected.`;

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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
              c.churnRiskScore >= 75 ? "bg-gradient-to-br from-red-500 to-red-600" :
              c.churnRiskScore >= 50 ? "bg-gradient-to-br from-orange-500 to-orange-600" :
              "bg-gradient-to-br from-brand-500 to-brand-600"
            }`}>
              {c.logo}
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-900">{c.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`badge ring-1 ${
                  c.churnRiskScore >= 75 ? "badge-danger" :
                  c.churnRiskScore >= 50 ? "badge-warning" :
                  "badge-success"
                }`}>
                  {getRiskLabel(c.churnRiskScore)} Risk
                </span>
                <span className="text-xs text-surface-500">{c.segment}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Risk Score */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-surface-900">Churn Risk Score</span>
            <span className={`text-2xl font-bold ${getRiskColor(c.churnRiskScore)}`}>{c.churnRiskScore}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${c.churnRiskScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                c.churnRiskScore >= 75 ? "bg-gradient-to-r from-red-500 to-red-400" :
                c.churnRiskScore >= 50 ? "bg-gradient-to-r from-orange-500 to-orange-400" :
                c.churnRiskScore >= 25 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                "bg-gradient-to-r from-emerald-500 to-emerald-400"
              }`}
            />
          </div>
        </div>

        {/* AI Risk Explanation */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">AI Risk Analysis</span>
          </div>
          <p className="text-sm text-surface-700 leading-relaxed">{riskExplanation}</p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "ARR", value: formatCurrency(c.arr, true), icon: BarChart3 },
            { label: "Renewal In", value: `${days} days`, icon: Calendar },
            { label: "Active Users", value: `${c.activeUsers}`, icon: Users },
            { label: "Engagement", value: `${c.engagementScore}%`, icon: Activity },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-surface-50 border border-surface-100">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-surface-500 uppercase tracking-wide mb-1">
                <s.icon className="w-3 h-3" />
                {s.label}
              </div>
              <div className="text-lg font-bold text-surface-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Engagement Trend */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-surface-500" />
            Engagement History
          </h4>
          <div className="h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.monthlyTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" fill="url(#engGrad)" strokeWidth={2} name="Engagement Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Trend */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
            <HeadphonesIcon className="w-4 h-4 text-surface-500" />
            Support Ticket Trend
          </h4>
          <div className="h-36 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={c.monthlyTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="tickets" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Tickets" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Reliability */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
          <h5 className="text-xs font-semibold text-surface-500 mb-3 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Payment Reliability (Stripe)
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Failed Payments</span>
              <span className={`font-medium ${c.failedPayments > 0 ? "text-red-600" : "text-emerald-600"}`}>{c.failedPayments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Subscription Status</span>
              <span className={`font-medium ${c.subscriptionStatus === "Active" ? "text-emerald-600" : "text-red-600"}`}>{c.subscriptionStatus}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Billing Cycle</span>
              <span className="font-medium">{c.billingCycle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Last Payment</span>
              <span className="font-medium">{new Date(c.lastPaymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-[10px] font-medium text-surface-500 uppercase tracking-wide">Recent Payments</div>
              {c.paymentHistory.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <span className="text-surface-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className="text-surface-700">{formatCurrency(p.amount)}</span>
                  <span className={`badge text-[10px] ${p.status === "Paid" ? "badge-success" : p.status === "Failed" ? "badge-danger" : "badge-warning"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Churn Signals */}
        {c.churnSignals.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Churn Indicators ({c.churnSignals.length})
            </h4>
            <div className="space-y-2">
              {c.churnSignals.map((s, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                  s.severity === "critical" ? "bg-red-50/50 border-red-100" :
                  s.severity === "high" ? "bg-orange-50/50 border-orange-100" :
                  "bg-amber-50/50 border-amber-100"
                }`}>
                  <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    s.severity === "critical" ? "bg-red-100 text-red-700" :
                    s.severity === "high" ? "bg-orange-100 text-orange-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {s.severity}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-surface-800">{s.signal}</p>
                    <p className="text-[10px] text-surface-500 mt-0.5">{s.source} &middot; {relativeTime(s.detectedDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Usage */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
          <h5 className="text-xs font-semibold text-surface-500 mb-3">Product Analytics (Mixpanel)</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-surface-500">Feature Adoption</span><span className={`font-medium ${getScoreColor(c.featureAdoption)}`}>{c.featureAdoption}%</span></div>
            <div className="flex justify-between"><span className="text-surface-500">Login Frequency</span><span className="font-medium">{c.loginFrequency}%</span></div>
            <div className="flex justify-between">
              <span className="text-surface-500">Usage Decline</span>
              <span className={`font-medium ${c.featureUsageDecline > 20 ? "text-red-600" : c.featureUsageDecline > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                {c.featureUsageDecline > 0 ? `-${c.featureUsageDecline}%` : "None"}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-surface-500">Sessions/month</span><span className="font-medium">{c.sessionActivity.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 mb-3">Suggested Actions</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Trigger Retention Workflow",
              "Notify CS Team",
              "Schedule Executive Outreach",
              "Generate Renewal Review",
              "Create Escalation Task",
            ].map((a) => (
              <button key={a} className="btn-secondary text-xs">
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
