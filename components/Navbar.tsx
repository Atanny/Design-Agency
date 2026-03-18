"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/",         label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio",label: "Work" },
  { href: "/blog",     label: "Journal" },
  { href: "/reviews",  label: "Reviews" },
  { href: "/contact",  label: "Contact" },
];

interface NavbarProps {
  logoName?: string;
  ctaText?: string;
  logoImage?: string;
}

export default function Navbar({ logoName = "", ctaText = "Start a Project", logoImage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "glass py-2" : "bg-transparent py-4"}`}
      >
        <nav className="max-w-6xl mx-auto px-5 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {logoImage ? (
              <Image src={logoImage} alt={logoName} width={36} height={36} className="object-contain rounded-2xl" />
            ) : (
              <span className="w-9 h-9 rounded-3xl gradient-primary flex items-center justify-center text-white font-display font-black text-base shadow-lg">
                {logoName ? logoName.charAt(0).toUpperCase() : "✦"}
              </span>
            )}
            <span className="font-display font-bold text-lg text-espresso-800 dark:text-sand-100 group-hover:text-coral-400 transition-colors">
              {logoName || "--"}<span className="text-coral-400">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? "bg-coral-400 text-white shadow-md shadow-coral-400/30"
                      : "text-espresso-600 dark:text-sand-300 hover:bg-coral-50 dark:hover:bg-espresso-700 hover:text-coral-500"
                  }`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-espresso-500 dark:text-sand-400 hover:bg-coral-50 dark:hover:bg-espresso-700 transition-colors">
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
            <Link href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-800 text-white text-sm font-bold hover:bg-coral-400 transition-all shadow-md">
              {ctaText}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-sand-100 dark:bg-espresso-700 text-espresso-800 dark:text-sand-50">
              <span className="flex flex-col gap-[5px] w-4">
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
            initial={{ opacity:0, y:-10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }}
            transition={{ duration:0.2 }}
            className="sticky top-0 z-40 md:hidden bg-white dark:bg-espresso-800 border-b border-sand-200 dark:border-espresso-700 pb-4 px-5"
          >
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-3xl text-base font-semibold transition-all ${
                    pathname === link.href
                      ? "bg-coral-400 text-white"
                      : "text-espresso-700 dark:text-sand-200 hover:bg-coral-50 dark:hover:bg-espresso-700"
                  }`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-3xl bg-espresso-800 dark:bg-coral-400 text-white text-base font-bold text-center">
                {ctaText}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
