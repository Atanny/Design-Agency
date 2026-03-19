"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import type { BlogPost } from "@/types";

function slugify(text: string) {
 return text
 .toLowerCase()
 .replace(/[^\w\s-]/g, "")
 .replace(/[\s_-]+/g, "-")
 .replace(/^-+|-+$/g, "");
}

type Mode = "list" | "create" | "edit";

const emptyForm = (): Partial<BlogPost> => ({
 title: "",
 slug: "",
 content: "",
 featured_image: "",
 meta_title: "",
 meta_description: "",
 published: false,
});

export default function AdminBlog() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [mode, setMode] = useState<Mode>("list");
 const [form, setForm] = useState<Partial<BlogPost>>(emptyForm());
 const [uploading, setUploading] = useState(false);
 const fileRef = useRef<HTMLInputElement>(null);
 const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

 const fetchPosts = async () => {
 const { data } = await supabase
 .from("blog_posts")
 .select("*")
 .order("created_at", { ascending: false });
 setPosts((data as BlogPost[]) || []);
 setLoading(false);
 };

 useEffect(() => { fetchPosts(); }, []);

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setUploading(true);
 const ext = file.name.split(".").pop();
 const filename = `blog-${Date.now()}.${ext}`;
 const { error, data } = await supabase.storage.from("blog").upload(filename, file, { upsert: true });
 if (error) {
 toast.error("Upload failed");
 } else {
 const { data: url } = supabase.storage.from("blog").getPublicUrl(data.path);
 setForm((f) => ({ ...f, featured_image: url.publicUrl }));
 toast.success("Image uploaded!");
 }
 setUploading(false);
 };

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.title || !form.slug) {
 toast.error("Title and slug are required.");
 return;
 }
 if (mode === "create") {
 const { error } = await supabase.from("blog_posts").insert([form]);
 if (error) { toast.error(error.message); return; }
 toast.success("Post created!");
 } else {
 const { error } = await supabase.from("blog_posts").update(form).eq("id", form.id);
 if (error) { toast.error(error.message); return; }
 toast.success("Post updated!");
 }
 setMode("list");
 setForm(emptyForm());
 fetchPosts();
 };

 const handleDelete = async (id: string) => {

 const { error } = await supabase.from("blog_posts").delete().eq("id", id);
 if (error) {
 toast.error(error.message);
 } else {
 setPosts((prev) => prev.filter((p) => p.id !== id));
 toast.success("Post deleted.");
 }
 };

 const handleEdit = (post: BlogPost) => {
 setForm(post);
 setMode("edit");
 };

 const showModal = mode === "create" || mode === "edit";

 return (
 <div className="p-6 w-full max-w-full">
 <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
          <div><h1 className="font-display text-3xl font-black text-white leading-none">Blog</h1><p className="text-zinc-500 text-sm mt-1 font-light">{posts.length} post{posts.length!==1?"s":""}</p></div>
        </div>
        <div className="sm:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-5 flex items-center justify-center">
          <button onClick={()=>setMode("create")} className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            New Post
          </button>
        </div>
      </div>
 ))}
 </div>
 )}

 <ConfirmModal
 open={!!confirmDelete}
 title="Delete Blog Post"
 message="This will permanently delete the post and cannot be undone."
 confirmLabel="Yes, Delete"
 variant="danger"
 onConfirm={() => { if (confirmDelete) { handleDelete(confirmDelete); setConfirmDelete(null); } }}
 onCancel={() => setConfirmDelete(null)}
 />
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
 <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
 <div className="flex items-center justify-between p-6 border-b border-zinc-800/40">
 <h2 className="font-display text-xl font-bold text-white">{mode === "create" ? "New Post" : "Edit Post"}</h2>
 <button onClick={() => { setMode("list"); setForm(emptyForm()); }} className="text-zinc-500 hover:text-white transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
 </button>
 </div>
 <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Title *</label>
 <input
 type="text"
 value={form.title || ""}
 onChange={(e) => {
 const title = e.target.value;
 setForm((f) => ({
 ...f,
 title,
 slug: f.slug || slugify(title),
 meta_title: f.meta_title || title,
 }));
 }}
 placeholder="Post title"
 className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-colors"
 />
 </div>

 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Slug *</label>
 <input
 type="text"
 value={form.slug || ""}
 onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
 placeholder="post-slug"
 className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 font-mono transition-colors"
 />
 </div>

 {/* Featured image */}
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Featured Image</label>
 <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
 {form.featured_image ? (
 <div className="flex items-center gap-4 mb-2">
 <div className="relative w-24 h-16 flex-shrink-0">
 <img src={form.featured_image} alt="Featured" className="w-24 h-16 object-cover rounded-xl border border-zinc-800/50" />
 {uploading && (
 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
 <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
 </svg>
 </div>
 )}
 </div>
 <div className="flex gap-2">
 <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
 className="px-3 py-2 border border-zinc-800 text-zinc-400 text-xs hover:text-white disabled:opacity-50 transition-colors">
 {uploading ? "Uploading..." : "Replace Image"}
 </button>
 <button type="button" onClick={() => setForm(f => ({ ...f, featured_image: "" }))}
 className="px-3 py-2 bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors">
 Remove
 </button>
 </div>
 </div>
 ) : (
 <div className="flex gap-3 items-center">
 <input
 type="text"
 value={form.featured_image || ""}
 onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))}
 placeholder="Image URL or upload..."
 className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 transition-colors"
 />
 <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
 className="px-4 py-3 rounded-xl border border-zinc-800/60 text-zinc-400 text-sm hover:text-white disabled:opacity-60 transition-colors whitespace-nowrap">
 {uploading ? "Uploading..." : "Upload"}
 </button>
 </div>
 )}
 </div>

 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Meta Description</label>
 <textarea
 value={form.meta_description || ""}
 onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
 placeholder="SEO description (150-160 chars)..."
 rows={2}
 maxLength={160}
 className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 resize-none transition-colors"
 />
 </div>

 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Content (HTML)</label>
 <textarea
 value={form.content || ""}
 onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
 placeholder="<p>Post content in HTML...</p>"
 rows={16}
 className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-coral-400/50 resize-none font-mono transition-colors"
 />
 </div>

 <div className="flex items-center gap-3">
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={form.published || false}
 onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
 className="rounded border-zinc-600 bg-zinc-800 text-amber-400"
 />
 <span className="text-zinc-400 text-sm">Publish now</span>
 </label>
 </div>

 <div className="flex gap-3 pt-2">
 <button type="submit"
 className="px-6 py-3 gradient-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-colors">
 {mode === "create" ? "Create Post" : "Save Changes"}
 </button>
 <button type="button" onClick={() => { setMode("list"); setForm(emptyForm()); }}
 className="px-6 py-3 rounded-xl border border-zinc-800/60 text-zinc-500 text-sm font-semibold hover:text-white hover:border-zinc-600 transition-all">
 Cancel
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
