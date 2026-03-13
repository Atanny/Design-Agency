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
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "UI/UX",
    image_url: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });
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
    const { error, data } = await supabase.storage
      .from("portfolio")
      .upload(filename, file, { upsert: true });

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data: url } = supabase.storage
        .from("portfolio")
        .getPublicUrl(data.path);
      setForm((f) => ({ ...f, image_url: url.publicUrl }));
      toast.success("Image uploaded!");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      toast.error("Title and image are required.");
      return;
    }
    const { error } = await supabase.from("portfolio").insert([form]);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Portfolio item added!");
      setShowForm(false);
      setForm({ title: "", description: "", category: "UI/UX", image_url: "" });
      setPreviewUrl("");
      fetchItems();
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this portfolio item?")) return;
    // Extract path from URL and delete from storage
    const path = imageUrl.split("/storage/v1/object/public/portfolio/")[1];
    if (path) await supabase.storage.from("portfolio").remove([path]);
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Item deleted.");
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-zinc-500 mt-1">{items.length} items</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl border border-zinc-700 bg-zinc-900">
          <h2 className="text-white font-semibold mb-5">New Portfolio Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Project title"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief project description..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Image *</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-gold-500 rounded-xl p-8 text-center transition-colors"
              >
                {previewUrl ? (
                  <div className="relative w-32 h-24 mx-auto rounded-lg overflow-hidden">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div>
                    <p className="text-zinc-400 text-sm">Click to upload image</p>
                    <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
                {uploading && <p className="text-gold-400 text-xs mt-2">Uploading...</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading || !form.image_url}
                className="px-5 py-2.5 rounded-lg bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-60 transition-colors"
              >
                Add to Portfolio
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setPreviewUrl(""); }}
                className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">No portfolio items yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-white text-xs font-medium truncate">{item.title}</p>
                <p className="text-zinc-600 text-xs">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
