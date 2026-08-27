"use client";

import { motion } from "framer-motion";
import { UserCheck, MessageSquare, ScanLine, Cpu, Stethoscope, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Identify",
      subtitle: "Language & Consent",
      desc: "Patient selects preferred language (Hindi, English, Regional) and provides digital consent.",
      icon: UserCheck,
      color: "from-teal-500 to-[#0F4C5C]",
      badge: "Kiosk / Mobile QR",
    },
    {
      num: "02",
      title: "Converse",
      subtitle: "Voice + Touch Interview",
      desc: "AI conducts an interactive voice & touch inquiry to capture chief complaint, HPI, and past history.",
      icon: MessageSquare,
      color: "from-[#0F4C5C] to-[#6366F1]",
      badge: "Multilingual AI",
    },
    {
      num: "03",
      title: "Scan",
      subtitle: "Medical Document Intelligence",
      desc: "Patient scans or uploads physical prescriptions, discharge summaries, and diagnostic lab reports.",
      icon: ScanLine,
      color: "from-[#6366F1] to-[#18A999]",
      badge: "OCR & Vision AI",
    },
    {
      num: "04",
      title: "Structure",
      subtitle: "Timeline & Red-Flag Triage",
      desc: "AI automatically structures clinical entities, flags emergency symptoms, and creates chronological history.",
      icon: Cpu,
      color: "from-[#18A999] to-emerald-500",
      badge: "FHIR Timeline",
    },
    {
      num: "05",
      title: "Review",
      subtitle: "Physician Control",
      desc: "Doctor reviews pre-populated history before consultation, with full capability to edit, confirm, or add notes.",
      icon: Stethoscope,
      color: "from-emerald-500 to-[#0F4C5C]",
      badge: "Physician Verification",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#18A999]/15 dark:bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none" />

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
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#0F4C5C]/20 dark:border-[#27272a]">
            SIMPLE 5-STEP WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-newsreader">
            From patient story to physician-ready history.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg font-normal">
            Designed for seamless operation in busy OPDs, community health centers, and specialty clinics.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white dark:bg-black rounded-3xl p-6 border border-slate-200/90 dark:border-[#27272a] hover:border-[#18A999]/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Header with Icon and Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 dark:text-[#27272a] group-hover:text-[#0F4C5C] dark:group-hover:text-[#18A999] transition-colors font-newsreader">
                      {step.num}
                    </span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#18181b] text-[#0F4C5C] dark:text-[#18A999] text-[10px] font-bold uppercase tracking-wider mb-2 border border-slate-200 dark:border-[#27272a]">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white mb-1 font-newsreader">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-[#a1a1aa] mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-[#a1a1aa] leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#27272a] flex items-center justify-between text-[11px] text-slate-400 dark:text-[#71717a] font-medium">
                  <span>Step {idx + 1} of 5</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#18A999] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
