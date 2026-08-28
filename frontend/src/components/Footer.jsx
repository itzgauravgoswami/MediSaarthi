"use client";

import { ShieldCheck, Heart, Linkedin, Twitter, Github, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 dark:bg-black text-slate-400 dark:text-[#a1a1aa] pt-16 pb-8 border-t border-slate-800 dark:border-[#27272a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="flex items-center gap-3 group focus-accessible">
              <div className="p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                <img
                  src="/logo/logo.png"
                  alt="MediSaarthi Logo"
                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden h-9 px-2 items-center justify-center bg-[#0F4C5C] text-white rounded-lg font-bold text-sm">
                  MS
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-newsreader">
                  MediSaarthi
                  <span className="w-2 h-2 rounded-full bg-[#18A999]"></span>
                </span>
                <span className="text-[10px] font-semibold text-[#18A999] tracking-wider uppercase">
                  Your AI Clinical Intake Companion
                </span>
              </div>
            </a>

            <p className="text-xs text-slate-400 dark:text-[#a1a1aa] max-w-sm leading-relaxed">
              {t("footerDesc", "MediSaarthi empowers healthcare institutions across India to collect, structure, and summarize patient history before the consultation begins, saving doctors valuable time.")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-[#111111] text-slate-400 hover:text-white transition-colors border dark:border-[#27272a]" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-[#111111] text-slate-400 hover:text-white transition-colors border dark:border-[#27272a]" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-[#111111] text-slate-400 hover:text-white transition-colors border dark:border-[#27272a]" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:contact@medisaarthi.ai" className="p-2 rounded-lg bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-[#111111] text-slate-400 hover:text-white transition-colors border dark:border-[#27272a]" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">Product</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#how-it-works" className="hover:text-[#18A999] transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-[#18A999] transition-colors">Key Features</a></li>
              <li><a href="#voice-ai" className="hover:text-[#18A999] transition-colors">Voice AI Engine</a></li>
              <li><a href="#document-ai" className="hover:text-[#18A999] transition-colors">Document OCR</a></li>
              <li><a href="#ayush" className="hover:text-[#18A999] transition-colors">AYUSH Workflows</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">Resources</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#faqs" className="hover:text-[#18A999] transition-colors">Documentation</a></li>
              <li><a href="#faqs" className="hover:text-[#18A999] transition-colors">FAQs</a></li>
              <li><a href="#get-started" className="hover:text-[#18A999] transition-colors">Contact Support</a></li>
              <li><a href="#privacy" className="hover:text-[#18A999] transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#18A999] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Compliance Column */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">Clinical Safety</p>
            <div className="p-3 rounded-xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-2 text-[11px] text-slate-400 dark:text-[#a1a1aa]">
              <div className="flex items-center gap-1.5 text-[#18A999] font-bold">
                <ShieldCheck className="w-4 h-4" />
                Human Oversight
              </div>
              <p>Doctors retain 100% control over diagnostic decisions and clinical history confirmation.</p>
            </div>
          </div>

        </div>

        {/* Mandated Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 dark:border-[#27272a] space-y-4 text-center text-xs">
          <p className="text-slate-500 dark:text-[#71717a] max-w-4xl mx-auto italic leading-relaxed">
            * AI-generated information is intended for clinical workflow assistance and requires appropriate healthcare professional verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-[#71717a] text-[11px]">
            <p>{t("rightsReserved", "© 2026 MediSaarthi. All rights reserved.")}</p>
            <p className="flex items-center gap-1">
              {t("builtWithLove", "Built for Indian Healthcare Institutions.")} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
