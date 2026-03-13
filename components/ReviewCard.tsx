"use client";

import { motion } from "framer-motion";
import type { Review } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-gold-500" : "text-zinc-300 dark:text-zinc-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewCard({
  review,
  index = 0,
}: {
  review: Review;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-lg hover:shadow-zinc-100/50 dark:hover:shadow-zinc-950/50 transition-all duration-300"
    >
      <StarRating rating={review.rating} />
      <blockquote className="mt-4 mb-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        &ldquo;{review.message}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white text-sm">
            {review.name}
          </p>
          <p className="text-xs text-zinc-400">Verified Client</p>
        </div>
      </div>
    </motion.div>
  );
}

export { StarRating };
