"use client";

import { getRevenueMetrics, pipelineDeals } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import type { ElementType } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Activity, Filter } from "lucide-react";

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

export function MrrMovement() {
  const m = getRevenueMetrics();
  return (
    <div className="glass-card p-5">
      <ChartHeader icon={Activity} title="MRR Movement" subtitle="New, expansion & churned MRR with net trend" />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={m.mrrTrend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number, name: string) => [formatCurrency(Math.abs(val)), name]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" />
            <Bar dataKey="new" stackId="a" fill="#10b981" name="New" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expansion" stackId="a" fill="#2556eb" name="Expansion" radius={[2, 2, 0, 0]} />
            <Bar dataKey="churn" stackId="a" fill="#ef4444" name="Churn" radius={[0, 0, 2, 2]} />
            <Line type="monotone" dataKey="mrr" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Total MRR" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const stageOrder = ["Discovery", "Proposal", "Negotiation", "Closing"];
const stageColors: Record<string, string> = {
  Discovery: "#bae6fd",
  Proposal: "#7dd3fc",
  Negotiation: "#38bdf8",
  Closing: "#0284c7",
};

export function PipelineByStage() {
  const data = stageOrder.map((stage) => ({
    stage,
    value: pipelineDeals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
    count: pipelineDeals.filter((d) => d.stage === stage).length,
  }));

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={Filter} title="Pipeline by Stage" subtitle="Open opportunity value across the funnel" />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
            <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number, _n, p) => [`${formatCurrency(val, true)} · ${p.payload.count} deals`, "Pipeline"]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Pipeline">
              {data.map((d, i) => (
                <Cell key={i} fill={stageColors[d.stage]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
