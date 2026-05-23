"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  logoUrl: string;
  logoText: string;
  companyShort: string;
  companySuffix: string;
  navLinks: { label: string; href: string }[];
  navCTA: { text: string; href: string };
}

export default function Header({ logoUrl, logoText, companyShort, companySuffix, navLinks, navCTA }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md shadow-sm dark:shadow-[#0F172A]"
          : "bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-[#0A2342]">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="w-full h-full object-contain" />
              ) : (
                <span className="text-white font-bold text-sm tracking-wider">{logoText}</span>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-semibold text-sm leading-tight">{companyShort}</p>
              <p className="text-[#6E6E73] dark:text-[#94A3B8] text-xs leading-tight">{companySuffix}</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#1D1D1F] dark:text-[#94A3B8] text-sm font-medium hover:text-[#0A2342] dark:hover:text-[#F1F5F9] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA + Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href={navCTA.href}
              className="bg-[#0A2342] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#1A3A5C] transition-colors"
            >
              {navCTA.text}
            </a>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-[#1D1D1F] dark:text-[#F1F5F9]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-current mb-1.5" />
              <div className="w-5 h-0.5 bg-current mb-1.5" />
              <div className="w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0F172A] border-t border-[#D2D2D7] dark:border-[#334155] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#1D1D1F] dark:text-[#F1F5F9] text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={navCTA.href}
            className="bg-[#0A2342] text-white text-sm font-medium px-5 py-2 rounded-full text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            {navCTA.text}
          </a>
        </div>
      )}
    </header>
  );
}
