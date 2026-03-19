"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminCommission() {
  const [isOpen, setIsOpen] = useState<boolean|null>(null);
  const [closedMessage, setClosedMessage] = useState("Commissions are currently closed. Please check back soon!");
  const [businessHours, setBusinessHours] = useState("Mon – Fri, 9AM – 6PM PHT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState<boolean|null>(null);

  useEffect(()=>{
    supabase.from("site_content").select("key,value").eq("section","commission").then(({data})=>{
      if(data){const m:Record<string,string>={};data.forEach((r:{key:string;value:string})=>{m[r.key]=r.value;});setIsOpen(m.status!=="closed");if(m.message)setClosedMessage(m.message);if(m.business_hours)setBusinessHours(m.business_hours);}else{setIsOpen(true);}
      setLoading(false);
    });
  },[]);

  const handleToggle = async (open:boolean) => {
    setSaving(true);setIsOpen(open);
    await supabase.from("site_content").upsert([{section:"commission",key:"status",value:open?"open":"closed"}],{onConflict:"section,key"});
    await fetch("/api/revalidate",{method:"POST"});
    setSaving(false);toast.success(`Commissions ${open?"opened":"closed"} — updated sitewide!`);
  };
  const handleSave = async () => {
    setSaving(true);
    await supabase.from("site_content").upsert([{section:"commission",key:"message",value:closedMessage},{section:"commission",key:"business_hours",value:businessHours}],{onConflict:"section,key"});
    await fetch("/api/revalidate",{method:"POST"});
    setSaving(false);toast.success("Saved! Changes applied sitewide.");
  };

  return (
    <div className="p-6 w-full">
      {/* Bento header */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
          <div>
            <h1 className="font-display text-3xl font-black text-white leading-none">Commission</h1>
            <p className="text-zinc-500 text-sm mt-1 font-light">Manage your availability and project status sitewide.</p>
          </div>
        </div>
        <div className={`sm:col-span-4 rounded-2xl border p-6 flex flex-col justify-between min-h-[110px] ${isOpen?"bg-emerald-500/8 border-emerald-500/20":"bg-red-500/8 border-red-500/20"}`}>
          {isOpen!==null&&<div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${isOpen?"bg-emerald-400 animate-pulse":"bg-red-500"}`}/><span className={`text-[10px] font-semibold uppercase tracking-widest ${isOpen?"text-emerald-400":"text-red-400"}`}>{isOpen?"Open for Work":"Closed"}</span></div>}
          <p className={`text-sm font-medium ${isOpen?"text-emerald-300":"text-red-300"}`}>{isOpen?"Accepting new projects":"Not accepting projects"}</p>
        </div>
      </div>

      {loading?(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{[...Array(2)].map((_,i)=><div key={i} className="h-48 rounded-2xl bg-zinc-900 animate-pulse"/>)}</div>
      ):(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Status toggle tile */}
          <div className={`rounded-2xl border p-7 flex flex-col justify-between min-h-[260px] transition-all ${isOpen?"bg-emerald-500/5 border-emerald-500/20":"bg-red-500/5 border-red-500/20"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpen?"bg-emerald-400 animate-pulse":"bg-red-500"}`}/>
                  <h2 className={`font-display text-2xl font-black ${isOpen?"text-emerald-400":"text-red-400"}`}>{isOpen?"Open for Commissions":"Commissions Closed"}</h2>
                </div>
                <p className="text-zinc-500 text-sm">{isOpen?"Visitors can submit project inquiries normally.":"A banner shows at the top of every page."}</p>
              </div>
              {/* Rounded toggle */}
              <button onClick={()=>setConfirmToggle(!isOpen)} disabled={saving}
                className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-60 ${isOpen?"bg-emerald-500":"bg-zinc-700"}`}>
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${isOpen?"left-7":"left-0.5"}`}/>
              </button>
            </div>
            <div className={`pt-5 border-t ${isOpen?"border-emerald-500/20":"border-red-500/20"}`}>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600 mb-3">Hero Badge Preview</p>
              <div className="rounded-xl flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800/50 w-fit">
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen?"bg-emerald-400 animate-pulse":"bg-red-500"}`}/>
                <span className="text-[11px] font-semibold tracking-wide text-zinc-400">{isOpen?"Available for projects":"Currently unavailable"}</span>
              </div>
            </div>
          </div>

          {/* Settings tiles */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1.5">Business Hours</label>
              <p className="text-xs text-zinc-600 mb-3">Shown in the hero section.</p>
              <input type="text" value={businessHours} onChange={e=>setBusinessHours(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-colors"/>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1.5">Closed Banner Message</label>
              <p className="text-xs text-zinc-600 mb-3">Shown at the top of every page when closed.</p>
              <textarea value={closedMessage} onChange={e=>setClosedMessage(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-coral-400/50 resize-none transition-colors"/>
              <div className="mt-4 pt-4 border-t border-zinc-800/40">
                <p className="text-[10px] font-semibold uppercase text-zinc-700 mb-2">Banner Preview</p>
                <div className="rounded-xl bg-zinc-800 px-4 py-2.5 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>
                  <p className="text-zinc-300 text-xs truncate"><span className="font-bold text-white mr-1.5">Commissions Closed.</span>{closedMessage}</p>
                </div>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full py-3.5 gradient-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all">
              {saving?"Saving...":"Save Changes"}
            </button>
          </div>
        </div>
      )}
      <ConfirmModal open={confirmToggle!==null} title={confirmToggle?"Open Commissions":"Close Commissions"}
        message={confirmToggle?"Commissions will be marked as open.":"Commissions will be closed. A banner will appear sitewide."}
        confirmLabel={confirmToggle?"Yes, Open":"Yes, Close"} variant={confirmToggle?"success":"warning"}
        onConfirm={()=>{if(confirmToggle!==null){handleToggle(confirmToggle);setConfirmToggle(null);}}}
        onCancel={()=>setConfirmToggle(null)}/>
    </div>
  );
}
