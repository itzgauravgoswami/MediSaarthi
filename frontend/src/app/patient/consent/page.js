"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/locales/i18n';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { ShieldCheck, Volume2, Check, X } from 'lucide-react';

export default function ConsentPage() {
  const router = useRouter();
  const { intakeState, setConsent } = usePatientIntake();
  const { language } = useLanguage();
  const lang = language || intakeState?.language || 'hi';
  const isHindi = lang === 'hi';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAgree = () => {
    setConsent(true);
    router.push('/patient/interview');
  };

  const handleDecline = () => {
    setConsent(false);
    alert(isHindi 
      ? "एआई क्लिनिकल इंटेक जारी रखने के लिए सहमति आवश्यक है। कृपया मैन्युअल सहायता के लिए कियोस्क स्टाफ से संपर्क करें।" 
      : "Consent is required to proceed with AI clinical intake. Please speak with kiosk staff for manual assistance."
    );
  };

  const handleAudioHelp = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const text = getTranslation(lang, 'consentBullet1') + ' ' + getTranslation(lang, 'consentBullet2');
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.lang = targetLang;
      utterance.rate = isHindi ? 0.88 : 0.95;

      const voices = window.speechSynthesis.getVoices();
      if (isHindi && voices.length > 0) {
        const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी'));
        if (hindiVoice) utterance.voice = hindiVoice;
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl w-full mx-auto my-2 space-y-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
              <ShieldCheck className="w-8 h-8 text-[#18A999]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-newsreader">{getTranslation(lang, 'consentTitle')}</h2>
              <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">{getTranslation(lang, 'consentDescription')}</p>
            </div>
          </div>

          <button
            onClick={handleAudioHelp}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlayingAudio
                ? 'bg-teal-500 text-white border-teal-500 animate-pulse'
                : 'bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#27272a]'
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#18A999]" />
            <span>{getTranslation(lang, 'listenAudio')}</span>
          </button>
        </div>

        {/* Bullets */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-4 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-[#a1a1aa]">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18A999] mt-2 shrink-0" />
            <p>{getTranslation(lang, 'consentBullet1')}</p>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18A999] mt-2 shrink-0" />
            <p><strong className="text-slate-900 dark:text-white font-newsreader">{getTranslation(lang, 'consentBullet2')}</strong></p>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18A999] mt-2 shrink-0" />
            <p>{getTranslation(lang, 'consentBullet3')}</p>
          </div>
        </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button size="lg" variant="outline" onClick={handleDecline} icon={X} fullWidth>
              {getTranslation(lang, 'iDoNotAgree')}
            </Button>
            <Button size="lg" variant="primary" onClick={handleAgree} icon={Check} fullWidth>
              {getTranslation(lang, 'iAgree')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
