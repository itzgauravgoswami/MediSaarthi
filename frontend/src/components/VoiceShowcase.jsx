import { useState, useEffect } from "react";
import { Mic, Volume2, Globe, Sparkles, Languages, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function VoiceShowcase() {
  const { language, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language === 'hi' ? "हिन्दी" : "English");

  useEffect(() => {
    setSelectedLang(language === 'hi' ? "हिन्दी" : "English");
  }, [language]);

  const languages = [
    { code: "hi", name: "हिन्दी" },
    { code: "en", name: "English" },
    { code: "bn", name: "বাংলা" },
    { code: "mr", name: "मराठी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
  ];

  const conversations = {
    हिन्दी: [
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "आपको मुख्य समस्या क्या हो रही है?",
        time: "10:02 AM",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "मुझे तीन दिन से सीने में भारीपन और हल्का दर्द हो रहा है।",
        time: "10:02 AM",
        badge: "Voice Transcribed (Hindi)",
      },
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "क्या यह दर्द चलने या सीढ़ियां चढ़ने जैसी मेहनत करने पर बढ़ता है?",
        time: "10:03 AM",
        badge: "Clinical Adaptive Prompt",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "जी हां, तेज चलने पर थोड़ा ज्यादा होता है।",
        time: "10:03 AM",
      },
    ],
    English: [
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "What is your main symptom or health concern today?",
        time: "10:02 AM",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "I have been feeling chest pressure and mild pain for 3 days.",
        time: "10:02 AM",
        badge: "Voice Transcribed (English)",
      },
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "Does the pain increase when walking or climbing stairs?",
        time: "10:03 AM",
        badge: "Clinical Adaptive Prompt",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "Yes, it gets worse during brisk exertion.",
        time: "10:03 AM",
      },
    ],
    বাংলা: [
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "আপনার প্রধান শারীরিক সমস্যা কি হচ্ছে?",
        time: "10:02 AM",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "আমার তিন দিন ধরে বুকে হালকা ব্যথা ও অস্বস্তি হচ্ছে।",
        time: "10:02 AM",
        badge: "Voice Transcribed (Bengali)",
      },
      {
        sender: "ai",
        name: "MediSaarthi AI",
        text: "হাঁটার সময় বা পরিশ্রমে কি ব্যথা বৃদ্ধি পায়?",
        time: "10:03 AM",
      },
      {
        sender: "patient",
        name: "Raj Kumar (Patient)",
        text: "হ্যাঁ, হাঁটার সময় বাড়ে।",
        time: "10:03 AM",
      },
    ],
  };

  const currentDialogue = conversations[selectedLang] || conversations["हिन्दी"];

  return (
    <section id="voice-ai" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18A999]/10 dark:bg-[#111111] text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#18A999]/20 dark:border-[#27272a]">
            <Sparkles className="w-3.5 h-3.5 text-[#18A999]" /> MULTILINGUAL VOICE ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-newsreader">
            Healthcare should speak your language.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            Patients describe symptoms in their spoken dialect. MediSaarthi's voice AI understands accent, context, and colloquial clinical phrasing.
          </p>

          {/* Language Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {languages.map((lang) => (
              <button
                key={lang.name}
                onClick={() => setSelectedLang(lang.name)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 focus-accessible ${
                  selectedLang === lang.name
                    ? "bg-gradient-to-r from-[#0F4C5C] to-[#18A999] dark:from-[#18A999] dark:to-teal-400 text-white dark:text-[#000000] shadow-md scale-105"
                    : "bg-white dark:bg-[#111111] text-slate-700 dark:text-[#a1a1aa] hover:bg-slate-50 dark:hover:bg-[#18181b] border border-slate-200 dark:border-[#27272a]"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#18A999]" />
                <span>{lang.name}</span>
                {selectedLang === lang.name && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Live Voice Interactive Demo Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-[#27272a] p-6 sm:p-8 shadow-2xl space-y-6 transition-colors duration-300">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#18A999]/10 text-[#0F4C5C] dark:text-[#18A999] rounded-xl border border-[#18A999]/20 dark:border-[#18A999]/30">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F4C5C] dark:text-white flex items-center gap-2 font-newsreader">
                  Live Intake Transcript
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-sans">
                    ACTIVE SESSION
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Selected Language: <span className="text-[#18A999] font-bold">{selectedLang}</span></p>
              </div>
            </div>

            {/* Sound Wave Animation Visualizer */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#18181b] px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-[#27272a] h-8 overflow-hidden shrink-0">
              <span className="text-[10px] text-slate-500 dark:text-[#71717a] mr-1 font-mono tracking-wider">AUDIO LOG</span>
              <div className="w-1 h-4 bg-[#0F4C5C] dark:bg-[#18A999] rounded-full animate-wave-1"></div>
              <div className="w-1 h-5 bg-[#18A999] dark:bg-[#6366F1] rounded-full animate-wave-3"></div>
              <div className="w-1 h-4 bg-[#6366F1] dark:bg-[#18A999] rounded-full animate-wave-2"></div>
              <div className="w-1 h-5 bg-[#18A999] dark:bg-teal-400 rounded-full animate-wave-4"></div>
            </div>
          </div>

          {/* Dialogue Bubbles */}
          <div className="space-y-4">
            {currentDialogue.map((dialogue, idx) => (
              <div
                key={idx}
                className={`flex gap-3 items-start ${
                  dialogue.sender === "patient" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    dialogue.sender === "ai"
                      ? "bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white shadow-md"
                      : "bg-[#6366F1] text-white shadow-md"
                  }`}
                >
                  {dialogue.sender === "ai" ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`max-w-xl p-4 rounded-2xl space-y-1 ${
                    dialogue.sender === "ai"
                      ? "bg-slate-50 dark:bg-[#18181b] text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-[#27272a]"
                      : "bg-[#EEF2FF] dark:bg-[#18181b] text-[#0F172A] dark:text-white rounded-tr-none border border-indigo-200 dark:border-[#6366F1]/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#71717a] pb-1 border-b border-slate-200/60 dark:border-[#27272a]">
                    <span className="font-bold text-[#0F4C5C] dark:text-white">{dialogue.name}</span>
                    <span>{dialogue.time}</span>
                  </div>

                  <p className="text-sm font-medium pt-1">
                    "{dialogue.text}"
                  </p>

                  {dialogue.badge && (
                    <div className="pt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#0F4C5C] dark:text-[#18A999] bg-[#18A999]/15 px-2 py-0.5 rounded-full border border-[#18A999]/30">
                        ✓ {dialogue.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#a1a1aa]">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#18A999]" />
              Support for 10+ regional accents with offline acoustic processing capabilities.
            </span>
            <span className="font-bold text-[#0F4C5C] dark:text-[#18A999]">Voice-First Accessibility</span>
          </div>

        </div>

      </div>
    </section>
  );
}
