"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import type { PortfolioItem } from "@/types";

const DEFAULT_CATEGORIES = ["UI/UX Design", "Brand Identity", "Poster Design", "Social Media", "Website Design", "Other"];

export default function AdminPortfolio() {
 const [items, setItems] = useState<PortfolioItem[]>([]);
 const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
 const [loading, setLoading] = useState(true);
 const [uploading, setUploading] = useState(false);
 const [showForm, setShowForm] = useState(false);
 const [form, setForm] = useState<{ title:string; description:string; category:string; image_url:string; project_url:string; image_urls:string[] }>({ title:"", description:"", category:"UI/UX Design", image_url:"", project_url:"", image_urls:[] });
 const [editItem, setEditItem] = useState<PortfolioItem|null>(null);
 const [saving, setSaving] = useState(false);
 const [editUploading, setEditUploading] = useState(false);
 const [confirm, setConfirm] = useState<{ type: "delete"; id: string; imageUrl: string } | null>(null);
 const fileRef = useRef<HTMLInputElement>(null);
 const editFileRef = useRef<HTMLInputElement>(null);
 const multiFileRef = useRef<HTMLInputElement>(null);
 const editMultiFileRef = useRef<HTMLInputElement>(null);
 const [previewUrl, setPreviewUrl] = useState("");
 const [uploadingExtra, setUploadingExtra] = useState(false);

 useEffect(() => {
 supabase.from("services").select("title").eq("active", true).order("sort_order", {ascending:true}).then(({ data }) => {
 if (data && data.length > 0) {
 const fromDB = data.map((s: {title:string}) => s.title);
 const merged = Array.from(new Set([...fromDB, "Other"]));
 setCategories(merged);
 }
 });
 }, []);

 const fetchItems = async () => {
 const { data } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });
 setItems((data as PortfolioItem[]) || []);
 setLoading(false);
 };

 useEffect(() => { fetchItems(); }, []);

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setPreviewUrl(URL.createObjectURL(file));
 setUploading(true);
 const ext = file.name.split(".").pop();
 const filename = `portfolio-${Date.now()}.${ext}`;
 const { error, data } = await supabase.storage.from("portfolio").upload(filename, file, { upsert: true });
 if (error) {
 toast.error("Upload failed: " + error.message);
 } else {
 const { data: url } = supabase.storage.from("portfolio").getPublicUrl(data.path);
 setForm((f) => ({ ...f, image_url: url.publicUrl }));
 toast.success("Image uploaded!");
 }
 setUploading(false);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.title || !form.image_url) { toast.error("Title and image are required."); return; }
 const { error } = await supabase.from("portfolio").insert([{
 title: form.title,
 description: form.description,
 category: form.category,
 image_url: form.image_url,
 project_url: form.project_url || null,
 }]);
 if (error) {
 toast.error(error.message);
 } else {
 toast.success("Portfolio item added!");
 setShowForm(false);
 setForm({ title:"", description:"", category:categories[0]||"UI/UX Design", image_url:"", project_url:"", image_urls:[] as string[] });
 setPreviewUrl("");
 fetchItems();
 }
 };

 const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = Array.from(e.target.files || []);
 if (!files.length) return;
 setUploadingExtra(true);
 const uploaded: string[] = [];
 for (const file of files) {
   const ext = file.name.split(".").pop();
   const filename = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
   const { error, data } = await supabase.storage.from("portfolio").upload(filename, file, { upsert: true });
   if (!error && data) {
     const { data: url } = supabase.storage.from("portfolio").getPublicUrl(data.path);
     uploaded.push(url.publicUrl);
   }
 }
 setForm(f => ({ ...f, image_urls: [...(f.image_urls || []), ...uploaded] }));
 setUploadingExtra(false);
 if (uploaded.length) toast.success(`${uploaded.length} image(s) added!`);
 };

 const handleEditMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = Array.from(e.target.files || []);
 if (!files.length || !editItem) return;
 setUploadingExtra(true);
 const uploaded: string[] = [];
 for (const file of files) {
   const ext = file.name.split(".").pop();
   const filename = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
   const { error, data } = await supabase.storage.from("portfolio").upload(filename, file, { upsert: true });
   if (!error && data) {
     const { data: url } = supabase.storage.from("portfolio").getPublicUrl(data.path);
     uploaded.push(url.publicUrl);
   }
 }
 setEditItem(i => i ? { ...i, image_urls: [...(i.image_urls || []), ...uploaded] } : i);
 setUploadingExtra(false);
 if (uploaded.length) toast.success(`${uploaded.length} image(s) added!`);
 };

 const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file || !editItem) return;
 setEditUploading(true);
 const ext = file.name.split(".").pop();
 const filename = `portfolio-${Date.now()}.${ext}`;
 const { error, data } = await supabase.storage.from("portfolio").upload(filename, file, { upsert: true });
 if (error) {
 toast.error("Upload failed: " + error.message);
 } else {
 const { data: url } = supabase.storage.from("portfolio").getPublicUrl(data.path);
 setEditItem(i => i ? { ...i, image_url: url.publicUrl } : i);
 toast.success("Image replaced!");
 }
 setEditUploading(false);
 };

 const handleEdit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editItem) return;
 setSaving(true);
 const { error } = await supabase.from("portfolio").update({
 title: editItem.title, description: editItem.description,
 category: editItem.category, project_url: editItem.project_url || null,
 image_url: editItem.image_url,
 }).eq("id", editItem.id);
 setSaving(false);
 if (error) { toast.error(error.message); } else {
 toast.success("Updated!");
 setEditItem(null);
 fetchItems();
 }
 };

 const handleDelete = async (id: string, imageUrl: string) => {
 const path = imageUrl.split("/storage/v1/object/public/portfolio/")[1];
 if (path) await supabase.storage.from("portfolio").remove([path]);
 const { error } = await supabase.from("portfolio").delete().eq("id", id);
 if (error) { toast.error(error.message); } else {
 toast.success("Item deleted.");
 setItems((prev) => prev.filter((i) => i.id !== id));
 }
 };

 return (
 <div className="p-8 w-full">
 <div className="flex items-center justify-between mb-8">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <div className="h-px w-8 bg-gold-500" />
 <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-600">Admin</span>
 </div>
 <h1 className="font-display text-4xl font-black text-white tracking-tight leading-none">Portfolio</h1>
 <p className="text-zinc-500 mt-1">{items.length} items</p>
 </div>
 <button onClick={() => setShowForm(true)}
 className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white text-sm font-black tracking-wide hover:bg-gold-600 transition-all"
 style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
 >
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
 Add Item
 </button>
 </div>

 {(showForm || showForm) && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
 <div className="bg-[#0c0c0c] border border-zinc-800/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto card-grain"
 style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>
 <div className="flex items-center justify-between p-6 border-b border-zinc-800/40">
 <div className="flex items-center gap-3">
 <div className="h-px w-6 bg-gold-500" />
 <h2 className="font-display text-xl font-black text-white tracking-tight">Add Portfolio Item</h2>
 </div>
 <button type="button" onClick={()=>{setShowForm(false);setShowForm(false);setPreviewUrl("");}}
 className="text-zinc-600 hover:text-white transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
 </button>
 </div>
 <form onSubmit={handleSubmit} className="p-6 space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Title *</label>
 <input type="text" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} placeholder="Project name"
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"/>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Category</label>
 <select value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))}
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0">
 {categories.map((c)=><option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 </div>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Description</label>
 <textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Brief description..."
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0 resize-none"/>
 </div>
 <div className="mb-4">
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Project Link (optional — shown as clickable button on site)</label>
 <input type="url" value={form.project_url} onChange={(e)=>setForm(f=>({...f,project_url:e.target.value}))} placeholder="https://..."
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"/>
 </div>
 <div className="mb-5">
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Image *</label>
 <div className="flex items-center gap-4">
 <button type="button" onClick={()=>fileRef.current?.click()}
 className="px-4 py-2.5 border border-zinc-800 bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
 {uploading ? "Uploading..." : "Choose Image"}
 </button>
 {previewUrl && <Image src={previewUrl} alt="preview" width={64} height={64} className="object-cover w-16 h-16"/>}
 </div>
 <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
 </div>
 {previewUrl && (
   <div className="mt-3">
     <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Additional Images (optional slideshow)</label>
     <div className="flex flex-wrap gap-2 mb-2">
       {(form.image_urls || []).map((url, i) => (
         <div key={i} className="relative group">
           <img src={url} alt="" className="w-14 h-14 object-cover" style={{ clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)" }}/>
           <button type="button" onClick={() => setForm(f => ({ ...f, image_urls: (f.image_urls||[]).filter((_,j)=>j!==i) }))}
             className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
         </div>
       ))}
       <input ref={multiFileRef} type="file" accept="image/*" multiple onChange={handleMultiImageUpload} className="hidden"/>
       <button type="button" onClick={() => multiFileRef.current?.click()} disabled={uploadingExtra}
         className="w-14 h-14 border border-dashed border-zinc-700 text-zinc-600 text-xs hover:border-gold-500/50 hover:text-zinc-400 flex items-center justify-center transition-colors">
         {uploadingExtra ? "..." : "+ Add"}
       </button>
     </div>
   </div>
 )}
 </div>
 <div className="flex gap-3 pt-2">
 <button type="submit" disabled={uploading || !form.image_url}
 className="flex-1 py-3 bg-gold-500 text-white text-sm font-black tracking-wide hover:bg-gold-600 disabled:opacity-50 transition-all"
 style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
 {uploading ? "Uploading..." : "Add to Portfolio"}
 </button>
 <button type="button" onClick={()=>{setShowForm(false);setShowForm(false);setPreviewUrl("");}}
 className="px-6 py-3 border border-zinc-800/60 text-zinc-500 text-sm font-semibold hover:text-white hover:border-zinc-600 transition-all">
 Cancel
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {loading ? (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
 {[...Array(8)].map((_,i)=><div key={i} className="aspect-square bg-zinc-900 animate-pulse"/>)}
 </div>
 ) : items.length === 0 ? (
 <div className="text-center py-20 text-zinc-600">
 <p className="text-lg mb-2">No portfolio items yet.</p>
 <button onClick={()=>setShowForm(true)} className="text-gold-500 text-sm hover:text-gold-400 transition-colors">+ Add your first item</button>
 </div>
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
 {items.map((item) => (
 <div key={item.id} className="group relative overflow-hidden bg-[#0c0c0c] border border-zinc-800/60 hover:border-gold-500/30 transition-all">
 <div className="aspect-square relative" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}>
 <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
 <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
 <p className="text-white text-sm font-semibold truncate">{item.title}</p>
 <p className="text-zinc-400 text-xs">{item.category}</p>
 <div className="flex items-center gap-2 mt-2">
 {item.project_url && (
 <a href={item.project_url} target="_blank" rel="noopener noreferrer"
 className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 transition-colors font-semibold"
 onClick={(e)=>e.stopPropagation()}>
 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
 View Live
 </a>
 )}
 <button onClick={(e)=>{e.stopPropagation();setEditItem({...item});}}
 className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
 Edit
 </button>
 <button onClick={()=>setConfirm({ type:"delete", id:item.id, imageUrl:item.image_url })}
 className="ml-auto text-[11px] text-red-400 hover:text-red-300 transition-colors">
 Delete
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 <ConfirmModal
 open={!!confirm}
 title="Delete Portfolio Item"
 message="This will permanently remove the image and cannot be undone."
 confirmLabel="Yes, Delete"
 variant="danger"
 onConfirm={() => { if (confirm) { handleDelete(confirm.id, confirm.imageUrl); setConfirm(null); } }}
 onCancel={() => setConfirm(null)}
 />
 {editItem && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
 <form onSubmit={handleEdit} className="bg-[#0c0c0c] border border-zinc-800 w-full max-w-lg p-6">
 <div className="flex items-center justify-between mb-5">
 <h2 className="font-display text-lg font-bold text-white">Edit Portfolio Item</h2>
 <button type="button" onClick={()=>setEditItem(null)} className="text-zinc-500 hover:text-white transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
 </button>
 </div>
 <div className="space-y-4">
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Image</label>
 <div className="flex items-center gap-4">
 <div className="relative w-20 h-20 flex-shrink-0">
 <img src={editItem.image_url} alt={editItem.title} className="w-20 h-20 object-cover border border-zinc-800/60" style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}/>
 {editUploading && (
 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
 <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
 </svg>
 </div>
 )}
 </div>
 <div>
 <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden"/>
 <button type="button" onClick={()=>editFileRef.current?.click()} disabled={editUploading}
 className="px-4 py-2 border border-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 disabled:opacity-50 transition-colors">
 {editUploading ? "Uploading..." : "Replace Image"}
 </button>
 <p className="text-xs text-zinc-600 mt-1">Upload a new image to replace the current one</p>
 </div>
 </div>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Title</label>
 <input type="text" value={editItem.title} onChange={(e)=>setEditItem(i=>i?{...i,title:e.target.value}:i)} required
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"/>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Category</label>
 <select value={editItem.category} onChange={(e)=>setEditItem(i=>i?{...i,category:e.target.value}:i)}
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0">
 {categories.map((c)=><option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Description</label>
 <textarea value={editItem.description||""} onChange={(e)=>setEditItem(i=>i?{...i,description:e.target.value}:i)} rows={2}
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0 resize-none"/>
 </div>
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Project Link</label>
 <input type="url" value={editItem.project_url||""} onChange={(e)=>setEditItem(i=>i?{...i,project_url:e.target.value}:i)} placeholder="https://..."
 className="w-full px-4 py-2.5 border border-zinc-800 bg-[#0c0c0c] text-white text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"/>
 </div>
 </div>
 <div className="flex gap-3 mt-5">
 <button type="submit" disabled={saving}
 className="flex-1 py-2.5 bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors">
 {saving ? "Saving..." : "Save Changes"}
 </button>
 <button type="button" onClick={()=>setEditItem(null)}
 className="px-6 py-2.5 border border-zinc-800/60 text-zinc-500 text-sm font-semibold hover:text-white hover:border-zinc-600 transition-all">
 Cancel
 </button>
 </div>
 </form>
 </div>
 )}
 </div>
 );
}
