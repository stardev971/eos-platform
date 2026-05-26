"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface InfoPopoverProps {
  title: string;
  children: ReactNode;
}

export default function InfoPopover({ title, children }: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const popWidth = 320;
    const popHeight = 240; // estimated max

    // Position below the button by default
    let top = rect.bottom + 6;
    let left = rect.right - popWidth;

    // If it would go off the left edge, align to button left instead
    if (left < 8) {
      left = rect.left;
    }

    // If it would go off the right edge
    if (left + popWidth > window.innerWidth - 8) {
      left = window.innerWidth - popWidth - 8;
    }

    // If not enough room below, show above
    if (top + popHeight > window.innerHeight - 8) {
      top = rect.top - popHeight - 6;
    }

    // Ensure it doesn't go above viewport
    if (top < 8) {
      top = 8;
    }

    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        popRef.current && !popRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded-md hover:bg-surface-100 transition-colors group relative z-10"
        title="View data sources"
      >
        <Info className="w-3.5 h-3.5 text-surface-400 group-hover:text-brand-600 transition-colors" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              style={{ top: pos.top, left: pos.left }}
              className="fixed w-80 bg-white rounded-xl shadow-panel border border-surface-200 z-[9999] p-4"
            >
              <div className="text-xs font-semibold text-surface-900 mb-2">{title}</div>
              <div className="text-xs text-surface-600 leading-relaxed space-y-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
