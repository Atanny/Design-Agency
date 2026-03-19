"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import { DEFAULTS } from "@/lib/content";

const SECTIONS = [
 { key: "navbar", label: "Navigation & Logo" },
 { key: "hero", label: "Hero Section" },
 { key: "services_section", label: "Services Section" },
 { key: "portfolio_section", label: "Portfolio Section" },
 { key: "process_section", label: "How We Work" },
 { key: "why_us_section", label: "Why Us Section" },
 { key: "testimonials_section", label: "Testimonials Section" },
 { key: "cta_section", label: "CTA Section" },
 { key: "contact_section", label: "Contact (Homepage)" },
 { key: "contact_page", label: "Contact Page" },
 { key: "reviews_section", label: "Reviews Page" },
 { key: "offer_card", label: "Offer Card (Services)" },
 { key: "footer", label: "Footer" },
 { key: "services_page", label: "Services Page" },
];

const LABELS: Record<string, Record<string, string>> = {
 navbar: {
 logo_name: "Logo Name",
 logo_image: "Logo Image (upload below)",
 cta_button: "CTA Button Text",
 social_facebook: "Facebook URL",
 social_instagram: "Instagram URL",
 social_tiktok: "TikTok URL",
 social_behance: "Behance URL",
 },
 hero: {
 badge: "Badge Text",
 headline_line1: "Headline Line 1",
 headline_accent: "Headline Accent Word",
 headline_line2: "Headline Line 2",
 headline_line3: "Headline Line 3",
 subheadline: "Subheadline",
 cta_button: "CTA Button",
 stat1_value: "Projects Count Override (leave blank to use live portfolio count)",
 stat1_label: "Stat 1 Label",
 stat2_label: "Stat 2 Label (Client Satisfaction — auto from reviews)",
 stat3_label: "Stat 3 Label (Average Rating — auto from reviews)",
 bg_image: "Hero Background Image (optional — shown behind headline tile)",
 },
 services_section: { badge: "Badge", headline: "Headline", subtext: "Subtext" },
 portfolio_section: { badge: "Badge", headline: "Headline", view_all: "View All Button", bg_image: "Page Header Background Image" },
 process_section: {
 badge: "Section Badge",
 headline_line1: "Headline Line 1",
 headline_line2: "Headline Line 2 (italic)",
 headline_line3: "Headline Line 3",
 subtext: "Subtext",
 step1_num: "Step 1 Number",
 step1_title: "Step 1 Title",
 step1_desc: "Step 1 Description",
 step2_num: "Step 2 Number",
 step2_title: "Step 2 Title",
 step2_desc: "Step 2 Description",
 step3_num: "Step 3 Number",
 step3_title: "Step 3 Title",
 step3_desc: "Step 3 Description",
 bg_image: "Section Background Image (shown in the visual tile)",
 },
 why_us_section: {
 badge: "Section Badge",
 headline: "Headline",
 headline_italic: "Headline Italic Part",
 card1_title: "Card 1 Title",
 card1_desc: "Card 1 Description",
 card2_title: "Card 2 Title",
 card2_desc: "Card 2 Description",
 card3_title: "Card 3 Title",
 card3_desc: "Card 3 Description",
 bg_image: "Section Header Background Image",
 },
 testimonials_section: { badge: "Badge", headline: "Headline" },
 cta_section: { badge: "Badge", headline: "Headline", subtext: "Subtext", button_text: "Button Text", bg_image: "CTA Section Background Image" },
 contact_section: { badge: "Badge", headline: "Headline", subtext: "Subtext" },
 contact_page: {
 badge: "Badge", headline: "Page Headline", subtext: "Page Subtext",
 email: "Contact Email", location: "Location", response: "Response Time",
 discovery_title: "Discovery Box Title", discovery_text: "Discovery Box Text",
 bg_image: "Page Header Background Image",
 },
 reviews_section: {
 badge: "Section Badge",
 headline: "Page Headline",
 subtext: "Subtext",
 cta_title: "Leave Review Title",
 cta_text: "Leave Review Subtext",
 },
 offer_card: {
 title: "Card Title",
 description: "Card Description",
 item1: "Bullet Point 1",
 item2: "Bullet Point 2",
 item3: "Bullet Point 3",
 item4: "Bullet Point 4",
 button_text: "Button Text",
 },
 footer: { tagline: "Tagline", copyright_suffix: "Copyright Suffix", made_in: "Made In Location" },
 services_page: { badge: "Page Badge", headline: "Page Headline", subtext: "Page Subtext", bg_image: "Page Header Background Image" },
};

