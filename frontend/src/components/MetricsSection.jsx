"use client";

import { Activity, Clock, FileCheck, Globe, Info } from "lucide-react";

export default function MetricsSection() {
  const metrics = [
    {
      value: "-60%",
      label: "Consultation Preparation Time",
      desc: "Reduction in pre-examination background questioning",
      icon: Clock,
      color: "text-[#18A999]",
    },
    {
      value: "95%+",
      label: "Structured History Completeness",
      desc: "Comprehensive capturing of HPI, past history & medications",
      icon: FileCheck,
      color: "text-white",
    },
    {
      value: "10+",
      label: "Multilingual Accessibility",
      desc: "Support for major Indian languages & acoustic dialects",
      icon: Globe,
      color: "text-[#6366F1]",
    },
    {
      value: "<30s",
      label: "Automated Document Processing",
      desc: "Instant OCR extraction of physical prescriptions & lab sheets",
      icon: Activity,
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="py-20 bg-[#000000] border-y border-[#27272a] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Mandated Prototype Metrics Disclaimer */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#27272a]">
            <Info className="w-3.5 h-3.5" />
            PROTOTYPE TARGETS / ILLUSTRATIVE METRICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-newsreader">
            Designed for clinical efficiency and accessibility.
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa]">
            Below metrics represent benchmark prototype targets evaluated during clinical workflow simulations.
          </p>
        </div>

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#111111] border border-[#27272a] hover:border-[#3f3f46] shadow-2xl transition-all text-center space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#18181b] text-[#18A999] border border-[#27272a] flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-3xl sm:text-4xl lg:text-5xl font-black ${item.color} font-newsreader`}>
                  {item.value}
                </p>
                <h3 className="text-sm font-bold text-white leading-tight font-newsreader">
                  {item.label}
                </h3>
                <p className="text-[11px] text-[#a1a1aa] leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
