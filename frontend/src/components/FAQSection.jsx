"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is MediSaarthi?",
      a: "MediSaarthi is an AI-powered clinical intake and patient history platform for hospitals, clinics, and AYUSH institutions. It helps collect, translate, and structure comprehensive patient histories before the physician consultation begins.",
    },
    {
      q: "Is MediSaarthi an AI doctor?",
      a: "No. MediSaarthi is strictly an AI-assisted clinical intake and documentation platform. It does not provide medical diagnoses or replace physicians. Attending doctors remain in complete control and are solely responsible for clinical decisions.",
    },
    {
      q: "Can patients speak instead of typing?",
      a: "Yes! MediSaarthi is designed around voice-first + touch interaction. Patients can speak naturally in their preferred language or tap intuitive visual icons, making intake accessible for elderly and low-literacy patients.",
    },
    {
      q: "Which languages are supported?",
      a: "The platform natively supports Hindi and English, with an underlying acoustic and NLP architecture designed for seamless expansion into additional regional Indian languages (such as Bengali, Marathi, Tamil, and Telugu).",
    },
    {
      q: "Can MediSaarthi read medical reports?",
      a: "Yes. MediSaarthi features an OCR and Medical Document Intelligence pipeline that parses lab values, prescriptions, and discharge summaries into structured parameters, subject to document clarity and physician verification.",
    },
    {
      q: "Does MediSaarthi diagnose diseases?",
      a: "No. The platform collects, translates, and structures patient-provided information and highlights red-flag emergency symptoms for hospital triage staff. It does not formulate autonomous diagnostic conclusions.",
    },
    {
      q: "Does it support AYUSH workflows?",
      a: "Yes. MediSaarthi includes a dedicated AYUSH clinical history module supporting Ayurvedic history-taking, including Dashavidha Pariksha, Prakriti analysis, and Ahara-Vihara lifestyle assessment.",
    },
    {
      q: "Can doctors edit the AI-generated summary?",
      a: "Yes. Physician verification is a mandatory core principle. Doctors can review, edit, append, confirm, or reject any part of the AI-generated intake summary before committing it to the medical record.",
    },
    {
      q: "Can MediSaarthi integrate with hospital systems?",
      a: "Yes. The platform architecture is designed for healthcare data exchange using HL7 FHIR standards and is ready for integration with Hospital Management Information Systems (HMIS) and the Ayushman Bharat Digital Mission (ABDM).",
    },
    {
      q: "How is patient data protected?",
      a: "MediSaarthi uses a consent-first design, role-based access control, end-to-end encryption in transit and at rest, session isolation, and audit trail logging. Production deployments undergo institutional security and compliance reviews.",
    },
  ];

  return (
    <section id="faqs" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-wider border border-[#0F4C5C]/20 dark:border-[#27272a]">
            <HelpCircle className="w-4 h-4 text-[#18A999]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight font-newsreader">
            Got questions? We have answers.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            Everything you need to know about MediSaarthi's clinical intake assistant, safety safeguards, and hospital deployment.
          </p>
        </motion.div>

        {/* Expandable Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus-accessible hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 font-newsreader">
                    <span className="text-xs font-extrabold text-[#0F4C5C] dark:text-[#18A999] bg-[#0F4C5C]/10 dark:bg-[#111111] px-2.5 py-1 rounded-md shrink-0 border dark:border-[#27272a]">
                      Q{idx + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0F4C5C] dark:text-[#18A999] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#18A999]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed border-t border-slate-200/80 dark:border-[#27272a] bg-slate-50/50 dark:bg-[#111111]/50">
                        <p className="pl-9">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
