"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href:"/",          label:"Home"     },
  { href:"/services",  label:"Services" },
  { href:"/portfolio", label:"Work"     },
  { href:"/blog",      label:"Journal"  },
  { href:"/reviews",   label:"Reviews"  },
  { href:"/contact",   label:"Contact"  },
];

interface NavbarProps { logoName?:string; ctaText?:string; logoImage?:string; }

export default function Navbar({ logoName="", ctaText="Hire Me", logoImage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navBase = scrolled
    ? "glass shadow-sm py-2"
    : "bg-transparent py-4";

  return (
    <>
      <motion.header
        initial={{ y:-56, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${navBase}`}>
        <nav className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {logoImage ? (
              <Image src={logoImage} alt={logoName} width={32} height={32} className="object-contain rounded-xl"/>
            ) : (
              <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white font-display font-black text-sm shadow-md shadow-coral-400/20">
                {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
              </span>
            )}
            <span className="font-display font-bold text-base text-page group-hover:text-coral-400 transition-colors">
              {logoName || "--"}<span className="text-coral-400">.</span>
            </span>
          </Link>

          {/* Desktop nav pill strip */}
          <div className="hidden md:flex items-center gap-0.5 bg-card border border-card rounded-full px-1.5 py-1.5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-coral-400 text-white shadow-sm"
                    : "text-muted hover:text-page hover:bg-section"
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-page hover:bg-card transition-colors">
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>

            <Link href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-coral-400/20">
              {ctaText}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-card border border-card text-page">
              <span className="flex flex-col gap-[5px] w-3.5">
                <span className={`h-0.5 bg-current transition-all origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}/>
                <span className={`h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}/>
                <span className={`h-0.5 bg-current transition-all origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}/>
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.2 }}
            className="sticky top-0 z-40 md:hidden bg-page border-b border-card pb-4 px-4 shadow-lg">
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === link.href
                      ? "bg-coral-400 text-white"
                      : "text-body hover:bg-card hover:text-page"
                  }`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl gradient-primary text-white text-base font-semibold text-center">
                {ctaText}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
