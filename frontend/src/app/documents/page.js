"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import { FileText, CheckCircle2, ShieldCheck, Sparkles, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function DocumentIntelligencePage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/documents`);
        if (res.ok) {
          const json = await res.json();
          const docs = Array.isArray(json) ? json : (json?.data || []);
          setDocuments(docs);
          if (docs.length > 0) setSelectedDoc(docs[0]);
        }
      } catch (err) {
        console.warn('[Documents API]', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">OCR INTELLIGENCE</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-newsreader">Document Intelligence Workspace</h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Compare original scanned medical documents side-by-side with OCR extracted clinical entities.</p>
          </div>

          <Link href="/patient/documents">
            <span className="px-4 py-2 rounded-full bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md">
              <UploadCloud className="w-4 h-4" />
              Upload New Document
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#18A999]" />
            <span>Loading document parser workspace...</span>
          </div>
        ) : !selectedDoc ? (
          <Card className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Medical Documents Scanned Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload past prescriptions, blood test reports, or discharge summaries in the Patient Portal to view live OCR entity extraction.
            </p>
            <Link href="/patient/documents">
              <span className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#18A999] text-black text-xs font-bold">
                Go to Document Upload
              </span>
            </Link>
          </Card>
        ) : (
          /* Split Screen Container */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Original Scan (6 Cols) */}
            <Card className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#18A999]" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">Original Document Scan</h3>
                </div>

                {documents.length > 1 && (
                  <select
                    value={selectedDoc.documentId || selectedDoc._id || selectedDoc.id}
                    onChange={(e) => setSelectedDoc(documents.find(d => (d.documentId || d._id || d.id) === e.target.value))}
                    className="px-3 py-1 text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full font-bold text-slate-700 dark:text-white focus:ring-1 focus:ring-[#18A999]"
                  >
                    {documents.map((d, i) => (
                      <option key={i} value={d.documentId || d._id || d.id}>{d.title || d.fileName || `Document #${i+1}`}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 dark:bg-black border border-slate-800 dark:border-[#27272a] font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[380px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-[#27272a] mb-3 not-mono">
                  <span className="font-bold text-white text-xs font-newsreader">{selectedDoc.title || selectedDoc.fileName || 'Scanned Document'}</span>
                  <span className="text-[10px] text-slate-400">{selectedDoc.fileType || 'PDF/Image'} • {new Date(selectedDoc.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                {selectedDoc.ocrText || selectedDoc.rawText || 'OCR transcript extracted.'}
              </div>
            </Card>

            {/* Right Panel: Extracted JSON Entities (6 Cols) */}
            <Card className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#18A999]" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">OCR Extracted Entities</h3>
                </div>
                <Badge variant="teal">{selectedDoc.confidence || 95}% Extraction Confidence</Badge>
              </div>

              {/* Diagnoses */}
              {selectedDoc.extractedData?.diagnoses?.length > 0 && (
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
              )}

              {/* Medications */}
              {selectedDoc.extractedData?.medications?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider block mb-1.5">Extracted Medications</span>
                  <div className="space-y-2">
                    {selectedDoc.extractedData.medications.map((m, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block font-newsreader">{m.name} {m.dosage || m.dose}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Frequency: {m.frequency || m.freq} • Duration: {m.duration || 'As directed'}</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-[#27272a] text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#18A999]" />
                <span>Extracted by MediSaarthi Document Intelligence Parser</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
