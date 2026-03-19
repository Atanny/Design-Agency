"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

const PAGES=[{key:"home",label:"Home",path:"/"},{key:"services",label:"Services",path:"/services"},{key:"portfolio",label:"Portfolio",path:"/portfolio"},{key:"blog",label:"Blog",path:"/blog"},{key:"reviews",label:"Reviews",path:"/reviews"},{key:"contact",label:"Contact",path:"/contact"}];
interface SeoRow{id?:string;page:string;meta_title:string;meta_description:string;og_image:string;}

export default function AdminSeo() {
  const [rows, setRows] = useState<Record<string,SeoRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string|null>(null);
  const [confirmPage, setConfirmPage] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      const{data}=await supabase.from("seo_settings").select("*");
      const map:Record<string,SeoRow>={};
      (data||[]).forEach((r:SeoRow)=>{map[r.page]=r;});
      setRows(map);setLoading(false);
    })();
  },[]);

  const update=(page:string,field:keyof SeoRow,value:string)=>setRows(p=>({...p,[page]:{...(p[page]??{page,meta_title:"",meta_description:"",og_image:""}),[field]:value}}));
  const savePage=async(page:string)=>{
    setSaving(page);
    const row=rows[page]||{page,meta_title:"",meta_description:"",og_image:""};
    const{error}=await supabase.from("seo_settings").upsert({...row,page,updated_at:new Date().toISOString()},{onConflict:"page"});
    setSaving(null);
    if(error)toast.error(error.message);else toast.success(`SEO saved for ${PAGES.find(p=>p.key===page)?.label}!`);
  };

  return (
    <div className="p-6 w-full">
      {/* Bento header */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 mb-4 flex flex-col justify-between min-h-[110px]">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
        <div>
          <h1 className="font-display text-3xl font-black text-white leading-none">SEO Settings</h1>
          <p className="text-zinc-500 text-sm mt-1 font-light">Control meta titles, descriptions, and OG images for each page.</p>
        </div>
      </div>

      {loading?(
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-48 rounded-2xl bg-zinc-900 animate-pulse"/>)}</div>
      ):(
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {PAGES.map(page=>{
            const row=rows[page.key]||{page:page.key,meta_title:"",meta_description:"",og_image:""};
            const titleLen=(row.meta_title||"").length;
            const descLen=(row.meta_description||"").length;
            return (
              <div key={page.key} className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{page.label}</h3>
                    <span className="text-xs text-zinc-600 font-mono">{page.path}</span>
                  </div>
                  {row.meta_title&&(
                    <div className="text-right hidden md:block max-w-[180px]">
                      <p className="text-xs text-zinc-600 mb-0.5">Preview</p>
                      <p className="text-blue-400 text-xs font-medium truncate">{row.meta_title}</p>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Meta Title</label>
                    <span className={`text-xs ${titleLen>60?"text-red-400":titleLen>50?"text-amber-400":"text-zinc-600"}`}>{titleLen}/60</span>
                  </div>
                  <input type="text" value={row.meta_title||""} onChange={e=>update(page.key,"meta_title",e.target.value)} placeholder="Page Title | Your Name" maxLength={70}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-colors"/>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Meta Description</label>
                    <span className={`text-xs ${descLen>160?"text-red-400":descLen>140?"text-amber-400":"text-zinc-600"}`}>{descLen}/160</span>
                  </div>
                  <textarea value={row.meta_description||""} onChange={e=>update(page.key,"meta_description",e.target.value)} placeholder="Brief description for search engines..." rows={2} maxLength={170}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 resize-none transition-colors"/>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 font-medium mb-1.5">OG Image URL <span className="text-zinc-600">(1200×630px)</span></label>
                  <input type="url" value={row.og_image||""} onChange={e=>update(page.key,"og_image",e.target.value)} placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-colors"/>
                </div>
                <div className="pt-3 border-t border-zinc-800/50 mt-auto">
                  <button onClick={()=>setConfirmPage(page.key)} disabled={saving===page.key}
                    className="px-5 py-2 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-colors">
                    {saving===page.key?"Saving...":"Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ConfirmModal open={!!confirmPage} title="Save SEO Settings"
        message={`Save SEO metadata for the ${PAGES.find(p=>p.key===confirmPage)?.label||"page"}?`}
        confirmLabel="Yes, Save" variant="warning"
        onConfirm={()=>{if(confirmPage){savePage(confirmPage);setConfirmPage(null);}}}
        onCancel={()=>setConfirmPage(null)}/>
    </div>
  );
}
