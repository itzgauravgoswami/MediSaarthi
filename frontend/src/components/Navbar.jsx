"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Voice AI", href: "#voice-ai" },
    { name: "Document AI", href: "#document-ai" },
    { name: "AYUSH", href: "#ayush" },
    { name: "Safety", href: "#safety" },
    { name: "FAQs", href: "#faqs" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          : "top-0 w-full px-4 sm:px-6 lg:px-8 bg-transparent py-5"
      }`}
    >
      {/* Morphing Inner Container */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "rounded-full px-5 py-2.5 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 dark:border-[#27272a]"
            : "w-full max-w-7xl mx-auto bg-transparent border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand & Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus-accessible rounded-full p-1"
            aria-label="MediSaarthi Home"
          >
            <div className="relative flex items-center justify-center p-1.5 bg-white rounded-xl shadow-md border border-slate-200 group-hover:scale-105 transition-transform">
              <img
                src="/logo/logo.png"
                alt="MediSaarthi Logo"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-7 px-2 items-center justify-center bg-[#0F4C5C] text-white font-bold text-xs">
                MS
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#0F4C5C] dark:text-white flex items-center gap-1.5 font-newsreader">
                MediSaarthi
                <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse"></span>
              </span>
              <span className="text-[9px] font-bold text-[#18A999] tracking-widest uppercase -mt-0.5">
                AI Clinical Intake
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-black p-1.5 rounded-full border border-slate-200 dark:border-[#27272a]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-white dark:hover:bg-[#111111] rounded-full transition-all focus-accessible"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all focus-accessible flex items-center justify-center shadow-sm"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#0F4C5C]" />
              )}
            </button>

            <a
              href="#login"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-full transition-all focus-accessible"
            >
              Sign In
            </a>
            <a
              href="#get-started"
              className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] hover:opacity-95 rounded-full shadow-teal-glow transition-all flex items-center gap-2 active:scale-95 focus-accessible"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] focus-accessible"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#0F4C5C]" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-100 dark:bg-black text-slate-800 dark:text-white border border-slate-200 dark:border-[#27272a] focus-accessible"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-3xl bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-slate-200 dark:border-[#27272a] p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-full transition-colors focus-accessible"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#27272a] flex flex-col gap-2.5">
            <a
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-black rounded-full border border-slate-200 dark:border-[#27272a] hover:bg-slate-200 dark:hover:bg-[#111111] focus-accessible"
            >
              Sign In
            </a>
            <a
              href="#get-started"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-[#0F4C5C] to-[#18A999] rounded-full shadow-teal-glow flex items-center justify-center gap-2 focus-accessible"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
