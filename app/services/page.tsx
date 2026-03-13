export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our full range of design services: UI/UX, branding, poster design, social media graphics, and more.",
};

const services = [
  {
    id: "uiux",
    title: "UI/UX Design",
    subtitle: "Intuitive. Beautiful. Effective.",
    description:
      "We create digital experiences that users love. Our process begins with deep user research, followed by wireframing, prototyping, and pixel-perfect UI delivery. Every decision is backed by data and design principles.",
    features: [
      "User Research & Personas",
      "Information Architecture",
      "Wireframing & Prototyping",
      "UI Design System",
      "Usability Testing",
      "Handoff to Developers",
    ],
    pricing: [
      {
        name: "Starter",
        price: "$799",
        features: ["Up to 5 screens", "1 revision round", "Figma file", "1 week delivery"],
      },
      {
        name: "Pro",
        price: "$1,999",
        features: ["Up to 15 screens", "3 revision rounds", "Full design system", "User flows", "2 week delivery"],
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited screens", "Unlimited revisions", "Full UX audit", "Ongoing support", "Priority delivery"],
      },
    ],
    color: "blue",
  },
  {
    id: "branding",
    title: "Brand Identity Design",
    subtitle: "Your brand, perfectly expressed.",
    description:
      "A strong brand is the foundation of every successful business. We create comprehensive brand identity systems — from strategy and logo design to complete brand guidelines that ensure consistency across every touchpoint.",
    features: [
      "Brand Strategy Workshop",
      "Logo Design (5 concepts)",
      "Color & Typography System",
      "Brand Guidelines PDF",
      "Business Card Design",
      "Social Media Templates",
    ],
    pricing: [
      {
        name: "Starter",
        price: "$599",
        features: ["Logo design (3 concepts)", "Color palette", "Basic guidelines", "2 week delivery"],
      },
      {
        name: "Pro",
        price: "$1,499",
        features: ["Logo + sub-mark", "Full brand system", "Guidelines PDF (30+ pages)", "3 revision rounds", "3 week delivery"],
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "$3,499",
        features: ["Brand strategy", "Complete identity system", "All collateral", "1 month ongoing support", "Priority delivery"],
      },
    ],
    color: "gold",
  },
  {
    id: "poster",
    title: "Poster & Marketing Design",
    subtitle: "Stop the scroll. Command attention.",
    description:
      "From concert posters to product campaigns, we design visual marketing materials that get noticed and drive action. Bold compositions, striking typography, and strategic use of color.",
    features: [
      "Print-ready files",
      "Multiple format sizes",
      "Brand-aligned design",
      "High-resolution export",
      "Stock imagery sourcing",
      "Campaign consistency",
    ],
    pricing: [
      {
        name: "Single",
        price: "$199",
        features: ["1 poster design", "2 formats", "2 revisions", "Print & web files", "3 day delivery"],
      },
      {
        name: "Campaign",
        price: "$699",
        features: ["5 poster designs", "All formats", "3 revisions each", "Source files", "1 week delivery"],
        highlighted: true,
      },
      {
        name: "Ongoing",
        price: "$999/mo",
        features: ["10 designs/month", "Unlimited revisions", "Priority queue", "Brand templates", "48h turnaround"],
      },
    ],
    color: "rose",
  },
  {
    id: "social",
    title: "Social Media Graphics",
    subtitle: "Consistent. On-brand. Scroll-stopping.",
    description:
      "Build a cohesive social media presence with custom graphics designed for every platform. We create templates and individual posts that maintain brand consistency while keeping your feed fresh.",
    features: [
      "Instagram / Facebook posts",
      "Stories & Reels covers",
      "LinkedIn banners",
      "Twitter/X graphics",
      "YouTube thumbnails",
      "Editable templates",
    ],
    pricing: [
      {
        name: "Starter",
        price: "$299",
        features: ["10 post designs", "2 platforms", "Canva templates", "1 week delivery"],
      },
      {
        name: "Growth",
        price: "$799",
        features: ["30 post designs", "All platforms", "Editable templates", "Stories included", "2 week delivery"],
        highlighted: true,
      },
      {
        name: "Monthly",
        price: "$599/mo",
        features: ["20 posts/month", "All platforms", "Ongoing templates", "Content calendar", "48h per post"],
      },
    ],
    color: "violet",
  },
  {
    id: "website",
    title: "Website Design",
    subtitle: "Beautiful sites that convert.",
    description:
      "We design visually stunning, conversion-optimized websites. From landing pages to full multi-page sites, we deliver pixel-perfect designs with a focus on user experience and business goals.",
    features: [
      "Responsive design",
      "Conversion optimization",
      "SEO-friendly structure",
      "CMS integration design",
      "Performance-first",
      "Developer handoff",
    ],
    pricing: [
      {
        name: "Landing Page",
        price: "$699",
        features: ["1 page design", "Mobile responsive", "Figma file", "3 revisions", "1 week delivery"],
      },
      {
        name: "Full Site",
        price: "$2,499",
        features: ["Up to 8 pages", "Design system", "CMS templates", "5 revisions", "3 week delivery"],
        highlighted: true,
      },
      {
        name: "E-commerce",
        price: "$3,999",
        features: ["Full e-commerce design", "Product pages", "Checkout flow", "Mobile-first", "4 week delivery"],
      },
    ],
    color: "emerald",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  gold: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  },
};

export default function ServicesPage() {
  return (
    <>
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
              Services
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Design Services
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Premium design services tailored to grow your brand. Every service
              comes with a dedicated designer and our quality guarantee.
            </p>
          </div>
        </section>

        {/* Services */}
        <div className="max-w-7xl mx-auto px-6 pb-32 space-y-32">
          {services.map((service, idx) => {
            const colors = colorMap[service.color];
            return (
              <section key={service.id} id={service.id} className="scroll-mt-24">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-start ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  {/* Info */}
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
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

                    <div className="mt-8">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        Start This Project
                      </Link>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className="grid gap-4">
                      {service.pricing.map((tier) => (
                        <div
                          key={tier.name}
                          className={`p-6 rounded-2xl border ${
                            tier.highlighted
                              ? "bg-zinc-900 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-700"
                              : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className={`text-sm font-semibold ${tier.highlighted ? "text-zinc-400" : "text-zinc-500"}`}>
                                {tier.name}
                              </p>
                              <p className={`font-display text-3xl font-bold mt-0.5 ${tier.highlighted ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                                {tier.price}
                              </p>
                            </div>
                            {tier.highlighted && (
                              <span className="px-2.5 py-1 rounded-full bg-gold-500 text-white text-xs font-semibold">
                                Popular
                              </span>
                            )}
                          </div>
                          <ul className="space-y-2">
                            {tier.features.map((f) => (
                              <li key={f} className={`flex items-center gap-2 text-sm ${tier.highlighted ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${tier.highlighted ? colors.text : colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
