"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section id="hero" className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      
      {/* Ambient Lighting Glow Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#18A999]/15 dark:bg-[#18A999]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 dark:bg-[#6366F1]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Background Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 92%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Centered Content Column */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black border border-[#0F4C5C]/20 dark:border-[#27272a] text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold tracking-wide uppercase shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#18A999]" />
            <span>{t("heroBadge", "AI-POWERED CLINICAL INTAKE PLATFORM")}</span>
          </motion.div>

          {/* Main Centered Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.12] font-newsreader"
          >
            {language === 'hi' ? (
              <>
                डॉक्टरों की मदद,{" "}
                <span className="text-[#0F4C5C] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#18A999] dark:via-teal-300 dark:to-cyan-400">
                  रोगियों
                </span>{" "}
                पर ध्यान केंद्रित करने के लिए, कागजी कार्रवाई पर नहीं।
              </>
            ) : (
              <>
                Helping doctors focus on{" "}
                <span className="text-[#0F4C5C] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#18A999] dark:via-teal-300 dark:to-cyan-400">
                  patients
                </span>
                , not paperwork.
              </>
            )}
          </motion.h1>

          {/* Subheadline Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {t("heroSubtitle", "MediSaarthi uses multilingual voice AI, intelligent document processing, and structured clinical history-taking to prepare a complete patient case before the consultation begins.")}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <a
              href="#kiosk-demo"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95 focus-accessible group"
            >
              <span>Try Live Kiosk Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 dark:text-white bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus-accessible group"
            >
              <Play className="w-4 h-4 text-[#0F4C5C] dark:text-[#18A999] fill-[#0F4C5C] dark:fill-[#18A999] group-hover:scale-110 transition-transform" />
              <span>See How It Works</span>
            </a>
          </motion.div>

          {/* Trust Footnote & Micro Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 flex flex-col items-center space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#a1a1aa]">
              <ShieldCheck className="w-4 h-4 text-[#18A999]" />
              <span>Built for hospitals, OPDs, clinics & AYUSH institutions across India.</span>
            </div>

            {/* 3 Metric Pills Centered */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full pt-2">
              <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-4 rounded-2xl bg-white/80 dark:bg-black border border-slate-200/80 dark:border-[#27272a] shadow-sm text-center transition-all">
                <p className="text-xl font-extrabold text-[#0F4C5C] dark:text-white font-newsreader">10+ Languages</p>
                <p className="text-xs text-slate-500 dark:text-[#71717a] font-medium">Native Indian Accent AI</p>
              </motion.div>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-4 rounded-2xl bg-white/80 dark:bg-black border border-slate-200/80 dark:border-[#27272a] shadow-sm text-center transition-all">
                <p className="text-xl font-extrabold text-[#18A999] font-newsreader">98% Accuracy</p>
                <p className="text-xs text-slate-500 dark:text-[#71717a] font-medium">OCR Medical Parsing</p>
              </motion.div>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-4 rounded-2xl bg-white/80 dark:bg-black border border-slate-200/80 dark:border-[#27272a] shadow-sm text-center transition-all">
                <p className="text-xl font-extrabold text-[#6366F1] font-newsreader">AYUSH Ready</p>
                <p className="text-xs text-slate-500 dark:text-[#71717a] font-medium">Integrated Workflows</p>
              </motion.div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
