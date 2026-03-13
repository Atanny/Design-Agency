"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function Hero({ content = {} }: HeroProps) {
  const badge  = content.badge           || "Premium Design Studio";
  const line1  = content.headline_line1  || "We Design";
  const accent = content.headline_accent || "Experiences";
  const line2  = content.headline_line2  || "That Elevate";
  const line3  = content.headline_line3  || "Your Brand";
  const sub    = content.subheadline     || "From brand identity to full digital experiences — we craft design that doesn't just look beautiful, it drives results.";
  const cta    = content.cta_button      || "Contact Us";

  const stats = [
    { value: content.stat1_value || "200+", label: content.stat1_label || "Projects Completed" },
    { value: content.stat2_value || "98%",  label: content.stat2_label || "Client Satisfaction" },
    { value: content.stat3_value || "5★",   label: content.stat3_label || "Average Rating" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16">

      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        {/* Gold orb top-right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gold-400/6 dark:bg-gold-400/4 blur-[140px]" />
        {/* Subtle orb bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gold-300/5 dark:bg-gold-600/3 blur-[120px]" />
        {/* Fine grid lines — editorial paper feel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(200,137,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,137,26,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        {/* Corner marks */}
        <div className="absolute top-28 left-8 w-6 h-6 border-l-2 border-t-2 border-gold-400/25" />
        <div className="absolute top-28 right-8 w-6 h-6 border-r-2 border-t-2 border-gold-400/25" />
        <div className="absolute bottom-16 left-8 w-6 h-6 border-l-2 border-b-2 border-gold-400/20" />
        <div className="absolute bottom-16 right-8 w-6 h-6 border-r-2 border-b-2 border-gold-400/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">{badge}</span>
            <div className="h-px w-8 bg-gold-500" />
          </motion.div>

          {/* Headline — massive editorial */}
          <motion.h1 custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="font-display font-black tracking-[-0.02em] leading-[0.9] text-zinc-900 dark:text-white mb-8 text-balance"
            style={{ fontSize: "clamp(3.8rem, 11vw, 9rem)" }}
          >
            {line1}{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold italic">{accent}</span>
              {/* Underline stroke */}
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
            <span className="font-light italic text-zinc-500 dark:text-zinc-500">{line2}</span>
            <br />
            {line3}
          </motion.h1>

          {/* Sub + CTA row */}
          <motion.div custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mt-10"
          >
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md font-light">
              {sub}
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/services"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold tracking-wide hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-300 shadow-2xl shadow-zinc-900/20"
                style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
              >
                View Services
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact"
                className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700 hover:decoration-gold-400"
              >
                {cta}
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div custom={0.5} initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-3 gap-0 mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800/40"
          >
            {stats.map((stat, i) => (
              <div key={stat.label}
                className={`py-6 ${i > 0 ? "pl-8 border-l border-zinc-100 dark:border-zinc-800/40" : "pr-8"}`}
              >
                <div className="font-display text-4xl md:text-5xl font-black text-gradient-gold leading-none mb-2">{stat.value}</div>
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-400">Scroll</span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-gold-400/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
