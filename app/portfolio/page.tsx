export const revalidate = 0;
import { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore our design portfolio. UI/UX, branding, poster design, social media graphics, and website design projects.",
};

export default async function PortfolioPage() {
  const content = await getContent("portfolio_section");
  const bgImage = content.bg_image || "";

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero bento row */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden relative min-h-[220px] flex items-end p-8"
            style={{ background: bgImage ? undefined : "linear-gradient(145deg,#1a1009,#0f0a06)" }}>
            {bgImage && (
              <>
                <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-black/60" />
              </>
            )}
            {!bgImage && <div className="absolute inset-0 dot-pattern opacity-20" />}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-6 bg-coral-400" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">Our Work</span>
              </div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9]">Portfolio</h1>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-coral-400 p-8 flex flex-col justify-end gap-2">
            <p className="text-white/70 text-sm font-light">A selection of our finest work.</p>
            <p className="text-white font-display font-black text-2xl leading-tight">Each project represents our commitment to design excellence.</p>
          </div>
        </div>

        {/* Portfolio grid */}
        <div className="pb-12 md:pb-16">
          <PortfolioGrid showFilters />
        </div>
      </div>
    </div>
  );
}
