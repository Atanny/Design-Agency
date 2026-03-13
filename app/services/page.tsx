import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";

export const revalidate = 0;

const services = [
  {
    id: "uiux",
    title: "UI/UX Design",
    subtitle: "Intuitive. Beautiful. Effective.",
    description: "We create digital experiences that users love. Our process begins with deep user research, followed by wireframing, prototyping, and pixel-perfect UI delivery.",
    features: ["User Research & Personas", "Information Architecture", "Wireframing & Prototyping", "UI Design System", "Usability Testing", "Handoff to Developers"],
    color: "blue",
  },
  {
    id: "branding",
    title: "Brand Identity Design",
    subtitle: "Your brand, perfectly expressed.",
    description: "A strong brand is the foundation of every successful business. We create comprehensive brand identity systems — logos, color palettes, typography, and complete brand guidelines.",
    features: ["Brand Strategy Workshop", "Logo Design", "Color & Typography System", "Brand Guidelines PDF", "Business Card Design", "Social Media Templates"],
    color: "gold",
  },
  {
    id: "poster",
    title: "Poster & Pubmats Design",
    subtitle: "Stop the scroll. Command attention.",
    description: "Posters, pubmats, and basic print designs that command attention. From event flyers to product layouts — print-ready, high-resolution files delivered.",
    features: ["Print-ready files", "Multiple format sizes", "Brand-aligned design", "High-resolution export", "Stock imagery sourcing", "Campaign consistency"],
    color: "rose",
  },
  {
    id: "social",
    title: "Social Media Graphics",
    subtitle: "Consistent. On-brand. Scroll-stopping.",
    description: "Build a cohesive social media presence with custom graphics designed for every platform. Templates and individual posts that maintain brand consistency.",
    features: ["Instagram / Facebook posts", "Stories & Reels covers", "LinkedIn banners", "Twitter/X graphics", "YouTube thumbnails", "Editable templates"],
    color: "violet",
  },
  {
    id: "website",
    title: "Website Design",
    subtitle: "Beautiful sites that convert.",
    description: "We design visually stunning, conversion-optimized websites. From landing pages to full multi-page sites — pixel-perfect designs with a focus on user experience.",
    features: ["Responsive design", "Conversion optimization", "SEO-friendly structure", "CMS integration design", "Performance-first", "Developer handoff"],
    color: "emerald",
  },
];

const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400",    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  gold:    { bg: "bg-amber-50 dark:bg-amber-900/20",  text: "text-amber-600 dark:text-amber-400",  badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  rose:    { bg: "bg-rose-50 dark:bg-rose-900/20",    text: "text-rose-600 dark:text-rose-400",    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" },
  violet:  { bg: "bg-violet-50 dark:bg-violet-900/20",text: "text-violet-600 dark:text-violet-400",badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page", "services").single();
    return {
      title: data?.meta_title || "Services | Lumis Studio",
      description: data?.meta_description || "Explore our design services.",
    };
  } catch { return { title: "Services | Lumis Studio" }; }
}

export default async function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
              Services
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Design Services
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
              Premium design services tailored to grow your brand.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Get an Offer
            </Link>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-32 space-y-32">
          {services.map((service, idx) => {
            const colors = colorMap[service.color];
            return (
              <section key={service.id} id={service.id} className="scroll-mt-24">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-start ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  <div className={idx % 2 === 1 ? "lg:col-start-2" : ""}>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} mb-4`}>
                      {service.title}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                      {service.subtitle}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                      What&apos;s Included
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                            <svg className={`w-2.5 h-2.5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Get an Offer for This Service
                    </Link>
                  </div>

                  <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className={`rounded-3xl h-80 flex items-center justify-center ${colors.bg} border border-zinc-100 dark:border-zinc-800`}>
                      <div className="text-center">
                        <p className={`font-display text-5xl font-bold ${colors.text} mb-2`}>
                          {service.title.split(" ")[0]}
                        </p>
                        <p className="text-zinc-400 text-sm">Custom design for your brand</p>
                        <Link
                          href="/contact"
                          className={`inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold ${colors.badge}`}
                        >
                          Get an Offer →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
