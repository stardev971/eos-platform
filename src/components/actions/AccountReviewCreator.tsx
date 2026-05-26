"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import { ClipboardList, Loader2, Zap, FileText, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
}

export default function AccountReviewCreator({ open, onClose, customerName }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewType, setReviewType] = useState("profitability");
  const [includeItems, setIncludeItems] = useState({
    revenue: true, support: true, engineering: true, product: true, churn: true, timeline: true,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <>
      <AnimatePresence>{submitted && <SuccessToast message="Account review generated" detail="PDF report created and shared via Slack. Jira review task assigned." />}</AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Generate Account Review"
        subtitle={customerName ? `Comprehensive review for ${customerName}` : "Cross-platform account analysis"}
        icon={<div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-brand-600" /></div>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Review Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "profitability", label: "Profitability Review", desc: "Revenue, costs, margin analysis" },
                { value: "health", label: "Health Assessment", desc: "Engagement, support, churn risk" },
                { value: "renewal", label: "Renewal Readiness", desc: "Pre-renewal comprehensive check" },
                { value: "executive", label: "Executive Brief", desc: "High-level summary for leadership" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setReviewType(t.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    reviewType === t.value ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "border-surface-200 hover:bg-surface-50"
                  }`}
                >
                  <div className={`text-sm font-medium ${reviewType === t.value ? "text-brand-700" : "text-surface-700"}`}>{t.label}</div>
                  <div className="text-[10px] text-surface-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">Include Data From</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "revenue", label: "Revenue & Billing", source: "Stripe" },
                { key: "support", label: "Support Metrics", source: "Zendesk" },
                { key: "engineering", label: "Engineering Effort", source: "Jira" },
                { key: "product", label: "Product Usage", source: "Mixpanel" },
                { key: "churn", label: "Churn Signals", source: "AI Engine" },
                { key: "timeline", label: "Activity Timeline", source: "All Sources" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                    includeItems[item.key as keyof typeof includeItems] ? "border-brand-200 bg-brand-50/30" : "border-surface-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeItems[item.key as keyof typeof includeItems]}
                    onChange={(e) => setIncludeItems({ ...includeItems, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded border-surface-300 text-brand-600"
                  />
                  <div>
                    <div className="text-xs font-medium text-surface-800">{item.label}</div>
                    <div className="text-[10px] text-surface-400">via {item.source}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Distribute To</label>
            <div className="flex gap-2">
              {["Slack #account-reviews", "Email to account team", "Save to Google Drive"].map((d) => (
                <label key={d} className="flex items-center gap-1.5 text-xs text-surface-600">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-surface-300 text-brand-600" />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Preview PDF
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><FileText className="w-4 h-4" /> Generate & Distribute</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
