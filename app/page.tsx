import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import { ReviewCard } from "@/components/ReviewCard";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

export const revalidate = 0; // always fresh — so admin updates show immediately

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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page", "home").single();
    return {
      title: data?.meta_title || "Lumis Studio — Design That Elevates Brands",
      description: data?.meta_description || "Premium UI/UX, branding, and visual design studio.",
      openGraph: data?.og_image ? { images: [data.og_image] } : undefined,
    };
  } catch {
    return { title: "Lumis Studio — Design That Elevates Brands" };
  }
}

export default async function Home() {
  const [reviews, heroContent, servicesContent, portfolioContent, testimonialsContent, ctaContent, contactContent] = await Promise.all([
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
      <Navbar />
      <main>
        {/* Hero - stats are live from DB */}
        <Hero content={heroContent} />

        {/* Services */}
        <ServicesSection content={servicesContent} />

        {/* Portfolio Preview */}
        <section className="section-pad bg-zinc-50 dark:bg-zinc-900/50">
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
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors group"
              >
                {portfolioContent.view_all}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <PortfolioGrid limit={6} showFilters={false} showViewAll />
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
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-4">
              {ctaContent.badge}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {ctaContent.headline}
            </h2>
            <p className="text-zinc-400 text-lg mb-10">{ctaContent.subtext}</p>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
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
      </main>
      <Footer />
    </>
  );
}
