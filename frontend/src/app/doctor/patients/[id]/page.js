"use client";

import React, { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ClinicalSummary from '@/components/clinical/ClinicalSummary';
import Timeline from '@/components/timeline/Timeline';
import { patientApi } from '@/services/api';
import { 
  User, 
  FileText, 
  Clock, 
  Pill, 
  TestTube, 
  Mic, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle2,
  Share2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const patientId = params.id;

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await patientApi.getPatientById(patientId);
        setPatient(data || {});
      } catch (err) {
        console.error('[Patient Detail Error]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#18A999]" />
          <span>Loading patient clinical workspace...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient || !patient.name) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center space-y-3">
          <User className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Record Not Found</h3>
          <p className="text-xs text-slate-500">The requested patient ID was not found in the database.</p>
          <Link href="/doctor/dashboard">
            <Button size="sm" variant="outline">Back to Queue</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Clinical Summary', icon: FileText },
    { id: 'timeline', label: 'Medical Timeline', icon: Clock },
    { id: 'documents', label: 'Parsed Documents', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'investigations', label: 'Lab Reports', icon: TestTube }
  ];

  const pid = patient.patientId || patient.id || patient._id || patientId;
  const docsList = patient.documents || [];
  const medsList = patient.medicationHistory || patient.medications || [];
  const labsList = patient.previousInvestigations || patient.investigations || [];
  const timelineList = patient.timeline || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Patient Queue
        </Link>

        {/* Patient Detail Top Header Workspace Banner */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#18A999] text-white flex items-center justify-center font-black text-xl shadow-md">
                {(patient.name || 'P').charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h1>
                  {patient.token && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Token {patient.token}
                    </span>
                  )}
                  {(patient.priority === 'High' || patient.redFlag === 'Attention Required') && (
                    <Badge variant="danger">
                      <AlertTriangle className="w-3 h-3 mr-1 inline" /> Priority Alert
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {patient.age || '45'} years • {patient.gender || 'Male'} • ABHA ID: <span className="font-mono">{patient.abhaId || '91-4829-1039-4821'}</span> • Phone: {patient.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" icon={Share2}>Export FHIR JSON</Button>
              <Link href={`/doctor/patients/${pid}/timeline`}>
                <Button size="sm" variant="primary" icon={Clock}>Open Timeline View</Button>
              </Link>
            </div>
          </div>

          {/* Navigation Workspace Tabs */}
          <div className="flex gap-2 mt-6 border-b border-slate-100 dark:border-slate-800 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#18A999] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Views */}
        {activeTab === 'summary' && (
          <ClinicalSummary patient={patient} />
        )}

        {activeTab === 'timeline' && (
          <Timeline timelineEvents={timelineList} />
        )}

        {activeTab === 'documents' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Uploaded Medical Documents</h3>
            {docsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No scanned medical documents uploaded yet for this patient.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docsList.map((doc, i) => (
                  <div key={doc.id || doc._id || i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{doc.title || doc.fileName || `Document #${i+1}`}</span>
                      <Badge variant="teal">{doc.confidence || 95}% Confidence</Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{doc.type || doc.fileType || 'Medical Document'} • {doc.date || new Date().toLocaleDateString()}</span>
                    <Link href={`/documents`}>
                      <Button size="sm" variant="outline" fullWidth className="mt-2">
                        Open Split-Screen OCR Viewer
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'medications' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Prescribed Medications</h3>
            {medsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active daily medications recorded in intake history.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {medsList.map((m, i) => (
                  <div key={m.name ? `${m.name}-${i}` : `med-${i}`} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">{typeof m === 'string' ? m : m.name}</span>
                    {typeof m !== 'string' && (
                      <>
                        <span className="text-xs text-slate-600 dark:text-slate-300 block">{m.dosage || m.dose} • {m.frequency || m.freq}</span>
                        <span className="text-[10px] text-slate-400 block italic">Source: {m.source || 'Intake History'}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'investigations' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Laboratory Investigations</h3>
            {labsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No past laboratory investigations uploaded.
              </div>
            ) : (
              <div className="space-y-2">
                {labsList.map((inv, i) => (
                  <div key={inv.test ? `${inv.test}-${inv.date}-${i}` : `inv-${i}`} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">{typeof inv === 'string' ? inv : inv.test || inv.testName}</span>
                      {typeof inv !== 'string' && <span className="text-[10px] text-slate-400">{inv.date || 'Recent Report'}</span>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${typeof inv !== 'string' && (inv.status === 'Elevated' || inv.status === 'Abnormal') ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                      {typeof inv === 'string' ? 'Recorded' : inv.result || inv.val || 'Normal'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
