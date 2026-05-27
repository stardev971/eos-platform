"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  DollarSign,
  Activity,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Sparkles,
  MessageSquare,
  ArrowDownRight,
  Info,
} from "lucide-react";
import { aiModelUsage, getAIUsageSummary } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import type { AIModelUsage } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────
function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

function getStatusConfig(status: AIModelUsage["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" };
    case "limited":
      return { label: "Limited", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200" };
    case "deprecated":
      return { label: "Deprecated", icon: XCircle, color: "text-red-500", bg: "bg-red-50", ring: "ring-red-200" };
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Content Generation":
      return MessageSquare;
    case "Image Processing":
      return ImageIcon;
    case "Data Analysis":
      return BarChart3;
    case "Churn Prediction":
      return Activity;
    case "Recommendations":
      return Sparkles;
    case "Summarization":
      return FileText;
    default:
      return Cpu;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Content Generation":
      return { color: "text-pink-600", bg: "bg-pink-50", ring: "ring-pink-200" };
    case "Image Processing":
      return { color: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-200" };
    case "Data Analysis":
      return { color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" };
    case "Churn Prediction":
      return { color: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-200" };
    case "Recommendations":
      return { color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-200" };
    case "Summarization":
      return { color: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-200" };
    default:
      return { color: "text-surface-600", bg: "bg-surface-50", ring: "ring-surface-200" };
  }
}

function getProviderBadge(provider: string) {
  switch (provider) {
    case "OpenAI":
      return { bg: "bg-emerald-600", text: "text-white", letter: "O" };
    case "Anthropic":
      return { bg: "bg-orange-500", text: "text-white", letter: "A" };
    case "Google":
      return { bg: "bg-blue-500", text: "text-white", letter: "G" };
    case "Stability AI":
      return { bg: "bg-purple-600", text: "text-white", letter: "S" };
    case "Internal":
      return { bg: "bg-surface-700", text: "text-white", letter: "E" };
    default:
      return { bg: "bg-surface-400", text: "text-white", letter: "?" };
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-05-26T15:30:00");
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Sort config ────────────────────────────────────────────────────
type SortKey = "model" | "requests" | "totalTokens" | "totalCost" | "avgLatencyMs";

// ─── Page Component ─────────────────────────────────────────────────
export default function AIUsagePage() {
  const summary = getAIUsageSummary();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalCost");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Unique categories for filter
  const allCategories = Array.from(new Set(aiModelUsage.map((m) => m.category)));

  // Filter + sort
  const filtered = aiModelUsage
    .filter((m) => {
      const matchSearch =
        !search ||
        m.model.toLowerCase().includes(search.toLowerCase()) ||
        m.useCase.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return <ChevronDown className="w-3 h-3 text-surface-300" />;
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-brand-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-brand-600" />
    );
  };

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 tracking-tight">AI Usage</h1>
              <p className="text-xs text-surface-500">
                Monitor model consumption, token usage, and costs across all AI-powered features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-surface-400 bg-surface-100 px-2.5 py-1 rounded-full">
              Billing period: May 1 – 26, 2026
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {[
          {
            label: "Total Tokens Used",
            value: formatTokens(summary.totalTokensUsed),
            sub: `${formatNumber(summary.totalRequests)} requests`,
            icon: Zap,
            bg: "bg-blue-50",
            iconColor: "#3b82f6",
          },
          {
            label: "Total AI Cost",
            value: formatCost(summary.totalCost),
            sub: (
              <span className="flex items-center gap-0.5 text-emerald-600">
                <ArrowDownRight className="w-3 h-3" />
                {Math.abs(summary.costTrend)}% vs last month
              </span>
            ),
            icon: DollarSign,
            bg: "bg-emerald-50",
            iconColor: "#10b981",
          },
          {
            label: "Active Models",
            value: summary.activeModels.toString(),
            sub: `of ${aiModelUsage.length} total`,
            icon: Cpu,
            bg: "bg-violet-50",
            iconColor: "#8b5cf6",
          },
          {
            label: "Avg Latency",
            value: `${summary.avgLatencyMs}ms`,
            sub: "across active models",
            icon: Clock,
            bg: "bg-amber-50",
            iconColor: "#f59e0b",
          },
          {
            label: "Cost / 1K Requests",
            value: formatCost((summary.totalCost / summary.totalRequests) * 1000),
            sub: "blended rate",
            icon: Activity,
            bg: "bg-pink-50",
            iconColor: "#ec4899",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="kpi-card"
          >
            <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon className="w-4.5 h-4.5" style={{ color: kpi.iconColor }} />
            </div>
            <div className="text-xs font-medium text-surface-500 mb-1">{kpi.label}</div>
            <div className="text-lg font-bold text-surface-900">{kpi.value}</div>
            <div className="text-[10px] text-surface-400 mt-0.5">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Cost by Category Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <h2 className="text-sm font-semibold text-surface-900 mb-4">Token Usage by Category</h2>
        <div className="space-y-3">
          {summary.tokensByCategory.map((cat) => {
            const CatIcon = getCategoryIcon(cat.category);
            const catColors = getCategoryColor(cat.category);
            const pct = (cat.tokens / summary.totalTokensUsed) * 100;
            return (
              <div key={cat.category} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${catColors.bg} flex items-center justify-center shrink-0`}>
                  <CatIcon className={`w-4 h-4 ${catColors.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-surface-800">{cat.category}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-surface-500">{formatTokens(cat.tokens)} tokens</span>
                      <span className="font-semibold text-surface-700">{formatCost(cat.cost)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        cat.category === "Churn Prediction"
                          ? "bg-orange-400"
                          : cat.category === "Data Analysis"
                          ? "bg-blue-400"
                          : cat.category === "Content Generation"
                          ? "bg-pink-400"
                          : cat.category === "Image Processing"
                          ? "bg-violet-400"
                          : cat.category === "Recommendations"
                          ? "bg-indigo-400"
                          : "bg-teal-400"
                      }`}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-surface-400 w-10 text-right shrink-0">
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Filters & Search ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                categoryFilter === "all"
                  ? "bg-white text-surface-900 shadow-sm"
                  : "text-surface-500 hover:text-surface-700"
              }`}
            >
              All Categories
            </button>
            {allCategories.map((cat) => {
              const CatIcon = getCategoryIcon(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    categoryFilter === cat
                      ? "bg-white text-surface-900 shadow-sm"
                      : "text-surface-500 hover:text-surface-700"
                  }`}
                >
                  <CatIcon className="w-3 h-3" />
                  <span className="hidden xl:inline">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="limited">Limited</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search models, use cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-surface-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-56"
          />
        </div>
      </div>

      {/* ── Model Usage Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.7fr] gap-4 px-5 py-3 border-b border-surface-100 bg-surface-50/50">
          {[
            { label: "Model / Provider", key: "model" as SortKey },
            { label: "Use Case", key: null },
            { label: "Requests", key: "requests" as SortKey },
            { label: "Tokens", key: "totalTokens" as SortKey },
            { label: "Cost", key: "totalCost" as SortKey },
            { label: "Latency", key: "avgLatencyMs" as SortKey },
          ].map((col) => (
            <button
              key={col.label}
              onClick={() => col.key && handleSort(col.key)}
              className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
                col.key ? "cursor-pointer hover:text-surface-700" : "cursor-default"
              } text-surface-500`}
            >
              {col.label}
              {col.key && <SortIcon colKey={col.key} />}
            </button>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-surface-100">
          {filtered.map((model, i) => {
            const statusCfg = getStatusConfig(model.status);
            const StatusIcon = statusCfg.icon;
            const providerBadge = getProviderBadge(model.provider);
            const catColors = getCategoryColor(model.category);
            const CatIcon = getCategoryIcon(model.category);
            const isExpanded = expandedId === model.id;

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Main Row */}
                <div
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.7fr] gap-4 px-5 py-4 items-center hover:bg-surface-50/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : model.id)}
                >
                  {/* Model + Provider */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg ${providerBadge.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${providerBadge.text}`}>{providerBadge.letter}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-surface-900 truncate">{model.model}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ring-1 ${statusCfg.bg} ${statusCfg.color} ${statusCfg.ring}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {statusCfg.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-surface-400">{model.provider}</span>
                    </div>
                  </div>

                  {/* Use Case + Category */}
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-surface-700 truncate">{model.useCase}</div>
                    <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${catColors.bg} ${catColors.color}`}>
                      <CatIcon className="w-2.5 h-2.5" />
                      {model.category}
                    </span>
                  </div>

                  {/* Requests */}
                  <div>
                    <span className="text-sm font-semibold text-surface-800">{formatNumber(model.requests)}</span>
                  </div>

                  {/* Tokens */}
                  <div>
                    <span className="text-sm font-semibold text-surface-800">
                      {model.totalTokens > 0 ? formatTokens(model.totalTokens) : "—"}
                    </span>
                    {model.totalTokens > 0 && (
                      <div className="text-[10px] text-surface-400 mt-0.5">
                        {formatTokens(model.inputTokens)} in / {formatTokens(model.outputTokens)} out
                      </div>
                    )}
                  </div>

                  {/* Cost */}
                  <div>
                    <span className={`text-sm font-bold ${model.totalCost > 0 ? "text-surface-900" : "text-surface-400"}`}>
                      {model.totalCost > 0 ? formatCost(model.totalCost) : "Free"}
                    </span>
                    {model.costPerMille > 0 && (
                      <div className="text-[10px] text-surface-400 mt-0.5">
                        ${model.costPerMille}/1K tok
                      </div>
                    )}
                  </div>

                  {/* Latency */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${
                      model.avgLatencyMs < 500 ? "text-emerald-600" : model.avgLatencyMs < 2000 ? "text-amber-600" : "text-orange-600"
                    }`}>
                      {model.avgLatencyMs < 1000
                        ? `${model.avgLatencyMs}ms`
                        : `${(model.avgLatencyMs / 1000).toFixed(1)}s`}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-surface-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-4 border-t border-surface-50"
                  >
                    <div className="pt-4 grid grid-cols-2 xl:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Input Tokens</div>
                        <div className="text-sm font-bold text-surface-900 mt-0.5">
                          {model.inputTokens > 0 ? formatTokens(model.inputTokens) : "N/A"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Output Tokens</div>
                        <div className="text-sm font-bold text-surface-900 mt-0.5">
                          {model.outputTokens > 0 ? formatTokens(model.outputTokens) : "N/A"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Cost per 1K Tokens</div>
                        <div className="text-sm font-bold text-surface-900 mt-0.5">
                          {model.costPerMille > 0 ? `$${model.costPerMille}` : "Free tier"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Last Used</div>
                        <div className="text-sm font-bold text-surface-900 mt-0.5">{timeAgo(model.lastUsed)}</div>
                      </div>
                    </div>

                    {model.status === "deprecated" && (
                      <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
                        <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-red-700">
                          <span className="font-medium">Deprecated:</span> This model is no longer receiving new requests. Existing data will remain available. Migration to a newer model is recommended.
                        </div>
                      </div>
                    )}

                    {model.status === "limited" && (
                      <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-700">
                          <span className="font-medium">Rate Limited:</span> This model is operating under reduced capacity. Request throughput has been throttled to stay within plan limits.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-surface-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No models match your filters.</p>
          </div>
        )}

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex items-center justify-between">
          <span className="text-xs text-surface-400">
            Showing {filtered.length} of {aiModelUsage.length} models
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-surface-500">
              Total: <span className="font-semibold text-surface-800">{formatTokens(filtered.reduce((s, m) => s + m.totalTokens, 0))} tokens</span>
            </span>
            <span className="text-surface-500">
              Cost: <span className="font-bold text-surface-900">{formatCost(filtered.reduce((s, m) => s + m.totalCost, 0))}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
