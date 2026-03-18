"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

const DEFAULT_MSG = "Due to high volume of commissions, we are currently unable to accommodate new projects. Please check back soon!";

export default function CommissionBanner() {
  const [status, setStatus] = useState<{ open:boolean; message:string }|null>(null);
  const [dismissed, setDismissed] = useState(false);

  const fetchStatus = async () => {
    const { data } = await supabase.from("site_content").select("key,value").eq("section","commission");
    if (!data || data.length === 0) return;
    const map: Record<string,string> = {};
    data.forEach((r:{key:string;value:string}) => { map[r.key]=r.value; });
    setStatus({ open: map.status !== "closed", message: map.message || DEFAULT_MSG });
  };

  useEffect(() => {
    fetchStatus();
    const ch = supabase.channel("banner-watch")
      .on("postgres_changes",{event:"*",schema:"public",table:"site_content",filter:"section=eq.commission"},
        () => { setDismissed(false); fetchStatus(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (!status || status.open || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ height:0 }} animate={{ height:"auto" }} exit={{ height:0 }}
        transition={{ duration:0.3 }} className="sticky top-0 z-[60] overflow-hidden">
        <div className="bg-espresso-800 border-b border-coral-400/30 px-4 py-2">
          <div className="relative max-w-6xl mx-auto flex items-center justify-center min-h-[22px]">
            <div className="flex items-center gap-2 px-8 text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-pulse flex-shrink-0"/>
              <p className="text-sand-200 text-xs">
                <span className="font-bold text-white mr-1.5">Commissions Closed.</span>
                {status.message}
              </p>
            </div>
            <button onClick={() => setDismissed(true)}
              className="absolute right-0 text-sand-500 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
