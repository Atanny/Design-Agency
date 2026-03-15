"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { PortfolioItem } from "@/types";

function SkeletonCard() {
  return <div className="overflow-hidden bg-zinc-100 dark:bg-zinc-800/60 animate-pulse aspect-[4/3]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }} />;
}

function ImageModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
        transition={{ duration:0.25, ease:"easeOut" }}
        className="relative max-w-4xl w-full bg-[#faf8f4] dark:bg-[#0c0c0c] overflow-hidden shadow-2xl card-grain"
        style={{ clipPath:"polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-800" style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}>
          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-semibold mb-3 tracking-wide uppercase">
                {item.category}
              </span>
              <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{item.title}</h3>
              {item.description && <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm">{item.description}</p>}
              {item.project_url && (
                <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-gold-600 dark:text-gold-400 hover:opacity-70 transition-opacity">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  View Live Project
                </a>
              )}
            </div>
            <button onClick={onClose}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface PortfolioGridProps {
  limit?: number;
  showFilters?: boolean;
  showViewAll?: boolean;
}

export default function PortfolioGrid({ limit, showFilters = true, showViewAll = false }: PortfolioGridProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    supabase.from("services").select("title").eq("active", true).order("sort_order", { ascending: true })
      .then(({ data }) => {
        const fromDB = (data || []).map((s: { title: string }) => s.title);
        setCategories(["All", ...fromDB, "Other"]);
      });
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("portfolio").select("*").order("created_at", { ascending: false });
    if (activeCategory !== "All") query = query.eq("category", activeCategory);
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (!error && data) setItems(data as PortfolioItem[]);
    setLoading(false);
  }, [activeCategory, limit]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              style={{ clipPath: activeCategory === cat ? "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" : "none" }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit || 6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-lg">No portfolio items yet.</p>
          <p className="text-sm mt-2">Check back soon!</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div key={item.id} layout
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                transition={{ duration:0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800/60" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}>
                  <Image src={item.image_url} alt={item.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="w-full">
                      <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur text-white text-xs mb-1.5 font-semibold tracking-wide">
                        {item.category}
                      </span>
                      <p className="text-white font-semibold mb-2">{item.title}</p>
                      {item.project_url && (
                        <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-semibold hover:bg-white/25 transition-colors">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          View Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showViewAll && (
        <div className="text-center mt-12">
          <Link href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
            View Full Portfolio
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>
      )}

      <AnimatePresence>
        {selected && <ImageModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
