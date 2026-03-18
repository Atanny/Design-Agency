export const revalidate = 0;
import { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getContent } from "@/lib/content";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgCircles } from "@/components/BgDecor";
import Link from "next/link";

export const metadata: Metadata = { title:"Portfolio", description:"Browse my design portfolio." };

export default async function PortfolioPage() {
  const content = await getContent("portfolio_section");
  const bgImage = content.bg_image || "";
  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero bento row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-8 rounded-2xl relative overflow-hidden min-h-[240px] flex flex-col justify-between p-8 md:p-10"
            style={{ background: bgImage ? undefined : "linear-gradient(160deg,#1a0f08,#0c0804)" }}>
            {bgImage
              ? <><img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25"/><div className="absolute inset-0 bg-black/65"/></>
              : <><BgDiagonalLines dark opacity={0.8}/><BgMeshGrid dark opacity={0.5}/></>
            }
            <BgGlowBlob color="coral" position="tr" />
            <BgWatermark text="PORTFOLIO" className="text-white" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">{content.badge||"My Work"}</span></div>
              <h1 className="font-display font-black text-white leading-[0.88]" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)"}}>Portfolio</h1>
            </div>
            <div className="relative z-10">
              <p className="text-white/45 text-sm font-light max-w-md">A curated selection of projects that showcase what I can do for your brand.</p>
            </div>
          </div>

          <div className="md:col-span-4 rounded-2xl bg-coral-400 relative overflow-hidden p-8 flex flex-col justify-between min-h-[240px]">
            <BgDots dark opacity={0.5} />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Real projects</span>
              <p className="font-display font-black text-white text-2xl leading-tight">Every pixel crafted with intention.</p>
            </div>
            <div className="relative z-10">
              <p className="text-white/70 text-sm font-light leading-relaxed mb-4">Each project is a story of a design challenge solved with care.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-semibold hover:bg-espresso-800 hover:text-white transition-all">
                Start a project →
              </Link>
            </div>
          </div>
        </div>

        {/* Filters + Grid section */}
        <div className="bento-card relative overflow-hidden p-6 md:p-8 mb-5">
          <BgMeshGrid opacity={0.4} />
          <BgGlowBlob color="amber" position="br" />
          <div className="relative z-10">
            <PortfolioGrid showFilters />
          </div>
        </div>
      </div>
    </div>
  );
}
