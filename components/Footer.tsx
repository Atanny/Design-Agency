import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "UI/UX Design", href: "/services#uiux" },
    { label: "Brand Identity", href: "/services#branding" },
    { label: "Poster & Pubmats", href: "/services#poster" },
    { label: "Social Media", href: "/services#social" },
    { label: "Website Design", href: "/services#website" },
  ],
  Company: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

interface FooterProps {
  content?: Record<string, string>;
  logoName?: string;
  logoImage?: string;
}

export default function Footer({ content = {}, logoName = "Lumis", logoImage }: FooterProps) {
  const tagline = content.tagline || "We craft premium digital experiences that elevate brands. Design is not just what it looks like — it's how it works.";
  const madeIn = content.made_in || "Philippines";
  const copyright = content.copyright_suffix || "All rights reserved.";

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 pb-16 border-b border-zinc-800">
          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              {logoImage ? (
                <Image src={logoImage} alt={logoName} width={32} height={32} className="rounded-lg object-contain" />
              ) : (
                <span className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-white font-display font-bold text-sm">
                  {logoName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="font-display text-white font-semibold text-xl">{logoName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs mb-6">{tagline}</p>

            {/* Social links - real SVG icons, no circles */}
            <div className="flex gap-3">
              {[
                { label: "Facebook", href: content.social_facebook || "#", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                { label: "Instagram", href: content.social_instagram || "#", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
                { label: "TikTok", href: content.social_tiktok || "#", icon: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /> },
                { label: "Behance", href: content.social_behance || "#", icon: <><path d="M3 9h8a4 4 0 010 8H3z" /><path d="M3 5h7a3 3 0 010 6H3z" /><path d="M14 6h6M14 10h6" /></> },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-gold-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} {logoName} Studio. {copyright}
          </p>
          <p className="text-sm text-zinc-600">
            Crafted with care in{" "}
            <span className="text-gold-500">{madeIn}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
