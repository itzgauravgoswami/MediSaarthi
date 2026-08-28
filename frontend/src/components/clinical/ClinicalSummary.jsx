"use client";

import React, { useState } from 'react';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi } from '@/services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Sparkles, 
  Info, 
  UserCheck, 
  Check 
} from 'lucide-react';

export default function ClinicalSummary({ patient }) {
  const [isEditing, setIsEditing] = useState(false);
  const [hpiText, setHpiText] = useState(patient?.historyOfPresentIllness || '');
  const [verified, setVerified] = useState(patient?.isVerified || false);
  const [verifiedDetails, setVerifiedDetails] = useState({
    by: patient?.verifiedBy || null,
    at: patient?.verifiedAt || null
  });

  const handleVerify = async () => {
    const res = await patientApi.verifySummary(patient.id, "Dr. Sharma");
    if (res.success) {
      setVerified(true);
      setVerifiedDetails({
        by: "Dr. Sharma",
        at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <Card className={`p-5 ${verified ? 'bg-emerald-950/40 border-emerald-800' : 'bg-slate-950 dark:bg-black border-slate-200 dark:border-[#27272a]'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl shrink-0 ${verified ? 'bg-emerald-500 text-white' : 'bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30'}`}>
              {verified ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-newsreader">
                  {verified ? 'Physician Verified Clinical Record' : 'AI-Generated Pre-Consultation Summary'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30">
                  Gemini 3.6 Flash Structured
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#a1a1aa] mt-0.5">
                {verified
                  ? `Verified by ${verifiedDetails.by} on ${verifiedDetails.at}`
                  : 'Please review and edit the collected information before confirming the clinical record.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!verified ? (
              <>
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Done Editing' : 'Edit Summary'}
                </Button>
                <Button size="sm" variant="primary" icon={Check} onClick={handleVerify}>
                  Confirm Information
                </Button>
              </>
            ) : (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                <UserCheck className="w-4 h-4" /> Verified Signature Logged
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HPI */}
        <Card className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#18A999]" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-newsreader">Chief Complaint & HPI</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#111111] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a] flex items-center gap-1">
              <Info className="w-3 h-3 text-[#18A999]" /> Source: Patient Voice Intake
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block">Chief Complaint</span>
            <p className="text-base font-extrabold text-rose-500 mt-1 font-newsreader">
              {patient?.chiefComplaint}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block">History of Present Illness (HPI)</span>
            {isEditing ? (
              <textarea
                value={hpiText}
                onChange={(e) => setHpiText(e.target.value)}
                rows={4}
                className="w-full mt-2 p-3 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl focus:ring-1 focus:ring-[#18A999]"
              />
            ) : (
              <p className="text-xs md:text-sm text-slate-700 dark:text-[#a1a1aa] leading-relaxed mt-1 p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#27272a]">
                {hpiText}
              </p>
            )}
          </div>
        </Card>

        {/* Past History */}
        <Card className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader border-b border-slate-100 dark:border-[#27272a] pb-2">
            Past Medical & Surgical History
          </h3>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Past Medical History</span>
            <p className="text-xs text-slate-700 dark:text-[#a1a1aa] font-semibold mt-0.5 font-newsreader">
              {patient?.pastMedicalHistory || 'None reported'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Past Surgical History</span>
            <p className="text-xs text-slate-700 dark:text-[#a1a1aa] font-semibold mt-0.5 font-newsreader">
              {patient?.pastSurgicalHistory || 'None reported'}
            </p>
          </div>
        </Card>

        {/* Allergies & Family */}
        <Card className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader border-b border-slate-100 dark:border-[#27272a] pb-2">
            Allergies & Family History
          </h3>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Drug Allergies</span>
            <div className="flex gap-2 mt-1">
              {patient?.drugAllergies?.map((allergy, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  {allergy}
                </span>
              )) || <span className="text-xs text-slate-500">No known drug allergies</span>}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Family History</span>
            <p className="text-xs text-slate-700 dark:text-[#a1a1aa] font-semibold mt-0.5">
              {patient?.familyHistory}
            </p>
          </div>
        </Card>

        {/* Medications */}
        <Card className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">Active Medications (Extracted via OCR)</h3>
            <span className="text-[10px] text-[#18A999] font-bold uppercase">Confidence &gt; 85%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {patient?.medicationHistory?.map((med, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-newsreader">{med.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30">
                    {med.confidence}% Match
                  </span>
                </div>
                <span className="text-xs text-slate-600 dark:text-[#a1a1aa] block font-mono">{med.dosage} • {med.frequency}</span>
                <span className="text-[10px] text-slate-400 block italic">Source: {med.source}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
