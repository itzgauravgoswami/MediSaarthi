"use client";

import { Shield, KeyRound, Lock, FileKey, UserCheck, ShieldCheck, Database, History, RefreshCcw } from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    { title: "Consent-First Design", desc: "Explicit opt-in consent for voice recording and document processing.", icon: ShieldCheck },
    { title: "Role-Based Access (RBAC)", desc: "Strict privilege separation between triage staff, intake kiosks, and attending doctors.", icon: KeyRound },
    { title: "Secure Authentication", desc: "Multi-factor authentication and tokenized session isolation for healthcare workers.", icon: Lock },
    { title: "Audit Trail Logging", desc: "Comprehensive, tamper-evident activity logs tracking every history creation and edit.", icon: History },
    { title: "Auto Session Termination", desc: "Kiosk and web interfaces automatically purge patient session buffers after consultation.", icon: RefreshCcw },
    { title: "End-to-End Encryption", desc: "AES-256 encryption for data at rest and TLS 1.3 encryption for data in transit.", icon: Database },
    { title: "Secure Document Shredding", desc: "Ephemeral OCR processing ensuring temporary image buffers are safely discarded.", icon: FileKey },
    { title: "Granular Patient Privacy", desc: "Patients control which past medical records are visible during specific visits.", icon: UserCheck },
  ];

  return (
    <section className="py-24 bg-[#000000] text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#0F4C5C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-[#C5A059] text-xs font-bold uppercase tracking-widest border border-[#27272a]">
            <Shield className="w-4 h-4 text-[#C5A059]" />
            <span>ENTERPRISE DATA GOVERNANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-newsreader">
            Built around patient trust.
          </h2>
          <p className="text-[#a1a1aa] text-base sm:text-lg">
            Designed with healthcare privacy and applicable Indian data-protection requirements in mind.
          </p>
        </div>

        {/* Main Security Shield Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Security Graphic */}
          <div className="lg:col-span-4 bg-[#111111] rounded-3xl p-8 border border-[#27272a] shadow-2xl text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0F4C5C] via-[#18A999] to-[#C5A059] flex items-center justify-center text-white shadow-gold-glow animate-pulse">
              <Shield className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white font-newsreader">Patient Data Protection</h3>
              <p className="text-xs text-[#a1a1aa]">
                Zero patient data monetization. All intake information remains within institutional boundaries.
              </p>
            </div>

            <div className="w-full pt-4 border-t border-[#27272a] flex items-center justify-center gap-2 text-[11px] font-bold text-[#18A999]">
              <ShieldCheck className="w-4 h-4" />
              <span>ABDM Architecture Ready</span>
            </div>
          </div>

          {/* Right 8 Security Feature Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#111111] border border-[#27272a] hover:border-[#18A999]/60 transition-all flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-[#18181b] text-[#18A999] shrink-0 border border-[#27272a]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 font-newsreader">{sec.title}</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">{sec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Legal Compliant Wording Callout */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#27272a] text-center text-xs text-[#a1a1aa] max-w-3xl mx-auto">
          🔒 MediSaarthi applies encryption and privacy-by-design standards across all patient interaction layers. Production hospital deployments undergo rigorous institutional security assessment and audit protocols.
        </div>

      </div>
    </section>
  );
}
