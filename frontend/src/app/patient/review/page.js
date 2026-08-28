"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import Button from '@/components/ui/Button';
import { CheckCircle2, Edit3, ArrowRight } from 'lucide-react';

export default function PatientReviewPage() {
  const router = useRouter();
  const { intakeState } = usePatientIntake();

  const handleConfirmSubmit = () => {
    router.push('/patient/complete');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
      {/* Glow & Gridlines */}
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
          Summary Review
        </span>
      </header>

      {/* Review Card */}
      <main className="max-w-2xl w-full mx-auto my-6 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
            <CheckCircle2 className="w-8 h-8 text-[#18A999]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-newsreader">Your Information Has Been Captured</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">Please review what we recorded before sending it to your doctor.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chief Complaint</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-newsreader">
              {intakeState?.chiefComplaint || 'Chest Pain with Breathlessness'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Symptom Duration</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Approximately 3 days</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Previous Documents Uploaded</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">2 Documents</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Medications Extracted</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">3 Active Items</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clinical Priority Flag</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Priority Review Flagged
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Your information will be securely organized into a clinical history summary for your attending doctor.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button size="lg" variant="outline" onClick={() => router.push('/patient/interview')} icon={Edit3} fullWidth>
            Edit Information
          </Button>
          <Button size="lg" variant="primary" onClick={handleConfirmSubmit} icon={ArrowRight} iconPosition="right" fullWidth>
            Confirm & Submit
          </Button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 relative z-10">
        MediSaarthi Platform • Intake Complete
      </footer>
    </div>
  );
}
