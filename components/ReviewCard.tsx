"use client";

import { motion } from "framer-motion";
import type { Review } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? "text-gold-500" : "text-zinc-200 dark:text-zinc-700"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16,1,0.3,1] }}
      className="group relative bg-white dark:bg-[#0c0c0c] border border-zinc-100 dark:border-zinc-800/60 p-8 hover:border-gold-400/30 transition-all duration-400 card-grain"
      style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
    >
      {/* Corner cut accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-b-[16px] border-l-transparent border-b-zinc-100 dark:border-b-zinc-800/60 group-hover:border-b-gold-400/20 transition-colors" />

      {/* Stars + rating */}
      <div className="flex items-center justify-between mb-6">
        <StarRating rating={review.rating} />
        <span className="font-display text-3xl font-black text-zinc-100 dark:text-zinc-800 select-none">&ldquo;</span>
      </div>

      {/* Quote */}
      <blockquote className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 font-light italic">
        {review.message}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="w-9 h-9 gradient-gold flex items-center justify-center text-white font-display font-black text-sm flex-shrink-0"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white text-sm">{review.name}</p>
          <p className="text-[11px] text-zinc-400 tracking-wide uppercase">Verified Client</p>
        </div>
      </div>
    </motion.div>
  );
}

export { StarRating };
