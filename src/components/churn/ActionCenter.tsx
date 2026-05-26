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
  Shield,
  Heart,
  UserX,
} from "lucide-react";

const quickActions = [
  {
    label: "Launch Retention Campaign",
    description: "Activate HubSpot re-engagement sequence for at-risk accounts",
    icon: Mail,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100 hover:border-red-200",
    action: "campaign" as const,
    context: "Retention campaign for accounts showing churn signals across Mixpanel and Zendesk",
  },
  {
    label: "Escalate Critical Account",
    description: "Create urgent Jira/Zendesk task for immediate customer intervention",
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100 hover:border-orange-200",
    action: "escalation" as const,
  },
  {
    label: "Schedule Win-Back Call",
    description: "Book executive outreach to rebuild relationship with churning customer",
    icon: Phone,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-200",
    action: "outreach" as const,
  },
  {
    label: "Generate Health Report",
    description: "Full account health assessment pulling data from all 4 platforms",
    icon: ClipboardList,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-200",
    action: "review" as const,
  },
];

export default function ChurnActionCenter() {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleAction = (action: string) => {
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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900">Retention Action Center</h3>
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
              onClick={() => handleAction(action.action)}
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

      <CampaignLauncher open={campaignOpen} onClose={() => setCampaignOpen(false)} context="Retention campaign for accounts showing churn signals across Mixpanel and Zendesk" />
      <EscalationCreator open={escalationOpen} onClose={() => setEscalationOpen(false)} riskScore={85} />
      <OutreachScheduler open={outreachOpen} onClose={() => setOutreachOpen(false)} />
      <AccountReviewCreator open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}
