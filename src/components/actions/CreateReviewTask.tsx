"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ActionModal from "@/components/ui/ActionModal";
import SuccessToast from "@/components/ui/SuccessToast";
import { ListChecks, Loader2, Plus, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  accountOwner?: string;
}

const defaultChecklist = [
  { label: "Review revenue & margin trend", done: true },
  { label: "Audit open support tickets", done: true },
  { label: "Confirm renewal readiness", done: true },
  { label: "Document expansion opportunities", done: false },
];

export default function CreateReviewTask({ open, onClose, customerName, accountOwner }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState(customerName ? `Quarterly account review — ${customerName}` : "Account review");
  const [platform, setPlatform] = useState("jira");
  const [assignee, setAssignee] = useState("owner");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [checklist, setChecklist] = useState(defaultChecklist);

  const owner = accountOwner || "Sarah Chen";

  const toggleItem = (i: number) =>
    setChecklist(checklist.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c)));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1700));
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
            message="Review task created"
            detail={`${platform === "jira" ? "Jira" : platform === "asana" ? "Asana" : "Linear"} task assigned. Slack reminder scheduled.`}
          />
        )}
      </AnimatePresence>

      <ActionModal
        open={open}
        onClose={onClose}
        title="Create Review Task"
        subtitle={customerName ? `Track a review for ${customerName}` : "Create a tracked review task"}
        icon={<div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><ListChecks className="w-5 h-5 text-emerald-600" /></div>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Create In</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "jira", label: "Jira" },
                { value: "asana", label: "Asana" },
                { value: "linear", label: "Linear" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                    platform === p.value ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Assign To</label>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="input-field text-sm">
                <option value="owner">{owner} (Account Owner)</option>
                <option value="marcus-rivera">Marcus Rivera — Account Director</option>
                <option value="james-park">James Park — CS Manager</option>
                <option value="self">Assign to myself</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "high", label: "High", color: "border-red-500 bg-red-50 text-red-700" },
                { value: "medium", label: "Medium", color: "border-amber-500 bg-amber-50 text-amber-700" },
                { value: "low", label: "Low", color: "border-surface-400 bg-surface-50 text-surface-700" },
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
            <label className="block text-xs font-medium text-surface-600 mb-2">Review Checklist</label>
            <div className="space-y-1.5">
              {checklist.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-surface-200 hover:bg-surface-50 transition-all text-left"
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? "text-emerald-600" : "text-surface-300"}`} />
                  <span className={`text-xs ${item.done ? "text-surface-800" : "text-surface-500"}`}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Task</>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </>
  );
}
