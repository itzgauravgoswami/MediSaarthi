"use client";

import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ variant = "pill", className = "" }) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border bg-slate-100 dark:bg-black text-slate-800 dark:text-white border-slate-200 dark:border-[#27272a] hover:border-[#18A999] shadow-sm select-none active:scale-95 whitespace-nowrap shrink-0 ${className}`}
      title={`Switch to ${language === 'en' ? 'Hindi (हिन्दी)' : 'English'}`}
      aria-label="Language Selector"
    >
      <Globe className="w-3.5 h-3.5 text-[#18A999]" />
      <span className="flex items-center gap-1 font-mono text-[11px]">
        <span className={language === 'en' ? 'text-[#18A999] font-extrabold' : 'text-slate-400 font-normal'}>
          EN
        </span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className={language === 'hi' ? 'text-[#18A999] font-extrabold' : 'text-slate-400 font-normal'}>
          हिन्दी
        </span>
      </span>
    </button>
  );
}
