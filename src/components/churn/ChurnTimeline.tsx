"use client";

import { customers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export function ChurnTimelineChart() {
  // Aggregate monthly trends across at-risk customers
  const atRisk = customers.filter((c) => c.churnRiskScore >= 50);
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = months.map((month, i) => {
    const avgEngagement = atRisk.reduce((s, c) => s + (c.monthlyTrend[i]?.engagement || 0), 0) / (atRisk.length || 1);
    const totalTickets = atRisk.reduce((s, c) => s + (c.monthlyTrend[i]?.tickets || 0), 0);
    const totalSupportCost = atRisk.reduce((s, c) => s + (c.monthlyTrend[i]?.supportCost || 0), 0);
    return {
      month,
      engagement: Math.round(avgEngagement),
      tickets: totalTickets,
      supportCost: totalSupportCost,
    };
  });

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-surface-900 mb-1">At-Risk Accounts — Engagement & Escalation Timeline</h3>
      <p className="text-xs text-surface-500 mb-4">Aggregated trend across {atRisk.length} at-risk accounts</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Avg Engagement" />
            <Line yAxisId="right" type="monotone" dataKey="tickets" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Total Tickets" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RiskDistribution() {
  const critical = customers.filter((c) => c.churnRiskScore >= 75);
  const high = customers.filter((c) => c.churnRiskScore >= 50 && c.churnRiskScore < 75);
  const medium = customers.filter((c) => c.churnRiskScore >= 25 && c.churnRiskScore < 50);
  const low = customers.filter((c) => c.churnRiskScore < 25);

  const data = [
    { level: "Critical", count: critical.length, arr: critical.reduce((s, c) => s + c.arr, 0), color: "#ef4444" },
    { level: "High", count: high.length, arr: high.reduce((s, c) => s + c.arr, 0), color: "#f97316" },
    { level: "Medium", count: medium.length, arr: medium.reduce((s, c) => s + c.arr, 0), color: "#f59e0b" },
    { level: "Low", count: low.length, arr: low.reduce((s, c) => s + c.arr, 0), color: "#22c55e" },
  ];

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-surface-900 mb-4">Risk Distribution — ARR at Stake</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number, name: string) => [formatCurrency(val, true), "ARR at Risk"]}
              labelFormatter={(l) => `${l} Risk`}
            />
            <Bar dataKey="arr" radius={[6, 6, 0, 0]} name="ARR">
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6">
        {data.map((d) => (
          <div key={d.level} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-surface-600">{d.level}: {d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
