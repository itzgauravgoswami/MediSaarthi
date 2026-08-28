"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DEMO_PATIENTS } from '@/services/demoDataService';
import { Calendar, Clock, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Doctor Appointments Schedule</h1>
            <p className="text-xs text-slate-500">Today's consultation appointments and pre-consultation AI intake readiness.</p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-3">
            {DEMO_PATIENTS.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#18A999] flex items-center justify-center font-bold text-xs">
                    {p.consultationTime}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.name} (Token {p.token})</h3>
                    <span className="text-xs text-slate-400">{p.age} yrs • {p.chiefComplaint}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={p.intakeStatus === 'Completed' ? 'success' : 'warning'}>
                    AI Intake {p.intakeStatus}
                  </Badge>
                  <Link href={`/doctor/patients/${p.id}`}>
                    <Button size="sm" variant="primary" icon={Eye}>
                      Open Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
