"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface CommissionStatus {
  open: boolean;
  message: string;
}

const DEFAULT_CLOSED_MSG = "Due to high volume of commissions, we are currently unable to accommodate new projects. Please check back soon!";

export default function CommissionBanner() {
  const [status, setStatus] = useState<CommissionStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const fetchStatus = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", "commission");

    if (!data || data.length === 0) return;
    const map: Record<string, string> = {};
    data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });

    const open = map.status === "open";
    const message = map.message || DEFAULT_CLOSED_MSG;
    setStatus({ open, message });
    setDismissed(false);
  };

  useEffect(() => {
    fetchStatus();

    const channel = supabase
      .channel("commission-watch")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "site_content",
        filter: "section=eq.commission",
      }, fetchStatus)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (status === null) return null;
  if (status.open) return null;
  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[70] overflow-hidden"
      >
        <div className="bg-[#0a0a0a] border-b border-red-500/20 px-4 py-2">
          <div className="relative max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-zinc-300 text-xs text-center leading-relaxed">
                <span className="font-bold text-white mr-1.5">Commissions Closed.</span>
                {status.message}
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-0 text-zinc-600 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
