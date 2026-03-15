import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "UI/UX Design",       href: "/services#uiux" },
    { label: "Brand Identity",      href: "/services#branding" },
    { label: "Poster & Pubmats",    href: "/services#poster" },
    { label: "Social Media",        href: "/services#social" },
    { label: "Website Design",      href: "/services#website" },
  ],
  Company: [
    { label: "Portfolio",   href: "/portfolio" },
    { label: "Reviews",     href: "/reviews" },
    { label: "Journal",     href: "/blog" },
    { label: "Contact",     href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "#" },
    { label: "Terms of Service",  href: "#" },
  ],
};

interface FooterProps {
  content?: Record<string, string>;
  logoName?: string;
  logoImage?: string;
}

export default function Footer({ content = {}, logoName = "", logoImage }: FooterProps) {
  const tagline   = content.tagline          || "Design is not just what it looks like — it's how it works.";
  const copyright = content.copyright_suffix || "All rights reserved.";

  const socials = [
    { label: "Facebook",  href: content.social_facebook  || "#", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { label: "Instagram", href: content.social_instagram || "#", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
    { label: "TikTok",    href: content.social_tiktok    || "#", icon: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /> },
    { label: "Behance",   href: content.social_behance   || "#", icon: <><path d="M3 9h8a4 4 0 010 8H3z" /><path d="M3 5h7a3 3 0 010 6H3z" /><path d="M14 6h6M14 10h6" /></> },
  ];

  return (
    <footer className="bg-[#060606] text-zinc-500 relative overflow-hidden">
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-display font-black text-[clamp(80px,18vw,200px)] text-white/[0.02] select-none pointer-events-none whitespace-nowrap leading-none pb-4">
        {logoName.toUpperCase()}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        
        <div className="py-16 md:py-20 border-b border-zinc-800/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            
            <div className="max-w-sm">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                {logoImage ? (
                  <Image src={logoImage} alt={logoName} width={40} height={40} className="object-contain" />
                ) : (
                  <span className="w-10 h-10 gradient-gold flex items-center justify-center text-white font-display font-black text-base shadow-lg shadow-gold-500/25"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                    {logoName ? logoName.charAt(0).toUpperCase() : "--"}
                  </span>
                )}
                <span className="font-display font-bold text-2xl text-white group-hover:text-gold-400 transition-colors">
                  {logoName || "--"}<span className={logoName ? "text-gold-500" : ""}>{logoName ? "." : ""}</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500 italic font-light">&ldquo;{tagline}&rdquo;</p>
            </div>

            
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600">Follow the work</p>
              <div className="flex gap-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <span className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-gold-500/40 group-hover:text-gold-400 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        {s.icon}
                      </svg>
                    </span>
                    <span className="text-[9px] tracking-widest uppercase text-zinc-600 group-hover:text-zinc-400 transition-colors">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-zinc-800/60">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600 mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 hover:pl-1 inline-block transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600 mb-5">Ready to create?</h3>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">Let's build something extraordinary together.</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors group"
            >
              Start a project
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-700">
          <p>© {new Date().getFullYear()} {logoName ? `${logoName} Studio` : "--"} — {copyright}</p>
          
        </div>
      </div>
    </footer>
  );
}
