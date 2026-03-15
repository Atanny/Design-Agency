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
  const [commissionOpen, setCommissionOpen] = useState<boolean | null>(null);
  const [businessHours, setBusinessHours] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_content").select("key,value").eq("section","commission");
      if (data) {
        const map: Record<string,string> = {};
        data.forEach((r: { key:string; value:string }) => { map[r.key] = r.value; });
        setCommissionOpen(map.status !== "closed");
        if (map.business_hours) setBusinessHours(map.business_hours);
      } else {
        setCommissionOpen(true);
      }
    };
    fetch();
    const channel = supabase.channel("hero-commission-watch")
      .on("postgres_changes", { event:"*", schema:"public", table:"site_content", filter:"section=eq.commission" }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#e8e4dc] dark:bg-[#080808]" />

        {/* PNG blob — gold top-left */}
        <img src="/abstracts/blob_gold_tl.png" alt="" aria-hidden="true"
          className="absolute -top-32 -left-32 w-[600px] h-[600px] object-contain pointer-events-none select-none opacity-75 dark:opacity-30" />

        {/* PNG blob — violet top-right */}
        <img src="/abstracts/blob_violet_tr.png" alt="" aria-hidden="true"
          className="absolute -top-20 -right-20 w-[500px] h-[500px] object-contain pointer-events-none select-none opacity-65 dark:opacity-25" />

        {/* PNG blob — emerald bottom-right */}
        <img src="/abstracts/blob_emerald_br.png" alt="" aria-hidden="true"
          className="absolute -bottom-24 -right-16 w-[500px] h-[500px] object-contain pointer-events-none select-none opacity-55 dark:opacity-20" />

        {/* PNG blob — blue bottom-left */}
        <img src="/abstracts/blob_blue_bl.png" alt="" aria-hidden="true"
          className="absolute bottom-0 -left-20 w-[420px] h-[420px] object-contain pointer-events-none select-none opacity-55 dark:opacity-20" />

        {/* PNG blob — gold center ambient */}
        <img src="/abstracts/blob_gold_center.png" alt="" aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] object-contain pointer-events-none select-none opacity-40 dark:opacity-10" />

        {/* Fine gold grid */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(200,137,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,137,26,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        {/* Corner bracket marks */}
        <div className="absolute top-28 left-8 w-6 h-6 border-l-2 border-t-2 border-gold-400/30" />
        <div className="absolute top-28 right-8 w-6 h-6 border-r-2 border-t-2 border-gold-400/30" />
        <div className="absolute bottom-16 left-8 w-6 h-6 border-l-2 border-b-2 border-gold-400/20" />
        <div className="absolute bottom-16 right-8 w-6 h-6 border-r-2 border-b-2 border-gold-400/20" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-4">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">{badge}</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          {commissionOpen !== null && (
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                commissionOpen
                  ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
                  : "border-red-500/30 bg-red-500/8 text-red-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${commissionOpen ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                {commissionOpen ? "Available for Commission" : "Commissions Closed"}
              </div>
              {businessHours && (
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 tracking-wide">
                  <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {businessHours}
                </div>
              )}
            </div>
          )}
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
            className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold tracking-wide hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
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
