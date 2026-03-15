"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
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
    if (!confirm("Delete this post?")) return;
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
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Blog</h1>
          <p className="text-zinc-500 mt-1">{posts.length} posts</p>
        </div>
        <button onClick={() => setMode("create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          New Post
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 rounded-xl bg-zinc-800 animate-pulse"/>)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">No blog posts yet.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{post.title}</p>
                  {post.published ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-xs font-medium">Draft</span>
                  )}
                </div>
                <p className="text-zinc-500 text-xs font-mono">/blog/{post.slug}</p>
                <p className="text-zinc-700 text-xs mt-0.5">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(post)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs font-medium hover:text-white transition-colors">Edit</button>
                <button onClick={() => handleDelete(post.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-display text-xl font-bold text-white">{mode === "create" ? "New Post" : "Edit Post"}</h2>
              <button onClick={() => { setMode("list"); setForm(emptyForm()); }} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Title *</label>
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
              className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Slug *</label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              placeholder="post-slug"
              className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 font-mono"
            />
          </div>

          {/* Featured image */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Featured Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={form.featured_image || ""}
                onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))}
                placeholder="Image URL or upload..."
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Meta Description</label>
            <textarea
              value={form.meta_description || ""}
              onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
              placeholder="SEO description (150-160 chars)..."
              rows={2}
              maxLength={160}
              className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Content (HTML)</label>
            <textarea
              value={form.content || ""}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="<p>Post content in HTML...</p>"
              rows={16}
              className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published || false}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="rounded border-zinc-600 bg-zinc-800 text-gold-500"
              />
              <span className="text-zinc-400 text-sm">Publish now</span>
            </label>
          </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="px-6 py-3 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 transition-colors">
                  {mode === "create" ? "Create Post" : "Save Changes"}
                </button>
                <button type="button" onClick={() => { setMode("list"); setForm(emptyForm()); }}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors">
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
