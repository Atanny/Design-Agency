"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

const DEFAULT_CLOSED_MSG = "Due to high volume of commissions, we are currently unable to accommodate new projects. Please check back soon!";

export default function AdminCommission() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [closedMessage, setClosedMessage] = useState(DEFAULT_CLOSED_MSG);
  const [businessHours, setBusinessHours] = useState("Mon – Fri, 9AM – 6PM PHT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState<boolean | null>(null);

  const fetchStatus = async () => {
    const { data } = await supabase.from("site_content").select("key,value").eq("section","commission");
    if (data) {
      const map: Record<string,string> = {};
      data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setIsOpen(map.status !== "closed");
      if (map.message) setClosedMessage(map.message);
      if (map.business_hours) setBusinessHours(map.business_hours);
    } else {
      setIsOpen(true);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleToggle = async (open: boolean) => {
    setSaving(true);
    setIsOpen(open);
    await supabase.from("site_content").upsert([
      { section:"commission", key:"status", value: open ? "open" : "closed" },
    ], { onConflict:"section,key" });
    await fetch("/api/revalidate", { method:"POST" });
    setSaving(false);
    toast.success(`Commissions ${open ? "opened" : "closed"} — updated sitewide!`);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("site_content").upsert([
      { section:"commission", key:"message",        value: closedMessage },
      { section:"commission", key:"business_hours", value: businessHours },
    ], { onConflict:"section,key" });
    await fetch("/api/revalidate", { method:"POST" });
    setSaving(false);
    toast.success("Saved! Changes applied sitewide.");
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-600">Admin</span>
        </div>
        <h1 className="font-display text-4xl font-black text-white tracking-tight leading-none">Commission Status</h1>
        <p className="text-zinc-600 text-sm mt-2">Control availability and business hours. Updates instantly sitewide including the hero section.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-48 bg-zinc-800/60 animate-pulse" />
          <div className="h-48 bg-zinc-800/60 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className={`p-8 border transition-all duration-300 card-grain ${
            isOpen ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
          }`} style={{ clipPath:"polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}>

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                  <h2 className={`font-display text-2xl font-black tracking-tight ${isOpen ? "text-emerald-400" : "text-red-400"}`}>
                    {isOpen ? "Open for Commissions" : "Commissions Closed"}
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm">
                  {isOpen ? "Visitors can submit project inquiries normally." : "A banner shows at the top of every page for visitors."}
                </p>
              </div>

              <button onClick={() => setConfirmToggle(!isOpen)} disabled={saving}
                className={`relative flex-shrink-0 w-14 h-7 transition-all duration-300 focus:outline-none disabled:opacity-60 ${
                  isOpen ? "bg-emerald-500" : "bg-zinc-700"
                }`}
                style={{ clipPath:"polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                aria-label="Toggle commission status"
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white transition-all duration-300 ${isOpen ? "left-7" : "left-0.5"}`}
                  style={{ clipPath:"polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }} />
              </button>
            </div>

            <div className={`pt-6 border-t ${isOpen ? "border-emerald-500/20" : "border-red-500/20"}`}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-3">Hero Badge Preview</p>
              <div className="flex items-center gap-2 px-3 py-2 border border-zinc-800/60 bg-[#0c0c0c] w-fit">
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                  {isOpen ? "Available for Commission" : "Commissions Closed"}
                </span>
              </div>
              <p className="text-xs text-zinc-700 mt-2">This status badge appears in the hero section of your landing page.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 border border-zinc-800/60 bg-[#0c0c0c] card-grain"
              style={{ clipPath:"polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Business Hours</label>
              <p className="text-xs text-zinc-600 mb-3">Shown in the hero section. Edit to match your working schedule.</p>
              <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Mon – Fri, 9AM – 6PM PHT"
                className="w-full px-4 py-3 border border-zinc-800/60 bg-zinc-900 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-gold-500/50 transition-colors" />
            </div>

            <div className="p-6 border border-zinc-800/60 bg-[#0c0c0c] card-grain"
              style={{ clipPath:"polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Closed Banner Message</label>
              <p className="text-xs text-zinc-600 mb-3">Shown at the top of every page when commissions are closed.</p>
              <textarea value={closedMessage} onChange={(e) => setClosedMessage(e.target.value)} rows={3}
                className="w-full px-4 py-3 border border-zinc-800/60 bg-zinc-900 text-white text-sm focus:outline-none focus:border-gold-500/50 resize-none transition-colors" />

              <div className="mt-4 pt-4 border-t border-zinc-800/40">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-2">Banner Preview</p>
                <div className="border border-zinc-800/60 overflow-hidden">
                  <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <p className="text-zinc-300 text-xs truncate">
                        <span className="font-bold text-white mr-1.5">Commissions Closed.</span>
                        {closedMessage}
                      </p>
                    </div>
                    <span className="text-zinc-600 text-xs flex-shrink-0">✕</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 bg-gold-500 text-white text-sm font-black tracking-wide hover:bg-gold-600 disabled:opacity-50 transition-all"
              style={{ clipPath:"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmToggle !== null}
        title={confirmToggle ? "Open Commissions" : "Close Commissions"}
        message={confirmToggle
          ? "Commissions will be marked as open. The closed banner will be hidden from all visitors."
          : "Commissions will be closed. A banner will appear sitewide notifying visitors."}
        confirmLabel={confirmToggle ? "Yes, Open" : "Yes, Close"}
        variant={confirmToggle ? "success" : "warning"}
        onConfirm={() => { if (confirmToggle !== null) { handleToggle(confirmToggle); setConfirmToggle(null); } }}
        onCancel={() => setConfirmToggle(null)}
      />
    </div>
  );
}
