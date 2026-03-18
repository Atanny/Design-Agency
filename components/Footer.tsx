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
  const tagline   = content.tagline        || "We craft premium digital experiences that elevate brands.";
  const copyright = content.copyright_suffix || "All rights reserved.";

  return (
    <footer className="bg-espresso-800 text-white">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {logoImage ? (
                <Image src={logoImage} alt={logoName} width={36} height={36} className="object-contain rounded-2xl"/>
              ) : (
                <span className="w-9 h-9 rounded-3xl gradient-primary flex items-center justify-center text-white font-display font-black text-base">
                  {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
                </span>
              )}
              <span className="font-display font-bold text-lg">{logoName ? `${logoName} Studio` : "--"}</span>
            </div>
            <p className="text-sand-400 text-sm leading-relaxed max-w-xs">{tagline}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400 mb-4">Navigation</p>
            <ul className="space-y-2">
              {links.map(l=>(
                <li key={l.href}>
                  <Link href={l.href} className="text-sand-300 hover:text-coral-400 text-sm font-medium transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400 mb-4">Let&apos;s Work</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-coral-400/20">
              Start a Project ✦
            </Link>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-sand-500">
          <p>© {new Date().getFullYear()} {logoName ? `${logoName} Studio` : "--"} — {copyright}</p>
        </div>
      </div>
    </footer>
  );
}
