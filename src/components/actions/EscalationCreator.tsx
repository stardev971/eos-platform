"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import {
  AlertTriangle,
  Loader2,
  Zap,
  Users,
  MessageSquare,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  riskScore?: number;
}

export default function EscalationCreator({ open, onClose, customerName, riskScore }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState("high");
  const [assignee, setAssignee] = useState("sarah-chen");
  const [channel, setChannel] = useState("zendesk");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setNotes("");
    }, 3000);
  };

  return (
    <>
      <AnimatePresence>{submitted && <SuccessToast message="Escalation created" detail={`Jira ticket created and Slack alert sent to #customer-escalations`} />}</AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Create Escalation Task"
        subtitle={customerName ? `Escalating: ${customerName}` : "Create cross-platform escalation"}
        icon={<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>}
      >
        <div className="space-y-4">
          {riskScore && riskScore >= 70 && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
              <span className="font-semibold">Critical Risk:</span> This account has a {riskScore}% churn risk score. Immediate action recommended.
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "critical", label: "Critical", color: "border-red-500 bg-red-50 text-red-700" },
                { value: "high", label: "High", color: "border-orange-500 bg-orange-50 text-orange-700" },
                { value: "medium", label: "Medium", color: "border-amber-500 bg-amber-50 text-amber-700" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                    priority === p.value ? `${p.color} ring-2 ring-offset-1` : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Assign To</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="input-field text-sm"
            >
              <option value="sarah-chen">Sarah Chen — VP Customer Success</option>
              <option value="marcus-rivera">Marcus Rivera — Account Director</option>
              <option value="james-park">James Park — CS Manager</option>
              <option value="alex-morgan">Alex Morgan — CEO (Self)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Create In</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "zendesk", label: "Zendesk Ticket", icon: MessageSquare },
                { value: "jira", label: "Jira Task", icon: AlertTriangle },
              ].map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannel(ch.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                    channel === ch.value ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  <ch.icon className="w-4 h-4" /> {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Notes / Context</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context for the team — what triggered this escalation, what actions have been taken..."
              className="input-field text-sm h-24 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-xs text-surface-500">
            <div className="font-semibold text-surface-700 mb-1">This action will:</div>
            <ul className="space-y-1 ml-3">
              <li>• Create a {channel === "zendesk" ? "Zendesk support ticket" : "Jira task"} with priority: {priority}</li>
              <li>• Send Slack notification to #customer-escalations</li>
              <li>• Flag account in HubSpot CRM as "Escalated"</li>
              <li>• Assign to {assignee === "sarah-chen" ? "Sarah Chen" : assignee === "marcus-rivera" ? "Marcus Rivera" : assignee === "james-park" ? "James Park" : "Alex Morgan"}</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><Zap className="w-4 h-4" /> Create Escalation</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
