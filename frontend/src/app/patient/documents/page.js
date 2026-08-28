"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { getTranslation } from '@/locales/i18n';
import Button from '@/components/ui/Button';
import { UploadCloud, FileText, Camera, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function PatientDocumentsPage() {
  const router = useRouter();
  const { intakeState, addDocument } = usePatientIntake();
  const lang = intakeState?.language || 'hi';

  const [uploading, setUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Max_Prescription_Nov2025.pdf", size: "1.2 MB", type: "Prescription", status: "Processed" }
  ]);

  const stages = [
    "Document uploaded successfully",
    "Reading document text...",
    "Extracting medical diagnoses & medications...",
    "Organizing clinical details...",
    "Added to medical timeline"
  ];

  const handleSimulateUpload = () => {
    setUploading(true);
    setProcessingStage(0);

    const interval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setUploading(false);
          addDocument({
            id: `DOC-${Date.now()}`,
            title: "Thyrocare_Lab_Report_Aug2026.pdf",
            type: "Lab Report",
            status: "Parsed"
          });
          setUploadedFiles((f) => [
            ...f,
            { name: "Thyrocare_Lab_Report_Aug2026.pdf", size: "840 KB", type: "Lab Report", status: "Processed" }
          ]);
          return 4;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
      {/* Gridlines & Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative p-1 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a]">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain p-1" />
          </div>
          <span className="font-extrabold text-lg text-[#0F4C5C] dark:text-white font-newsreader">Medi<span className="text-[#18A999]">Saarthi</span></span>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] rounded-full border border-[#18A999]/30 dark:border-[#27272a]">
          Step 4 of 4: Medical Documents
        </span>
      </header>

      {/* Upload Workspace */}
      <main className="max-w-3xl w-full mx-auto my-6 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold font-newsreader">{getTranslation(lang, 'documentsTitle')}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">{getTranslation(lang, 'documentsSubtitle')}</p>
        </div>

        {/* Drag & Drop Area */}
        <div
          onClick={handleSimulateUpload}
          className="p-8 md:p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-[#27272a] bg-slate-50/50 dark:bg-[#111111]/40 hover:bg-[#0F4C5C]/10 dark:hover:bg-black hover:border-[#18A999] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-4 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black border border-[#18A999]/30 text-[#18A999] flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-[#18A999]" />
          </div>

          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white block font-newsreader">
              {getTranslation(lang, 'dragDropText')}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {getTranslation(lang, 'supportedFormats')}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button size="sm" variant="outline" icon={Camera}>
              {getTranslation(lang, 'scanDocument')}
            </Button>
            <Button size="sm" variant="primary" icon={UploadCloud}>
              Upload File
            </Button>
          </div>
        </div>

        {/* OCR Stepper */}
        {uploading && (
          <div className="p-6 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black border border-[#18A999]/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#18A999]">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#18A999]" />
                Processing your document with OCR Intelligence...
              </span>
              <span>{Math.min(100, (processingStage + 1) * 20)}%</span>
            </div>

            <div className="space-y-2">
              {stages.map((stageText, idx) => {
                const isDone = idx < processingStage;
                const isCurrent = idx === processingStage;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-medium">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#18A999] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-[#27272a] shrink-0" />
                    )}
                    <span className={isDone ? "text-white font-bold" : isCurrent ? "text-[#18A999] font-bold" : "text-slate-500"}>
                      {stageText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uploaded Documents List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#18A999] uppercase tracking-wider">Uploaded Documents</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#18A999]" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block font-newsreader">{file.name}</span>
                      <span className="text-[10px] text-slate-400">{file.type} • {file.size}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button size="lg" onClick={() => router.push('/patient/review')} icon={ArrowRight} iconPosition="right">
            Review Captured Information
          </Button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 relative z-10">
        MediSaarthi Document Intelligence Engine • OCR & Parsing
      </footer>
    </div>
  );
}
