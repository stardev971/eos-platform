"use client";

import { customers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import type { ElementType } from "react";
import { BarChart3, Activity, TrendingDown, PieChart as PieIcon } from "lucide-react";

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

export function ProfitabilityDistribution() {
  const buckets = [
    { range: "< 0%", count: customers.filter((c) => c.marginPercentage < 0).length, color: "#ef4444" },
    { range: "0-30%", count: customers.filter((c) => c.marginPercentage >= 0 && c.marginPercentage < 30).length, color: "#f97316" },
    { range: "30-60%", count: customers.filter((c) => c.marginPercentage >= 30 && c.marginPercentage < 60).length, color: "#f59e0b" },
    { range: "60-80%", count: customers.filter((c) => c.marginPercentage >= 60 && c.marginPercentage < 80).length, color: "#22c55e" },
    { range: "80%+", count: customers.filter((c) => c.marginPercentage >= 80).length, color: "#10b981" },
  ];

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={BarChart3} title="Profitability Distribution" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Customers">
              {buckets.map((b, i) => (
                <Cell key={i} fill={b.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RevenueVsSupport() {
  const data = customers.map((c) => ({
    name: c.name,
    x: c.arr / 1000,
    y: c.supportCost,
    z: c.profitabilityScore,
    health: c.healthScore,
  }));

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={Activity} title="Revenue vs Support Load" subtitle="Bubble size = profitability score" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
            <XAxis
              dataKey="x"
              type="number"
              tick={{ fontSize: 11, fill: "#8b95ad" }}
              axisLine={false}
              tickLine={false}
              name="ARR ($K)"
              tickFormatter={(v) => `$${v}K`}
            />
            <YAxis
              dataKey="y"
              type="number"
              tick={{ fontSize: 11, fill: "#8b95ad" }}
              axisLine={false}
              tickLine={false}
              name="Support Cost"
              tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`}
            />
            <ZAxis dataKey="z" range={[40, 400]} name="Profitability" />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number, name: string) => {
                if (name === "ARR ($K)") return [`$${val}K`, "ARR"];
                if (name === "Support Cost") return [formatCurrency(val), "Support"];
                return [val, name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
            />
            <Scatter data={data} name="Customers">
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.health >= 80 ? "#22c55e" : d.health >= 60 ? "#f59e0b" : "#ef4444"}
                  fillOpacity={0.6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopLossMakers() {
  const lossMakers = [...customers]
    .filter((c) => c.marginPercentage < 50)
    .sort((a, b) => a.marginPercentage - b.marginPercentage)
    .slice(0, 6)
    .map((c) => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
      margin: c.marginPercentage,
      cost: c.operationalCost,
    }));

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={TrendingDown} title="Lowest Margin Accounts" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lossMakers} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#8b95ad" }} axisLine={false} tickLine={false} width={110} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
              formatter={(val: number) => [`${val.toFixed(1)}%`, "Margin"]}
            />
            <Bar dataKey="margin" radius={[0, 4, 4, 0]} name="Margin %">
              {lossMakers.map((l, i) => (
                <Cell key={i} fill={l.margin < 0 ? "#ef4444" : l.margin < 30 ? "#f97316" : "#f59e0b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SegmentBreakdown() {
  const segments = [
    { name: "Enterprise", value: customers.filter((c) => c.segment === "Enterprise").reduce((s, c) => s + c.arr, 0), fill: "#0284c7" },
    { name: "Mid-Market", value: customers.filter((c) => c.segment === "Mid-Market").reduce((s, c) => s + c.arr, 0), fill: "#38bdf8" },
    { name: "SMB", value: customers.filter((c) => c.segment === "SMB").reduce((s, c) => s + c.arr, 0), fill: "#bae6fd" },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className="glass-card p-5">
      <ChartHeader icon={PieIcon} title="ARR by Segment" />
      <div className="flex items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {segments.map((s, i) => (
                  <Cell key={i} fill={s.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #e8ecf4", borderRadius: "12px", fontSize: "12px" }}
                formatter={(val: number) => [formatCurrency(val, true), "ARR"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {segments.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-surface-700">{s.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-surface-900">{formatCurrency(s.value, true)}</span>
                <span className="text-xs text-surface-500 ml-2">{((s.value / total) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
