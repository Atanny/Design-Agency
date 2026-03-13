"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SERVICES = [
  {
    id: "uiux",
    title: "UI/UX Design",
    description: "Intuitive interfaces that delight users and drive conversions. We research, prototype, and perfect every interaction.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
    color: "from-blue-500/10 to-indigo-500/10",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "branding",
    title: "Brand Identity Design",
    description: "Complete brand systems that communicate your values. Logos, typography, colors, and guidelines that scale.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>),
    color: "from-gold-500/10 to-amber-500/10",
    accent: "text-gold-600 dark:text-gold-400",
  },
  {
    id: "poster",
    title: "Poster & Marketing Design",
    description: "Eye-catching marketing materials that stop the scroll. Posters, flyers, and campaigns with visual impact.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
    color: "from-rose-500/10 to-pink-500/10",
    accent: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "website",
    title: "Website UI Design",
    description: "Beautiful, conversion-optimized website designs. Pixel-perfect layouts built for performance and aesthetics.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>),
    color: "from-emerald-500/10 to-teal-500/10",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "social",
    title: "Social Media Graphics",
    description: "Scroll-stopping social content that builds brand recognition. Consistent, on-brand visuals for every platform.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>),
    color: "from-violet-500/10 to-purple-500/10",
    accent: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "product",
    title: "Product & App Design",
    description: "End-to-end product design from wireframes to polished UI. Mobile-first, accessibility-driven, user-tested.",
    icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>),
    color: "from-cyan-500/10 to-sky-500/10",
    accent: "text-cyan-600 dark:text-cyan-400",
  },
];

interface ServicesSectionProps {
  content: Record<string, string>;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  const c = content;

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
            {c.badge}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
            {c.headline}
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {c.subtext}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl mb-6 bg-zinc-50 dark:bg-zinc-800 ${service.accent}`}>
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-85 transition-opacity"
                  >
                    Get an Offer
                  </Link>
                  <Link
                    href={`/services#${service.id}`}
                    className={`text-sm font-medium ${service.accent} hover:underline`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
