"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-gold-500" : "text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const router = useRouter();

  const fetchReviews = async () => {
    // Admin uses service role — bypasses RLS and sees ALL reviews
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ approved: !approved })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: !approved } : r));
      const action = !approved ? "approved" : "unapproved";
      toast.success(`Review ${action}! It will ${!approved ? "now show" : "no longer show"} on the public reviews page.`);
      // Revalidate the reviews page
      router.refresh();
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted.");
    }
  };

  const filtered =
    filter === "all" ? reviews :
    filter === "approved" ? reviews.filter((r) => r.approved) :
    reviews.filter((r) => !r.approved);

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Reviews</h1>
          <p className="text-zinc-500 mt-0.5">
            {pendingCount > 0
              ? <span className="text-amber-400 font-medium">{pendingCount} pending approval</span>
              : "All reviews processed"}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "pending", label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
            { key: "approved", label: "Approved" },
            { key: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key ? "bg-white text-zinc-900" : "border border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl border border-blue-800/30 bg-blue-900/10 mb-6 flex items-start gap-3">
        <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-blue-300 text-sm">
          Approved reviews appear instantly on the public Reviews page and the homepage (top 4 shown).
          The page refreshes automatically on each visit.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-zinc-800 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">No reviews in this filter.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`p-5 rounded-2xl border ${
                review.approved
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-amber-800/30 bg-amber-900/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-white text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{review.name}</p>
                      <Stars rating={review.rating} />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.approved ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {review.approved ? "Live" : "Pending"}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed pl-11">{review.message}</p>
                  <p className="text-zinc-700 text-xs mt-2 pl-11">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleApproval(review.id, review.approved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      review.approved
                        ? "border border-zinc-700 text-zinc-400 hover:text-white"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                  >
                    {review.approved ? "Unpublish" : "Approve & Publish"}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
