export const revalidate = 0;
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
import { createServerClient } from "@/lib/supabaseClient";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgTopography, BgCircles } from "@/components/BgDecor";

export async function generateMetadata(): Promise<Metadata> {
  try { const s=createServerClient(); const{data}=await s.from("seo_settings").select("*").eq("page","contact").single(); return{title:data?.meta_title||"Contact",description:data?.meta_description||"Hire me."}; }
  catch { return {title:"Contact"}; }
}

export default async function ContactPage() {
  const c = await getContent("contact_page");
  const bgImage = c.bg_image || "";

  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-7 rounded-2xl relative overflow-hidden min-h-[260px] flex flex-col justify-between p-8 md:p-10"
            style={{ background: bgImage ? undefined : "linear-gradient(160deg,#1a0f08,#0c0804)" }}>
            {bgImage
              ? <><img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-22"/><div className="absolute inset-0 bg-black/68"/></>
              : <><BgMeshGrid dark opacity={0.7}/><BgDiagonalLines dark opacity={0.6}/></>
            }
            <BgGlowBlob color="coral" position="tr" />
            <BgWatermark text="CONTACT" className="text-white" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">{c.badge||"Contact"}</span></div>
              <h1 className="font-display font-black text-white leading-[0.88] mb-4" style={{fontSize:"clamp(2.5rem,6vw,5rem)"}}>{c.headline||"Let's Work Together"}</h1>
            </div>
            <div className="relative z-10">
              <p className="text-white/45 text-sm leading-relaxed max-w-md font-light">{c.subtext||"I'm currently available for new projects."}</p>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-rows-3 gap-3">
            {[
              {icon:"📬",label:"Email",     value:c.email||"",    href:c.email?`mailto:${c.email}`:undefined},
              {icon:"⏱", label:"I reply",  value:c.response||"Within 24 hours"},
              {icon:"📍",label:"Based in", value:c.location||"Philippines"},
            ].map(item=>(
              <div key={item.label} className="bento-card relative overflow-hidden px-6 py-4 flex items-center gap-4">
                <BgDiagonalLines opacity={0.35} />
                <span className="relative z-10 text-xl w-6 text-center flex-shrink-0">{item.icon}</span>
                <div className="relative z-10 min-w-0">
                  <p className="text-faint text-[10px] font-semibold uppercase tracking-widest mb-0.5">{item.label}</p>
                  {item.href
                    ? <a href={item.href} className="text-page text-sm font-medium hover:text-coral-500 transition-colors truncate block">{item.value||"—"}</a>
                    : <p className="text-page text-sm font-medium">{item.value||"—"}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pb-14">
          <div className="lg:col-span-8 bento-card relative overflow-hidden p-8 md:p-10 min-h-[420px] flex flex-col">
            <BgMeshGrid opacity={0.4} />
            <BgGlowBlob color="coral" position="tr" />
            <p className="relative z-10 text-[10px] font-semibold tracking-[0.2em] uppercase text-coral-500 mb-6">Tell me about your project</p>
            <div className="relative z-10 flex-1"><ContactForm/></div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="rounded-2xl bg-coral-400 relative overflow-hidden p-8 flex-1 flex flex-col justify-between min-h-[200px]">
              <BgDots dark opacity={0.5} />
              <div className="relative z-10 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-2xl">📞</div>
              <div className="relative z-10">
                <h3 className="font-display font-bold text-white text-xl mb-2">{c.discovery_title||"Free Discovery Call"}</h3>
                <p className="text-white/75 text-sm leading-relaxed font-light">{c.discovery_text||"Not sure what you need? Book a free 30-minute call — no pressure."}</p>
              </div>
            </div>
            <div className="bento-card relative overflow-hidden p-7 min-h-[160px] flex flex-col justify-between">
              <BgCircles />
              <BgGlowBlob color="amber" position="bl" />
              <div className="relative z-10">
                <p className="text-body text-sm leading-relaxed mb-4 font-light">I work with startups, small businesses, and creatives who want design that actually means something.</p>
                <div className="flex flex-wrap gap-2">
                  {["UI/UX","Branding","Print","Social","Web"].map(t=>(
                    <span key={t} className="px-2.5 py-1 rounded-full border border-card text-muted text-[11px] font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
