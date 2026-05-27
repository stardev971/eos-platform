"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}

export default function ActionModal({ open, onClose, title, subtitle, icon, children, wide }: ActionModalProps) {
  return (
    <AnimatePresence>
      {open && (
        // Full-screen flex container handles centering. We rely on flexbox
        // (not CSS translate utilities) because Framer Motion writes its own
        // inline `transform` for the entry animation, which would otherwise
        // clobber `-translate-x/y-1/2` and push the panel off-screen.
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`relative bg-white rounded-2xl shadow-panel border border-surface-200 overflow-hidden ${wide ? "w-[700px]" : "w-[540px]"} max-w-full max-h-[88vh] flex flex-col`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-surface-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-white to-brand-50/40">
              <div className="flex items-center gap-3 min-w-0">
                {icon}
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-surface-900 truncate">{title}</h2>
                  {subtitle && <p className="text-xs text-surface-500 mt-0.5 truncate">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-surface-400" />
              </button>
            </div>
            {/* Body — scrolls independently while header stays pinned */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
