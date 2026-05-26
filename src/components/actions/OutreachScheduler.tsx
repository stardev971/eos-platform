"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import { Phone, Loader2, Zap, Calendar, Video, Mail, MessageSquare } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
}

export default function OutreachScheduler({ open, onClose, customerName }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [outreachType, setOutreachType] = useState("call");
  const [scheduledDate, setScheduledDate] = useState("");
  const [attendees, setAttendees] = useState("ceo");
  const [agenda, setAgenda] = useState(
    customerName
      ? `Executive check-in with ${customerName} leadership team.\n\nAgenda:\n1. Review current partnership health\n2. Address recent support concerns\n3. Discuss product roadmap alignment\n4. Explore expansion opportunities`
      : ""
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <>
      <AnimatePresence>{submitted && <SuccessToast message="Executive outreach scheduled" detail="Calendar invite sent via Google Calendar. HubSpot activity logged." />}</AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Schedule Executive Outreach"
        subtitle={customerName ? `Account: ${customerName}` : "Direct engagement with customer leadership"}
        icon={<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Phone className="w-5 h-5 text-blue-600" /></div>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Outreach Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "call", label: "Call", icon: Phone },
                { value: "video", label: "Video", icon: Video },
                { value: "email", label: "Email", icon: Mail },
                { value: "meeting", label: "In-Person", icon: Calendar },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setOutreachType(t.value)}
                  className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    outreachType === t.value ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">EOS Attendees</label>
              <select value={attendees} onChange={(e) => setAttendees(e.target.value)} className="input-field text-sm">
                <option value="ceo">Alex Morgan (CEO)</option>
                <option value="vp-cs">Sarah Chen (VP CS) + CEO</option>
                <option value="team">Full Account Team</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Agenda / Talking Points</label>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="input-field text-sm h-32 resize-none font-mono"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-xs text-surface-500">
            <div className="font-semibold text-surface-700 mb-1">This action will:</div>
            <ul className="space-y-1 ml-3">
              <li>• Create calendar event with {customerName || "customer"} contacts</li>
              <li>• Log activity in HubSpot CRM</li>
              <li>• Send prep brief to attendees via Slack</li>
              <li>• Set reminder 24h before the meeting</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !scheduledDate}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</>
              ) : (
                <><Calendar className="w-4 h-4" /> Schedule Outreach</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
