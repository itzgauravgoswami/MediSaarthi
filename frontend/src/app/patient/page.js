"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, ArrowRight, ShieldCheck, HeartPulse, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PatientKioskHome() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Ambient glow & Gridlines */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative p-1 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-[#27272a]">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain p-1" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-[#0F4C5C] dark:text-white font-newsreader flex items-center gap-1.5">
              MediSaarthi
              <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse"></span>
            </h1>
            <p className="text-[10px] font-bold text-[#18A999] tracking-widest uppercase">Clinical Intake Kiosk</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:border-[#18A999] transition-all">
          <Volume2 className="w-4 h-4 text-[#18A999]" />
          <span>Audio Help</span>
        </button>
      </header>

      {/* Hero Welcome Card */}
      <main className="max-w-2xl w-full mx-auto my-auto text-center space-y-8 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 md:p-14 rounded-3xl shadow-2xl relative z-10">
        <div className="inline-flex p-4 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
          <HeartPulse className="w-12 h-12 animate-pulse text-[#18A999]" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-newsreader">
            Welcome to MediSaarthi
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
            Let's prepare your medical information before you meet your doctor.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/patient/language" className="w-full sm:w-auto">
            <Button size="xl" fullWidth icon={ArrowRight} iconPosition="right">
              Start Pre-Consultation Intake
            </Button>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-6 border-t border-slate-100 dark:border-[#27272a] grid grid-cols-2 gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-[#18A999]" />
            <span>Voice & Touch Multilingual</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#18A999]" />
            <span>Doctor Reviewed & Secure</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed relative z-10">
        MediSaarthi assists doctors by collecting and organizing information. It does not replace medical professionals or independently diagnose patients.
      </footer>
    </div>
  );
}
