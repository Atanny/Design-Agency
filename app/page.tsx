import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import ReviewCard from "@/components/ReviewCard";
import { BgMeshGrid, BgDots, BgDiagonalLines, BgCircles, BgGlowBlob, BgWatermark, BgTopography, BgHex, BgCornerAccent } from "@/components/BgDecor";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

export const revalidate = 0;

async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("reviews").select("*").eq("approved",true).order("created_at",{ascending:false}).limit(6);
    return (data as Review[]) || [];
  } catch { return []; }
}

function Badge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px w-5 bg-coral-400 flex-shrink-0" />
      <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-500">{label}</span>
    </div>
  );
}

export default async function Home() {
  const [reviews, heroC, servC, portC, testC, ctaC, conC, procC, whyC] = await Promise.all([
    getFeaturedReviews(),
    getContent("hero"), getContent("services_section"), getContent("portfolio_section"),
    getContent("testimonials_section"), getContent("cta_section"), getContent("contact_section"),
    getContent("process_section"), getContent("why_us_section"),
  ]);

  const ctaBg = ctaC.bg_image || ""; const procBg = procC.bg_image || ""; const whyBg = whyC.bg_image || "";

  return (
    <div className="bg-page">
      <Hero content={heroC} />
      <ServicesSection content={servC} />

      {/* ══════════════════════════════════════
          PORTFOLIO SECTION
      ══════════════════════════════════════ */}
      <section className="bg-page relative overflow-hidden py-16 md:py-24">
        {/* Full-section decorative background */}
        <BgMeshGrid opacity={0.5} />
        <BgGlowBlob color="coral" position="tr" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">

          {/* Header row — tiles stretch to same height */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">

            {/* Title tile */}
            <div className="md:col-span-8 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between h-full min-h-[180px]">
              <BgDiagonalLines opacity={0.6} />
              <BgWatermark text="WORK" />
              <div className="relative z-10">
                <Badge label={portC.badge || "My Work"} />
                <h2 className="font-display font-black text-page leading-[0.9] mt-1" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                  {portC.headline || "Selected Projects"}
                </h2>
              </div>
              <div className="relative z-10 mt-6">
                <Link href="/portfolio" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-card text-body text-sm font-medium hover:border-coral-400/60 hover:text-coral-500 transition-all">
                  View full portfolio
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            {/* Accent tile */}
            <div className="md:col-span-4 rounded-2xl bg-coral-400 relative overflow-hidden p-8 flex flex-col justify-between h-full min-h-[180px]">
              <BgDots dark opacity={0.5} />
              <BgCornerAccent dark />
              <div className="relative z-10">
                <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Every pixel</span>
              </div>
              <div className="relative z-10">
                <p className="font-display font-black text-white text-2xl leading-tight">crafted with intention.</p>
                <p className="text-white/70 text-sm mt-2 font-light leading-relaxed">Real problems. Real solutions. Real results.</p>
              </div>
            </div>
          </div>

          <PortfolioGrid limit={7} showFilters={false} showViewAll />
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS / HOW I WORK SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{backgroundColor:"var(--bg-section)"}}>
        <BgHex opacity={0.8} />
        <BgGlowBlob color="amber" position="bl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Visual hero tile */}
            <div className="lg:col-span-5 rounded-2xl relative overflow-hidden min-h-[400px] lg:min-h-0 flex flex-col justify-end"
              style={{ background: procBg ? undefined : "linear-gradient(160deg,#1a0f08 0%,#0c0804 100%)" }}>
              {procBg
                ? <><img src={procBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-espresso-900/70"/></>
                : <><BgDiagonalLines dark opacity={0.8}/><BgGlowBlob color="coral" position="tl"/></>
              }
              {/* Large number watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
                <span className="font-display font-black text-[11rem] leading-none text-white/[0.03]">3</span>
              </div>
              <div className="relative z-10 p-8 md:p-10">
                <Badge label={procC.badge || "How I Work"} />
                <h2 className="font-display font-black text-white leading-[0.9] mt-1" style={{fontSize:"clamp(2rem,3.5vw,3rem)"}}>
                  {procC.headline_line1 || "Simple process,"}<br/>
                  <em className="font-light italic text-white/40 not-italic">{procC.headline_line2 || "extraordinary"}</em><br/>
                  {procC.headline_line3 || "results"}
                </h2>
                <p className="text-white/50 text-sm mt-5 leading-relaxed font-light max-w-xs">
                  {procC.subtext || "You'll know exactly what's happening at every stage — no surprises, no ghosting."}
                </p>
              </div>
            </div>

            {/* Steps — each fills its grid cell */}
            <div className="lg:col-span-7 grid grid-cols-1 gap-3">
              {[
                { n:procC.step1_num||"01", t:procC.step1_title||"We Talk",    d:procC.step1_desc||"Tell me about your project, goals, and timeline. I ask the right questions upfront so nothing gets lost.", accent:"bg-coral-400/10 text-coral-500", decor:<BgDiagonalLines opacity={0.4}/> },
                { n:procC.step2_num||"02", t:procC.step2_title||"I Design",   d:procC.step2_desc||"I create focused, tailored concepts. You review, we talk, I refine. No guesswork — just clear collaboration.", accent:"bg-amber-300/10 text-amber-500", decor:<BgDots opacity={0.3}/> },
                { n:procC.step3_num||"03", t:procC.step3_title||"You Launch", d:procC.step3_desc||"All files delivered properly — print-ready or screen-ready. Clean handoff, zero extra charges.", accent:"bg-emerald-400/10 text-emerald-600", decor:<BgMeshGrid opacity={0.3}/> },
              ].map(item => (
                <div key={item.n} className="bento-card relative overflow-hidden p-7 flex items-start gap-5 h-full flex-1">
                  {item.decor}
                  <BgGlowBlob color="coral" position="br" />
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0 ${item.accent}`}>
                    {item.n}
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <h3 className="font-display font-bold text-page text-xl mb-2 leading-snug">{item.t}</h3>
                    <p className="text-body text-sm leading-relaxed font-light">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY HIRE ME SECTION
      ══════════════════════════════════════ */}
      <section className="bg-page relative overflow-hidden py-16 md:py-24">
        <BgTopography />
        <BgGlowBlob color="violet" position="center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">

          {/* Header tile — full width, tall */}
          <div className="bento-card relative overflow-hidden p-8 md:p-12 mb-3">
            <BgCircles />
            {whyBg && <><img src={whyBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.06]"/><div className="absolute inset-0 bg-page/85"/></>}
            <BgWatermark text="WHY ME" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <Badge label={whyC.badge || "Why Work With Me"} />
                <h2 className="font-display font-black text-page leading-[0.9] mt-1" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                  {whyC.headline || "Personal attention"}{" "}
                  <em className="text-gradient-primary not-italic italic">{whyC.headline_italic || "every project"}</em>
                </h2>
              </div>
              <div className="md:max-w-xs">
                <p className="text-body text-sm leading-relaxed font-light md:text-right">When you hire me, you get me — not a junior, not a template, not an AI that forgot your brief.</p>
              </div>
            </div>
          </div>

          {/* Feature tiles — 3 equal columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fast */}
            <div className="rounded-2xl bg-coral-400 relative overflow-hidden p-8 flex flex-col justify-between min-h-[260px]">
              <BgDots dark opacity={0.5} />
              <BgCornerAccent dark />
              <div className="relative z-10 w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div className="relative z-10">
                <div className="font-display font-black text-white/20 text-6xl leading-none mb-3 select-none">01</div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{whyC.card1_title||"Fast Turnaround"}</h3>
                <p className="text-white/75 text-sm leading-relaxed font-light">{whyC.card1_desc||"Most projects delivered within 3–7 days. I respect your deadlines like they're my own."}</p>
              </div>
            </div>
            {/* Direct */}
            <div className="bento-card relative overflow-hidden p-8 flex flex-col justify-between min-h-[260px]">
              <BgMeshGrid opacity={0.5} />
              <BgGlowBlob color="violet" position="tr" />
              <div className="relative z-10 w-11 h-11 rounded-xl bg-violet-400/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
              </div>
              <div className="relative z-10">
                <div className="font-display font-black text-faint text-6xl leading-none mb-3 select-none">02</div>
                <h3 className="font-display font-bold text-xl text-page mb-2">{whyC.card2_title||"Direct Communication"}</h3>
                <p className="text-body text-sm leading-relaxed font-light">{whyC.card2_desc||"You work directly with me — no account managers, no handoffs, no miscommunication."}</p>
              </div>
            </div>
            {/* Revisions */}
            <div className="rounded-2xl bg-amber-300 relative overflow-hidden p-8 flex flex-col justify-between min-h-[260px]">
              <BgDiagonalLines opacity={0.5} />
              <div className="relative z-10 w-11 h-11 rounded-xl bg-espresso-800/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-espresso-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </div>
              <div className="relative z-10">
                <div className="font-display font-black text-espresso-800/20 text-6xl leading-none mb-3 select-none">03</div>
                <h3 className="font-display font-bold text-xl text-espresso-800 mb-2">{whyC.card3_title||"Unlimited Revisions"}</h3>
                <p className="text-espresso-600 text-sm leading-relaxed font-light">{whyC.card3_desc||"I refine until you're genuinely happy. Your satisfaction is the only milestone that matters."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REVIEWS SECTION
      ══════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-24" style={{backgroundColor:"var(--bg-section)"}}>
          <BgDots opacity={0.4} />
          <BgGlowBlob color="amber" position="tr" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
              {/* Title tile */}
              <div className="md:col-span-8 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[200px]">
                <BgCircles />
                <BgWatermark text="KIND WORDS" />
                <div className="relative z-10">
                  <Badge label={testC.badge || "Client Words"} />
                  <h2 className="font-display font-black text-page leading-[0.9] mt-1" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                    {testC.headline || "Kind words"}
                  </h2>
                </div>
                <div className="relative z-10 mt-6">
                  <p className="text-body text-sm font-light">From real clients who trusted me with their brand.</p>
                </div>
              </div>
              {/* Stats tile */}
              <div className="md:col-span-4 rounded-2xl bg-espresso-800 relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]">
                <BgMeshGrid dark opacity={0.7} />
                <BgGlowBlob color="coral" position="br" />
                <div className="relative z-10 flex gap-0.5">
                  {[1,2,3,4,5].map(s=><span key={s} className="text-amber-400 text-xl">★</span>)}
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-xs leading-relaxed font-light mb-4">Consistently rated 5 stars by people who trusted me with their brand.</p>
                  <Link href="/reviews" className="inline-flex items-center gap-2 text-coral-400 text-[11px] font-semibold tracking-widest uppercase hover:text-coral-300 transition-colors">
                    Read all reviews
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Review cards — proper bento spans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              {reviews.map((review,i) => {
                const span = i===0?"lg:col-span-5":i===1?"lg:col-span-7":i===2?"lg:col-span-7":i===3?"lg:col-span-5":"lg:col-span-4";
                return (
                  <div key={review.id} className={`col-span-1 ${span} h-full`}>
                    <ReviewCard review={review} index={i}/>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="bg-page relative overflow-hidden py-16 md:py-24">
        <BgGlowBlob color="coral" position="center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-center justify-center"
            style={{ background: ctaBg ? undefined : "linear-gradient(160deg,#1a0f08 0%,#0c0804 100%)" }}>
            {ctaBg
              ? <><img src={ctaBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-black/72"/></>
              : <><BgDiagonalLines dark opacity={0.7}/><BgMeshGrid dark opacity={0.5}/></>
            }
            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-coral-400/10 blur-3xl pointer-events-none"/>
            <BgWatermark text="LET'S GO" className="text-white" />
            {/* Large number decoration */}
            <div className="absolute bottom-0 right-0 font-display font-black text-[14rem] leading-none text-white/[0.03] select-none pointer-events-none pr-4">✦</div>

            <div className="relative z-10 max-w-2xl mx-auto text-center px-8 py-16 md:py-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-coral-400/40"/>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">{ctaC.badge||"Let's Work Together"}</span>
                <div className="h-px w-8 bg-coral-400/40"/>
              </div>
              <h2 className="font-display font-black text-white leading-[0.88] mb-6" style={{fontSize:"clamp(2.5rem,6vw,5rem)"}}>
                {ctaC.headline||"Got a project in mind?"}
              </h2>
              <p className="text-white/50 leading-relaxed mb-10 font-light text-lg max-w-md mx-auto">
                {ctaC.subtext||"I'd love to hear about it. Let's create something you're proud to show off."}
              </p>
              <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-full gradient-primary text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-2xl shadow-coral-400/25">
                {ctaC.button_text||"Start a Conversation"}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{backgroundColor:"var(--bg-section)"}}>
        <BgHex opacity={0.6} />
        <BgGlowBlob color="emerald" position="bl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Info tile */}
            <div className="lg:col-span-5 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[420px]">
              <BgTopography />
              <BgWatermark text="HELLO" />
              <div className="relative z-10">
                <Badge label={conC.badge||"Get In Touch"} />
                <h2 className="font-display font-black text-page leading-[0.9] mt-1 mb-4" style={{fontSize:"clamp(2rem,3.5vw,3rem)"}}>
                  {conC.headline||"Let's talk about your project"}
                </h2>
                <p className="text-body text-sm leading-relaxed font-light">{conC.subtext||"Drop me a message and I'll get back to you within 24 hours."}</p>
              </div>
              <div className="relative z-10 space-y-4 pt-6 border-t border-card">
                {[
                  {icon:"📍", label:"Based in", value:"Philippines"},
                  {icon:"⚡", label:"Response", value:"Within 24 hours"},
                  {icon:"✦",  label:"First call", value:"Always free"},
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-lg w-6 text-center flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-faint text-[10px] font-semibold uppercase tracking-widest leading-none mb-0.5">{item.label}</p>
                      <p className="text-page text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form tile */}
            <div className="lg:col-span-7 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col min-h-[420px]">
              <BgDiagonalLines opacity={0.4} />
              <BgGlowBlob color="coral" position="tr" />
              <div className="relative z-10 flex-1 flex flex-col">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-coral-500 mb-6">Tell me about your project</p>
                <div className="flex-1">
                  <ContactForm compact/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
