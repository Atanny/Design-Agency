"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

const ACCENT_OPTIONS = [
  { label:"Blue",    value:"text-blue-400",    bg:"bg-blue-500/10" },
  { label:"Coral",   value:"text-coral-400",   bg:"bg-coral-400/10" },
  { label:"Rose",    value:"text-rose-400",    bg:"bg-rose-500/10" },
  { label:"Emerald", value:"text-emerald-400", bg:"bg-emerald-500/10" },
  { label:"Violet",  value:"text-violet-400",  bg:"bg-violet-500/10" },
  { label:"Cyan",    value:"text-cyan-400",    bg:"bg-cyan-500/10" },
  { label:"Amber",   value:"text-amber-400",   bg:"bg-amber-500/10" },
];

const ICON_OPTIONS = [
  { label:"Monitor",   value:"monitor",   path:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label:"Palette",   value:"palette",   path:"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { label:"Image",     value:"image",     path:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label:"Globe",     value:"globe",     path:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" },
  { label:"Chat",      value:"chat",      path:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { label:"Phone",     value:"phone",     path:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { label:"Star",      value:"star",      path:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { label:"Lightning", value:"lightning", path:"M13 10V3L4 14h7v7l9-11h-7z" },
];

interface Service {
  id: string; title: string; subtitle: string; description: string;
  features: string; icon: string; accent: string; bg_color: string;
  sort_order: number; active: boolean;
}

const EMPTY: Omit<Service,"id"|"sort_order"> = {
  title:"", subtitle:"", description:"", features:"",
  icon:"monitor", accent:"text-blue-400", bg_color:"bg-blue-500/10", active:true,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null);

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("sort_order",{ascending:true});
    setServices(data||[]);
    setLoading(false);
  };
  useEffect(()=>{ fetchServices(); },[]);

  const handleDragStart = (idx:number) => setDragIndex(idx);
  const handleDragOver  = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = async (dropIdx:number) => {
    if (dragIndex===null||dragIndex===dropIdx) { setDragIndex(null); setDragOver(null); return; }
    const reordered = [...services];
    const [moved] = reordered.splice(dragIndex,1);
    reordered.splice(dropIdx,0,moved);
    const updated = reordered.map((s,i)=>({...s,sort_order:i}));
    setServices(updated); setDragIndex(null); setDragOver(null);
    await Promise.all(updated.map(s=>supabase.from("services").update({sort_order:s.sort_order}).eq("id",s.id)));
    toast.success("Order saved!");
  };

  const openNew  = () => { setEditing({...EMPTY,id:"",sort_order:services.length} as Service); setIsNew(true); };
  const openEdit = (s:Service) => { setEditing({...s}); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    const payload = { title:editing.title, subtitle:editing.subtitle, description:editing.description,
      features:editing.features, icon:editing.icon, accent:editing.accent, bg_color:editing.bg_color,
      active:editing.active };
    if (isNew) {
      const { error } = await supabase.from("services").insert([{...payload,sort_order:services.length}]);
      if (error) { toast.error(error.message); } else { toast.success("Service added!"); setEditing(null); fetchServices(); }
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id",editing.id);
      if (error) { toast.error(error.message); } else { toast.success("Service updated!"); setEditing(null); fetchServices(); }
    }
    await fetch("/api/revalidate",{method:"POST"});
    setSaving(false);
  };

  const handleDelete = async (id:string) => {
    await supabase.from("services").delete().eq("id",id);
    await fetch("/api/revalidate",{method:"POST"});
    toast.success("Deleted."); fetchServices();
  };

  const toggleActive = async (s:Service) => {
    await supabase.from("services").update({active:!s.active}).eq("id",s.id);
    await fetch("/api/revalidate",{method:"POST"});
    fetchServices();
  };

  const iconPath = (v:string) => ICON_OPTIONS.find(i=>i.value===v)?.path||ICON_OPTIONS[0].path;

  return (
    <div className="p-6 w-full">

      {/* Bento header */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
          <div>
            <h1 className="font-display text-3xl font-black text-white leading-none">Services</h1>
            <p className="text-zinc-500 text-sm mt-1 font-light">Manage your services. Drag to reorder.</p>
          </div>
        </div>
        <div className="sm:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-5 flex items-center justify-center">
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Service
          </button>
        </div>
      </div>

      {/* Service list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_,i)=><div key={i} className="h-48 rounded-2xl bg-zinc-900 animate-pulse"/>)}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-16 text-center">
          <p className="text-zinc-500 text-lg mb-4">No services yet.</p>
          <button onClick={openNew} className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">+ Add your first service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s,idx)=>(
            <div key={s.id}
              draggable
              onDragStart={()=>handleDragStart(idx)}
              onDragOver={e=>handleDragOver(e,idx)}
              onDrop={()=>handleDrop(idx)}
              onDragEnd={()=>{setDragIndex(null);setDragOver(null);}}
              className={`relative group rounded-2xl border p-6 cursor-grab active:cursor-grabbing transition-all ${
                dragOver===idx ? "border-coral-400/50 scale-[1.01]" :
                s.active ? "bg-zinc-900 border-zinc-800/50 hover:border-zinc-700" :
                "bg-zinc-900/40 border-zinc-800/30 opacity-60"
              }`}>

              {/* Drag handle */}
              <div className="absolute top-3 right-3 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>
                </svg>
              </div>

              {/* Icon */}
              <div className={`inline-flex p-2.5 rounded-xl mb-4 ${s.bg_color} ${s.accent}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath(s.icon)}/>
                </svg>
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-1">{s.title}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{s.description}</p>

              <div className="flex items-center gap-2">
                <button onClick={()=>openEdit(s)}
                  className="flex-1 py-2 rounded-lg border border-zinc-800/60 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-colors">
                  Edit
                </button>
                <button onClick={()=>toggleActive(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    s.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                             : "bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/60"
                  }`}>
                  {s.active ? "Active" : "Hidden"}
                </button>
                <button onClick={()=>setConfirmDelete(s.id)}
                  className="p-2 rounded-lg border border-zinc-800/60 text-zinc-600 hover:text-red-400 hover:border-red-400/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/40">
              <h2 className="font-display text-xl font-bold text-white">{isNew ? "Add Service" : "Edit Service"}</h2>
              <button onClick={()=>setEditing(null)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Service Title *</label>
                <input type="text" value={editing.title} placeholder="e.g. UI/UX Design"
                  onChange={e=>setEditing({...editing,title:e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-coral-400/50 transition-colors"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Subtitle</label>
                <input type="text" value={editing.subtitle||""} placeholder="e.g. Intuitive. Beautiful. Effective."
                  onChange={e=>setEditing({...editing,subtitle:e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-coral-400/50 transition-colors"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Short Description</label>
                <textarea value={editing.description} placeholder="Brief description of the service..." rows={3}
                  onChange={e=>setEditing({...editing,description:e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-coral-400/50 resize-none transition-colors"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Features (one per line)</label>
                <textarea value={editing.features} placeholder={"Logo Design\nColor & Typography\nBrand Guidelines"} rows={5}
                  onChange={e=>setEditing({...editing,features:e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-coral-400/50 resize-none font-mono transition-colors"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map(ico=>(
                    <button key={ico.value} type="button" onClick={()=>setEditing({...editing,icon:ico.value})}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        editing.icon===ico.value ? "border-coral-400 bg-coral-400/10 text-coral-400" : "border-zinc-800/60 text-zinc-500 hover:border-zinc-600"
                      }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ico.path}/>
                      </svg>
                      <span className="text-xs">{ico.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_OPTIONS.map(acc=>(
                    <button key={acc.value} type="button" onClick={()=>setEditing({...editing,accent:acc.value,bg_color:acc.bg})}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${acc.bg} ${acc.value} ${
                        editing.accent===acc.value ? "border-white/30 ring-1 ring-white/20" : "border-transparent opacity-60 hover:opacity-100"
                      }`}>
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={()=>setEditing({...editing,active:!editing.active})}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.active?"bg-amber-500":"bg-zinc-700"}`}>
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${editing.active?"translate-x-5":""}`}/>
                </button>
                <span className="text-sm text-zinc-400">Visible on site</span>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-zinc-800/40">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : isNew ? "Add Service" : "Save Changes"}
              </button>
              <button onClick={()=>setEditing(null)}
                className="px-6 py-3 rounded-xl border border-zinc-800/60 text-zinc-500 text-sm font-semibold hover:text-white hover:border-zinc-600 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Service"
        message="This will remove the service from all pages. This cannot be undone."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={()=>{ if(confirmDelete){handleDelete(confirmDelete);setConfirmDelete(null);} }}
        onCancel={()=>setConfirmDelete(null)}
      />
    </div>
  );
}
