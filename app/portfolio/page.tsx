export const revalidate = 0;
import { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse my design portfolio — brand identities, UI/UX, posters, social media and web design projects.",
};

export default async function PortfolioPage() {
  const content = await getContent("portfolio_section");
  const bgImage = content.bg_image || "";

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden relative min-h-[200px] flex flex-col justify-end p-8"
            style={{ background: bgImage ? undefined : "linear-gradient(160deg,#161009,#0c0804)" }}>
            {bgImage && (
              <>
                <img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-black/65" />
              </>
            )}
            {!bgImage && <div className="absolute inset-0 dot-pattern opacity-[0.1]" />}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-5 bg-coral-400" />
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">
                  {content.badge || "My Work"}
                </span>
              </div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9]">Portfolio</h1>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-coral-400 p-8 flex flex-col justify-end gap-3">
            <p className="text-white/80 text-sm leading-relaxed font-light">
              Real projects, real results. Each one tells the story of a design challenge solved.
            </p>
            <p className="font-display font-black text-white text-xl leading-tight">
              Every pixel crafted with intention.
            </p>
          </div>
        </div>

        <div className="pb-12 md:pb-16">
          <PortfolioGrid showFilters />
        </div>
      </div>
    </div>
  );
}
