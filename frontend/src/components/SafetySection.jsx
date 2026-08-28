import { ShieldCheck, UserCheck, AlertTriangle, Eye, FileCheck, Stethoscope } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SafetySection() {
  const { t, language } = useLanguage();

  const safetyPrinciples = [
    {
      title: language === 'hi' ? "कोई स्वायत्त निदान नहीं" : "No Autonomous Diagnosis",
      desc: language === 'hi' ? "मेडीसारथी कभी भी स्वायत्त चिकित्सा निदान नहीं देता या दवाएं नहीं लिखता है। एआई की एकमात्र भूमिका मरीज के इतिहास को एकत्र, अनुवाद और व्यवस्थित करना है।" : "MediSaarthi never renders autonomous medical diagnoses or prescribes medication. The AI's sole role is to collect, translate, and organize patient-provided history.",
      icon: Eye,
      color: "border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-black text-amber-900 dark:text-amber-300",
      badge: "Non-Diagnostic AI",
    },
    {
      title: language === 'hi' ? "अनिवार्य मानवीय सत्यापन" : "Mandatory Human Verification",
      desc: language === 'hi' ? "अस्पताल के आधिकारिक इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड में हस्ताक्षर करने से पहले डॉक्टर किसी भी एआई-जनरेट सारांश की समीक्षा, संपादन, अनुमोदन या उसे खारिज करते हैं।" : "Doctors review, edit, approve, or discard any AI-generated summary before it is signed into the hospital's official Electronic Health Record.",
      icon: UserCheck,
      color: "border-[#0F4C5C]/30 dark:border-[#27272a] bg-[#0F4C5C]/5 dark:bg-black text-[#0F4C5C] dark:text-white",
      badge: "Physician-in-the-Loop",
    },
    {
      title: language === 'hi' ? "रेड-फ्लैग ट्राइएज एस्केलेशन" : "Red-Flag Triage Escalation",
      desc: language === 'hi' ? "गंभीर लक्षण (सीने में तेज दर्द, स्ट्रोक के लक्षण, गंभीर रक्तस्राव) रूटीन इंटेक को दरकिनार करते हैं और अस्पताल के ट्राइएज कर्मचारियों को उच्च प्राथमिकता अलर्ट भेजते हैं।" : "Critical symptoms (acute chest pain, stroke signs, severe hemorrhage) bypass routine intake and trigger high-priority alerts to hospital triage staff.",
      icon: AlertTriangle,
      color: "border-rose-200 dark:border-rose-800/40 bg-rose-50/50 dark:bg-black text-rose-900 dark:text-rose-300",
      badge: "Emergency Safety",
    },
  ];

  return (
    <section id="safety" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-wider border border-[#0F4C5C]/20 dark:border-[#27272a]">
            <ShieldCheck className="w-4 h-4 text-[#18A999]" />
            <span>RESPONSIBLE HEALTHCARE AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight font-newsreader">
            AI assists. Doctors decide.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            MediSaarthi is strictly designed as a clinical intake and documentation companion. It empowers doctors with structured data without replacing human clinical judgment.
          </p>
        </div>

        {/* Clinical Oversight Flow Pipeline */}
        <div className="max-w-5xl mx-auto mb-16 p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-black text-white shadow-xl space-y-6 border border-slate-800 dark:border-[#27272a]">
          <h3 className="text-xs font-extrabold tracking-widest text-[#18A999] uppercase text-center font-sans">
            SAFEGUARDED CLINICAL DATA FLOW PIPELINE
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-center text-center">
            {/* Step 1 */}
            <div className="p-3 bg-slate-800 dark:bg-[#111111] rounded-xl border border-slate-700 dark:border-[#27272a] space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-[#71717a] font-bold block">STEP 1</span>
              <p className="text-xs font-bold text-slate-200 dark:text-white">Patient Info</p>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-slate-800 dark:bg-[#111111] rounded-xl border border-slate-700 dark:border-[#27272a] space-y-1">
              <span className="text-[10px] text-[#18A999] font-bold block">STEP 2</span>
              <p className="text-xs font-bold text-slate-200 dark:text-white">AI Collection</p>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-slate-800 dark:bg-[#111111] rounded-xl border border-slate-700 dark:border-[#27272a] space-y-1">
              <span className="text-[10px] text-[#18A999] font-bold block">STEP 3</span>
              <p className="text-xs font-bold text-slate-200 dark:text-white">AI Structuring</p>
            </div>

            {/* Step 4 */}
            <div className="p-3 bg-slate-800 dark:bg-[#111111] rounded-xl border border-slate-700 dark:border-[#27272a] space-y-1">
              <span className="text-[10px] text-[#18A999] font-bold block">STEP 4</span>
              <p className="text-xs font-bold text-slate-200 dark:text-white">AI Summary</p>
            </div>

            {/* Step 5 - Physician Highlighted */}
            <div className="p-3 bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] rounded-xl border border-teal-400 space-y-1 col-span-2 sm:col-span-1 shadow-lg scale-105">
              <span className="text-[10px] text-teal-200 font-bold block">MANDATORY GATE</span>
              <p className="text-xs font-black text-white flex items-center justify-center gap-1.5 font-newsreader">
                <Stethoscope className="w-3.5 h-3.5 text-teal-200" />
                <span>Physician Verification</span>
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-3 bg-emerald-950 dark:bg-emerald-950/60 rounded-xl border border-emerald-500/50 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-400 font-bold block">FINAL RECORD</span>
              <p className="text-xs font-bold text-emerald-300">Signed EMR</p>
            </div>
          </div>
        </div>

        {/* 3 Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safetyPrinciples.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl bg-white dark:bg-black border ${principle.color.split(" ")[0]} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#27272a]">
                      <Icon className="w-6 h-6 text-[#18A999]" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a]">
                      {principle.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 font-newsreader">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
                    {principle.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#27272a] flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-white">
                  <FileCheck className="w-4 h-4 text-[#18A999]" />
                  <span>Verified Clinical Protocol</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
