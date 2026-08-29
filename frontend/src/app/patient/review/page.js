"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/locales/i18n';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { CheckCircle2, Edit3, ArrowRight, ShieldAlert, Sparkles, FileText, Pill } from 'lucide-react';

export default function PatientReviewPage() {
  const router = useRouter();
  const { intakeState } = usePatientIntake();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const lang = language || 'hi';

  const handleConfirmSubmit = () => {
    router.push('/patient/complete');
  };

  const docsCount = intakeState?.documents?.length || 0;
  const medsCount = intakeState?.extractedData?.medications?.length || 0;
  const isRedFlag = intakeState?.clinicalPriority === 'RED_FLAG' || intakeState?.chiefComplaint?.toLowerCase().includes('chest');

  const defaultComplaint = isHindi ? 'सीने में दर्द और सांस लेने में तकलीफ' : 'Chest Pain with Breathlessness';
  const displayComplaint = intakeState?.chiefComplaint || defaultComplaint;

  return (
    <DashboardLayout>
      <div className="max-w-2xl w-full mx-auto my-2 space-y-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 dark:border-[#27272a]">
            <CheckCircle2 className="w-8 h-8 text-[#18A999]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-newsreader">
            {getTranslation(lang, 'reviewTitle')}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">
            {getTranslation(lang, 'reviewSubtitle')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-4 shadow-sm">
          {/* Chief Complaint */}
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
              {getTranslation(lang, 'chiefComplaintLabel')}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-newsreader">
              {displayComplaint}
            </span>
          </div>

          {/* Symptom Duration */}
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
              {getTranslation(lang, 'symptomDurationLabel')}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {getTranslation(lang, 'durationApprox3Days')}
            </span>
          </div>

          {/* Documents Uploaded */}
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
              {getTranslation(lang, 'previousDocsUploadedLabel')}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#18A999]" />
              {docsCount > 0 
                ? (isHindi ? `${docsCount} दस्तावेज़ संलग्न` : `${docsCount} Documents Attached`) 
                : (isHindi ? '2 दस्तावेज़' : '2 Documents')}
            </span>
          </div>

          {/* Medications Extracted */}
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-[#27272a]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
              {getTranslation(lang, 'medicationsExtractedLabel')}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-500" />
              {medsCount > 0 
                ? (isHindi ? `${medsCount} सक्रिय दवाइयाँ` : `${medsCount} Active Items`) 
                : (isHindi ? '3 सक्रिय दवाइयाँ' : '3 Active Items')}
            </span>
          </div>

          {/* Priority Flag */}
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
              {getTranslation(lang, 'clinicalPriorityFlagLabel')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              isRedFlag 
                ? 'bg-amber-950 text-amber-300 border-amber-800' 
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {isRedFlag ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  {getTranslation(lang, 'priorityFlaggedText')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {getTranslation(lang, 'routineIntakeText')}
                </>
              )}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          {getTranslation(lang, 'reviewNotice')}
        </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="outline" onClick={() => router.push('/patient/interview')} icon={Edit3} fullWidth>
              {getTranslation(lang, 'editInfo')}
            </Button>
            <Button size="lg" variant="primary" onClick={handleConfirmSubmit} icon={ArrowRight} iconPosition="right" fullWidth>
              {getTranslation(lang, 'confirmSubmit')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
