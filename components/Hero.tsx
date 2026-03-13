"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

interface HeroProps {
  content?: Record<string, string>;
}

export default function Hero({ content = {} }: HeroProps) {
  const badge = content.badge || "Premium Design Studio";
  const line1 = content.headline_line1 || "We Design";
  const accent = content.headline_accent || "Experiences";
  const line2 = content.headline_line2 || "That Elevate";
  const line3 = content.headline_line3 || "Your Brand";
  const sub = content.subheadline || "From brand identity to full digital experiences — we craft design that doesn't just look beautiful, it drives results.";
  const cta = content.cta_button || "Contact Us";

  const stats = [
    { value: content.stat1_value || "200+", label: content.stat1_label || "Projects Completed" },
    { value: content.stat2_value || "98%",  label: content.stat2_label || "Client Satisfaction" },
    { value: content.stat3_value || "5★",   label: content.stat3_label || "Average Rating" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-zinc-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-600 dark:text-gold-400 text-sm font-medium mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            {badge}
          </motion.div>

          <motion.h1 custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-zinc-900 dark:text-white mb-8 text-balance"
          >
            {line1}{" "}
            <span className="relative"><span className="text-gradient-gold">{accent}</span></span>
            <br />{line2}<br />{line3}
          </motion.h1>

          <motion.p custom={0.25} initial="hidden" animate="visible" variants={fadeUp}
            className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {sub}
          </motion.p>

          <motion.div custom={0.38} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/services"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-all shadow-xl shadow-zinc-900/20"
            >
              View Services
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
            >
              {cta}
            </Link>
          </motion.div>

          <motion.div custom={0.5} initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-zinc-100 dark:border-zinc-800/60"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - below stats, no overlap */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="flex flex-col items-center gap-2 text-zinc-400 mt-10"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-zinc-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}
