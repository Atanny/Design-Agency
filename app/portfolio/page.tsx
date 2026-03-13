import { Metadata } from "next";
export const revalidate = 0;
import PortfolioGrid from "@/components/PortfolioGrid";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our design portfolio. UI/UX, branding, poster design, social media graphics, and website design projects.",
};

export default function PortfolioPage() {
  return (
    <>
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
              Our Work
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Portfolio
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              A selection of our finest work. Each project represents our
              commitment to design excellence.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <PortfolioGrid showFilters />
        </section>
      </main>
    </>
  );
}
