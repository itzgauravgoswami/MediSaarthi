"use client";

import { Zap, FileCheck2, Users, LineChart, Building2, CheckCircle2 } from "lucide-react";

export default function HospitalBenefits() {
  const benefits = [
    {
      title: "Faster Intake",
      desc: "Reduce repetitive history-taking during consultations, allowing doctors to focus on diagnosis and treatment in high-volume hospital environments.",
      icon: Zap,
      color: "text-[#18A999] bg-[#18A999]/10 border-[#18A999]/30",
      highlight: "Save up to 10 mins per consultation",
    },
    {
      title: "Better Documentation",
      desc: "Convert fragmented, verbal, or handwritten patient information into standardized, structured clinical notes that improve EHR record quality.",
      icon: FileCheck2,
      color: "text-[#0F4C5C] bg-[#0F4C5C]/20 border-[#0F4C5C]/40",
      highlight: "Standardized FHIR JSON & PDF notes",
    },
    {
      title: "Improved Accessibility",
      desc: "Voice, touch, and multilingual interaction ensure that elderly, illiterate, or non-English speaking patients can easily provide their health history.",
      icon: Users,
      color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/30",
      highlight: "Native Indian dialect voice AI",
    },
    {
      title: "Better Continuity of Care",
      desc: "Organize previous prescriptions, lab reports, and past discharge summaries chronologically into a clean longitudinal patient medical timeline.",
      icon: LineChart,
      color: "text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/30",
      highlight: "Longitudinal health view for doctors",
    },
  ];

  return (
    <section id="hospitals" className="py-24 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#27272a]">
            <Building2 className="w-4 h-4 text-[#18A999]" />
            <span>HOSPITAL & CLINIC OPERATIONAL IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-newsreader">
            Built for high-volume healthcare.
          </h2>
          <p className="text-[#a1a1aa] text-base sm:text-lg">
            Empowering OPDs, multi-specialty hospitals, and community health centers to streamline patient flow and maximize clinical care time.
          </p>
        </div>

        {/* 4 Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#111111] border border-[#27272a] hover:border-[#3f3f46] shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${benefit.color} shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#18181b] text-white border border-[#27272a]">
                      Impact Card 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-[#18A999] transition-colors font-newsreader">
                    {benefit.title}
                  </h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6 font-normal">
                    {benefit.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#27272a] flex items-center gap-2 text-xs font-bold text-[#18A999]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{benefit.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
