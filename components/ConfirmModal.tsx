"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
 open: boolean;
 title: string;
 message: string;
 confirmLabel?: string;
 cancelLabel?: string;
 variant?: "danger" | "warning" | "success";
 onConfirm: () => void;
 onCancel: () => void;
}

export default function ConfirmModal({
 open,
 title,
 message,
 confirmLabel = "Confirm",
 cancelLabel = "Cancel",
 variant = "danger",
 onConfirm,
 onCancel,
}: ConfirmModalProps) {
 useEffect(() => {
 if (!open) return;
 const handler = (e: KeyboardEvent) => {
 if (e.key === "Escape") onCancel();
 if (e.key === "Enter") onConfirm();
 };
 window.addEventListener("keydown", handler);
 return () => window.removeEventListener("keydown", handler);
 }, [open, onConfirm, onCancel]);

 const colors = {
 danger: { icon: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", btn: "bg-red-500 hover:bg-red-600 text-white" },
 warning: { icon: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", btn: "bg-amber-500 hover:bg-amber-600 text-white" },
 success: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", btn: "bg-emerald-500 hover:bg-emerald-600 text-white" },
 }[variant];

 const icons = {
 danger: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
 </svg>
 ),
 warning: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
 </svg>
 ),
 success: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
 </svg>
 ),
 }[variant];

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.15 }}
 className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
 onClick={onCancel}
 >
 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
 <motion.div
 initial={{ scale: 0.92, opacity: 0, y: 12 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.95, opacity: 0, y: 8 }}
 transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
 className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
 style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
 onClick={(e) => e.stopPropagation()}
 >
 <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors.btn.split(" ")[0]}`} />

 <div className="p-6">
 <div className="flex items-start gap-4 mb-5">
 <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.border} border ${colors.icon}`}>
 {icons}
 </div>
 <div>
 <h3 className="font-display text-lg font-bold text-white mb-1">{title}</h3>
 <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
 </div>
 </div>

 <p className="text-[11px] text-zinc-600 mb-4">Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono text-[10px]">Enter</kbd> to confirm · <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono text-[10px]">Esc</kbd> to cancel</p>

 <div className="flex gap-3">
 <button onClick={onConfirm}
 className={`flex-1 py-2.5 text-sm font-bold transition-all duration-200 ${colors.btn}`} style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
 {confirmLabel}
 </button>
 <button onClick={onCancel}
 className="flex-1 py-2.5 text-sm font-semibold border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
 {cancelLabel}
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
