"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import { DEMO_PATIENTS } from '@/services/demoDataService';
import { FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function DocumentIntelligencePage() {
  const patient = DEMO_PATIENTS[0];
  const [selectedDoc, setSelectedDoc] = useState(patient.documents[0]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">OCR INTELLIGENCE</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-newsreader">Document Intelligence Workspace</h1>
          <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Compare original scanned medical documents side-by-side with OCR extracted clinical entities.</p>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Original Scan (6 Cols) */}
          <Card className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#18A999]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">Original Document Scan</h3>
              </div>

              <select
                value={selectedDoc.id}
                onChange={(e) => setSelectedDoc(patient.documents.find(d => d.id === e.target.value))}
                className="px-3 py-1 text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full font-bold text-slate-700 dark:text-white focus:ring-1 focus:ring-[#18A999]"
              >
                {patient.documents.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[380px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-[#27272a] mb-3 not-mono">
                <span className="font-bold text-white text-xs font-newsreader">{selectedDoc.title}</span>
                <span className="text-[10px] text-slate-400">PDF Document Scan • {selectedDoc.date}</span>
              </div>
              {selectedDoc.rawText}
            </div>
          </Card>

          {/* Right Panel: Extracted JSON Entities (6 Cols) */}
          <Card className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#18A999]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">OCR Extracted Entities</h3>
              </div>
              <Badge variant="teal">{selectedDoc.confidence}% Extraction Confidence</Badge>
            </div>

            {/* Diagnoses */}
            <div>
              <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block mb-1.5">Detected Diagnoses</span>
              <div className="flex flex-wrap gap-2">
                {selectedDoc.extractedData.diagnoses.map((d, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Medications */}
            {selectedDoc.extractedData.medications.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block mb-1.5">Extracted Medications</span>
                <div className="space-y-2">
                  {selectedDoc.extractedData.medications.map((m, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-newsreader">{m.name} {m.dose}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Frequency: {m.freq} • Duration: {m.duration}</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Investigations */}
            {selectedDoc.extractedData.investigations.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block mb-1.5">Lab Test Results</span>
                <div className="space-y-2">
                  {selectedDoc.extractedData.investigations.map((inv, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-newsreader">{typeof inv === 'string' ? inv : inv.testName}</span>
                        {typeof inv !== 'string' && <span className="text-[10px] text-slate-400 font-mono">Ref Range: {inv.ref}</span>}
                      </div>
                      <span className="font-black text-rose-500 font-mono">
                        {typeof inv !== 'string' ? inv.val : 'Recorded'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-[#27272a] text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#18A999]" />
              <span>Extracted by MediSaarthi Document Intelligence Parser v2026</span>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
