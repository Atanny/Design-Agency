import { Metadata } from "next";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import { ReviewCard } from "@/components/ReviewCard";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

export const revalidate = 0;

async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("reviews").select("*").eq("approved", true)
      .order("created_at", { ascending: false }).limit(3);
    return (data as Review[]) || [];
  } catch { return []; }
}

export default async function Home() {
  const [reviews, heroContent, servicesContent, portfolioContent, testimonialsContent, ctaContent, contactContent, processContent, whyUsContent] =
    await Promise.all([
      getFeaturedReviews(),
      getContent("hero"), getContent("services_section"), getContent("portfolio_section"),
      getContent("testimonials_section"), getContent("cta_section"), getContent("contact_section"),
      getContent("process_section"), getContent("why_us_section"),
    ]);

  return (
    <>
      <Hero content={heroContent} />

      <ServicesSection content={servicesContent} />

      {/* ── Process Section ─────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden bg-[#f0ede6] dark:bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent" />

        {/* Abstract art — process section */}
        <svg className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 dark:opacity-10 pointer-events-none" viewBox="0 0 500 500" fill="none">
          <circle cx="400" cy="100" r="160" fill="url(#pg1)" />
          <ellipse cx="460" cy="320" rx="80" ry="140" fill="url(#pg2)" transform="rotate(20 460 320)" />
          <polygon points="300,50 480,150 450,320 280,380 150,280 180,100" fill="url(#pg3)" opacity="0.4" />
          <defs>
            <radialGradient id="pg1"><stop offset="0%" stopColor="#c8891a" stopOpacity="0.3"/><stop offset="100%" stopColor="#e8bd5a" stopOpacity="0"/></radialGradient>
            <radialGradient id="pg2"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/><stop offset="100%" stopColor="#d97706" stopOpacity="0"/></radialGradient>
            <radialGradient id="pg3"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-15 dark:opacity-8 pointer-events-none" viewBox="0 0 300 300" fill="none">
          <circle cx="80" cy="250" r="120" fill="url(#pg4)" />
          <defs>
            <radialGradient id="pg4"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/><stop offset="100%" stopColor="#059669" stopOpacity="0"/></radialGradient>
          </defs>
        </svg>

        {/* Large background number */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 font-display font-black text-[clamp(120px,20vw,260px)] text-zinc-900/[0.02] dark:text-white/[0.02] select-none pointer-events-none leading-none">
          HOW
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">{processContent.badge || "How We Work"}</span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[0.95] mb-8">
                {processContent.headline_line1 || "Design built"}<br />
                <span className="italic font-light text-zinc-400 dark:text-zinc-500">{processContent.headline_line2 || "around your"}</span><br />
                {processContent.headline_line3 || "goals"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12 font-light max-w-sm">
                {processContent.subtext || "We start with a deep understanding of your brand, audience, and objectives. Every design decision is intentional."}
              </p>

              {/* Steps */}
              <div className="space-y-0">
                {[
                  { step: processContent.step1_num || "01", title: processContent.step1_title || "Discovery", desc: processContent.step1_desc || "We learn your brand, goals, and audience inside out." },
                  { step: processContent.step2_num || "02", title: processContent.step2_title || "Design",    desc: processContent.step2_desc || "We craft visuals that are both beautiful and purposeful." },
                  { step: processContent.step3_num || "03", title: processContent.step3_title || "Deliver",   desc: processContent.step3_desc || "Print-ready or screen-ready files, on time, every time." },
                ].map((item, i) => (
                  <div key={item.step}
                    className="group flex gap-6 items-start py-6 border-b border-zinc-200 dark:border-zinc-800/60 last:border-0 hover:pl-2 transition-all duration-300"
                  >
                    <span className="font-display text-[11px] font-black tracking-widest text-gold-500/60 group-hover:text-gold-500 transition-colors pt-0.5 flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-zinc-900 dark:text-white mb-1.5 text-lg group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — rich illustrated panel */}
            <div className="relative h-[520px] hidden lg:block">
              {/* Outer frame */}
              <div className="absolute inset-0 border border-zinc-200 dark:border-zinc-800/60 overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))" }}
              >
                <div className="absolute inset-0 bg-zinc-50 dark:bg-[#0e0e0e]" />
                {/* Scattered ambient glows */}
                <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-gold-400/10 blur-2xl" />
                <div className="absolute bottom-12 left-8 w-24 h-24 rounded-full bg-violet-400/10 blur-xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-rose-400/6 blur-2xl" />
                {/* Mosaic cards */}
                <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-3">
                  {[
                    { label: "Brand Identity", icon: "🎨", grad: "from-gold-500/20 to-amber-600/10",    accent: "text-gold-400",    border: "border-gold-500/20" },
                    { label: "UI Design",      icon: "🖥️",  grad: "from-blue-500/20 to-indigo-600/10",  accent: "text-blue-400",    border: "border-blue-500/20" },
                    { label: "Poster Design",  icon: "🖼️",  grad: "from-rose-500/20 to-pink-600/10",    accent: "text-rose-400",    border: "border-rose-500/20" },
                    { label: "Social Media",   icon: "✦",   grad: "from-emerald-500/20 to-teal-600/10", accent: "text-emerald-400", border: "border-emerald-500/20" },
                  ].map((item, i) => (
                    <div key={item.label}
                      className={`relative flex flex-col justify-between p-5 border ${item.border} bg-gradient-to-br ${item.grad} overflow-hidden`}
                      style={{ clipPath: i === 1 ? "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" : "none" }}
                    >
                      <span className="absolute bottom-2 right-3 font-display font-black text-5xl text-white/5 dark:text-white/5 select-none leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-2xl mb-auto block">{item.icon}</span>
                      <div>
                        <div className={`w-8 h-px mb-2 opacity-60 bg-current ${item.accent}`} />
                        <span className={`text-sm font-bold ${item.accent}`}>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 w-16 h-16 border border-gold-400/25 rotate-45" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio Preview ────────────────────────────────────── */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">
                  {portfolioContent.badge || "Our Work"}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[0.95]">
                {portfolioContent.headline || "Selected Work"}
              </h2>
            </div>
            <Link href="/portfolio"
              className="group inline-flex items-center gap-2.5 text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
            >
              {portfolioContent.view_all || "View All Work"}
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <PortfolioGrid limit={6} showFilters={false} showViewAll />
        </div>
      </section>

      {/* ── Why Us ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#060606] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

        {/* Abstract art — dark section */}
        <svg className="absolute top-0 left-0 w-[600px] h-[600px] opacity-[0.07] pointer-events-none" viewBox="0 0 600 600" fill="none">
          <circle cx="100" cy="100" r="200" fill="url(#wu1)" />
          <polygon points="300,0 600,150 550,450 250,580 0,400 50,100" fill="url(#wu2)" opacity="0.5" />
          <defs>
            <radialGradient id="wu1"><stop offset="0%" stopColor="#e8bd5a" stopOpacity="1"/><stop offset="100%" stopColor="#c8891a" stopOpacity="0"/></radialGradient>
            <radialGradient id="wu2"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.06] pointer-events-none" viewBox="0 0 400 400" fill="none">
          <ellipse cx="350" cy="350" rx="200" ry="150" fill="url(#wu3)" transform="rotate(-30 350 350)" />
          <circle cx="280" cy="200" r="100" fill="url(#wu4)" />
          <defs>
            <radialGradient id="wu3"><stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/><stop offset="100%" stopColor="#059669" stopOpacity="0"/></radialGradient>
            <radialGradient id="wu4"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.6"/><stop offset="100%" stopColor="#db2777" stopOpacity="0"/></radialGradient>
          </defs>
        </svg>
        {/* Ghost text bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display font-black text-[clamp(80px,16vw,180px)] text-white/[0.015] whitespace-nowrap tracking-tight">
            LUMIS STUDIO
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-gold-500/50" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-400">{whyUsContent.badge || "Why Lumis Studio"}</span>
              <div className="h-px w-12 bg-gold-500/50" />
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight leading-[0.95]">
              {whyUsContent.headline || "Designed"}{" "}
              <span className="italic font-light text-zinc-500">{whyUsContent.headline_italic || "differently"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                title: whyUsContent.card1_title || "Fast Turnaround",
                desc:  whyUsContent.card1_desc  || "Most projects delivered within 3–7 days without sacrificing quality.",
                glow: "bg-gold-400/10", border: "border-gold-500/15", accent: "text-gold-400",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                deco: "from-gold-500/20 via-amber-400/10 to-transparent",
              },
              {
                num: "02",
                title: whyUsContent.card2_title || "Strategy-First",
                desc:  whyUsContent.card2_desc  || "Every design decision is grounded in your brand goals and audience.",
                glow: "bg-violet-400/10", border: "border-violet-500/15", accent: "text-violet-400",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                deco: "from-violet-500/20 via-purple-400/10 to-transparent",
              },
              {
                num: "03",
                title: whyUsContent.card3_title || "Unlimited Revisions",
                desc:  whyUsContent.card3_desc  || "We iterate until you're fully satisfied. No extra charges for revisions.",
                glow: "bg-emerald-400/10", border: "border-emerald-500/15", accent: "text-emerald-400",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                deco: "from-emerald-500/20 via-teal-400/10 to-transparent",
              },
            ].map((item) => (
              <div key={item.title}
                className={`group relative p-10 border ${item.border} bg-zinc-900 hover:bg-zinc-900/80 transition-all duration-300 overflow-hidden`}
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
              >
                {/* Gradient glow in top-right */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Top diagonal gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.deco} opacity-40`} />
                <span className="absolute top-5 right-6 font-display text-[10px] font-black tracking-[0.2em] text-zinc-700 group-hover:text-zinc-600 transition-colors">
                  {item.num}
                </span>
                <div className={`${item.accent} mb-6 relative`}>{item.icon}</div>
                <h3 className={`font-display text-xl font-bold mb-3 transition-colors duration-300 text-white group-hover:${item.accent}`}>
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">{item.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.deco} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">
                  {testimonialsContent.badge || "Client Reviews"}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[0.95]">
                {testimonialsContent.headline || "What clients say"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <Link href="/reviews"
                className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-zinc-400 hover:text-gold-500 transition-colors"
              >
                Read all reviews
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 md:py-40 bg-[#060606] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        {/* Abstract art — CTA */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle cx="600" cy="300" r="300" fill="url(#cta1)" />
          <ellipse cx="200" cy="500" rx="200" ry="150" fill="url(#cta2)" />
          <ellipse cx="1000" cy="100" rx="180" ry="130" fill="url(#cta3)" />
          <polygon points="600,50 900,200 850,500 350,500 300,200" fill="url(#cta4)" opacity="0.4" />
          <defs>
            <radialGradient id="cta1"><stop offset="0%" stopColor="#e8bd5a" stopOpacity="1"/><stop offset="100%" stopColor="#c8891a" stopOpacity="0"/></radialGradient>
            <radialGradient id="cta2"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></radialGradient>
            <radialGradient id="cta3"><stop offset="0%" stopColor="#10b981" stopOpacity="0.7"/><stop offset="100%" stopColor="#059669" stopOpacity="0"/></radialGradient>
            <radialGradient id="cta4"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.5"/><stop offset="100%" stopColor="#db2777" stopOpacity="0"/></radialGradient>
          </defs>
        </svg>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gold-500/40" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-400">
              {ctaContent.badge || "Let's Create"}
            </span>
            <div className="h-px w-12 bg-gold-500/40" />
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[0.9] mb-6">
            {ctaContent.headline || "Ready to start something great?"}
          </h2>
          <p className="text-zinc-500 text-lg mb-14 font-light max-w-xl mx-auto">
            {ctaContent.subtext || "Tell us about your project and let's build something extraordinary together."}
          </p>
          <Link href="/contact"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#faf8f4] text-zinc-900 text-sm font-bold tracking-wide hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-2xl shadow-black/40"
            style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
          >
            {ctaContent.button_text || "Start a Project"}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Contact Preview ──────────────────────────────────────── */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">
                {contactContent.badge || "Get In Touch"}
              </span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[0.95] mb-4">
              {contactContent.headline || "Start a conversation"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-sm">{contactContent.subtext}</p>
          </div>
          <div className="border border-zinc-100 dark:border-zinc-800/60 p-8 md:p-12 bg-[#faf8f4] dark:bg-[#0c0c0c] card-grain"
            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
          >
            <ContactForm compact />
          </div>
        </div>
      </section>
    </>
  );
}
