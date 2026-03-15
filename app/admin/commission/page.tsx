"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

const DEFAULT_CLOSED_MSG = "Due to high volume of commissions, we are currently unable to accommodate new projects. Please check back soon!";
const DEFAULT_OPEN_MSG = "We are currently open for new commissions! Get in touch and let's create something amazing together.";

export default function AdminCommission() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [closedMessage, setClosedMessage] = useState(DEFAULT_CLOSED_MSG);
  const [openMessage, setOpenMessage] = useState(DEFAULT_OPEN_MSG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState<boolean | null>(null);

  const fetchStatus = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", "commission");

    if (data) {
      const map: Record<string, string> = {};
      data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setIsOpen(map.status === "open" || map.status === undefined ? true : map.status === "open");
      if (map.message) setClosedMessage(map.message);
      if (map.open_message) setOpenMessage(map.open_message);
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
      { section: "commission", key: "status", value: open ? "open" : "closed" },
    ], { onConflict: "section,key" });
    await fetch("/api/revalidate", { method: "POST" });
    setSaving(false);
    toast.success(`Commissions ${open ? "opened" : "closed"} — updated sitewide!`);
  };

  const handleSaveMessages = async () => {
    setSaving(true);
    await supabase.from("site_content").upsert([
      { section: "commission", key: "message", value: closedMessage },
      { section: "commission", key: "open_message", value: openMessage },
    ], { onConflict: "section,key" });
    setSaving(false);
    toast.success("Messages saved!");
  };

  return (
    <div className="p-8 w-full max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Commission Status</h1>
        <p className="text-zinc-500 mt-1">Control whether you're accepting new commissions. Updates instantly sitewide.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 rounded-2xl bg-zinc-800 animate-pulse" />
          <div className="h-48 rounded-2xl bg-zinc-800 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-8 rounded-2xl border transition-all duration-300 ${
            isOpen
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}>
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                  <h2 className={`font-display text-xl font-bold ${isOpen ? "text-emerald-400" : "text-red-400"}`}>
                    {isOpen ? "Open for Commissions" : "Commissions Closed"}
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm">
                  {isOpen
                    ? "Visitors can submit project inquiries normally."
                    : "A banner will show at the top of every page for visitors."
                  }
                </p>
              </div>

              <button
                onClick={() => setConfirmToggle(!isOpen)}
                disabled={saving}
                className={`relative flex-shrink-0 w-16 h-8 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-60 ${
                  isOpen ? "bg-emerald-500" : "bg-zinc-700"
                }`}
                aria-label="Toggle commission status"
              >
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  isOpen ? "left-9" : "left-1"
                }`} />
              </button>
            </div>

            <div className={`mt-5 pt-5 border-t ${isOpen ? "border-emerald-500/20" : "border-red-500/20"}`}>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmToggle(true)}
                  disabled={saving || isOpen === true}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border disabled:opacity-40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:cursor-not-allowed"
                >
                  ✓ Open Commissions
                </button>
                <button
                  onClick={() => setConfirmToggle(false)}
                  disabled={saving || isOpen === false}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border disabled:opacity-40 border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed"
                >
                  ✕ Close Commissions
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <h3 className="text-white font-semibold mb-5">Banner Messages</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Closed Banner Message
                </label>
                <p className="text-xs text-zinc-600 mb-2">Shown at the top of the site when commissions are closed.</p>
                <textarea
                  value={closedMessage}
                  onChange={(e) => setClosedMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-600 mb-4">Preview of closed banner:</p>
              <div className="rounded-xl overflow-hidden border border-zinc-700">
                <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <p className="text-zinc-300 text-xs truncate">
                      <span className="font-bold text-white mr-1.5">Commissions Closed.</span>
                      {closedMessage}
                    </p>
                  </div>
                  <span className="text-zinc-600 text-xs flex-shrink-0">✕</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveMessages}
              disabled={saving}
              className="mt-5 px-6 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Message"}
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
