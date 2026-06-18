"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { recommendations } from "@/lib/data";
import { Recommendation } from "@/lib/types";
import CampaignLauncher from "@/components/actions/CampaignLauncher";
import EscalationCreator from "@/components/actions/EscalationCreator";
import OutreachScheduler from "@/components/actions/OutreachScheduler";
import AccountReviewCreator from "@/components/actions/AccountReviewCreator";
import {
  Sparkles,
  ChevronDown,
  Zap,
  Gauge,
  Target,
  Check,
  Mail,
  AlertTriangle,
  Phone,
  ClipboardList,
} from "lucide-react";

const priorityStyle: Record<string, { badge: string; bar: string; label: string }> = {
  critical: { badge: "badge-danger", bar: "bg-red-500", label: "Critical" },
  high: { badge: "badge-warning", bar: "bg-orange-500", label: "High" },
  medium: { badge: "badge-info", bar: "bg-blue-500", label: "Medium" },
  low: { badge: "bg-surface-100 text-surface-600 ring-1 ring-surface-200", bar: "bg-surface-400", label: "Low" },
};

const categoryStyle: Record<string, string> = {
  Revenue: "bg-emerald-50 text-emerald-700",
  Retention: "bg-red-50 text-red-700",
  Cost: "bg-amber-50 text-amber-700",
  Efficiency: "bg-violet-50 text-violet-700",
  Growth: "bg-brand-50 text-brand-700",
};

const actionMeta: Record<Recommendation["actionType"], { label: string; icon: typeof Mail }> = {
  campaign: { label: "Run Campaign", icon: Mail },
  escalation: { label: "Escalate", icon: AlertTriangle },
  outreach: { label: "Schedule Outreach", icon: Phone },
  review: { label: "Create Review", icon: ClipboardList },
};

const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };

export default function RecommendationsBoard() {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(recommendations[0]?.id ?? null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  // Modal state
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState("");
  const [activeContext, setActiveContext] = useState("");

  const priorities = ["All", "critical", "high", "medium", "low"];
  const categories = ["All", "Revenue", "Retention", "Cost", "Efficiency", "Growth"];

  const filtered = useMemo(() => {
    let list = [...recommendations];
    if (priorityFilter !== "All") list = list.filter((r) => r.priority === priorityFilter);
    if (categoryFilter !== "All") list = list.filter((r) => r.category === categoryFilter);
    return list.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || b.impactValue - a.impactValue);
  }, [priorityFilter, categoryFilter]);

  const trigger = (r: Recommendation) => {
    setActiveCustomer(r.customer || "");
    setActiveContext(r.description);
    switch (r.actionType) {
      case "campaign": setCampaignOpen(true); break;
      case "escalation": setEscalationOpen(true); break;
      case "outreach": setOutreachOpen(true); break;
      case "review": setReviewOpen(true); break;
    }
  };

  return (
    <>
      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="brand-mark w-7 h-7 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">Prioritized Recommendations</h3>
              <p className="text-[11px] text-surface-500">Ranked by impact & confidence · refreshed every 15 min</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-surface-50 rounded-lg p-0.5 border border-surface-200">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                    priorityFilter === p ? "bg-white text-surface-900 shadow-sm" : "text-surface-500 hover:text-surface-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs rounded-lg border border-surface-200 bg-surface-50 px-2.5 py-1.5 text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-surface-100">
          {filtered.map((r, i) => {
            const ps = priorityStyle[r.priority];
            const isOpen = expanded === r.id;
            const isDone = done[r.id];
            const Action = actionMeta[r.actionType];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`p-4 ${isDone ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-1 self-stretch rounded-full ${ps.bar} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`badge text-[10px] ${ps.badge}`}>{ps.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${categoryStyle[r.category]}`}>{r.category}</span>
                      {r.customer && <span className="text-[11px] text-surface-500">{r.customer}</span>}
                    </div>
                    <h4 className={`text-sm font-semibold text-surface-900 ${isDone ? "line-through" : ""}`}>{r.title}</h4>
                    <p className="text-xs text-surface-600 mt-1 leading-relaxed">{r.description}</p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-2.5 text-[11px]">
                      <span className="flex items-center gap-1 text-surface-600"><Target className="w-3 h-3 text-emerald-500" /> <span className="font-semibold text-surface-800">{r.impact}</span></span>
                      <span className="flex items-center gap-1 text-surface-600"><Gauge className="w-3 h-3 text-brand-500" /> {r.confidence}% confidence</span>
                      <span className="flex items-center gap-1 text-surface-600"><Zap className="w-3 h-3 text-amber-500" /> {r.effort} effort</span>
                      <span className="text-surface-400 hidden sm:inline">{r.sources.join(" · ")}</span>
                    </div>

                    {/* Expandable rationale */}
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-3 rounded-lg bg-surface-50 border border-surface-100"
                      >
                        <div className="text-[10px] font-semibold text-surface-500 uppercase tracking-wide mb-2">Why this is recommended</div>
                        <ul className="space-y-1.5">
                          {r.rationale.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-surface-700">
                              <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => trigger(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                      >
                        <Action.icon className="w-3 h-3" /> {Action.label}
                      </button>
                      <button
                        onClick={() => setExpanded(isOpen ? null : r.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                      >
                        Why <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        onClick={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                          isDone ? "text-emerald-600 bg-emerald-50" : "text-surface-600 hover:bg-surface-100"
                        }`}
                      >
                        <Check className="w-3 h-3" /> {isDone ? "Done" : "Mark done"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-surface-400">No recommendations match these filters.</div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <CampaignLauncher open={campaignOpen} onClose={() => setCampaignOpen(false)} customerName={activeCustomer} context={activeContext} />
      <EscalationCreator open={escalationOpen} onClose={() => setEscalationOpen(false)} customerName={activeCustomer} />
      <OutreachScheduler open={outreachOpen} onClose={() => setOutreachOpen(false)} customerName={activeCustomer} />
      <AccountReviewCreator open={reviewOpen} onClose={() => setReviewOpen(false)} customerName={activeCustomer} />
    </>
  );
}
