"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: [0.16,1,0.3,1] } }),
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
  const cta    = content.cta_button      || "Start a Project";
  const bgImage = content.bg_image       || "";

  return (
    <section className="relative bg-[#0a0a0a] pt-8 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-3">

          {/* ── MAIN HEADLINE TILE ── col-span-8 */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden relative min-h-[360px] md:min-h-[420px] flex flex-col justify-between p-8 md:p-10"
            style={{ background: "linear-gradient(145deg,#1a1009 0%,#0f0a06 60%,#1a0f08 100%)" }}>
            {/* Background image */}
            {bgImage && (
              <>
                <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/60" />
              </>
            )}
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-[80px] bg-coral-400/8 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-[60px] bg-amber-300/10 blur-xl pointer-events-none" />

            {/* Commission badge */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-auto pb-6">
              {commissionOpen !== null && (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${commissionOpen ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${commissionOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}/>
                  {commissionOpen ? "Available for commission" : "Commissions closed"}
                </span>
              )}
              {businessHours && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-300/20 bg-amber-300/8 text-amber-300">
                  🕐 {businessHours}
                </span>
              )}
            </div>

            {/* Headline */}
            <div className="relative z-10">
              <h1 className="font-display font-black leading-[0.9] text-white"
                style={{ fontSize:"clamp(2.6rem,7vw,5.5rem)" }}>
                {line1}{" "}
                <span className="text-gradient-primary">{accent}</span>
                <br/>
                <span className="font-light italic text-white/50">{line2}</span>
                <br/>
                {line3}
              </h1>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-coral-400/25">
                  View Services ✦
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white font-semibold text-sm hover:bg-white/8 transition-colors">
                  {cta}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── STATS COLUMN ── col-span-4 */}
          <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
            {/* Projects tile */}
            <motion.div custom={0.08} initial="hidden" animate="visible" variants={fadeUp}
              className="tile tile-coral p-6 flex flex-col justify-between min-h-[130px] md:flex-1">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{content.stat1_label||"Projects Delivered"}</p>
              <div>
                <p className="font-display font-black text-white text-5xl leading-none">
                  {content.stat1_value || (stats.portfolioCount !== null ? `${stats.portfolioCount}+` : "—")}
                </p>
                <span className="text-white/40 text-xs mt-1 block">and counting</span>
              </div>
            </motion.div>
            {/* Satisfaction tile */}
            <motion.div custom={0.14} initial="hidden" animate="visible" variants={fadeUp}
              className="tile tile-amber p-6 flex flex-col justify-between min-h-[130px] md:flex-1">
              <p className="text-espresso-700 text-[10px] font-bold uppercase tracking-widest">{content.stat2_label||"Client Satisfaction"}</p>
              <p className="font-display font-black text-espresso-800 text-5xl leading-none">
                {stats.satisfaction !== null ? `${stats.satisfaction}%` : "—"}
              </p>
            </motion.div>
          </div>

          {/* ── SUBTEXT TILE ── */}
          <motion.div custom={0.18} initial="hidden" animate="visible" variants={fadeUp}
            className="col-span-12 md:col-span-5 tile bg-zinc-900 p-6 flex flex-col justify-between">
            <p className="text-zinc-400 text-base leading-relaxed">{sub}</p>
            {stats.avgRating !== null && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s=>(
                    <svg key={s} className={`w-4 h-4 ${s<=Math.round(stats.avgRating||0)?"text-amber-400":"text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-amber-400 font-bold text-sm">{stats.avgRating}</span>
                <span className="text-zinc-600 text-xs">avg rating</span>
              </div>
            )}
          </motion.div>

          {/* ── TAGS TILE ── */}
          <motion.div custom={0.22} initial="hidden" animate="visible" variants={fadeUp}
            className="col-span-12 md:col-span-4 tile bg-[#0f0a06] border border-zinc-800/50 p-6 flex flex-col justify-center gap-3">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">What we do</p>
            <div className="flex flex-wrap gap-2">
              {["UI/UX Design","Branding","Poster Design","Social Media","Web Design"].map(tag=>(
                <span key={tag} className="px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 text-xs font-medium hover:border-coral-400/40 hover:text-coral-400 transition-colors cursor-default">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* ── SCROLL INDICATOR ── */}
          <motion.div custom={0.26} initial="hidden" animate="visible" variants={fadeUp}
            className="col-span-12 md:col-span-3 tile tile-dark p-6 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-coral-400/20 border border-coral-400/30 flex items-center justify-center text-coral-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
              </svg>
            </motion.div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-600">Scroll</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
