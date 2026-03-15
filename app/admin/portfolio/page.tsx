"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import type { PortfolioItem } from "@/types";

const CATEGORIES = ["UI/UX", "Branding", "Poster", "Social Media", "Website", "Other"];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", category:"UI/UX", image_url:"", project_url:"" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      setForm({ title:"", description:"", category:"UI/UX", image_url:"", project_url:"" });
      setPreviewUrl("");
      fetchItems();
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this portfolio item?")) return;
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
          <h1 className="font-display text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-zinc-500 mt-1">{items.length} items</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
          <h2 className="text-white font-semibold mb-5">New Portfolio Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} placeholder="Project name"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"/>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
              <select value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500">
                {CATEGORIES.map((c)=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Brief description..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"/>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-400 mb-1.5">Project Link (optional — shown as clickable button on site)</label>
            <input type="url" value={form.project_url} onChange={(e)=>setForm(f=>({...f,project_url:e.target.value}))} placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"/>
          </div>
          <div className="mb-5">
            <label className="block text-xs text-zinc-400 mb-1.5">Image *</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={()=>fileRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
                {uploading ? "Uploading..." : "Choose Image"}
              </button>
              {previewUrl && <Image src={previewUrl} alt="preview" width={64} height={64} className="rounded-lg object-cover w-16 h-16"/>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading || !form.image_url}
              className="px-6 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors">
              Save Item
            </button>
            <button type="button" onClick={()=>{setShowForm(false);setPreviewUrl("");}}
              className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_,i)=><div key={i} className="aspect-square rounded-2xl bg-zinc-800 animate-pulse"/>)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-lg mb-2">No portfolio items yet.</p>
          <button onClick={()=>setShowForm(true)} className="text-gold-500 text-sm hover:text-gold-400 transition-colors">+ Add your first item</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all">
              <div className="aspect-square relative">
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
                    <button onClick={()=>handleDelete(item.id,item.image_url)}
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
    </div>
  );
}
