import { FileText, ArrowRight, CheckCircle2, AlertTriangle, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DocumentShowcase() {
  const { t, language } = useLanguage();

  return (
    <section id="document-ai" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

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
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#18A999]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-wider border border-[#18A999]/20 dark:border-[#27272a]">
            {t("docBadge", "INTELLIGENT OCR & PARSING")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight font-newsreader">
            {t("docTitle", "Turn paper prescriptions & lab reports into structured data.")}
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            {t("docSubtitle", "Instant extraction of handwritten doctor notes, medicine dosages, lab values, and diagnostic findings.")}
          </p>
        </div>

        {/* Workflow Diagram Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] shadow-sm flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-700 dark:text-[#a1a1aa]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-black text-slate-700 dark:text-white border border-slate-200 dark:border-[#27272a]"><FileText className="w-4 h-4 text-rose-500" /></div>
            <span className="text-slate-800 dark:text-white">01. Medical Document</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#18A999]" />
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-black text-[#18A999] border border-teal-100 dark:border-[#27272a]"><Cpu className="w-4 h-4" /></div>
            <span className="text-slate-800 dark:text-white">02. OCR Engine</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#18A999]" />
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-black text-[#6366F1] border border-indigo-100 dark:border-[#27272a]"><Sparkles className="w-4 h-4" /></div>
            <span className="text-slate-800 dark:text-white">03. AI Entity Extraction</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#18A999]" />
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#0F4C5C] text-white"><CheckCircle2 className="w-4 h-4" /></div>
            <span className="text-slate-800 dark:text-white">04. Structured History</span>
          </div>
        </div>

        {/* Document Parsing Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Column: Physical Paper Scan */}
          <div className="lg:col-span-5 bg-white dark:bg-black rounded-3xl p-6 border border-slate-200 dark:border-[#27272a] shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#27272a]">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 font-newsreader">
                <FileText className="w-4 h-4 text-rose-500" /> Physical Lab Report.pdf
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-black text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a]">
                SCANNED
              </span>
            </div>

            {/* Paper Document */}
            <div className="p-4 bg-slate-50 dark:bg-black rounded-xl border border-dashed border-slate-300 dark:border-[#27272a] font-mono text-[11px] text-slate-700 dark:text-[#a1a1aa] space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded font-sans text-[9px] font-bold border dark:border-amber-800/60">
                OCR Scan Active
              </div>

              <div className="border-b border-slate-200 dark:border-[#27272a] pb-2">
                <p className="font-bold text-slate-900 dark:text-white">METRO DIAGNOSTICS LAB</p>
                <p className="text-slate-500 dark:text-[#71717a]">Patient: Raj Kumar (45M) • Date: 24/08/2026</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#0F4C5C] dark:text-[#18A999]">COMPLETE BLOOD COUNT (CBC):</p>
                <p>Hemoglobin: 10.2 g/dL (Ref: 13.5 - 17.5)</p>
                <p>Total WBC: 12,400 /µL (Ref: 4,000 - 11,000)</p>
                <p>RBC Count: 4.2 mill/µL</p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-[#27272a]">
                <p className="font-bold text-[#0F4C5C] dark:text-[#18A999]">BIOCHEMISTRY:</p>
                <p>Fasting Blood Sugar: 165 mg/dL (Ref: 70 - 99)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#a1a1aa] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Document uploaded via camera scan or WhatsApp integration.
            </div>
          </div>

          {/* Center Connector */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white flex items-center justify-center shadow-lg animate-pulse">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold text-[#0F4C5C] dark:text-[#18A999] uppercase tracking-wider">AI Extraction</span>
          </div>

          {/* Right Column: Extracted Structured Parameters */}
          <div className="lg:col-span-5 bg-white dark:bg-black rounded-3xl p-6 border-2 border-[#18A999]/30 dark:border-[#18A999]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#27272a]">
              <span className="text-xs font-bold text-[#0F4C5C] dark:text-white flex items-center gap-1.5 font-newsreader">
                <Sparkles className="w-4 h-4 text-[#18A999]" /> Extracted Structured Parameters
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#18A999]/20 text-[#0F4C5C] dark:text-[#18A999] border dark:border-[#18A999]/30">
                PARSED DATA
              </span>
            </div>

            {/* Parameter Cards */}
            <div className="space-y-3">
              {/* Hemoglobin */}
              <div className="p-3 bg-amber-50/80 dark:bg-black rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Hemoglobin (Hb)</p>
                  <p className="text-[11px] text-slate-600 dark:text-[#a1a1aa] font-mono">10.2 g/dL</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-extrabold flex items-center gap-1 border dark:border-amber-800/60">
                  <AlertTriangle className="w-3 h-3" /> Low
                </span>
              </div>

              {/* WBC */}
              <div className="p-3 bg-rose-50/80 dark:bg-black rounded-xl border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Total WBC Count</p>
                  <p className="text-[11px] text-slate-600 dark:text-[#a1a1aa] font-mono">12,400 /µL</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-200/80 dark:bg-rose-950 text-rose-900 dark:text-rose-300 text-[11px] font-extrabold flex items-center gap-1 border dark:border-rose-800/60">
                  <AlertTriangle className="w-3 h-3" /> High
                </span>
              </div>

              {/* Glucose */}
              <div className="p-3 bg-amber-50/80 dark:bg-black rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Fasting Blood Glucose</p>
                  <p className="text-[11px] text-slate-600 dark:text-[#a1a1aa] font-mono">165 mg/dL</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-extrabold flex items-center gap-1 border dark:border-amber-800/60">
                  <AlertTriangle className="w-3 h-3" /> Elevated
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-slate-100 dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a] text-[11px] text-slate-600 dark:text-[#a1a1aa] font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#0F4C5C] dark:text-[#18A999] shrink-0 mt-0.5" />
              <span>
                <strong>Physician Note:</strong> Information extracted from documents is presented for physician verification prior to medical record commit.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
