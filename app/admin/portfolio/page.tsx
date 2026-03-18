"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import type { PortfolioItem } from "@/types";

const DEFAULT_CATEGORIES = [
  "UI/UX Design",
  "Brand Identity",
  "Poster Design",
  "Social Media",
  "Website Design",
  "Other",
];

interface ItemCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <div className="group relative overflow-hidden bg-[#0c0c0c] border border-zinc-800/60 hover:border-coral-400/30 transition-all rounded-2xl">
      <div className="aspect-square relative overflow-hidden rounded-2xl">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {(item.image_urls || []).length > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-coral-400/90 text-white text-[9px] font-bold">
            {(item.image_urls || []).length + 1} imgs
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
          <p className="text-white text-sm font-semibold truncate">
            {item.title}
          </p>
          <p className="text-zinc-400 text-xs">{item.category}</p>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onEdit(item)}
              className="px-3 py-1 rounded-full bg-white/20 text-white text-xs hover:bg-white/30"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(item.id, item.image_url)}
              className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [confirm, setConfirm] = useState<{
    type: "delete";
    id: string;
    imageUrl: string;
  } | null>(null);

  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "grouped">("grouped");

  const fileRef = useRef<HTMLInputElement>(null);

  // ✅ DEFINE FIRST
  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

    setItems((data as PortfolioItem[]) || []);
    setLoading(false);
  };

  // ✅ THEN USE
  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    const path = imageUrl.split("/storage/v1/object/public/portfolio/")[1];
    if (path) await supabase.storage.from("portfolio").remove([path]);

    await supabase.from("portfolio").delete().eq("id", id);

    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const sorted = [...items]
    .filter((i) => filterCat === "All" || i.category === filterCat)
    .sort((a, b) =>
      sortBy === "name"
        ? a.title.localeCompare(b.title)
        : sortBy === "oldest"
        ? new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
    );

  return (
    <div className="p-8 w-full">
      <h1 className="text-white text-3xl mb-6">Portfolio</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", ...Array.from(new Set(items.map((i) => i.category)))].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 text-xs ${
                filterCat === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {cat}
            </button>
          )
        )}

        <select
          onChange={(e) =>
            setSortBy(e.target.value as "newest" | "oldest" | "name")
          }
          className="bg-zinc-800 text-white text-xs px-2"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">A-Z</option>
        </select>

        <button onClick={() => setViewMode("grid")} className="text-white">
          Grid
        </button>
        <button onClick={() => setViewMode("grouped")} className="text-white">
          Group
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : sorted.length === 0 ? (
        <p className="text-white">No items</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sorted.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={setEditItem}
              onDelete={(id, url) =>
                setConfirm({ type: "delete", id, imageUrl: url })
              }
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(new Set(sorted.map((i) => i.category))).map((cat) => (
            <div key={cat}>
              <h2 className="text-white mb-3">{cat}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sorted
                  .filter((i) => i.category === cat)
                  .map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={setEditItem}
                      onDelete={(id, url) =>
                        setConfirm({ type: "delete", id, imageUrl: url })
                      }
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Item"
        message="Are you sure?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (confirm) {
            handleDelete(confirm.id, confirm.imageUrl);
            setConfirm(null);
          }
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}