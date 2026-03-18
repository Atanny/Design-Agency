"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.16,1,0.3,1] } }),
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

  const line1   = content.headline_line1  || "I Design";
  const accent  = content.headline_accent || "Brands";
  const line2   = content.headline_line2  || "That People";
  const line3   = content.headline_line3  || "Remember";
  const sub     = content.subheadline     || "Freelance designer crafting brand identities, UI/UX, and visual experiences that make your business impossible to ignore.";
  const ctaText = content.cta_button      || "Hire Me";
  const bgImage = content.bg_image        || "";

  return (
    <section className="bg-[#0a0a0a] pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-12 gap-3">

          {/* ── MAIN CARD: Headline + CTA ── */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="col-span-12 lg:col-span-7 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px] p-8 md:p-10"
            style={{ background: "linear-gradient(160deg, #161009 0%, #0c0804 100%)" }}>
            {/* Subtle bg image overlay */}
            {bgImage && (
              <>
                <img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0804]/90 via-[#0c0804]/60 to-transparent" />
              </>
            )}
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-coral-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

            {/* Status badges */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              {commissionOpen !== null && (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                  commissionOpen
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/25 bg-red-500/10 text-red-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${commissionOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                  {commissionOpen ? "Available for projects" : "Currently unavailable"}
                </span>
              )}
              {businessHours && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-zinc-700/60 bg-zinc-800/40 text-zinc-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {businessHours}
                </span>
              )}
            </div>

            {/* Headline */}
            <div className="relative z-10 mt-6">
              <h1 className="font-display font-black text-white leading-[0.88]" style={{ fontSize: "clamp(3rem, 7.5vw, 6rem)" }}>
                {line1}{" "}
                <span className="text-gradient-primary">{accent}</span>
                <br />
                <span className="font-light italic text-white/40">{line2}</span>
                <br />
                {line3}
              </h1>
              <p className="mt-6 text-zinc-400 text-base leading-relaxed max-w-md font-light">
                {sub}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-coral-400/20">
                  {ctaText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/portfolio"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-all">
                  See My Work
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Stats + social proof ── */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3">

            {/* Projects stat */}
            <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-1 rounded-2xl bg-coral-400 p-6 flex flex-col justify-between min-h-[150px]">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest leading-tight">
                {content.stat1_label || "Projects Delivered"}
              </p>
              <div>
                <p className="font-display font-black text-white leading-none" style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)" }}>
                  {content.stat1_value || (stats.portfolioCount !== null ? `${stats.portfolioCount}+` : "—")}
                </p>
              </div>
            </motion.div>

            {/* Satisfaction stat */}
            <motion.div custom={0.15} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-1 rounded-2xl bg-amber-300 p-6 flex flex-col justify-between min-h-[150px]">
              <p className="text-espresso-700 text-[10px] font-bold uppercase tracking-widest leading-tight">
                {content.stat2_label || "Client Satisfaction"}
              </p>
              <p className="font-display font-black text-espresso-800 leading-none" style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)" }}>
                {stats.satisfaction !== null ? `${stats.satisfaction}%` : "—"}
              </p>
            </motion.div>

            {/* Social proof / rating */}
            <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800/60 p-6 flex flex-col gap-3">
              {stats.avgRating !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating || 0) ? "text-amber-400" : "text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-amber-400 font-bold text-sm">{stats.avgRating}</span>
                    <span className="text-zinc-500 text-xs">average client rating</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    "Clients trust me with their brand because I treat every project like it's my own business on the line."
                  </p>
                </>
              ) : (
                <p className="text-zinc-500 text-sm leading-relaxed">
                  "I put everything into every project — no shortcuts, no templates, no compromise."
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-zinc-800/60 mt-1">
                {["UI/UX Design", "Branding", "Print", "Social Media", "Web Design"].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full border border-zinc-800 text-zinc-500 text-[11px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
