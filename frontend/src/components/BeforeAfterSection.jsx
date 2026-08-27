"use client";

import { useState } from "react";
import { ArrowRight, AlertTriangle, CheckCircle2, Clock, Sparkles, UserCheck } from "lucide-react";

export default function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState("with");

  const withoutSteps = [
    { title: "Patient arrives", desc: "Waits in long OPD queue", time: "0 mins" },
    { title: "Registration", desc: "Basic personal details entered", time: "10 mins" },
    { title: "Doctor asks questions", desc: "Verbal history taking from scratch", time: "20 mins" },
    { title: "Patient searches reports", desc: "Fumbles through plastic folder bags", time: "25 mins" },
    { title: "Doctor reads documents", desc: "Tries to decipher handwritten notes", time: "30 mins" },
    { title: "History documented", desc: "Doctor manually types notes into EMR", time: "35 mins" },
    { title: "Diagnosis / consultation", desc: "Consultation truncated due to time", time: "40 mins" },
  ];

  const withSteps = [
    { title: "Patient arrives", desc: "Scans QR or approaches Kiosk", time: "0 mins" },
    { title: "AI-guided history", desc: "Patient speaks in Hindi/local language", time: "2 mins" },
    { title: "Voice + touch", desc: "Answers adaptive clinical questions", time: "5 mins" },
    { title: "Reports digitized", desc: "Instant OCR extraction of past reports", time: "7 mins" },
    { title: "AI organizes history", desc: "Creates FHIR timeline & surfaces red flags", time: "8 mins" },
    { title: "Doctor reviews summary", desc: "Physician reads 30-sec structured summary", time: "Pre-OPD" },
    { title: "Consultation", desc: "Focused clinical examination & care", time: "Immediate" },
  ];

  return (
    <section className="py-24 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#27272a] text-[#18A999] text-xs font-bold uppercase tracking-widest">
            WORKFLOW TRANSFORMATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-newsreader">
            See the difference in clinical speed and accuracy.
          </h2>
          <p className="text-[#a1a1aa] text-base font-normal">
            Compare traditional OPD intake with MediSaarthi's AI-assisted workflow.
          </p>

          {/* Mobile Tab Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab("without")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all focus-accessible ${
                activeTab === "without"
                  ? "bg-rose-950 text-rose-300 border border-rose-800 shadow-sm"
                  : "bg-[#111111] text-[#a1a1aa] hover:bg-[#18181b] border border-[#27272a]"
              }`}
            >
              Without MediSaarthi ❌
            </button>
            <button
              onClick={() => setActiveTab("with")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all focus-accessible ${
                activeTab === "with"
                  ? "bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-teal-glow"
                  : "bg-[#111111] text-[#a1a1aa] hover:bg-[#18181b] border border-[#27272a]"
              }`}
            >
              With MediSaarthi ✨
            </button>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Column 1: Without MediSaarthi */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-[#111111] border border-rose-900/40 space-y-6 transition-all duration-300 ${
              activeTab === "without" ? "block" : "hidden lg:block opacity-75"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-newsreader">Without MediSaarthi</h3>
                  <p className="text-xs text-rose-400 font-semibold">Traditional Unstructured Flow</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#a1a1aa] bg-[#18181b] px-3 py-1 rounded-full border border-[#27272a]">
                ~40 mins OPD overhead
              </span>
            </div>

            {/* Vertical Steps */}
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#27272a] -z-0" />
              {withoutSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex items-start gap-4 p-3.5 bg-[#18181b] rounded-xl border border-[#27272a]">
                  <div className="w-8 h-8 rounded-full bg-[#27272a] text-[#a1a1aa] text-xs font-bold flex items-center justify-center shrink-0 border border-[#3f3f46]">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-newsreader">{step.title}</h4>
                      <span className="text-[10px] text-[#a1a1aa] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rose-400" /> {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-900/60 text-xs text-rose-300 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Result: Physician spends 60% of appointment time asking basic history questions.</span>
            </div>
          </div>

          {/* Column 2: With MediSaarthi */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F4C5C]/20 via-[#18A999]/10 to-[#111111] border-2 border-[#18A999]/50 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300 ${
              activeTab === "with" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#18A999]/30 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0F4C5C] text-white">
                  <Sparkles className="w-5 h-5 text-[#18A999]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-newsreader">With MediSaarthi</h3>
                  <p className="text-xs text-[#18A999] font-bold">AI Clinical Intake Workflow</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-white bg-gradient-to-r from-[#0F4C5C] to-[#18A999] px-3.5 py-1 rounded-full shadow-teal-glow">
                80% Time Saved
              </span>
            </div>

            {/* Vertical Steps */}
            <div className="space-y-4 relative z-10">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#18A999]/30 -z-0" />
              {withSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex items-start gap-4 p-3.5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-[#18A999] transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-newsreader flex items-center gap-1.5">
                        {step.title}
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#18A999]" />
                      </h4>
                      <span className="text-[10px] text-[#18A999] font-mono font-bold flex items-center gap-1 bg-[#18A999]/20 px-2 py-0.5 rounded-full border border-[#18A999]/30">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#18A999]/15 rounded-2xl border border-[#18A999]/30 text-xs text-white font-bold flex items-center gap-2 relative z-10">
              <UserCheck className="w-4 h-4 text-[#18A999] shrink-0" />
              <span>Result: Doctor enters consultation with complete structured case summary in hand!</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
