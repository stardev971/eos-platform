"use client";

import { getTeamSummary } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import type { ElementType } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Gauge, Briefcase } from "lucide-react";

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

function utilColor(v: number) {
  if (v >= 95) return "#ef4444";
  if (v >= 85) return "#f59e0b";
  return "#10b981";
}

export function TeamUtilization() {
  const s = getTeamSummary();
  const data = s.byTeam.map((t) => ({ team: t.team, utilization: t.avgUtilization }));
  return (
    <div className="glass-card p-5">
      <ChartHeader icon={Gauge} title="Utilization by Team" subtitle="Average capacity in use — red flags overload" />
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="team" tick={{ fontSize: 10, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number) => [`${val}%`, "Utilization"]}
            />
            <Bar dataKey="utilization" radius={[6, 6, 0, 0]} name="Utilization">
              {data.map((d, i) => (
                <Cell key={i} fill={utilColor(d.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ArrManagedByTeam() {
  const s = getTeamSummary();
  const data = s.byTeam
    .filter((t) => t.arrManaged > 0)
    .map((t) => ({ team: t.team, arr: t.arrManaged }));
  return (
    <div className="glass-card p-5">
      <ChartHeader icon={Briefcase} title="ARR Under Management" subtitle="Revenue owned by customer-facing teams" />
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
            <YAxis type="category" dataKey="team" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} width={120} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number) => [formatCurrency(val, true), "ARR managed"]}
            />
            <Bar dataKey="arr" radius={[0, 6, 6, 0]} fill="#2556eb" name="ARR" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
