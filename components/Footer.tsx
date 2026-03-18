"use client";
import Link from "next/link";
import Image from "next/image";

const links = [
  {label:"Services", href:"/services"},
  {label:"Work",     href:"/portfolio"},
  {label:"Journal",  href:"/blog"},
  {label:"Reviews",  href:"/reviews"},
  {label:"Contact",  href:"/contact"},
];

interface FooterProps { content?:Record<string,string>; logoName?:string; logoImage?:string; }

export default function Footer({ content={}, logoName="", logoImage }: FooterProps) {
  const tagline   = content.tagline         || "Freelance designer crafting brands, interfaces, and visual experiences that get noticed.";
  const copyright = content.copyright_suffix || "All rights reserved.";

  return (
    <footer className="bg-page border-t border-card pt-3 pb-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-3">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5 bento-card p-7 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-2.5">
              {logoImage ? (
                <Image src={logoImage} alt={logoName} width={32} height={32} className="object-contain rounded-xl"/>
              ) : (
                <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white font-display font-black text-sm">
                  {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
                </span>
              )}
              <span className="font-display font-bold text-base text-page">
                {logoName || "--"}<span className="text-coral-400">.</span>
              </span>
            </div>
            <p className="text-body text-sm leading-relaxed mt-4 max-w-xs font-light">{tagline}</p>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3 bento-card p-7">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-coral-500 mb-4">Pages</p>
            <nav className="flex flex-col gap-2.5">
              {links.map(l=>(
                <Link key={l.href} href={l.href} className="text-body hover:text-page text-sm font-medium transition-colors leading-none">{l.label}</Link>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div className="lg:col-span-4 rounded-2xl bg-coral-400 p-7 flex flex-col justify-between">
            <p className="text-white/70 text-sm font-light leading-relaxed">Ready to start something great?</p>
            <div>
              <p className="font-display font-black text-white text-xl leading-tight mb-4">Let's talk about your project.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-semibold hover:bg-espresso-800 hover:text-white transition-all">
                Hire me ✦
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bento-card-alt px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted text-xs">© {new Date().getFullYear()} {logoName || "--"} — {copyright}</p>
          <p className="text-faint text-xs">Made with care ✦</p>
        </div>
      </div>
    </footer>
  );
}
