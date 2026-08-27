"use client";

import { Clock, Files, VolumeX, ArrowUpRight } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      num: "01",
      title: "Limited consultation time",
      desc: "Doctors often have only a few minutes to understand the patient's complete history, leading to rushed notes and missed clinical details.",
      icon: Clock,
      stat: "70% Time Spent",
      statDesc: "on manual history taking during OPD visits",
      badgeColor: "bg-amber-950/60 text-amber-300 border-amber-800/60",
    },
    {
      num: "02",
      title: "Fragmented medical records",
      desc: "Patients arrive carrying paper prescriptions, handwritten notes, and lab reports scattered across physical files in unstructured formats.",
      icon: Files,
      stat: "Unstructured Data",
      statDesc: "hard to synthesize in short consultations",
      badgeColor: "bg-rose-950/60 text-rose-300 border-rose-800/60",
    },
    {
      num: "03",
      title: "Language & accessibility barriers",
      desc: "Elderly, rural, and low-literacy patients struggle with complex digital forms or language gaps, creating anxiety and incomplete histories.",
      icon: VolumeX,
      stat: "60%+ Patients",
      statDesc: "prefer voice interaction in native dialect",
      badgeColor: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60",
    },
  ];

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold uppercase tracking-widest">
            THE CLINICAL CHALLENGE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-newsreader">
            Healthcare's most valuable minutes are being lost to paperwork.
          </h2>
          <p className="text-[#a1a1aa] text-base sm:text-lg font-normal">
            In high-volume OPDs and clinics, physicians spend significant time verbally asking repetitive background questions instead of focusing on diagnostic examination and treatment.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.num}
                className="p-8 rounded-3xl bg-[#111111] border border-[#27272a] hover:border-[#3f3f46] shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-[#27272a] group-hover:text-[#18A999] transition-colors font-newsreader">
                      {prob.num}
                    </span>
                    <div className={`p-3 rounded-2xl border ${prob.badgeColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3 font-newsreader">
                    {prob.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-6">
                    {prob.desc}
                  </p>
                </div>

                <div className={`pt-4 border-t border-[#27272a] ${prob.badgeColor} rounded-xl p-3 border`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Impact Indicator</p>
                  <p className="text-sm font-extrabold mt-0.5">{prob.stat}</p>
                  <p className="text-[11px] opacity-80">{prob.statDesc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner Solution Transition */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-500/30">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#ffffff] uppercase bg-black/30 px-3.5 py-1 rounded-full border border-white/20">
              THE MEDISAARTHI SOLUTION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-newsreader">
              MediSaarthi moves clinical history-taking before the consultation.
            </h3>
            <p className="text-slate-100 text-sm max-w-2xl font-normal">
              By collecting, translating, and organizing patient data prior to entering the doctor's room, physicians receive a structured clinical summary instantly.
            </p>
          </div>

          <a
            href="#how-it-works"
            className="shrink-0 px-7 py-4 bg-white text-[#0F4C5C] hover:bg-slate-100 font-extrabold rounded-xl shadow-xl transition-all flex items-center gap-2 group active:scale-95 relative z-10 focus-accessible text-xs uppercase tracking-wider"
          >
            <span>See The Flow</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
