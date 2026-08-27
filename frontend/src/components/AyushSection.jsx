"use client";

import { motion } from "framer-motion";
import { Flower2, Leaf, Sparkles, CheckCircle2, HeartPulse, Stethoscope } from "lucide-react";

export default function AyushSection() {
  const ayushParameters = [
    { name: "Prakriti", category: "Dosha Constitution", desc: "Vata, Pitta, Kapha bio-energetic baseline assessment" },
    { name: "Vikriti", category: "Imbalance State", desc: "Current pathophysiological state and dosha aggravation" },
    { name: "Sara", category: "Tissue Excellence", desc: "Qualitative evaluation of Dhatus (Rasa to Sukra)" },
    { name: "Samhanana", category: "Compactness", desc: "Assessment of physical build and structural integrity" },
    { name: "Pramana", category: "Anthropometry", desc: "Body proportion and physical measurement ratios" },
    { name: "Satmya", category: "Adaptability", desc: "Habituation and suitability of diet & environment" },
    { name: "Sattva", category: "Mental Strength", desc: "Psychological resilience (Pravara, Madhyama, Avara)" },
    { name: "Ahara Shakti", category: "Digestive Capacity", desc: "Abhyavaharana & Jarana Shakti evaluation (Agni)" },
    { name: "Vyayama Shakti", category: "Physical Capacity", desc: "Work capacity and exercise tolerance metrics" },
    { name: "Vaya", category: "Age Assessment", desc: "Chronological vs biological age classification" },
    { name: "Ahara", category: "Dietary Habits", desc: "Rasa, Guna, Virya food preference & pattern history" },
    { name: "Vihara", category: "Lifestyle & Regimen", desc: "Dinacharya, Ritucharya, sleep and activity patterns" },
  ];

  return (
    <section id="ayush" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background Organic Glow */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-black text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-[#27272a]">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AYUSH & INTEGRATIVE MEDICINE WORKFLOWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-newsreader">
            Modern intelligence. Traditional clinical depth.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg font-normal">
            MediSaarthi natively supports Ayurvedic history-taking including Dashavidha Pariksha, Prakriti analysis, and detailed Ahara-Vihara lifestyle assessment.
          </p>
        </motion.div>

        {/* 12 AYUSH Parameter Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {ayushParameters.map((param, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white dark:bg-black border border-emerald-200/80 dark:border-[#27272a] hover:bg-emerald-50/50 dark:hover:bg-[#111111] shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30">
                  {param.category}
                </span>
                <Flower2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors font-newsreader">
                {param.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#a1a1aa] leading-relaxed font-normal">
                {param.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* AYUSH Integration Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-[#0F4C5C] to-[#18A999] dark:from-[#0F4C5C] dark:via-[#0A3540] dark:to-[#000000] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/40 dark:border-[#27272a]"
        >
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2 font-newsreader">
              <Stethoscope className="w-5 h-5 text-emerald-300" />
              Unified AYUSH + Allopathy Patient Record
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 dark:text-[#a1a1aa] max-w-2xl">
              MediSaarthi allows AYUSH practitioners and integrative wellness hospitals to capture traditional holistic parameters alongside standard clinical investigation reports.
            </p>
          </div>

          <a
            href="#get-started"
            className="shrink-0 px-6 py-3 bg-white text-[#0F4C5C] font-extrabold rounded-xl shadow-md hover:bg-slate-100 hover:scale-105 transition-all text-xs uppercase tracking-wider focus-accessible"
          >
            Explore AYUSH Features
          </a>
        </motion.div>

      </div>
    </section>
  );
}
