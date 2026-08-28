"use client";

import React, { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Timeline from '@/components/timeline/Timeline';
import { patientApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PatientTimelinePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const patientId = params.id || 'P102';
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await patientApi.getPatientById(patientId);
      setPatient(data);
    }
    load();
  }, [patientId]);

  if (!patient) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href={`/doctor/patients/${patient.id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Patient Workspace ({patient.name})
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Medical Timeline — {patient.name}</h1>
          <p className="text-xs text-slate-500">Chronological synthesis of consultations, prescriptions, lab tests, and hospital stays.</p>
        </div>

        <Timeline timelineEvents={patient.timeline} />
      </div>
    </DashboardLayout>
  );
}
