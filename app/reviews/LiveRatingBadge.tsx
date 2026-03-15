"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  initialAvg: number;
  initialCount: number;
}

export default function LiveRatingBadge({ initialAvg, initialCount }: Props) {
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);

  const fetchRating = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("rating")
      .eq("approved", true);
    const ratings = (data || []).map((r: { rating: number }) => r.rating);
    setCount(ratings.length);
    setAvg(ratings.length > 0
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
      : 0);
  };

  useEffect(() => {
    const channel = supabase
      .channel("reviews-rating-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, fetchRating)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const rounded = Math.round(avg);

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <div className="flex gap-1">
        {[1,2,3,4,5].map((s) => (
          <svg key={s} className={`w-5 h-5 transition-colors duration-500 ${s <= rounded ? "text-gold-500" : "text-zinc-300 dark:text-zinc-700"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="font-display text-3xl font-black text-gradient-gold">
        {count > 0 ? avg.toFixed(1) : "—"}
      </span>
      <span className="text-zinc-500 text-sm">{count > 0 ? `${count} reviews` : "No reviews yet"}</span>
    </div>
  );
}
