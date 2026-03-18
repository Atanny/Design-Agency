"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger"|"warning"|"success";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel="Confirm", cancelLabel="Cancel", variant="danger", onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") onCancel(); if (e.key==="Enter") onConfirm(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onConfirm, onCancel]);

  const btn = variant==="danger" ? "bg-red-500 hover:bg-red-600 text-white" : variant==="success" ? "bg-green-500 hover:bg-green-600 text-white" : "gradient-primary text-white";
  const icon = variant==="danger" ? "🗑️" : variant==="success" ? "✅" : "⚠️";

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onCancel}>
          <div className="absolute inset-0 bg-espresso-800/60 backdrop-blur-sm"/>
          <motion.div initial={{scale:0.9,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0}}
            transition={{duration:0.2,ease:[0.16,1,0.3,1]}}
            className="relative w-full max-w-sm bg-white dark:bg-espresso-700 rounded-3xl shadow-2xl overflow-hidden"
            onClick={e=>e.stopPropagation()}>
            <div className="h-1.5 gradient-primary w-full"/>
            <div className="p-6">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-display text-xl font-bold text-espresso-800 dark:text-sand-50 mb-2">{title}</h3>
              <p className="text-espresso-600 dark:text-sand-300 text-sm leading-relaxed mb-1">{message}</p>
              <p className="text-[11px] text-sand-400 mb-5">Press <kbd className="px-1.5 py-0.5 rounded-xl bg-sand-100 text-sand-600 font-mono text-[10px]">Enter</kbd> to confirm</p>
              <div className="flex gap-3">
                <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${btn}`}>{confirmLabel}</button>
                <button onClick={onCancel} className="flex-1 py-2.5 rounded-full text-sm font-semibold border-2 border-sand-200 dark:border-espresso-600 text-espresso-700 dark:text-sand-300 hover:border-coral-300 transition-all">{cancelLabel}</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
