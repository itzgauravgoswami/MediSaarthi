"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LOCALES } from '@/locales/i18n';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import Button from '@/components/ui/Button';
import { Globe, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { intakeState, setLanguage } = usePatientIntake();
  const [selected, setSelected] = useState(intakeState?.language || 'hi');

  const handleContinue = () => {
    setLanguage(selected);
    router.push('/patient/consent');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Glow & Gridlines */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
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
          <div className="w-10 h-10 relative p-1 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a]">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain p-1" />
          </div>
          <span className="font-extrabold text-lg text-[#0F4C5C] dark:text-white font-newsreader">Medi<span className="text-[#18A999]">Saarthi</span></span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] rounded-full border border-[#18A999]/30 dark:border-[#27272a]">
          Step 1 of 4: Language
        </span>
      </header>

      {/* Main Card */}
      <main className="max-w-3xl w-full mx-auto my-8 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
            <Globe className="w-8 h-8 text-[#18A999]" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-newsreader tracking-tight">Choose Your Preferred Language</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">
            You can speak or touch to answer questions in your native language.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(LOCALES).map((lang) => {
            const isSupported = lang.status === 'supported';
            const isSelected = selected === lang.code;

            return (
              <button
                key={lang.code}
                disabled={!isSupported}
                onClick={() => isSupported && setSelected(lang.code)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'border-[#18A999] bg-[#0F4C5C]/10 dark:bg-black ring-2 ring-[#18A999]'
                    : isSupported
                    ? 'border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/50 bg-white dark:bg-black'
                    : 'border-slate-100 dark:border-[#1a1a1a] bg-slate-50 dark:bg-[#0a0a0a] opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-bold text-base text-slate-900 dark:text-white font-newsreader">{lang.nativeName}</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{lang.name}</span>
                </div>

                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#18A999]" />}
                {!isSupported && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1f1f23] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end pt-4 border-t border-slate-100 dark:border-[#27272a]">
          <Button size="lg" onClick={handleContinue} icon={ArrowRight} iconPosition="right">
            Continue to Consent
          </Button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 relative z-10">
        MediSaarthi Platform • Language Selection Engine
      </footer>
    </div>
  );
}
