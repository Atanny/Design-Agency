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

interface FooterProps {
  content?: Record<string,string>;
  logoName?: string;
  logoImage?: string;
}

export default function Footer({ content={}, logoName="", logoImage }: FooterProps) {
  const tagline   = content.tagline         || "We craft premium digital experiences that elevate brands.";
  const copyright = content.copyright_suffix || "All rights reserved.";

  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Bento footer grid */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Brand tile */}
          <div className="col-span-12 md:col-span-5 rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-2.5 mb-4">
              {logoImage ? (
                <Image src={logoImage} alt={logoName} width={36} height={36} className="object-contain rounded-xl"/>
              ) : (
                <span className="w-9 h-9 rounded-2xl gradient-primary flex items-center justify-center text-white font-display font-black text-base">
                  {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
                </span>
              )}
              <span className="font-display font-bold text-lg text-white">
                {logoName ? `${logoName} Studio` : "--"}<span className="text-coral-400">.</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{tagline}</p>
          </div>

          {/* Nav tile */}
          <div className="col-span-6 md:col-span-3 rounded-2xl bg-zinc-900 p-6 flex flex-col gap-3">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400 mb-1">Navigate</p>
            {links.map(l=>(
              <Link key={l.href} href={l.href} className="text-zinc-400 hover:text-coral-400 text-sm font-medium transition-colors">{l.label}</Link>
            ))}
          </div>

          {/* CTA tile */}
          <div className="col-span-6 md:col-span-4 rounded-2xl bg-coral-400 p-8 flex flex-col justify-between">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Ready to create?</p>
            <div>
              <p className="font-display font-black text-white text-2xl leading-tight mb-4">Start your project today</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-bold hover:bg-espresso-800 hover:text-white transition-all">
                Get in touch ✦
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="rounded-2xl bg-zinc-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} {logoName ? `${logoName} Studio` : "--"} — {copyright}</p>
          <p className="text-zinc-700">Designed & built with care</p>
        </div>
      </div>
    </footer>
  );
}
