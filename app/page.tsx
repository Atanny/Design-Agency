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
  const [reviews, heroContent, servicesContent, portfolioContent, testimonialsContent, ctaContent, contactContent] =
    await Promise.all([
      getFeaturedReviews(),
      getContent("hero"), getContent("services_section"), getContent("portfolio_section"),
      getContent("testimonials_section"), getContent("cta_section"), getContent("contact_section"),
    ]);

  return (
    <>
      <Hero content={heroContent} />

      <ServicesSection content={servicesContent} />

      {/* ── Process Section ─────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

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
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">How We Work</span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[0.95] mb-8">
                Design built<br />
                <span className="italic font-light text-zinc-400 dark:text-zinc-500">around your</span><br />
                goals
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12 font-light max-w-sm">
                We start with a deep understanding of your brand, audience, and objectives. Every design decision is intentional.
              </p>

              {/* Steps */}
              <div className="space-y-0">
                {[
                  { step: "01", title: "Discovery", desc: "We learn your brand, goals, and audience inside out." },
                  { step: "02", title: "Design",    desc: "We craft visuals that are both beautiful and purposeful." },
                  { step: "03", title: "Deliver",   desc: "Print-ready or screen-ready files, on time, every time." },
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

            {/* Right — abstract design canvas */}
            <div className="relative h-[480px] hidden lg:block">
              <div className="absolute inset-0 border border-zinc-200 dark:border-zinc-800/60"
                style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-[#0a0a0a]" />
                {/* Design system mockup inside */}
                <div className="absolute inset-8 grid grid-cols-2 grid-rows-2 gap-4">
                  {["Brand Identity", "UI Design", "Poster Design", "Social Media"].map((label, i) => (
                    <div key={label}
                      className={`flex flex-col items-start justify-end p-5 transition-all duration-500 ${
                        i % 2 === 0
                          ? "bg-zinc-900 dark:bg-zinc-800 text-white"
                          : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                      }`}
                      style={{ clipPath: i === 1 ? "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" : "none" }}
                    >
                      <div className={`w-6 h-6 mb-3 ${i % 2 === 0 ? "bg-gold-500/30" : "bg-zinc-100 dark:bg-zinc-700"}`} />
                      <span className={`text-xs font-bold tracking-wide ${i % 2 === 0 ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Corner decoration */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border border-gold-400/20"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
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
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-400">Why Lumis Studio</span>
              <div className="h-px w-12 bg-gold-500/50" />
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight leading-[0.95]">
              Designed{" "}
              <span className="italic font-light text-zinc-500">differently</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/40">
            {[
              { num: "01", icon: "⚡", title: "Fast Turnaround",      desc: "Most projects delivered within 3–7 days without sacrificing quality." },
              { num: "02", icon: "🎯", title: "Strategy-First",       desc: "Every design decision is grounded in your brand goals and audience." },
              { num: "03", icon: "♾️", title: "Unlimited Revisions",  desc: "We iterate until you're fully satisfied. No extra charges for revisions." },
            ].map((item) => (
              <div key={item.title}
                className="group relative bg-[#060606] p-10 hover:bg-zinc-900/80 transition-colors duration-300 overflow-hidden"
              >
                <span className="absolute top-6 right-6 font-display text-[10px] font-black tracking-[0.2em] text-zinc-700 group-hover:text-gold-500/30 transition-colors">
                  {item.num}
                </span>
                <span className="text-4xl mb-6 block">{item.icon}</span>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-gold-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">{item.desc}</p>
                {/* Bottom line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(200,137,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,137,26,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

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
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-zinc-900 text-sm font-bold tracking-wide hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-2xl shadow-black/40"
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
          <div className="border border-zinc-100 dark:border-zinc-800/60 p-8 md:p-12 bg-white dark:bg-[#0c0c0c] card-grain"
            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
          >
            <ContactForm compact />
          </div>
        </div>
      </section>
    </>
  );
}
