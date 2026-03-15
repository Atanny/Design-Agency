"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

const PAGES = [
  { key: "home",      label: "Home Page",      path: "/" },
  { key: "services",  label: "Services Page",  path: "/services" },
  { key: "portfolio", label: "Portfolio Page", path: "/portfolio" },
  { key: "blog",      label: "Blog Page",      path: "/blog" },
  { key: "reviews",   label: "Reviews Page",   path: "/reviews" },
  { key: "contact",   label: "Contact Page",   path: "/contact" },
];

interface SeoRow {
  id?: string;
  page: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

export default function AdminSeo() {
  const [rows, setRows] = useState<Record<string, SeoRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("seo_settings").select("*");
      const map: Record<string, SeoRow> = {};
      (data || []).forEach((r: SeoRow) => { map[r.page] = r; });
      setRows(map);
      setLoading(false);
    })();
  }, []);

  const update = (page: string, field: keyof SeoRow, value: string) => {
    setRows((prev) => ({
      ...prev,
      [page]: { ...(prev[page] ?? { page, meta_title: "", meta_description: "", og_image: "" }), [field]: value },
    }));
  };

  const savePage = async (page: string) => {
    setSaving(page);
    const row = rows[page] || { page, meta_title: "", meta_description: "", og_image: "" };
    const { error } = await supabase
      .from("seo_settings")
      .upsert({ ...row, page, updated_at: new Date().toISOString() }, { onConflict: "page" });
    setSaving(null);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`SEO saved for ${PAGES.find((p) => p.key === page)?.label}!`);
    }
  };

  return (
    <div className="p-8 w-full max-w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">SEO Settings</h1>
        <p className="text-zinc-500 mt-1">Control meta titles, descriptions, and Open Graph images for each page.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-zinc-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {PAGES.map((page) => {
            const row = rows[page.key] || { page: page.key, meta_title: "", meta_description: "", og_image: "" };
            const titleLen = (row.meta_title || "").length;
            const descLen = (row.meta_description || "").length;

            return (
              <div key={page.key} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold">{page.label}</h3>
                    <span className="text-xs text-zinc-600 font-mono">{page.path}</span>
                  </div>
                  {/* Google preview snippet */}
                  {row.meta_title && (
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-zinc-600 mb-0.5">Google Preview</p>
                      <p className="text-blue-400 text-sm font-medium truncate max-w-xs">{row.meta_title}</p>
                      <p className="text-zinc-500 text-xs truncate max-w-xs">{row.meta_description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-zinc-400 font-medium">Meta Title</label>
                      <span className={`text-xs ${titleLen > 60 ? "text-red-400" : titleLen > 50 ? "text-amber-400" : "text-zinc-600"}`}>
                        {titleLen}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={row.meta_title || ""}
                      onChange={(e) => update(page.key, "meta_title", e.target.value)}
                      placeholder="Page Title | Your Studio Name"
                      maxLength={70}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-zinc-400 font-medium">Meta Description</label>
                      <span className={`text-xs ${descLen > 160 ? "text-red-400" : descLen > 140 ? "text-amber-400" : "text-zinc-600"}`}>
                        {descLen}/160
                      </span>
                    </div>
                    <textarea
                      value={row.meta_description || ""}
                      onChange={(e) => update(page.key, "meta_description", e.target.value)}
                      placeholder="Brief description of this page for search engines..."
                      rows={2}
                      maxLength={170}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 font-medium mb-1.5">
                      OG Image URL <span className="text-zinc-600">(recommended: 1200×630px)</span>
                    </label>
                    <input
                      type="url"
                      value={row.og_image || ""}
                      onChange={(e) => update(page.key, "og_image", e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => savePage(page.key)}
                    disabled={saving === page.key}
                    className="px-5 py-2 rounded-lg bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-60 transition-colors"
                  >
                    {saving === page.key ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
