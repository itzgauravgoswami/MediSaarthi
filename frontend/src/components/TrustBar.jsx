"use client";

import { motion } from "framer-motion";
import { Languages, Mic, Cpu, Flower2, Network, ShieldCheck, Sparkles } from "lucide-react";

export default function TrustBar() {
  const trustPillars = [
    {
      title: "Multilingual Voice",
      desc: "10+ Indian Languages",
      icon: Languages,
      color: "text-[#0F4C5C] dark:text-[#18A999]",
      bg: "bg-[#0F4C5C]/10 dark:bg-[#18A999]/10 border-[#0F4C5C]/20 dark:border-[#18A999]/30",
    },
    {
      title: "Voice-First Intake",
      desc: "Low-Literacy Accessible",
      icon: Mic,
      color: "text-[#18A999]",
      bg: "bg-[#18A999]/10 border-[#18A999]/20 dark:border-[#18A999]/30",
    },
    {
      title: "Adaptive Clinical AI",
      desc: "Dynamic Questioning",
      icon: Cpu,
      color: "text-[#6366F1]",
      bg: "bg-[#6366F1]/10 border-[#6366F1]/20 dark:border-[#6366F1]/30",
    },
    {
      title: "AYUSH Workflows",
      desc: "Dashavidha Pariksha",
      icon: Flower2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30",
    },
    {
      title: "FHIR & ABDM Ready",
      desc: "Interoperable EMR Data",
      icon: Network,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20 dark:border-sky-500/30",
    },
    {
      title: "Consent & Privacy",
      desc: "End-to-End Encrypted",
      icon: ShieldCheck,
      color: "text-indigo-600 dark:text-[#C5A059]",
      bg: "bg-indigo-500/10 dark:bg-[#C5A059]/10 border-indigo-500/20 dark:border-[#C5A059]/30",
    },
  ];

  return (
    <section className="relative py-8 sm:py-10 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-[#18A999]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sleek Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-[#27272a]"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#18A999]/10 text-[#18A999] border border-[#18A999]/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              Clinical Platform Pillars
            </h3>
          </div>

          <p className="text-xs font-medium text-slate-500 dark:text-[#a1a1aa] text-center sm:text-right">
            Built for OPDs, multi-specialty hospitals & AYUSH institutes across India.
          </p>
        </motion.div>

        {/* Compact 6-Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#111111] border border-slate-200/80 dark:border-[#27272a] hover:border-[#18A999]/50 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate font-newsreader">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-[#a1a1aa] truncate font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
