import { Metadata } from "next";
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

  const ctaBg      = ctaContent.bg_image     || "";
  const processBg  = processContent.bg_image || "";
  const whyUsBg    = whyUsContent.bg_image   || "";

  return (
    <div className="bg-[#0a0a0a]">
      <Hero content={heroContent} />

      <ServicesSection content={servicesContent} />

      {/* ── PORTFOLIO SECTION ── */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header bento row */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-12 md:col-span-9 rounded-2xl bg-zinc-900 p-8 flex items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-6 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{portfolioContent.badge || "Our Work"}</span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.95]">
                  {portfolioContent.headline || "Selected Work"}
                </h2>
              </div>
              <Link href="/portfolio"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-coral-400 hover:text-coral-400 transition-all flex-shrink-0">
                View all work
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="col-span-12 md:col-span-3 rounded-2xl bg-espresso-800 p-6 flex flex-col justify-center items-center text-center gap-2">
              <span className="font-display font-black text-4xl text-white">✦</span>
              <p className="text-zinc-400 text-xs leading-relaxed">Every pixel crafted with intention</p>
            </div>
          </div>
          <PortfolioGrid limit={7} showFilters={false} showViewAll />
        </div>
      </section>

      {/* ── PROCESS SECTION ── */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-3">

            {/* Process visual tile — image bg if set */}
            <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[360px]"
              style={{ background: processBg ? undefined : "linear-gradient(145deg,#1a1009,#0f0a06)" }}>
              {processBg ? (
                <>
                  <img src={processBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60" />
                </>
              ) : (
                <div className="absolute inset-0 dot-pattern opacity-20" />
              )}
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-6 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{processContent.badge || "How We Work"}</span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-[0.95]">
                  {processContent.headline_line1 || "Design built"}{" "}
                  <span className="italic font-light text-white/50">{processContent.headline_line2 || "around your"}</span>{" "}
                  {processContent.headline_line3 || "goals"}
                </h2>
                <p className="text-zinc-400 text-sm mt-4 font-light">
                  {processContent.subtext || "We start with a deep understanding of your brand, audience, and objectives."}
                </p>
              </div>
            </div>

            {/* Steps tiles */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-1 gap-3">
              {[
                { step: processContent.step1_num||"01", title: processContent.step1_title||"Discovery", desc: processContent.step1_desc||"We learn your brand, goals, and audience inside out.", accent:"bg-coral-400/10 text-coral-400" },
                { step: processContent.step2_num||"02", title: processContent.step2_title||"Design",    desc: processContent.step2_desc||"We craft visuals that are both beautiful and purposeful.", accent:"bg-amber-300/10 text-amber-300" },
                { step: processContent.step3_num||"03", title: processContent.step3_title||"Deliver",   desc: processContent.step3_desc||"Print-ready or screen-ready files, on time, every time.", accent:"bg-emerald-400/10 text-emerald-400" },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex items-start gap-5 group hover:border-zinc-700 transition-colors">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${item.accent}`}>{item.step}</span>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US SECTION ── */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-12 rounded-2xl bg-zinc-900 p-8 text-center relative overflow-hidden">
              {whyUsBg && (
                <>
                  <img src={whyUsBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
                  <div className="absolute inset-0 bg-[#0a0a0a]/70" />
                </>
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-8 bg-coral-400/40" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{whyUsContent.badge||"Why Choose Us"}</span>
                  <div className="h-px w-8 bg-coral-400/40" />
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.95]">
                  {whyUsContent.headline||"Designed"}{" "}
                  <span className="italic font-light text-zinc-500">{whyUsContent.headline_italic||"differently"}</span>
                </h2>
              </div>
            </div>
          </div>
          {/* Feature tiles */}
          <div className="grid grid-cols-12 gap-3">
            {[
              { num:"01", title:whyUsContent.card1_title||"Fast Turnaround",    desc:whyUsContent.card1_desc||"Most projects delivered within 3–7 days without sacrificing quality.", bg:"bg-coral-400", text:"text-white" },
              { num:"02", title:whyUsContent.card2_title||"Strategy-First",     desc:whyUsContent.card2_desc||"Every design decision is grounded in your brand goals and audience.", bg:"bg-zinc-900 border border-zinc-800", text:"text-white" },
              { num:"03", title:whyUsContent.card3_title||"Unlimited Revisions", desc:whyUsContent.card3_desc||"We iterate until you're fully satisfied. No extra charges.", bg:"bg-amber-300", text:"text-espresso-800" },
            ].map((card, i) => (
              <div key={card.title} className={`col-span-12 md:col-span-4 rounded-2xl ${card.bg} p-8 flex flex-col justify-between min-h-[200px]`}>
                <span className={`font-display font-black text-5xl leading-none opacity-15 ${card.text}`}>{card.num}</span>
                <div>
                  <h3 className={`font-display font-bold text-xl mb-2 ${card.text}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${i===1?"text-zinc-500":i===2?"text-espresso-600":"text-white/80"}`}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      {reviews.length > 0 && (
        <section className="py-12 md:py-16 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-6 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{testimonialsContent.badge||"Client Reviews"}</span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white leading-[0.95]">
                  {testimonialsContent.headline||"What clients say"}
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4 rounded-2xl bg-espresso-800 p-6 flex flex-col justify-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s=><span key={s} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-zinc-400 text-sm">Consistently top-rated by our clients</p>
                <Link href="/reviews" className="text-coral-400 text-xs font-bold tracking-widest uppercase hover:text-coral-300 transition-colors">
                  Read all reviews →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3">
              {reviews.map((review, i) => (
                <div key={review.id} className={`${i===0?"col-span-12 md:col-span-5":i===1?"col-span-12 md:col-span-7":i===2?"col-span-12 md:col-span-7":i===3?"col-span-12 md:col-span-5":"col-span-12 md:col-span-4"}`}>
                  <ReviewCard review={review} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA SECTION ── */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl overflow-hidden min-h-[360px] flex items-center justify-center p-10 md:p-16 text-center"
            style={{ background: ctaBg ? undefined : "linear-gradient(145deg,#1a1009,#0f0a06)" }}>
            {ctaBg ? (
              <>
                <img src={ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 dot-pattern opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-coral-400/10 blur-3xl" />
              </>
            )}
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 bg-coral-400/50" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{ctaContent.badge||"Let's Create"}</span>
                <div className="h-px w-8 bg-coral-400/50" />
              </div>
              <h2 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9] mb-5">
                {ctaContent.headline||"Ready to start something great?"}
              </h2>
              <p className="text-zinc-400 text-lg mb-10 font-light">
                {ctaContent.subtext||"Tell us about your project and let's build something extraordinary together."}
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-coral-400 text-white text-sm font-bold hover:bg-coral-500 transition-all shadow-xl shadow-coral-400/25">
                {ctaContent.button_text||"Start a Project"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-5 rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6 bg-coral-400" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{contactContent.badge||"Get In Touch"}</span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-[0.95] mb-4">
                  {contactContent.headline||"Start a conversation"}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">{contactContent.subtext||"Drop us a message and we'll get back to you within 24 hours."}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
                {[
                  { icon:"📍", label:"Philippines" },
                  { icon:"⚡", label:"24hr response" },
                  { icon:"✦", label:"Free consultation" },
                ].map(item=>(
                  <div key={item.label} className="flex items-center gap-3 text-zinc-500 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 md:col-span-7 rounded-2xl bg-zinc-900 p-8">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
