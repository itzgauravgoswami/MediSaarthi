"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LOCALES, getTranslation } from '@/locales/i18n';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { Globe, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { intakeState, setLanguage: setIntakeLanguage } = usePatientIntake();
  const { language, setLanguage: setGlobalLanguage } = useLanguage();
  
  const [selected, setSelected] = useState(language || intakeState?.language || 'hi');
  const isHindi = selected === 'hi' || language === 'hi';
  const lang = selected || language || 'hi';

  const handleLanguageSelect = (code) => {
    setSelected(code);
    setGlobalLanguage(code);
    setIntakeLanguage(code);
  };

  const handleContinue = () => {
    setGlobalLanguage(selected);
    setIntakeLanguage(selected);
    router.push('/patient/consent');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl w-full mx-auto my-2 space-y-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
            <Globe className="w-8 h-8 text-[#18A999]" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-newsreader tracking-tight">
            {getTranslation(lang, 'selectLanguage')}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">
            {getTranslation(lang, 'selectLanguageSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(LOCALES).map((loc) => {
            const isSupported = loc.status === 'supported';
            const isSelected = selected === loc.code;

            return (
              <button
                key={loc.code}
                disabled={!isSupported}
                onClick={() => isSupported && handleLanguageSelect(loc.code)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#18A999] bg-[#0F4C5C]/10 dark:bg-black ring-2 ring-[#18A999]'
                    : isSupported
                    ? 'border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/50 bg-white dark:bg-black'
                    : 'border-slate-100 dark:border-[#1a1a1a] bg-slate-50 dark:bg-[#0a0a0a] opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{loc.flag}</span>
                    <span className="font-bold text-base text-slate-900 dark:text-white font-newsreader">{loc.nativeName}</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{loc.name}</span>
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
              {isHindi ? 'सहमति के लिए आगे बढ़ें' : 'Continue to Consent'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
