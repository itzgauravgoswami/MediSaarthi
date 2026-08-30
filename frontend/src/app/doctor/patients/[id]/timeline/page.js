"use client";

import React, { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Timeline from '@/components/timeline/Timeline';
import { patientApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function PatientTimelinePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const patientId = params.id;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await patientApi.getPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error('[Timeline Load Error]', err);
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
          <span>Loading patient clinical timeline...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) return null;

  const pid = patient.patientId || patient.id || patientId;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href={`/doctor/patients/${pid}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Patient Workspace ({patient.name})
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Medical Timeline — {patient.name}</h1>
          <p className="text-xs text-slate-500">Chronological synthesis of consultations, prescriptions, lab tests, and hospital stays.</p>
        </div>

        <Timeline timelineEvents={patient.timeline || []} />
      </div>
    </DashboardLayout>
  );
}