const TEXTAREA_KEYS = ["subheadline", "subtext", "tagline", "discovery_text", "step1_desc", "step2_desc", "step3_desc", "card1_desc", "card2_desc", "card3_desc"];
const IMAGE_KEYS = ["logo_image", "bg_image"];
const URL_KEYS = ["social_facebook", "social_instagram", "social_tiktok", "social_behance"];

export default function AdminContent() {
 const [activeSection, setActiveSection] = useState("navbar");
 const [data, setData] = useState<Record<string, string>>({});
 const [original, setOriginal] = useState<Record<string, string>>({});
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [confirmSave, setConfirmSave] = useState(false);

 const fetchSection = async (section: string) => {
 setLoading(true);
 const { data: rows } = await supabase
 .from("site_content")
 .select("key, value")
 .eq("section", section);

 const defaults = DEFAULTS[section] || {};
 const fromDb: Record<string, string> = {};
 (rows || []).forEach((r: { key: string; value: string }) => { fromDb[r.key] = r.value; });
 const merged = { ...defaults, ...fromDb };
 setData(merged);
 setOriginal(merged);
 setLoading(false);
 };

 useEffect(() => { fetchSection(activeSection); }, [activeSection]);

 const handleImageUpload = async (file: File, key: string) => {
 if (!file) return;
 setUploading(true);
 try {
 const ext = file.name.split(".").pop();
 const folder = key === "logo_image" ? "logos" : "section-backgrounds";
 const path = `${folder}/${key}_${Date.now()}.${ext}`;
 const { error: uploadError } = await supabase.storage
 .from("site-assets")
 .upload(path, file, { upsert: true });
 if (uploadError) throw uploadError;
 const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
 const url = urlData.publicUrl;
 setData((d) => ({ ...d, [key]: url }));
 toast.success("Image uploaded! Click Save Changes to apply.");
 } catch (err) {
 toast.error("Upload failed. Make sure you have a 'site-assets' bucket in Supabase.");
 console.error(err);
 }
 setUploading(false);
 };

 const handleSave = async () => {
 setSaving(true);
 const changed = Object.entries(data)
 .filter(([k, v]) => v !== original[k])
 .map(([key, value]) => ({ section: activeSection, key, value }));

 if (changed.length === 0) {
 toast("No changes to save.");
 setSaving(false);
 return;
 }

 const res = await fetch("/api/content", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ updates: changed }),
 });

 setSaving(false);
 if (res.ok) {
 setOriginal({ ...data });
 toast.success(`${changed.length} field${changed.length > 1 ? "s" : ""} saved! Pages updated.`);
 } else {
 toast.error("Failed to save. Please try again.");
 }
 };

 const keys = Object.keys(DEFAULTS[activeSection] || {});
 const labels = LABELS[activeSection] || {};
 const hasChanges = JSON.stringify(data) !== JSON.stringify(original);

  const IMAGE_KEYS = ["logo_image","bg_image"];
  const URL_KEYS   = ["social_facebook","social_instagram","social_tiktok","social_behance","email"];
  const TEXTAREA_KEYS = ["subtext","description","subheadline","step1_desc","step2_desc","step3_desc","cta_text","discovery_text"];

  return (
    <div className="p-6 w-full">

      {/* Bento header */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 mb-4 flex flex-col justify-between min-h-[110px]">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
        <div>
          <h1 className="font-display text-3xl font-black text-white leading-none">Content</h1>
          <p className="text-zinc-500 text-sm mt-1 font-light">Edit site-wide copy and section content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

        {/* Section sidebar */}
        <div className="lg:col-span-3 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-3 flex flex-col gap-1 h-fit lg:sticky lg:top-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600 px-3 pt-2 pb-1.5">Sections</p>
          {SECTIONS.map(s=>(
            <button key={s.key} onClick={()=>setActiveSection(s.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection===s.key?"gradient-primary text-white":"text-zinc-500 hover:text-white hover:bg-zinc-800/50"
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Fields panel */}
        <div className="lg:col-span-9 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">
              {SECTIONS.find(s=>s.key===activeSection)?.label}
            </h2>
            {hasChanges&&(
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">Unsaved changes</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">{[...Array(5)].map((_,i)=><div key={i} className="h-12 rounded-xl bg-zinc-800 animate-pulse"/>)}</div>
          ) : (
            <div className="space-y-5">
              {keys.map(key=>{
                const isImage    = IMAGE_KEYS.includes(key);
                const isUrl      = URL_KEYS.includes(key);
                const isBg       = key==="bg_image";
                const isTextarea = !isImage&&!isUrl&&(TEXTAREA_KEYS.some(t=>key.includes(t))||(data[key]||"").length>80);
                const uploadId   = `upload-${activeSection}-${key}`;

                if (isImage) return (
                  <div key={key}>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-2">
                      {labels[key]||key.replace(/_/g," ")}
                    </label>
                    <div className="flex items-start gap-4">
                      {data[key] ? (
                        <div className="relative flex-shrink-0">
                          <img src={data[key]} alt="Preview"
                            className={isBg?"w-36 h-20 object-cover rounded-xl border border-zinc-800/50":"w-16 h-16 object-contain rounded-xl border border-zinc-800/50 bg-zinc-800 p-2"}/>
                          <button onClick={()=>setData(d=>({...d,[key]:""}))}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
                        </div>
                      ) : (
                        <div className={`${isBg?"w-36 h-20":"w-16 h-16"} rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 flex-shrink-0`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <input ref={key==="logo_image"?fileInputRef:undefined} id={uploadId} type="file" accept="image/*" className="hidden"
                          onChange={e=>e.target.files?.[0]&&handleImageUpload(e.target.files[0],key)}/>
                        <label htmlFor={uploadId} className="inline-block px-4 py-2 rounded-xl bg-zinc-700 text-white text-sm hover:bg-zinc-600 cursor-pointer transition-colors">
                          {uploading?"Uploading...":data[key]?`Change ${isBg?"Image":"Logo"}`:`Upload ${isBg?"Background":"Logo"}`}
                        </label>
                        {isBg&&<p className="text-xs text-zinc-600 mt-1">Recommended: 1920×1080px. Shown with an overlay.</p>}
                        {!isBg&&<p className="text-xs text-zinc-600 mt-1">PNG, JPG, SVG · 64×64px recommended</p>}
                        <p className="text-xs text-zinc-600">Requires a <code className="text-amber-400">site-assets</code> bucket in Supabase Storage</p>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={key}>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 capitalize">
                      {labels[key]||key.replace(/_/g," ")}
                    </label>
                    {isTextarea ? (
                      <textarea value={data[key]||""} onChange={e=>setData(d=>({...d,[key]:e.target.value}))} rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 resize-none transition-all"/>
                    ) : (
                      <input type={isUrl?"url":"text"} value={data[key]||""} onChange={e=>setData(d=>({...d,[key]:e.target.value}))}
                        placeholder={isUrl?"https://...":""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-all"/>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800/50">
            <button onClick={()=>setConfirmSave(true)} disabled={saving||!hasChanges}
              className="px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all">
              {saving?"Saving...":"Save Changes"}
            </button>
            <button onClick={()=>setData({...original})} disabled={!hasChanges}
              className="px-6 py-2.5 rounded-xl border border-zinc-800/60 text-zinc-400 text-sm hover:text-white disabled:opacity-40 transition-colors">
              Discard
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmSave}
        title="Save Changes"
        message="These changes will be applied sitewide immediately."
        confirmLabel="Yes, Save"
        variant="warning"
        onConfirm={()=>{setConfirmSave(false);handleSave();}}
        onCancel={()=>setConfirmSave(false)}
      />
    </div>
  );
}
