"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CampaignLauncher from "@/components/actions/CampaignLauncher";
import EscalationCreator from "@/components/actions/EscalationCreator";
import OutreachScheduler from "@/components/actions/OutreachScheduler";
import AccountReviewCreator from "@/components/actions/AccountReviewCreator";
import {
  Zap,
  Mail,
  AlertTriangle,
  Phone,
  ClipboardList,
  TrendingUp,
  Shield,
  BarChart3,
} from "lucide-react";

const quickActions = [
  {
    label: "Run Upsell Campaign",
    description: "Launch targeted upsell sequence via HubSpot for high-margin accounts",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-200",
    action: "campaign" as const,
    context: "Upsell opportunity for profitable accounts with expansion potential",
  },
  {
    label: "Escalate Unprofitable Account",
    description: "Create Jira/Zendesk escalation for accounts with negative margins",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100 hover:border-red-200",
    action: "escalation" as const,
  },
  {
    label: "Schedule Executive Review",
    description: "Book a strategic review call with account stakeholders",
    icon: Phone,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-200",
    action: "outreach" as const,
  },
  {
    label: "Generate Profitability Report",
    description: "Create comprehensive PDF with cost breakdown across all platforms",
    icon: ClipboardList,
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-100 hover:border-brand-200",
    action: "review" as const,
  },
];

export default function ProfitabilityActionCenter() {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleAction = (action: string, context?: string) => {
    switch (action) {
      case "campaign": setCampaignOpen(true); break;
      case "escalation": setEscalationOpen(true); break;
      case "outreach": setOutreachOpen(true); break;
      case "review": setReviewOpen(true); break;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm ring-1 ring-white/40">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900">Action Center</h3>
            <p className="text-[10px] text-surface-500">Quick workflows — actions sync to connected platforms</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              onClick={() => handleAction(action.action, action.context)}
              className={`p-3.5 rounded-xl border ${action.border} ${action.bg} text-left transition-all hover:shadow-sm group`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-surface-800 group-hover:text-surface-900">{action.label}</div>
                  <div className="text-[10px] text-surface-500 mt-0.5 leading-relaxed">{action.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <CampaignLauncher open={campaignOpen} onClose={() => setCampaignOpen(false)} context="Upsell opportunity for profitable accounts with expansion potential" />
      <EscalationCreator open={escalationOpen} onClose={() => setEscalationOpen(false)} />
      <OutreachScheduler open={outreachOpen} onClose={() => setOutreachOpen(false)} />
      <AccountReviewCreator open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}
