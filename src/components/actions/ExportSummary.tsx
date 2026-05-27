"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import { FileText, FileSpreadsheet, Presentation, Loader2, Download, Eye } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
}

const formats = [
  { value: "pdf", label: "PDF Report", desc: "Formatted account brief", icon: FileText },
  { value: "csv", label: "CSV Data", desc: "Raw metrics export", icon: FileSpreadsheet },
  { value: "slides", label: "Slides", desc: "Google Slides deck", icon: Presentation },
] as const;

export default function ExportSummary({ open, onClose, customerName }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [format, setFormat] = useState<string>("pdf");
  const [destination, setDestination] = useState("download");
  const [sections, setSections] = useState({
    overview: true, revenue: true, support: true, engineering: true, risks: true, activity: false,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  const activeFormat = formats.find((f) => f.value === format)!;

  return (
    <>
      <AnimatePresence>
        {submitted && (
          <SuccessToast
            message="Summary exported"
            detail={
              destination === "download"
                ? `${activeFormat.label} generated and downloaded.`
                : destination === "slack"
                ? `${activeFormat.label} shared to Slack #account-team.`
                : `${activeFormat.label} saved to Google Drive.`
            }
          />
        )}
      </AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Export Account Summary"
        subtitle={customerName ? `Export data for ${customerName}` : "Export account summary"}
        icon={<div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><Download className="w-5 h-5 text-brand-600" /></div>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === f.value ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "border-surface-200 hover:bg-surface-50"
                  }`}
                >
                  <f.icon className={`w-4 h-4 mb-1.5 ${format === f.value ? "text-brand-600" : "text-surface-500"}`} />
                  <div className={`text-xs font-medium ${format === f.value ? "text-brand-700" : "text-surface-700"}`}>{f.label}</div>
                  <div className="text-[10px] text-surface-500 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">Sections to Include</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "overview", label: "Customer Overview", source: "HubSpot" },
                { key: "revenue", label: "Revenue & Cost Trend", source: "Stripe" },
                { key: "support", label: "Support Metrics", source: "Zendesk" },
                { key: "engineering", label: "Engineering Effort", source: "Jira" },
                { key: "risks", label: "Active Risks", source: "AI Engine" },
                { key: "activity", label: "Recent Activity", source: "All Sources" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                    sections[item.key as keyof typeof sections] ? "border-brand-200 bg-brand-50/30" : "border-surface-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={sections[item.key as keyof typeof sections]}
                    onChange={(e) => setSections({ ...sections, [item.key]: e.target.checked })}
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
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-field text-sm">
              <option value="download">Download to this device</option>
              <option value="slack">Share to Slack #account-team</option>
              <option value="drive">Save to Google Drive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
              ) : (
                <><Download className="w-4 h-4" /> Export Summary</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
