"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} star`}
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hovered || value)
                ? "text-coral-400"
                : "text-zinc-200 dark:text-zinc-700"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message || form.rating === 0) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reviews").insert([{ ...form, approved: false }]);
    setLoading(false);
    if (error) {
      toast.error("Failed to submit review. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-espresso-800 dark:text-sand-50 mb-2">
          Thank You!
        </h3>
        <p className="text-espresso-500 dark:text-espresso-400">
          Your review has been submitted and will be published after approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Your Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Jane Smith"
          required
          className="w-full px-4 py-3 border border-sand-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-espresso-800 dark:text-sand-50 placeholder-zinc-400 focus:outline-none focus:border-coral-400/60 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Rating <span className="text-red-400">*</span>
        </label>
        <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Your Review <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell others about your experience..."
          required
          rows={5}
          className="w-full px-4 py-3 border border-sand-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-espresso-800 dark:text-sand-50 placeholder-zinc-400 focus:outline-none focus:border-coral-400/60 transition-all text-sm resize-none"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-espresso-800 font-bold text-sm hover:bg-coral-400 dark:hover:bg-coral-400 dark:hover:text-white disabled:opacity-60 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </motion.button>
    </form>
  );
}
