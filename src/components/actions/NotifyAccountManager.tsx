"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import { Bell, Loader2, Send, Slack, Mail, MessageSquare } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  accountOwner?: string;
}

export default function NotifyAccountManager({ open, onClose, customerName, accountOwner }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [channel, setChannel] = useState("slack");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState(
    customerName
      ? `Heads up on ${customerName} — flagging this account for your attention. Please review the latest profitability and health metrics and follow up on any open risks before the next check-in.`
      : ""
  );

  const owner = accountOwner || "the account manager";

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <>
      <AnimatePresence>
        {submitted && (
          <SuccessToast
            message="Account manager notified"
            detail={`${channel === "slack" ? "Slack DM" : channel === "email" ? "Email" : "SMS"} sent to ${owner}.`}
          />
        )}
      </AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Notify Account Manager"
        subtitle={customerName ? `Regarding ${customerName}` : "Send a notification to the account owner"}
        icon={<div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Bell className="w-5 h-5 text-amber-600" /></div>}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-medium text-surface-500 uppercase tracking-wide">Recipient</div>
              <div className="text-sm font-semibold text-surface-900">{owner}</div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-brand-50 text-brand-600 font-medium">Account Owner</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "slack", label: "Slack DM", icon: Slack },
                { value: "email", label: "Email", icon: Mail },
                { value: "sms", label: "SMS", icon: MessageSquare },
              ].map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannel(ch.value)}
                  className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    channel === ch.value ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  <ch.icon className="w-4 h-4" /> {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "low", label: "Low", color: "border-surface-400 bg-surface-50 text-surface-700" },
                { value: "normal", label: "Normal", color: "border-blue-500 bg-blue-50 text-blue-700" },
                { value: "urgent", label: "Urgent", color: "border-red-500 bg-red-50 text-red-700" },
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
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note for the account manager..."
              className="input-field text-sm h-28 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-xs text-surface-500">
            <div className="font-semibold text-surface-700 mb-1">This action will:</div>
            <ul className="space-y-1 ml-3">
              <li>• Send a {priority} priority {channel === "slack" ? "Slack message" : channel === "email" ? "email" : "SMS"} to {owner}</li>
              <li>• Attach a link to the {customerName || "customer"} account record</li>
              <li>• Log the touchpoint in HubSpot CRM</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !message.trim()}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Notification</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
