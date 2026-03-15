"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface HeroProps {
  content?: Record<string, string>;
}

interface LiveStats {
  portfolioCount: number | null;
  avgRating: number | null;
  satisfaction: number | null;
  reviewCount: number | null;
}

function useHeroStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({
    portfolioCount: null, avgRating: null, satisfaction: null, reviewCount: null,
  });

  const fetchStats = async () => {
    const [portResult, revResult] = await Promise.all([
      supabase.from("portfolio").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("rating").eq("approved", true),
    ]);
    const portfolioCount = portResult.count ?? 0;
    const ratings = (revResult.data || []).map((r: { rating: number }) => r.rating);
    const reviewCount = ratings.length;
    const avgRating = reviewCount > 0
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / reviewCount) * 10) / 10
      : null;
    const satisfaction = reviewCount > 0
      ? Math.round((ratings.filter((r: number) => r >= 4).length / reviewCount) * 100)
      : null;
    setStats({ portfolioCount, avgRating, satisfaction, reviewCount });
  };

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel("hero-stats-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, fetchStats)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return stats;
}

export default function Hero({ content = {} }: HeroProps) {
  const badge  = content.badge           || "Premium Design Studio";
  const line1  = content.headline_line1  || "We Design";
  const accent = content.headline_accent || "Experiences";
  const line2  = content.headline_line2  || "That Elevate";
  const line3  = content.headline_line3  || "Your Brand";
  const sub    = content.subheadline     || "From brand identity to full digital experiences — we craft design that doesn't just look beautiful, it drives results.";
  const cta    = content.cta_button      || "Contact Us";

  const liveStats = useHeroStats();

  const stats = [
    {
      value: content.stat1_value
        ? content.stat1_value
        : (liveStats.portfolioCount !== null ? `${liveStats.portfolioCount}+` : "--"),
      label: content.stat1_label || "Projects Completed",
      live: !content.stat1_value,
    },
    {
      value: liveStats.satisfaction !== null
        ? `${liveStats.satisfaction}%`
        : "--",
      label: content.stat2_label || "Client Satisfaction",
      live: true,
    },
    {
      value: liveStats.avgRating !== null
        ? `${liveStats.avgRating}★`
        : "--",
      label: content.stat3_label || "Average Rating",
      live: true,
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20">

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#f7f5f0] dark:bg-[#080808]" />
        <svg className="absolute -top-24 -left-24 w-[500px] h-[500px] opacity-60 dark:opacity-30" viewBox="0 0 500 500" fill="none">
          <circle cx="180" cy="180" r="140" fill="url(#g1)" />
          <ellipse cx="300" cy="120" rx="80" ry="120" fill="url(#g2)" transform="rotate(-30 300 120)" />
          <circle cx="100" cy="320" r="60" fill="url(#g3)" />
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8bd5a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c8891a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.53" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.70" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute -top-16 -right-16 w-[420px] h-[420px] opacity-50 dark:opacity-25" viewBox="0 0 420 420" fill="none">
          <polygon points="210,20 390,180 330,380 90,380 30,180" fill="url(#g4)" />
          <circle cx="300" cy="140" r="70" fill="url(#g5)" />
          <rect x="60" y="200" width="100" height="100" rx="20" fill="url(#g6)" transform="rotate(20 110 250)" />
          <defs>
            <radialGradient id="g4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g5" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c8891a" stopOpacity="0.61" />
              <stop offset="100%" stopColor="#e8bd5a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g6" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute -bottom-20 -right-10 w-[380px] h-[380px] opacity-40 dark:opacity-20" viewBox="0 0 380 380" fill="none">
          <circle cx="280" cy="260" r="120" fill="url(#g7)" />
          <ellipse cx="160" cy="320" rx="90" ry="60" fill="url(#g8)" transform="rotate(15 160 320)" />
          <defs>
            <radialGradient id="g7" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.44" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g8" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c8891a" stopOpacity="0.53" />
              <stop offset="100%" stopColor="#e8bd5a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-10 left-0 w-[280px] h-[280px] opacity-35 dark:opacity-15" viewBox="0 0 280 280" fill="none">
          <polygon points="140,10 270,75 270,205 140,270 10,205 10,75" fill="url(#g9)" />
          <defs>
            <radialGradient id="g9" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.53" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.035]"
          style={{ backgroundImage: "linear-gradient(rgba(200,137,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,137,26,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute top-28 left-8 w-6 h-6 border-l-2 border-t-2 border-gold-400/30" />
        <div className="absolute top-28 right-8 w-6 h-6 border-r-2 border-t-2 border-gold-400/30" />
        <div className="absolute bottom-16 left-8 w-6 h-6 border-l-2 border-b-2 border-gold-400/20" />
        <div className="absolute bottom-16 right-8 w-6 h-6 border-r-2 border-b-2 border-gold-400/20" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="inline-flex items-center gap-3 mb-10"
        >
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">{badge}</span>
          <div className="h-px w-8 bg-gold-500" />
        </motion.div>

        <motion.h1 custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
          className="font-display font-black tracking-[-0.02em] leading-[0.9] text-zinc-900 dark:text-white mb-8 text-balance"
          style={{ fontSize: "clamp(3.8rem, 11vw, 9rem)" }}
        >
          {line1}{" "}
          <span className="relative inline-block">
            <span className="text-gradient-gold italic">{accent}</span>
            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
              <path d="M0 5 Q75 0 150 4 Q225 8 300 3" stroke="url(#goldline)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <defs>
                <linearGradient id="goldline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c8891a" />
                  <stop offset="50%" stopColor="#e8bd5a" />
                  <stop offset="100%" stopColor="#c8891a" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <br />
          <span className="font-light italic text-zinc-400 dark:text-zinc-500">{line2}</span>
          <br />
          {line3}
        </motion.h1>

        <motion.div custom={0.25} initial="hidden" animate="visible" variants={fadeUp}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400/50" />
          <div className="w-1 h-1 rounded-full bg-gold-500/60" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400/50" />
        </motion.div>

        <motion.p custom={0.32} initial="hidden" animate="visible" variants={fadeUp}
          className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-light mb-12"
        >
          {sub}
        </motion.p>

        <motion.div custom={0.42} initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold tracking-wide hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-300 shadow-2xl shadow-zinc-900/15"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            View Services
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/contact"
            className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-gold-400"
          >
            {cta}
          </Link>
        </motion.div>

        <motion.div custom={0.55} initial="hidden" animate="visible" variants={fadeUp}
          className="w-full grid grid-cols-3 pt-10 border-t border-zinc-200/60 dark:border-zinc-800/40"
        >
          {stats.map((stat, i) => (
            <div key={stat.label}
              className={`py-6 flex flex-col items-center ${i > 0 ? "border-l border-zinc-200/60 dark:border-zinc-800/40" : ""}`}
            >
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-display text-4xl md:text-5xl font-black text-gradient-gold leading-none mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">{stat.label}</div>
              {stat.live && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-500 font-semibold tracking-widest uppercase">Live</span>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pb-1"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <motion.div className="w-px h-8 bg-gradient-to-b from-gold-400/50 to-transparent" />
          <svg className="w-3 h-3 text-gold-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
        <span className="text-[8px] font-bold tracking-[0.35em] uppercase text-zinc-500">Scroll</span>
      </motion.div>
    </section>
  );
}
