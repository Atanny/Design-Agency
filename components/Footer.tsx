"use client";
import Link from "next/link";
import Image from "next/image";

const links = [
  { label:"Services",  href:"/services"  },
  { label:"Work",      href:"/portfolio" },
  { label:"Journal",   href:"/blog"      },
  { label:"Reviews",   href:"/reviews"   },
  { label:"Contact",   href:"/contact"   },
];

interface FooterProps { content?: Record<string,string>; logoName?: string; logoImage?: string; }

export default function Footer({ content={}, logoName="", logoImage }: FooterProps) {
  const tagline   = content.tagline         || "Freelance designer crafting brands, interfaces, and visual experiences that get noticed.";
  const copyright = content.copyright_suffix || "All rights reserved.";

  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-800/40 pt-3 pb-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-12 gap-3 mb-3">

          {/* Brand tile */}
          <div className="col-span-12 md:col-span-5 rounded-2xl bg-zinc-900 p-7 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-2.5">
              {logoImage ? (
                <Image src={logoImage} alt={logoName} width={32} height={32} className="object-contain rounded-xl"/>
              ) : (
                <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white font-display font-black text-sm shadow-md">
                  {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
                </span>
              )}
              <span className="font-display font-bold text-base text-white">
                {logoName || "--"}<span className="text-coral-400">.</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mt-4 max-w-xs">{tagline}</p>
          </div>

          {/* Nav tile */}
          <div className="col-span-6 md:col-span-3 rounded-2xl bg-zinc-900 p-7">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400 mb-4">Pages</p>
            <nav className="flex flex-col gap-2.5">
              {links.map(l => (
                <Link key={l.href} href={l.href}
                  className="text-zinc-400 hover:text-white text-sm font-medium transition-colors leading-none">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA tile */}
          <div className="col-span-6 md:col-span-4 rounded-2xl bg-coral-400 p-7 flex flex-col justify-between">
            <p className="text-white/70 text-[11px] font-semibold leading-relaxed">
              Ready to start something great together?
            </p>
            <div>
              <p className="font-display font-black text-white text-xl leading-tight mb-4">Let's talk about your project.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-bold hover:bg-espresso-800 hover:text-white transition-all">
                Hire me ✦
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="rounded-2xl bg-zinc-900/60 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} {logoName || "--"} — {copyright}</p>
          <p className="text-zinc-700">Made with care ✦</p>
        </div>
      </div>
    </footer>
  );
}
