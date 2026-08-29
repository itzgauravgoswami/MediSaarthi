"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { LayoutDashboard, ShieldCheck, Mic, FileText, CheckCircle2, Moon, Sun, Stethoscope } from 'lucide-react';

export default function PatientNavbar({ activeTab = '' }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isHindi = language === 'hi';

  const navItems = [
    { id: 'dashboard', href: '/patient/dashboard', icon: LayoutDashboard, label: isHindi ? 'डैशबोर्ड' : 'Dashboard' },
    { id: 'doctors', href: '/patient/doctors', icon: Stethoscope, label: isHindi ? 'डॉक्टर्स' : 'Doctors' },
    { id: 'consent', href: '/patient/consent', icon: ShieldCheck, label: isHindi ? 'सहमति' : 'Consent' },
    { id: 'interview', href: '/patient/interview', icon: Mic, label: isHindi ? 'आवाज इंटेक' : 'Voice Intake' },
    { id: 'documents', href: '/patient/documents', icon: FileText, label: isHindi ? 'दस्तावेज़' : 'Documents' },
    { id: 'review', href: '/patient/review', icon: CheckCircle2, label: isHindi ? 'सारांश' : 'Summary' },
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#27272a] bg-white/95 dark:bg-black/95 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between gap-3 w-full">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <Link href="/patient/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 relative p-1 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-[#27272a] shadow-sm group-hover:scale-105 transition-transform">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill sizes="32px" className="object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-[#0F4C5C] dark:text-white font-newsreader flex items-center gap-1.5 leading-tight">
              Medi<span className="text-[#18A999]">Saarthi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#18A999] animate-pulse" />
            </span>
            <span className="text-[8.5px] font-bold text-[#18A999] tracking-widest uppercase -mt-0.5">
              {isHindi ? 'क्लिनिकल एआई पोर्टल' : 'Clinical AI Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* Patient Portal Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-[#111111] p-1 rounded-full border border-slate-200 dark:border-[#27272a]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || pathname === item.href;

          return isActive ? (
            <div key={item.id} className="px-3 py-1 text-xs font-bold text-[#18A999] bg-white dark:bg-black rounded-full border border-[#18A999]/30 shadow-xs flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-[#18A999] animate-pulse" />
              {item.label}
            </div>
          ) : (
            <Link
              key={item.id}
              href={item.href}
              className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-white dark:hover:bg-[#1a1a1a] rounded-full transition-all flex items-center gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#0F4C5C]" />}
        </button>
        <span className="hidden sm:flex px-2.5 py-0.5 rounded-full bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 text-[11px] font-bold font-mono">
          TOKEN #102
        </span>
      </div>
    </header>
  );
}
