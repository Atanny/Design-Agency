export const revalidate = 0;
import { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";

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
            <p className="text-sm font-semibold uppercase tracking-widest text-coral-500 dark:text-coral-400 mb-4">
              Our Work
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-espresso-800 dark:text-sand-50 tracking-tight mb-6">
              Portfolio
            </h1>
            <p className="text-lg text-espresso-500 dark:text-espresso-400">
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
