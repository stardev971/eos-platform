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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-panel border border-surface-200 overflow-hidden ${wide ? "w-[700px] max-w-[95vw]" : "w-[540px] max-w-[95vw]"} max-h-[85vh] flex flex-col`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-surface-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <h2 className="text-lg font-bold text-surface-900">{title}</h2>
                  {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <X className="w-5 h-5 text-surface-400" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
