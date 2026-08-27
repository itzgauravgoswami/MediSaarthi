"use client";

import { useState } from "react";
import { Siren, Check, Edit3, User, Calendar, Stethoscope, AlertTriangle, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export default function DoctorDashboardPreview() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <section className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

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
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-wider border border-[#0F4C5C]/20 dark:border-[#27272a]">
            PHYSICIAN DECISION INTERFACE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight font-newsreader">
            Complete patient case, ready before you say hello.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            Instead of spending the first 10 minutes typing background notes, physicians open a structured pre-consultation summary ready for clinical review.
          </p>
        </div>

        {/* Doctor Dashboard Mockup Window */}
        <div className="max-w-5xl mx-auto bg-black dark:bg-black rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800 dark:border-[#27272a] space-y-4">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 dark:bg-black rounded-2xl border border-slate-800 dark:border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-xs font-bold text-slate-300 dark:text-white tracking-wider uppercase flex items-center gap-2 font-sans">
                <Stethoscope className="w-4 h-4 text-[#18A999]" />
                MediSaarthi Doctor Portal • OPD Room 4
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-[#a1a1aa]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Dr. Ananya Sharma (Cardiology)
            </div>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="bg-black dark:bg-black rounded-2xl p-6 border border-slate-800 dark:border-[#27272a] space-y-6">
            
            {/* Patient Info Bar & Red Flag Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white font-bold flex items-center justify-center text-lg shadow-md font-newsreader">
                  RK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-newsreader">Raj Kumar</h3>
                    <span className="text-xs font-mono font-bold bg-slate-950 dark:bg-black text-slate-400 dark:text-[#18A999] px-2 py-0.5 rounded border border-slate-700 dark:border-[#27272a]">
                      Patient #A102
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-[#a1a1aa] font-medium">
                    45 Years • Male • Language: Hindi / English • OPD Token #14
                  </p>
                </div>
              </div>

              {/* Red Flag Alert Badge */}
              <div className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse shrink-0">
                <Siren className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Red Flag Detected: Exertional Chest Pain</span>
              </div>
            </div>

            {/* Grid of Clinical History Sections */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Chief Complaint & HPI */}
              <div className="md:col-span-7 space-y-4">
                {/* Chief Complaint */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#18A999]">
                    Chief Complaint
                  </span>
                  <p className="text-sm font-extrabold text-white font-newsreader">
                    Chest pain × 3 days (Onocardial onset)
                  </p>
                </div>

                {/* HPI */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#18A999]">
                    History of Present Illness (HPI)
                  </span>
                  <p className="text-xs text-slate-300 dark:text-[#a1a1aa] leading-relaxed font-normal">
                    Patient reports pressure-like central retrosternal discomfort radiating to left shoulder for 3 days. Worse on exertion (brisk walking), relieved by rest. No diaphoresis or syncopal episodes reported.
                  </p>
                </div>

                {/* Systemic Screening */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#18A999]">
                    Systemic Screening
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-950 dark:bg-black text-slate-300 dark:text-white border border-slate-700 dark:border-[#27272a]">Dyspnea (+ Grade I)</span>
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-950 dark:bg-black text-slate-300 dark:text-[#a1a1aa] border border-slate-700 dark:border-[#27272a]">Palpitations (-)</span>
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-950 dark:bg-black text-slate-300 dark:text-[#a1a1aa] border border-slate-700 dark:border-[#27272a]">Fever (-)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: History, Meds & Lab Summary */}
              <div className="md:col-span-5 space-y-4">
                {/* Past Medical History */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717a]">
                    Past History
                  </span>
                  <p className="text-xs font-bold text-slate-200 dark:text-white font-newsreader">
                    Hypertension × 4 years • Non-smoker
                  </p>
                </div>

                {/* Current Medications */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717a]">
                    Current Medications
                  </span>
                  <p className="text-xs font-bold text-emerald-400 font-mono">
                    Tab. Amlodipine 5 mg OD (Regular)
                  </p>
                </div>

                {/* OCR Investigation Summary */}
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717a]">
                    Previous OCR Investigations
                  </span>
                  <p className="text-xs text-slate-300 dark:text-[#a1a1aa] font-mono">
                    Hb: 12.4 g/dL • Fasting Glucose: 145 mg/dL
                  </p>
                </div>
              </div>

            </div>

            {/* Doctor Action Buttons */}
            <div className="pt-4 border-t border-slate-800 dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-[#a1a1aa]">
                <ShieldCheck className="w-4 h-4 text-[#18A999]" />
                <span>AI-generated intake summary awaiting physician signature.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => alert("Opening Summary Edit Mode...")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-black hover:bg-slate-900 dark:hover:bg-[#111111] text-slate-200 dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 dark:border-[#27272a] focus-accessible"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#18A999]" />
                  Edit Summary
                </button>

                <button
                  onClick={() => setIsConfirmed(!isConfirmed)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg focus-accessible ${
                    isConfirmed
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white hover:opacity-95"
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  {isConfirmed ? "Confirmed & Saved to EMR ✓" : "Confirm & Save"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
