"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

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
    { name: t("home", "Home"), href: "/#hero" },
    { name: t("doctors", "Doctors"), href: "/doctors" },
    { name: t("howItWorks", "How It Works"), href: "/#how-it-works" },
    { name: t("features", "Features"), href: "/#features" },
    { name: t("voiceAi", "Voice AI"), href: "/#voice-ai" },
    { name: t("documentAi", "Document AI"), href: "/#document-ai" },
    { name: t("ayush", "AYUSH"), href: "/#ayush" },
    { name: t("safety", "Safety"), href: "/#safety" },
    { name: t("faqs", "FAQs"), href: "/#faqs" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-4 sm:top-5 px-3 sm:px-6 lg:px-8 max-w-[96%] xl:max-w-[1400px] mx-auto"
          : "top-3 sm:top-4 w-full px-4 sm:px-8 lg:px-12 bg-transparent py-2 max-w-[1400px] mx-auto"
      }`}
    >
      {/* Morphing Inner Container */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "rounded-full px-5 py-1.5 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 dark:border-[#27272a] w-full"
            : "w-full mx-auto bg-transparent border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand & Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-accessible rounded-full p-0.5 shrink-0"
            aria-label="MediSaarthi Home"
          >
            <div className="relative flex items-center justify-center p-1 bg-white rounded-lg shadow-md border border-slate-200 group-hover:scale-105 transition-transform">
              <img
                src="/logo/logo.png"
                alt="MediSaarthi Logo"
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-6 px-1.5 items-center justify-center bg-[#0F4C5C] text-white font-bold text-xs">
                MS
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[#0F4C5C] dark:text-white flex items-center gap-1 font-newsreader leading-tight">
                MediSaarthi
                <span className="w-1.5 h-1.5 rounded-full bg-[#18A999] animate-pulse"></span>
              </span>
              <span className="text-[8px] font-bold text-[#18A999] tracking-widest uppercase -mt-0.5">
                AI Clinical Intake
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-black p-1 rounded-full border border-slate-200 dark:border-[#27272a] shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-white dark:hover:bg-[#111111] rounded-full transition-all focus-accessible whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Theme / Language Switcher */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all focus-accessible flex items-center justify-center shadow-sm shrink-0"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#0F4C5C]" />
              )}
            </button>

            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-full transition-all focus-accessible whitespace-nowrap"
            >
              {t("signIn", "Sign In")}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] hover:opacity-95 rounded-full shadow-teal-glow transition-all flex items-center gap-1.5 active:scale-95 focus-accessible whitespace-nowrap"
            >
              <span>{t("getStarted", "Get Started")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />

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
        <div className="mt-2 rounded-3xl bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-slate-200 dark:border-[#27272a] p-4 space-y-4 shadow-2xl">
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
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-black rounded-full border border-slate-200 dark:border-[#27272a] focus-accessible"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-[#0F4C5C] to-[#18A999] rounded-full shadow-teal-glow flex items-center justify-center gap-2 focus-accessible"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

