"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profitabilityInsights } from "@/lib/data";
import InfoPopover from "@/components/ui/InfoPopover";
import CampaignLauncher from "@/components/actions/CampaignLauncher";
import EscalationCreator from "@/components/actions/EscalationCreator";
import OutreachScheduler from "@/components/actions/OutreachScheduler";
import AccountReviewCreator from "@/components/actions/AccountReviewCreator";
import {
  Sparkles,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Info,
  ArrowRight,
  Mail,
  Phone,
  ClipboardList,
  Zap,
} from "lucide-react";

const typeConfig = {
  critical: { icon: AlertCircle, bg: "bg-red-50", border: "border-red-100", text: "text-red-700", dot: "bg-red-500" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  opportunity: { icon: TrendingUp, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  info: { icon: Info, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
};

export default function AIInsightsSection() {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignCustomer, setCampaignCustomer] = useState("");
  const [campaignContext, setCampaignContext] = useState("");
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationCustomer, setEscalationCustomer] = useState("");
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [outreachCustomer, setOutreachCustomer] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewCustomer, setReviewCustomer] = useState("");

  const getActions = (insight: typeof profitabilityInsights[0]) => {
    if (insight.type === "critical" || insight.type === "warning") {
      return [
        { label: "Escalate", icon: AlertTriangle, onClick: () => { setEscalationCustomer(insight.customer || ""); setEscalationOpen(true); } },
        { label: "Run Campaign", icon: Mail, onClick: () => { setCampaignCustomer(insight.customer || ""); setCampaignContext(insight.description); setCampaignOpen(true); } },
        { label: "Review Account", icon: ClipboardList, onClick: () => { setReviewCustomer(insight.customer || ""); setReviewOpen(true); } },
      ];
    }
    if (insight.type === "opportunity") {
      return [
        { label: "Schedule Outreach", icon: Phone, onClick: () => { setOutreachCustomer(insight.customer || ""); setOutreachOpen(true); } },
        { label: "Review Account", icon: ClipboardList, onClick: () => { setReviewCustomer(insight.customer || ""); setReviewOpen(true); } },
      ];
    }
    return [
      { label: "View Details", icon: ArrowRight, onClick: () => { setReviewCustomer(insight.customer || ""); setReviewOpen(true); } },
    ];
  };

  return (
    <>
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="brand-mark w-7 h-7 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">AI Insights & Actions</h3>
              <p className="text-[10px] text-surface-500">Auto-generated from connected systems</p>
            </div>
          </div>
          <InfoPopover title="How are these insights generated?">
            <p>Each insight is computed by our AI engine analyzing data across all connected platforms in real-time:</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span><strong>HubSpot:</strong> Account lifecycle, owner, contract data</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span><strong>Stripe:</strong> ARR, MRR, payment history, billing status</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span><strong>Zendesk:</strong> Ticket volume, CSAT, SLA breaches, escalations</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span><strong>Jira:</strong> Engineering hours, bug count, sprint velocity</span></div>
            </div>
            <p className="mt-2 text-surface-400">Insights are refreshed every 15 minutes. Click any action button to trigger a workflow in the connected platform.</p>
          </InfoPopover>
        </div>
        <div className="space-y-3">
          {profitabilityInsights.map((insight, i) => {
            const config = typeConfig[insight.type];
            const Icon = config.icon;
            const actions = getActions(insight);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-4 rounded-xl ${config.bg} border ${config.border} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 ${config.text} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${config.text}`}>{insight.title}</h4>
                    <p className="text-xs text-surface-700 mt-1 leading-relaxed">{insight.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-surface-500">{insight.source}</span>
                      <span className="text-[10px] text-surface-400">&middot;</span>
                      <span className="text-[10px] text-surface-500">{insight.impact}</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 mt-3">
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/80 border border-surface-200 text-surface-700 hover:bg-white hover:border-surface-300 hover:shadow-sm transition-all"
                        >
                          <action.icon className="w-3 h-3" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Modals */}
      <CampaignLauncher open={campaignOpen} onClose={() => setCampaignOpen(false)} customerName={campaignCustomer} context={campaignContext} />
      <EscalationCreator open={escalationOpen} onClose={() => setEscalationOpen(false)} customerName={escalationCustomer} />
      <OutreachScheduler open={outreachOpen} onClose={() => setOutreachOpen(false)} customerName={outreachCustomer} />
      <AccountReviewCreator open={reviewOpen} onClose={() => setReviewOpen(false)} customerName={reviewCustomer} />
    </>
  );
}
