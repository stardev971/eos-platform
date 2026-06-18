"use client";

import { getExecutiveMetrics } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import type { ElementType } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, HeartPulse } from "lucide-react";

function ChartHeader({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="icon-chip w-7 h-7 bg-surface-100 shrink-0">
        <Icon className="w-3.5 h-3.5 text-surface-600" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-surface-900 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-surface-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export function PortfolioTrend() {
  const m = getExecutiveMetrics();
  return (
    <div className="glass-card p-5 col-span-2">
      <ChartHeader icon={TrendingUp} title="Portfolio ARR Trend" subtitle="Annualized recurring revenue across all accounts — last 12 months" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={m.portfolioTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="execArrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2556eb" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#2556eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number) => [formatCurrency(val, true), "ARR"]}
            />
            <Area type="monotone" dataKey="arr" stroke="#2556eb" fill="url(#execArrGrad)" strokeWidth={2.5} name="ARR" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HealthBreakdown() {
  const m = getExecutiveMetrics();
  const data = [
    { name: "Healthy", value: m.healthy, fill: "#10b981" },
    { name: "Needs Attention", value: m.needsAttention, fill: "#f59e0b" },
    { name: "At Risk", value: m.atRisk, fill: "#ef4444" },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={HeartPulse} title="Portfolio Health" subtitle="Accounts by health tier" />
      <div className="flex items-center gap-5">
        <div className="w-36 h-36 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={2} stroke="#fff">
                {data.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-surface-900">{total}</span>
            <span className="text-[10px] text-surface-500">accounts</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-surface-700">{d.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-surface-900">{d.value}</span>
                <span className="text-xs text-surface-500 ml-2">{((d.value / total) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
