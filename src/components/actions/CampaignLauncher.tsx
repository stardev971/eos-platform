"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import {
  Mail,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  customerEmail?: string;
  context?: string;
}

const sequences = [
  { id: "seq-1", name: "Win-Back Campaign", emails: 5, duration: "14 days", description: "Re-engage churning customers with value reminders and exclusive offers", tags: ["Retention", "Automated"] },
  { id: "seq-2", name: "Executive Outreach", emails: 3, duration: "7 days", description: "Personal outreach from leadership to high-value at-risk accounts", tags: ["High-Touch", "Personal"] },
  { id: "seq-3", name: "Product Value Showcase", emails: 4, duration: "10 days", description: "Highlight underused features and ROI metrics specific to the account", tags: ["Education", "Engagement"] },
  { id: "seq-4", name: "Renewal Incentive", emails: 3, duration: "21 days", description: "Early renewal offer with loyalty discount for at-risk accounts", tags: ["Renewal", "Discount"] },
  { id: "seq-5", name: "Customer Success Check-in", emails: 2, duration: "5 days", description: "Direct check-in from assigned CSM to understand pain points", tags: ["Support", "Relationship"] },
];

export default function CampaignLauncher({ open, onClose, customerName, context }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSeq, setSelectedSeq] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [contacts, setContacts] = useState([
    { name: "David Kim", role: "VP Engineering", email: "david.k@" + (customerName?.toLowerCase().replace(/\s/g, "") || "company") + ".com", selected: true },
    { name: "Rachel Torres", role: "Product Manager", email: "rachel.t@" + (customerName?.toLowerCase().replace(/\s/g, "") || "company") + ".com", selected: true },
    { name: "Mark Stevens", role: "CTO", email: "mark.s@" + (customerName?.toLowerCase().replace(/\s/g, "") || "company") + ".com", selected: false },
  ]);

  const handleLaunch = async () => {
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLaunching(false);
    setLaunched(true);
    setTimeout(() => {
      setLaunched(false);
      onClose();
      setStep(1);
      setSelectedSeq(null);
    }, 3000);
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectedSeq(null);
    setLaunched(false);
  };

  const selectedSequence = sequences.find((s) => s.id === selectedSeq);

  return (
    <>
      <AnimatePresence>{launched && <SuccessToast message="Campaign activated in HubSpot" detail={`${selectedSequence?.name} sequence started for ${contacts.filter(c => c.selected).length} contacts`} />}</AnimatePresence>

      <ActionModal
        open={open}
        onClose={handleClose}
        title="Launch Re-engagement Campaign"
        subtitle={customerName ? `Target: ${customerName} via HubSpot Sequences` : "Select and activate a HubSpot email sequence"}
        icon={<div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Mail className="w-5 h-5 text-orange-600" /></div>}
        wide
      >
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-400"
              }`}>{s}</div>
              <span className={`text-xs font-medium ${step >= s ? "text-surface-900" : "text-surface-400"}`}>
                {s === 1 ? "Select Sequence" : s === 2 ? "Choose Contacts" : "Confirm & Launch"}
              </span>
              {s < 3 && <ChevronRight className="w-4 h-4 text-surface-300 mx-1" />}
            </div>
          ))}
        </div>

        {context && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
            <span className="font-semibold">AI Context:</span> {context}
          </div>
        )}

        {/* Step 1: Select Sequence */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-surface-600 mb-4">Select an email sequence from HubSpot to activate for this account:</p>
            {sequences.map((seq) => (
              <div
                key={seq.id}
                onClick={() => setSelectedSeq(seq.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSeq === seq.id
                    ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900">{seq.name}</span>
                      {seq.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-surface-100 text-surface-500">{t}</span>
                      ))}
                    </div>
                    <p className="text-xs text-surface-500 mt-1">{seq.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-surface-400">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{seq.emails} emails</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{seq.duration}</span>
                    </div>
                  </div>
                  {selectedSeq === seq.id && (
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-3">
              <button
                disabled={!selectedSeq}
                onClick={() => setStep(2)}
                className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
              >
                Next: Select Contacts <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Contacts */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-surface-600">Select contacts from HubSpot to enroll in the <span className="font-semibold">{selectedSequence?.name}</span> sequence:</p>

            <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-xs text-surface-500 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-brand-500" />
              Contacts pulled from HubSpot CRM for {customerName || "this account"}
            </div>

            <div className="space-y-2">
              {contacts.map((c, i) => (
                <div
                  key={c.email}
                  onClick={() => {
                    const updated = [...contacts];
                    updated[i].selected = !updated[i].selected;
                    setContacts(updated);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    c.selected ? "border-brand-200 bg-brand-50/30" : "border-surface-200 hover:bg-surface-50"
                  }`}
                >
                  <input type="checkbox" checked={c.selected} readOnly className="w-4 h-4 rounded border-surface-300 text-brand-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-surface-900">{c.name}</div>
                    <div className="text-xs text-surface-500">{c.role} &middot; {c.email}</div>
                  </div>
                  <span className="badge badge-info text-[10px]">HubSpot</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3">
              <button onClick={() => setStep(1)} className="btn-secondary text-sm">Back</button>
              <button
                disabled={contacts.filter(c => c.selected).length === 0}
                onClick={() => setStep(3)}
                className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
              >
                Next: Review & Launch <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">Campaign Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-surface-500">Sequence</span><span className="font-semibold text-surface-900">{selectedSequence?.name}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Account</span><span className="font-medium">{customerName || "Selected Account"}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Contacts</span><span className="font-medium">{contacts.filter(c => c.selected).length} selected</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Emails in sequence</span><span className="font-medium">{selectedSequence?.emails}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Duration</span><span className="font-medium">{selectedSequence?.duration}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Syncs to</span><span className="font-medium text-orange-600">HubSpot Sequences</span></div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
              <span className="font-semibold">What happens next:</span> The selected contacts will be enrolled in this HubSpot sequence immediately. You can track progress in HubSpot or from the SaaS OS activity feed.
            </div>

            <div className="flex justify-between pt-3">
              <button onClick={() => setStep(2)} className="btn-secondary text-sm">Back</button>
              <button
                onClick={handleLaunch}
                disabled={launching}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {launching ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Activating in HubSpot...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Launch Campaign</>
                )}
              </button>
            </div>
          </div>
        )}
      </ActionModal>
    </>
  );
}
