"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessToastProps {
  message: string;
  detail?: string;
}

export default function SuccessToast({ message, detail }: SuccessToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className="fixed top-6 left-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-600 text-white shadow-lg"
    >
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <div>
        <div className="text-sm font-semibold">{message}</div>
        {detail && <div className="text-xs text-emerald-100 mt-0.5">{detail}</div>}
      </div>
    </motion.div>
  );
}
