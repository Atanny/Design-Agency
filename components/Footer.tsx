import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "UI/UX Design", href: "/services#uiux" },
    { label: "Brand Identity", href: "/services#branding" },
    { label: "Poster Design", href: "/services#poster" },
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
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16 border-b border-zinc-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-white font-display font-bold text-sm">
                L
              </span>
              <span className="font-display text-white font-semibold text-xl">
                Lumis
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              We craft premium digital experiences that elevate brands. Design
              is not just what it looks like — it&apos;s how it works.
            </p>
            <div className="flex gap-4 mt-6">
              {["Twitter", "Instagram", "Dribbble", "Behance"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                >
                  <span className="sr-only">{social}</span>
                  <span className="text-xs font-medium">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
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
            © {new Date().getFullYear()} Lumis Studio. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600">
            Crafted with care in{" "}
            <span className="text-gold-500">San Francisco</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
