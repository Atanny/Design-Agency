"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgCircles, BgWatermark, BgHex } from "@/components/BgDecor";

const ICON_PATHS: Record<string,string> = {
  monitor:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  palette:"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  image:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  globe:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  chat:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  phone:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  lightning:"M13 10V3L4 14h7v7l9-11h-7z",
};

const FALLBACK = [
  { id:"uiux",     title:"UI/UX Design",         description:"Intuitive interfaces your users will actually enjoy. Wireframes to pixel-perfect screens, delivered.", icon:"monitor",  accent:"text-blue-500",   bg_color:"bg-blue-500/10" },
  { id:"branding", title:"Brand Identity",        description:"A complete identity system — logo, typography, colors, and brand guidelines built to last.",          icon:"palette",  accent:"text-coral-500",  bg_color:"bg-coral-400/10" },
  { id:"poster",   title:"Poster & Print Design", description:"Eye-catching posters, flyers, and pubmats that stand out in a crowded feed or on a real wall.",       icon:"image",    accent:"text-rose-500",   bg_color:"bg-rose-500/10" },
  { id:"website",  title:"Website UI Design",     description:"Conversion-focused website mockups. Pixel-perfect layouts ready for handoff or development.",          icon:"globe",    accent:"text-emerald-500",bg_color:"bg-emerald-500/10" },
  { id:"social",   title:"Social Media Graphics", description:"Scroll-stopping content that builds brand recognition across every platform, consistently.",           icon:"chat",     accent:"text-violet-500", bg_color:"bg-violet-500/10" },
  { id:"product",  title:"Product & App Design",  description:"End-to-end product design from early wireframes to polished, developer-ready UI specifications.",      icon:"phone",    accent:"text-cyan-500",   bg_color:"bg-cyan-500/10" },
];

// Decorative bg per service card
const CARD_DECORS = [
  <BgDiagonalLines key="a" opacity={0.4}/>,
  <BgDots key="b" opacity={0.3}/>,
  <BgMeshGrid key="c" opacity={0.35}/>,
  <BgCircles key="d" opacity={0.4}/>,
  <BgHex key="e" opacity={0.4}/>,
  <BgDiagonalLines key="f" opacity={0.35}/>,
];

const SPANS = [
  "col-span-1 sm:col-span-2 lg:col-span-5",
  "col-span-1 lg:col-span-4",
  "col-span-1 lg:col-span-3",
  "col-span-1 lg:col-span-4",
  "col-span-1 lg:col-span-4",
  "col-span-1 lg:col-span-4",
];

interface ServicesSectionProps { content?: Record<string,string>; }

export default function ServicesSection({ content={} }: ServicesSectionProps) {
  const [services, setServices] = useState(FALLBACK);
  useEffect(()=>{
    supabase.from("services").select("*").eq("active",true).order("sort_order",{ascending:true})
      .then(({data})=>{ if(data&&data.length>0) setServices(data); });
  },[]);

  const badge    = content.badge    || "What I Do";
  const headline = content.headline || "My Services";
  const subtext  = content.subtext  || "From brand foundations to polished digital products — end-to-end design that works.";

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{backgroundColor:"var(--bg-section)"}}>
      <BgMeshGrid opacity={0.5} />
      <BgGlowBlob color="coral" position="tl" />
      <BgGlowBlob color="amber" position="br" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">

          {/* Title tile */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55}}
            className="md:col-span-7 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[200px]">
            <BgCircles />
            <BgWatermark text="SERVICES" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-5 bg-coral-400"/>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-500">{badge}</span>
              </div>
              <h2 className="font-display font-black text-page leading-[0.9]" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                {headline}
              </h2>
            </div>
            <p className="relative z-10 text-body text-sm leading-relaxed font-light mt-4 max-w-xs">{subtext}</p>
          </motion.div>

          {/* CTA tile */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55,delay:0.1}}
            className="md:col-span-5 tile-gradient-coral rounded-2xl relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[200px]">
            <BgDots dark opacity={0.5} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <span className="text-white/70 text-sm font-light">Let's talk</span>
            </div>
            <div className="relative z-10">
              <p className="text-white font-display font-black text-2xl leading-tight mb-3">
                Every service delivered personally by me.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-5">No handoffs, no outsourcing. You get my full attention.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-semibold hover:bg-espresso-800 hover:text-white transition-all">
                Discuss your project →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Service card tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {services.map((s,i) => (
            <motion.div key={s.id}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-60px"}} transition={{duration:0.45,delay:i*0.06}}
              className={`group ${SPANS[i]||"col-span-1 lg:col-span-4"} bento-card relative overflow-hidden p-7 flex flex-col justify-between min-h-[240px] hover:shadow-xl transition-all duration-250`}>
              {CARD_DECORS[i % CARD_DECORS.length]}
              <BgGlowBlob color="coral" position="br" />

              <div className="relative z-10">
                <div className={`inline-flex p-2.5 rounded-xl mb-5 ${s.bg_color}`}>
                  <svg className={`w-5 h-5 ${s.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[s.icon]||ICON_PATHS.monitor}/>
                  </svg>
                </div>
                <h3 className="font-display font-bold text-page text-xl mb-2.5 leading-snug group-hover:text-coral-500 transition-colors">{s.title}</h3>
                <p className="text-body text-sm leading-relaxed font-light">{s.description}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-6 pt-5 border-t border-card">
                <Link href="/contact" className={`text-[11px] font-semibold tracking-widest uppercase ${s.accent} hover:opacity-70 transition-opacity flex items-center gap-1.5`}>
                  Get a quote
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </Link>
                <span className="font-display font-black text-faint text-3xl leading-none select-none">{String(i+1).padStart(2,"0")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
