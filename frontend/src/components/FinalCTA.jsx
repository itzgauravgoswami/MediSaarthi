"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Stethoscope, CheckCircle2 } from "lucide-react";

export default function FinalCTA() {
  return (
    <section id="get-started" className="relative py-14 sm:py-16 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#18A999]/15 dark:bg-[#18A999]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#0F4C5C]/20 dark:border-[#27272a]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#18A999]" />
          <span>TRANSFORM YOUR OPD WORKFLOW TODAY</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#0F172A] dark:text-white font-newsreader"
        >
          Give doctors more <span className="text-gradient-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#18A999] dark:via-teal-300 dark:to-cyan-400">time to care</span>.
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Let MediSaarthi handle the repetitive work of collecting, structuring, and preparing patient history before the consultation begins.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <a
            href="#get-started"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95 focus-accessible group"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-white bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus-accessible group"
          >
            <Stethoscope className="w-4 h-4 text-[#0F4C5C] dark:text-[#18A999] group-hover:scale-110 transition-transform" />
            <span>Explore The Platform</span>
          </a>
        </motion.div>

        {/* Quick Trust Checks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-[#a1a1aa] font-semibold border-t border-slate-200/80 dark:border-[#27272a] max-w-xl mx-auto"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#18A999]" /> No Software Lock-in</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#18A999]" /> FHIR Standardized</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#18A999]" /> Physician Verified</span>
        </motion.div>

      </div>
    </section>
  );
}
