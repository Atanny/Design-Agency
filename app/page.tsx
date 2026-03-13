import { Metadata } from "next";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import { ReviewCard } from "@/components/ReviewCard";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

export const revalidate = 0;

async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data as Review[]) || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [
    reviews,
    heroContent,
    servicesContent,
    portfolioContent,
    testimonialsContent,
    ctaContent,
    contactContent,
  ] = await Promise.all([
    getFeaturedReviews(),
    getContent("hero"),
    getContent("services_section"),
    getContent("portfolio_section"),
    getContent("testimonials_section"),
    getContent("cta_section"),
    getContent("contact_section"),
  ]);

  return (
    <>
      {/* Hero */}
      <Hero content={heroContent} />

      {/* Services */}
      <ServicesSection content={servicesContent} />

      {/* Process / Visual break section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">How We Work</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
                Design that's built around your goals
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                We start with a deep understanding of your brand, your audience, and your objectives. Every design decision is intentional — nothing is just decorative.
              </p>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Discovery", desc: "We learn your brand, goals, and audience inside out." },
                  { step: "02", title: "Design", desc: "We craft visuals that are both beautiful and purposeful." },
                  { step: "03", title: "Deliver", desc: "Print-ready or screen-ready files, on time, every time." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start p-4 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                    <span className="text-gold-500 font-display font-bold text-lg w-8 flex-shrink-0">{item.step}</span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-gold-400/20 to-zinc-200 dark:from-gold-500/10 dark:to-zinc-800 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8 w-full">
                  {["Brand Identity", "UI Design", "Poster Design", "Social Media"].map((label, i) => (
                    <div key={label} className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 ${
                      i % 2 === 0
                        ? "bg-white dark:bg-zinc-900 shadow-lg"
                        : "bg-zinc-900 dark:bg-white"
                    }`}>
                      <span className={`text-xs font-semibold ${i % 2 === 0 ? "text-zinc-900 dark:text-white" : "text-white dark:text-zinc-900"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl gradient-gold opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-3">
                {portfolioContent.badge}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {portfolioContent.headline}
              </h2>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors group">
              {portfolioContent.view_all}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <PortfolioGrid limit={6} showFilters={false} showViewAll />
        </div>
      </section>

      {/* Why Us / Visual feature strip */}
      <section className="py-20 bg-zinc-900 dark:bg-zinc-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-4">Why Lumis Studio</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Designed differently</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Fast Turnaround", desc: "Most projects delivered within 3–7 days without sacrificing quality." },
              { icon: "🎯", title: "Strategy-First", desc: "Every design decision is grounded in your brand goals and audience." },
              { icon: "♾️", title: "Unlimited Revisions", desc: "We iterate until you're fully satisfied. No extra charges for revisions." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl border border-zinc-800 hover:border-gold-500/30 hover:bg-zinc-800/50 transition-all group">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-gold-400 transition-colors">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-3">
                {testimonialsContent.badge}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {testimonialsContent.headline}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/reviews" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                Read all reviews →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-zinc-950 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-4">{ctaContent.badge}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {ctaContent.headline}
          </h2>
          <p className="text-zinc-400 text-lg mb-10">{ctaContent.subtext}</p>
          <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
            {ctaContent.button_text}
          </Link>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-3">
              {contactContent.badge}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
              {contactContent.headline}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">{contactContent.subtext}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 shadow-xl shadow-zinc-100/50 dark:shadow-none">
            <ContactForm compact />
          </div>
        </div>
      </section>
    </>
  );
}
