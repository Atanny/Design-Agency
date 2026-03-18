"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ICON_PATHS: Record<string, string> = {
  monitor:   "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  palette:   "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  image:     "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  globe:     "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  chat:      "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  phone:     "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  star:      "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
};

const FALLBACK = [
  { id: "uiux",     title: "UI/UX Design",           description: "Intuitive interfaces that delight users and drive conversions.",               icon: "monitor",  accent: "text-blue-400",    bg_color: "bg-blue-500/10" },
  { id: "branding", title: "Brand Identity Design",   description: "Complete brand systems — logos, typography, colors, and guidelines.",         icon: "palette",  accent: "text-coral-400",    bg_color: "bg-coral-400/10" },
  { id: "poster",   title: "Poster & Pubmats Design", description: "Posters, pubmats, and campaigns with visual impact. Print-ready files.",      icon: "image",    accent: "text-rose-400",    bg_color: "bg-rose-500/10" },
  { id: "website",  title: "Website UI Design",       description: "Beautiful, conversion-optimized website designs. Pixel-perfect layouts.",     icon: "globe",    accent: "text-emerald-400", bg_color: "bg-emerald-500/10" },
  { id: "social",   title: "Social Media Graphics",   description: "Scroll-stopping social content that builds brand recognition.",              icon: "chat",     accent: "text-violet-400",  bg_color: "bg-violet-500/10" },
  { id: "product",  title: "Product & App Design",    description: "End-to-end product design from wireframes to polished UI.",                  icon: "phone",    accent: "text-cyan-400",    bg_color: "bg-cyan-500/10" },
];

interface ServicesSectionProps {
  content?: Record<string, string>;
}

export default function ServicesSection({ content = {} }: ServicesSectionProps) {
  const [services, setServices] = useState(FALLBACK);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).order("sort_order", { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setServices(data); });
  }, []);

  const badge    = content.badge    || "What We Do";
  const headline = content.headline || "Design Services";
  const subtext  = content.subtext  || "From brand foundations to full digital products, we offer the complete design spectrum.";

  return (
    <section className="section-pad relative overflow-hidden">
      
      <svg className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.22] dark:opacity-[0.05] pointer-events-none" viewBox="0 0 400 400" fill="none">
        <circle cx="350" cy="80" r="150" fill="url(#ss1)" />
        <polygon points="200,0 400,100 380,300 180,380 20,260 60,60" fill="url(#ss2)" opacity="0.5" />
        <defs>
          <radialGradient id="ss1"><stop offset="0%" stopColor="#c8891a" stopOpacity="0.75"/><stop offset="100%" stopColor="#e8bd5a" stopOpacity="0"/></radialGradient>
          <radialGradient id="ss2"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.75"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></radialGradient>
        </defs>
      </svg>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
          className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-coral-400" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-coral-500 dark:text-coral-400">{badge}</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight text-espresso-800 dark:text-sand-50 leading-[0.95]">
              {headline}
            </h2>
          </div>
          <p className="text-base text-espresso-500 dark:text-espresso-400 max-w-xs leading-relaxed font-light md:text-right">{subtext}</p>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#dedad2] dark:bg-zinc-800/60">
          {services.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-[#faf8f4] dark:bg-[#0c0c0c] p-8 hover:bg-white dark:hover:bg-zinc-900 transition-colors duration-300 card-grain"
            >
              
              <span className="absolute top-6 right-6 font-display text-[11px] font-bold tracking-widest text-zinc-300 dark:text-zinc-700 group-hover:text-coral-400/40 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>

              
              <div className={`inline-flex p-3 mb-6 ${s.bg_color}`}
              >
                <svg className={`w-6 h-6 ${s.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[s.icon] || ICON_PATHS.monitor} />
                </svg>
              </div>

              <h3 className="font-display text-xl font-bold text-espresso-800 dark:text-sand-50 mb-3 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors">
                {s.title}
              </h3>
              <p className="text-espresso-500 dark:text-espresso-500 text-sm leading-relaxed mb-8 font-light">{s.description}</p>

              
              <div className="flex items-center justify-between">
                <Link href="/contact"
                  className={`text-xs font-bold tracking-widest uppercase ${s.accent} hover:opacity-70 transition-opacity flex items-center gap-1.5`}
                >
                  Get an Offer
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href={`/services#${s.id}`}
                  className="text-[11px] font-semibold text-espresso-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors tracking-wide"
                >
                  Learn more →
                </Link>
              </div>

              
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${s.bg_color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                style={{ background: `var(--tw-gradient-from, currentColor)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
