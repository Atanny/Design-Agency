"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgCornerAccent, BgHex } from "@/components/BgDecor";

const fadeUp = {
  hidden:{ opacity:0, y:24 },
  visible:(d=0)=>({ opacity:1, y:0, transition:{ duration:0.6, delay:d, ease:[0.16,1,0.3,1] } }),
};

interface HeroProps { content?: Record<string,string>; }
interface LiveStats { portfolioCount:number|null; avgRating:number|null; satisfaction:number|null; }

function useHeroData() {
  const [stats,setStats]=useState<LiveStats>({ portfolioCount:null, avgRating:null, satisfaction:null });
  const [commissionOpen,setCommissionOpen]=useState<boolean|null>(null);
  const [businessHours,setBusinessHours]=useState("");
  const fetchAll=async()=>{
    const [portRes,revRes,commRes]=await Promise.all([
      supabase.from("portfolio").select("id",{count:"exact",head:true}),
      supabase.from("reviews").select("rating").eq("approved",true),
      supabase.from("site_content").select("key,value").eq("section","commission"),
    ]);
    const ratings=(revRes.data||[]).map((r:{rating:number})=>r.rating);
    const count=ratings.length;
    setStats({
      portfolioCount: portRes.count??0,
      avgRating: count>0?Math.round((ratings.reduce((a:number,b:number)=>a+b,0)/count)*10)/10:null,
      satisfaction: count>0?Math.round((ratings.filter((r:number)=>r>=4).length/count)*100):null,
    });
    if(commRes.data){
      const map:Record<string,string>={};
      commRes.data.forEach((r:{key:string;value:string})=>{map[r.key]=r.value;});
      setCommissionOpen(map.status!=="closed");
      if(map.business_hours) setBusinessHours(map.business_hours);
    } else setCommissionOpen(true);
  };
  useEffect(()=>{
    fetchAll();
    const ch=supabase.channel("hero-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"portfolio"},fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"reviews"},fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"site_content",filter:"section=eq.commission"},fetchAll)
      .subscribe();
    return()=>{ supabase.removeChannel(ch); };
  },[]);
  return { stats, commissionOpen, businessHours };
}

export default function Hero({ content={} }: HeroProps) {
  const { stats, commissionOpen, businessHours } = useHeroData();
  const line1   = content.headline_line1  || "I Design";
  const accent  = content.headline_accent || "Brands";
  const line2   = content.headline_line2  || "That People";
  const line3   = content.headline_line3  || "Remember";
  const sub     = content.subheadline     || "Freelance designer crafting brand identities, UI/UX, and visual experiences that make your business impossible to ignore.";
  const ctaText = content.cta_button      || "Hire Me";
  const bgImage = content.bg_image        || "";

  return (
    <section className="bg-page pt-5 pb-3">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

          {/* ── HEADLINE TILE ── */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-7 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] p-8 md:p-10"
            style={{ background:"linear-gradient(160deg,#1a0f08 0%,#0c0804 100%)" }}>
            {bgImage ? (
              <><img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.2]"/><div className="absolute inset-0 bg-gradient-to-br from-espresso-900/90 via-espresso-900/60 to-espresso-900/40"/></>
            ) : (
              <><BgDiagonalLines dark opacity={0.8}/><BgMeshGrid dark opacity={0.5}/></>
            )}
            <BgGlowBlob color="coral" position="tr" />
            <BgCornerAccent dark />
            {/* Big decorative number */}
            <div className="absolute bottom-0 left-0 font-display font-black text-[16rem] leading-none text-white/[0.025] select-none pointer-events-none pl-4 pb-0" aria-hidden>
              ✦
            </div>

            {/* Status badges */}
            <div className="relative z-10 flex flex-wrap gap-2">
              {commissionOpen !== null && (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${
                  commissionOpen ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${commissionOpen?"bg-emerald-400 animate-pulse":"bg-red-400"}`}/>
                  {commissionOpen ? "Available for projects" : "Currently unavailable"}
                </span>
              )}
              {businessHours && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {businessHours}
                </span>
              )}
            </div>

            {/* Headline */}
            <div className="relative z-10">
              <h1 className="font-display font-black text-white leading-[0.87]" style={{ fontSize:"clamp(3.2rem,8.5vw,6.5rem)" }}>
                {line1}{" "}
                <em className="text-gradient-primary not-italic">{accent}</em>
                <br/>
                <span className="font-light italic text-white/30">{line2}</span>
                <br/>
                {line3}
              </h1>
              <p className="mt-5 text-white/45 text-sm md:text-base leading-relaxed max-w-md font-light">{sub}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-xl shadow-coral-400/25">
                  {ctaText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/portfolio" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/70 font-medium text-sm hover:border-white/30 hover:text-white transition-all">
                  See My Work
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">

            {/* Projects stat */}
            <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-1 tile-gradient-coral rounded-2xl relative overflow-hidden p-6 flex flex-col justify-between min-h-[170px]">
              <BgDots dark opacity={0.5} />
              <p className="relative z-10 text-white/70 text-[10px] font-semibold uppercase tracking-widest leading-tight">
                {content.stat1_label || "Projects Delivered"}
              </p>
              <div className="relative z-10">
                <p className="font-display font-black text-white leading-none" style={{fontSize:"clamp(3rem,6vw,4rem)"}}>
                  {content.stat1_value || (stats.portfolioCount !== null ? `${stats.portfolioCount}+` : "—")}
                </p>
                <p className="text-white/50 text-xs mt-1 font-light">and counting</p>
              </div>
            </motion.div>

            {/* Satisfaction stat */}
            <motion.div custom={0.15} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-1 rounded-2xl bg-amber-300 relative overflow-hidden p-6 flex flex-col justify-between min-h-[170px]">
              <BgDiagonalLines opacity={0.5} />
              <p className="relative z-10 text-espresso-700 text-[10px] font-semibold uppercase tracking-widest leading-tight">
                {content.stat2_label || "Client Satisfaction"}
              </p>
              <div className="relative z-10">
                <p className="font-display font-black text-espresso-800 leading-none" style={{fontSize:"clamp(3rem,6vw,4rem)"}}>
                  {stats.satisfaction !== null ? `${stats.satisfaction}%` : "—"}
                </p>
                <p className="text-espresso-600 text-xs mt-1 font-light">happy clients</p>
              </div>
            </motion.div>

            {/* Social proof — live ratings */}
            <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
              className="col-span-2 bento-card relative overflow-hidden p-6 flex flex-col justify-between gap-4 min-h-[160px]">
              <BgHex opacity={0.6} />
              <BgGlowBlob color="amber" position="br" />

              {stats.avgRating !== null ? (
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex-shrink-0 text-center">
                    <p className="font-display font-black text-amber-400 text-4xl leading-none">{stats.avgRating}</p>
                    <p className="text-muted text-[10px] font-medium mt-1">out of 5</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s=>(
                        <svg key={s} className={`w-4 h-4 ${s<=Math.round(stats.avgRating||0)?"text-amber-400":"text-faint"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-body text-xs font-light">
                      {stats.satisfaction !== null && <><span className="text-page font-semibold">{stats.satisfaction}%</span> satisfaction · </>}
                      <a href="/reviews" className="text-coral-500 hover:underline">Read reviews →</a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10">
                  <p className="text-muted text-sm font-light">No reviews yet.</p>
                </div>
              )}

              <div className="relative z-10 flex flex-wrap gap-2 pt-3 border-t border-card">
                {["UI/UX","Branding","Print","Social","Web"].map(tag=>(
                  <span key={tag} className="px-2.5 py-1 rounded-full border border-card text-muted text-[11px] font-medium">{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
