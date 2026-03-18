import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import ReviewCard from "@/components/ReviewCard";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

export const revalidate = 0;

async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("reviews").select("*").eq("approved", true)
      .order("created_at", { ascending: false }).limit(6);
    return (data as Review[]) || [];
  } catch { return []; }
}

export default async function Home() {
  const [
    reviews,
    heroContent, servicesContent, portfolioContent,
    testimonialsContent, ctaContent, contactContent,
    processContent, whyUsContent,
  ] = await Promise.all([
    getFeaturedReviews(),
    getContent("hero"), getContent("services_section"), getContent("portfolio_section"),
    getContent("testimonials_section"), getContent("cta_section"), getContent("contact_section"),
    getContent("process_section"), getContent("why_us_section"),
  ]);

  const ctaBg     = ctaContent.bg_image    || "";
  const processBg = processContent.bg_image || "";
  const whyUsBg   = whyUsContent.bg_image  || "";

  return (
    <div className="bg-[#0a0a0a]">
      <Hero content={heroContent} />
      <ServicesSection content={servicesContent} />

      {/* ── PORTFOLIO ── */}
      <section className="py-10 md:py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-3 mb-3">

            {/* Label + title */}
            <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-7 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-5 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                    {portfolioContent.badge || "My Work"}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.93]">
                  {portfolioContent.headline || "Selected Projects"}
                </h2>
              </div>
              <Link href="/portfolio"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-coral-400 hover:text-coral-400 transition-all flex-shrink-0">
                View all
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Decorative callout tile */}
            <div className="col-span-12 md:col-span-4 rounded-2xl bg-espresso-800 p-7 flex flex-col justify-between gap-2">
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Real projects, real results. Each one is a story of solving a unique design challenge.
              </p>
              <span className="font-display font-black text-3xl text-white/10 select-none">✦</span>
            </div>
          </div>
          <PortfolioGrid limit={7} showFilters={false} showViewAll />
        </div>
      </section>

      {/* ── HOW I WORK ── */}
      <section className="py-10 md:py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-3">

            {/* Visual / intro tile */}
            <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[320px] flex flex-col justify-end"
              style={{ background: processBg ? undefined : "linear-gradient(160deg,#161009,#0c0804)" }}>
              {processBg ? (
                <>
                  <img src={processBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/65" />
                </>
              ) : (
                <div className="absolute inset-0 dot-pattern opacity-[0.12]" />
              )}
              <div className="relative z-10 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-5 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                    {processContent.badge || "How I Work"}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-[0.93]">
                  {processContent.headline_line1 || "Simple process,"}{" "}
                  <span className="italic font-light text-white/40">{processContent.headline_line2 || "extraordinary"}</span>{" "}
                  {processContent.headline_line3 || "results"}
                </h2>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-light max-w-xs">
                  {processContent.subtext || "I keep things clear and collaborative. You'll know exactly what's happening at every stage."}
                </p>
              </div>
            </div>

            {/* Step tiles */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-1 gap-3">
              {[
                {
                  step: processContent.step1_num || "01",
                  title: processContent.step1_title || "We Talk",
                  desc: processContent.step1_desc || "Tell me about your project, goals, and timeline. I'll ask the right questions.",
                  color: "bg-coral-400/10 text-coral-400",
                },
                {
                  step: processContent.step2_num || "02",
                  title: processContent.step2_title || "I Design",
                  desc: processContent.step2_desc || "I create focused concepts tailored to your brand. You review, give feedback, and I refine.",
                  color: "bg-amber-300/10 text-amber-300",
                },
                {
                  step: processContent.step3_num || "03",
                  title: processContent.step3_title || "You Launch",
                  desc: processContent.step3_desc || "You get all your files properly organised. No extra fees, no surprises.",
                  color: "bg-emerald-400/10 text-emerald-400",
                },
              ].map((item, i) => (
                <div key={item.step}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex items-start gap-5 hover:border-zinc-700 transition-colors">
                  {/* Step badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xs flex-shrink-0 ${item.color}`}>
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-white text-lg mb-1.5 leading-snug">{item.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HIRE ME ── */}
      <section className="py-10 md:py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-12 rounded-2xl bg-zinc-900 p-7 relative overflow-hidden">
              {whyUsBg && (
                <>
                  <img src={whyUsBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-10" />
                  <div className="absolute inset-0 bg-[#111]/80" />
                </>
              )}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-5 bg-coral-400/60" />
                    <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                      {whyUsContent.badge || "Why Work With Me"}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.93]">
                    {whyUsContent.headline || "Personal attention"}{" "}
                    <span className="italic font-light text-zinc-500">{whyUsContent.headline_italic || "every project"}</span>
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed md:max-w-xs md:text-right">
                  When you hire me, you get me — not a junior or a template.
                </p>
              </div>
            </div>
          </div>

          {/* Feature tiles */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4 rounded-2xl bg-coral-400 p-7 flex flex-col justify-between min-h-[200px]">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{whyUsContent.card1_title || "Fast Turnaround"}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{whyUsContent.card1_desc || "Most projects delivered within 3–7 days. I respect your deadlines like they're my own."}</p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-7 flex flex-col justify-between min-h-[200px] hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-full bg-violet-400/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{whyUsContent.card2_title || "Direct Communication"}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{whyUsContent.card2_desc || "You work directly with me — no account managers, no handoffs, no miscommunication."}</p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-2xl bg-amber-300 p-7 flex flex-col justify-between min-h-[200px]">
              <div className="w-10 h-10 rounded-full bg-espresso-800/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-espresso-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-espresso-800 mb-2">{whyUsContent.card3_title || "Unlimited Revisions"}</h3>
                <p className="text-espresso-600 text-sm leading-relaxed">{whyUsContent.card3_desc || "I refine until you're genuinely happy. Your satisfaction is the only milestone that matters."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <section className="py-10 md:py-14 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">

            <div className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-5 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                    {testimonialsContent.badge || "Client Words"}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.93]">
                  {testimonialsContent.headline || "Kind words"}
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4 rounded-2xl bg-espresso-800 p-7 flex flex-col justify-between gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">Consistently rated 5 stars by people who trusted me with their brand.</p>
                <Link href="/reviews" className="text-coral-400 text-[11px] font-bold tracking-widest uppercase hover:text-coral-300 transition-colors self-start">
                  Read all reviews →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {reviews.map((review, i) => {
                const span = i === 0 ? "col-span-12 md:col-span-5"
                  : i === 1 ? "col-span-12 md:col-span-7"
                  : i === 2 ? "col-span-12 md:col-span-7"
                  : i === 3 ? "col-span-12 md:col-span-5"
                  : "col-span-12 md:col-span-4";
                return (
                  <div key={review.id} className={span}>
                    <ReviewCard review={review} index={i} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-10 md:py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl overflow-hidden p-10 md:p-16 text-center"
            style={{ background: ctaBg ? undefined : "linear-gradient(160deg,#161009,#0c0804)" }}>
            {ctaBg ? (
              <>
                <img src={ctaBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70" />
              </>
            ) : (
              <div className="absolute inset-0 dot-pattern opacity-[0.08]" />
            )}
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-coral-400/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-6 bg-coral-400/40" />
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">{ctaContent.badge || "Let's Work Together"}</span>
                <div className="h-px w-6 bg-coral-400/40" />
              </div>
              <h2 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9] mb-5">
                {ctaContent.headline || "Got a project in mind?"}
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-10 font-light">
                {ctaContent.subtext || "I'd love to hear about it. Let's create something you're proud to show off."}
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-coral-400/20">
                {ctaContent.button_text || "Start a Conversation"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-10 md:py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-3">

            <div className="col-span-12 md:col-span-5 rounded-2xl bg-zinc-900 p-7 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-5 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                    {contactContent.badge || "Get In Touch"}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-[0.93] mb-3">
                  {contactContent.headline || "Let's talk about your project"}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {contactContent.subtext || "Drop me a message and I'll get back to you within 24 hours."}
                </p>
              </div>
              <div className="space-y-3 pt-4 border-t border-zinc-800/60">
                {[
                  { icon: "📍", label: "Based in Philippines" },
                  { icon: "⚡", label: "Replies within 24 hours" },
                  { icon: "✦",  label: "Free first consultation" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span className="text-zinc-400 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 rounded-2xl bg-zinc-900 p-7 md:p-8">
              <ContactForm compact />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
