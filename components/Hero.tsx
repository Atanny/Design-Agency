"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: [0.16,1,0.3,1] } }),
};

interface HeroProps { content?: Record<string, string>; }
interface LiveStats { portfolioCount: number|null; avgRating: number|null; satisfaction: number|null; }

function useHeroData() {
  const [stats, setStats] = useState<LiveStats>({ portfolioCount:null, avgRating:null, satisfaction:null });
  const [commissionOpen, setCommissionOpen] = useState<boolean|null>(null);
  const [businessHours, setBusinessHours] = useState("");

  const fetchAll = async () => {
    const [portRes, revRes, commRes] = await Promise.all([
      supabase.from("portfolio").select("id", { count:"exact", head:true }),
      supabase.from("reviews").select("rating").eq("approved", true),
      supabase.from("site_content").select("key,value").eq("section","commission"),
    ]);
    const ratings = (revRes.data||[]).map((r:{rating:number})=>r.rating);
    const count = ratings.length;
    setStats({
      portfolioCount: portRes.count ?? 0,
      avgRating: count > 0 ? Math.round((ratings.reduce((a:number,b:number)=>a+b,0)/count)*10)/10 : null,
      satisfaction: count > 0 ? Math.round((ratings.filter((r:number)=>r>=4).length/count)*100) : null,
    });
    if (commRes.data) {
      const map: Record<string,string> = {};
      commRes.data.forEach((r:{key:string;value:string})=>{ map[r.key]=r.value; });
      setCommissionOpen(map.status !== "closed");
      if (map.business_hours) setBusinessHours(map.business_hours);
    } else setCommissionOpen(true);
  };

  useEffect(() => {
    fetchAll();
    const ch = supabase.channel("hero-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"portfolio"},fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"reviews"},fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"site_content",filter:"section=eq.commission"},fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { stats, commissionOpen, businessHours };
}

export default function Hero({ content = {} }: HeroProps) {
  const { stats, commissionOpen, businessHours } = useHeroData();

  const line1  = content.headline_line1  || "We Design";
  const accent = content.headline_accent || "Experiences";
  const line2  = content.headline_line2  || "That Elevate";
  const line3  = content.headline_line3  || "Your Brand";
  const sub    = content.subheadline     || "From brand identity to full digital experiences — we craft design that drives results.";
  const cta    = content.cta_button      || "Contact Us";

  return (
    <section className="relative min-h-screen bg-[#fdf9f5] dark:bg-[#1a1009] py-24 md:py-32 overflow-hidden">
      {/* Background dots */}
      <div className="absolute inset-0 dot-pattern opacity-40 dark:opacity-20 pointer-events-none" />

      {/* Floating blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-coral-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full bg-amber-300/25 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* ── Big headline tile ── */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="md:col-span-7 tile tile-dark p-8 md:p-12 min-h-[320px] flex flex-col justify-between">
            {/* Commission pill */}
            {commissionOpen !== null && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className={`pill ${commissionOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${commissionOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}/>
                  {commissionOpen ? "Available for commission" : "Commissions closed"}
                </span>
                {businessHours && (
                  <span className="pill bg-amber-300/20 text-amber-300">
                    🕐 {businessHours}
                  </span>
                )}
              </div>
            )}
            <div>
              <h1 className="font-display font-black leading-[0.95] text-white text-balance"
                style={{ fontSize:"clamp(2.8rem,8vw,6rem)" }}>
                {line1}{" "}
                <span className="text-gradient-primary">{accent}</span>
                <br/>
                <span className="font-light italic opacity-60">{line2}</span>
                <br/>
                {line3}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full gradient-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-coral-400/30">
                View Services ✦
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                {cta}
              </Link>
            </div>
          </motion.div>

          {/* ── Stats column ── */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Projects stat */}
            <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
              className="tile tile-coral p-6 flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{content.stat1_label||"Projects Completed"}</p>
              <p className="font-display font-black text-white leading-none"
                style={{ fontSize:"clamp(2.5rem,6vw,4rem)" }}>
                {content.stat1_value || (stats.portfolioCount !== null ? `${stats.portfolioCount}+` : "—")}
              </p>
              <span className="absolute bottom-4 right-5 text-6xl opacity-10 font-black">✦</span>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {/* Satisfaction */}
              <motion.div custom={0.15} initial="hidden" animate="visible" variants={fadeUp}
                className="tile tile-amber p-5">
                <p className="text-espresso-700 text-[10px] font-bold uppercase tracking-widest mb-1">{content.stat2_label||"Satisfaction"}</p>
                <p className="font-display font-black text-espresso-800 text-3xl leading-none">
                  {stats.satisfaction !== null ? `${stats.satisfaction}%` : "—"}
                </p>
              </motion.div>

              {/* Rating */}
              <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
                className="tile tile-dark p-5">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{content.stat3_label||"Avg Rating"}</p>
                <p className="font-display font-black text-amber-300 text-3xl leading-none">
                  {stats.avgRating !== null ? `${stats.avgRating}★` : "—"}
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── Subheadline tile ── */}
          <motion.div custom={0.25} initial="hidden" animate="visible" variants={fadeUp}
            className="md:col-span-5 tile tile-sand dark:bg-espresso-700 p-6">
            <p className="text-espresso-700 dark:text-sand-200 text-base leading-relaxed">{sub}</p>
          </motion.div>

          {/* ── Scroll indicator tile ── */}
          <motion.div custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
            className="md:col-span-3 tile bg-coral-50 dark:bg-espresso-700 p-6 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-coral-400 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
              </svg>
            </motion.div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">Scroll</span>
          </motion.div>

          {/* ── Decorative pattern tile ── */}
          <motion.div custom={0.35} initial="hidden" animate="visible" variants={fadeUp}
            className="md:col-span-4 tile bg-espresso-800 p-6 overflow-hidden">
            <div className="dot-pattern absolute inset-0 opacity-30" />
            <div className="relative z-10 flex flex-wrap gap-2">
              {["UI/UX Design","Branding","Motion","Print","Web"].map(s=>(
                <span key={s} className="pill bg-white/10 text-white/80">{s}</span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
