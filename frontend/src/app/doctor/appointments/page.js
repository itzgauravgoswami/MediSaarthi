"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { appointmentApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Eye, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();
  const doctorId = user?.doctorId || user?.id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userRole === 'patient') {
      router.replace('/patient/dashboard');
      return;
    }

    async function loadAppointments() {
      try {
        setLoading(true);
        const data = await appointmentApi.getAppointments({ doctorId });
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, [userRole, doctorId, router]);

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
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[#18A999]" />
              <span>Loading appointment queue from database...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No appointments scheduled for today.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((p) => {
                const timeDisplay = p.slotTime || (p.appointmentDate ? new Date(p.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled');
                const patientName = p.patientName || p.name || 'Patient';
                const token = p.tokenNumber || p.token || '—';
                const pid = p.patientId || p.id;

                return (
                  <div key={p.appointmentId || pid} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#18A999] flex items-center justify-center font-bold text-xs font-mono">
                        {timeDisplay}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{patientName} (Token {token})</h3>
                        <span className="text-xs text-slate-400">{p.department || 'OPD'} • {p.chiefComplaint || 'General Consultation'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={p.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {p.status || 'SCHEDULED'}
                      </Badge>
                      <Link href={`/doctor/patients/${pid}`}>
                        <Button size="sm" variant="primary" icon={Eye}>
                          Open Workspace
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
