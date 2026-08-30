"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { emergencyApi, appointmentApi } from '@/services/api';
import { 
  Mic, 
  FileText, 
  Clock, 
  HeartPulse, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Stethoscope, 
  ShieldAlert, 
  PhoneCall,
  Activity,
  Calendar,
  MapPin,
  Building,
  UserCheck,
  CreditCard
} from 'lucide-react';

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const userRole = (user?.role || '').toLowerCase();

  const [activeEmergency, setActiveEmergency] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  const patientId = user?.patientId || user?.id;

  // Role Guard & Load Active Emergency Events & Appointments
  useEffect(() => {
    if (userRole && userRole !== 'patient') {
      if (userRole === 'doctor') router.replace('/doctor/dashboard');
      else if (userRole === 'pharmacy') router.replace('/pharmacy/dashboard');
      else if (userRole === 'admin') router.replace('/admin/dashboard');
      return;
    }
    async function loadDashboardData() {
      try {
        if (typeof emergencyApi?.getEmergencyEvents === 'function') {
          const events = await emergencyApi.getEmergencyEvents({ patientId, status: 'ALERTING' });
          if (events && events.length > 0) {
            setActiveEmergency(events[0]);
          }
        }
      } catch (err) {
        console.warn('[Emergency Check Note]', err.message);
      }

      try {
        setLoadingAppts(true);
        if (typeof appointmentApi?.getPatientAppointments === 'function') {
          const apptList = await appointmentApi.getPatientAppointments(patientId);
          setAppointments(apptList || []);
        }
      } catch (err) {
        console.warn('[Appointments Check Note]', err.message);
      } finally {
        setLoadingAppts(false);
      }
    }

    loadDashboardData();

    // Subscribe to SSE Stream
    let sse = null;
    if (typeof emergencyApi?.subscribeToAlertStream === 'function') {
      sse = emergencyApi.subscribeToAlertStream({
        role: 'PATIENT',
        patientId,
        onPatientUpdate: (update) => {
          if (update) {
            setActiveEmergency(prev => prev ? { ...prev, ...update } : update);
          }
        }
      });
    }

    return () => {
      sse?.close?.();
    };
  }, [patientId]);

  const latestAppt = appointments[0] || null;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        
        {/* Active Emergency Alert Banner */}
        {activeEmergency && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-black text-white border-2 border-rose-500/80 shadow-2xl animate-fadeIn space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                  <ShieldAlert className="w-7 h-7 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                      ACTIVE EMERGENCY
                    </span>
                    <span className="text-xs font-bold text-rose-200">
                      Specialty: {activeEmergency.recommendedSpecialty || 'Emergency Medicine'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold font-newsreader text-white mt-0.5">
                    Medical Professional Alerted
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href="tel:108" 
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg animate-pulse"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Ambulance (108)
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-800/40 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {activeEmergency.status === 'ACKNOWLEDGED' ? (
                    <strong className="text-emerald-400">
                      Alert acknowledged by {activeEmergency.acknowledgedBy || activeEmergency.assignedDoctorName || 'doctor'}.
                    </strong>
                  ) : (
                    <span>
                      Alert dispatched to <strong>{activeEmergency.assignedDoctorName || 'Emergency Physician'}</strong>.
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-300 shrink-0">
                {activeEmergency.status} • {new Date(activeEmergency.detectedAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Patient Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-5 rounded-3xl shadow-md relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">PATIENT CLINICAL PORTAL</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader">
              Welcome back, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Token <span className="font-mono font-bold text-[#18A999]">{user?.token || '—'}</span> • ABHA ID: <span className="font-mono">{user?.abhaId || '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/patient/interview">
              <span className="px-4 py-2 rounded-full bg-[#18A999] text-black hover:bg-[#148e81] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md">
                <Mic className="w-3.5 h-3.5" />
                Voice Intake & Booking
              </span>
            </Link>
          </div>
        </div>

        {/* Registered Doctor Appointment Card (Voice-Assisted Booking) */}
        {latestAppt && (
          <div className="bg-white dark:bg-black border-2 border-[#18A999]/60 p-5 md:p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#27272a] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#18A999]/15 text-[#18A999]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#18A999] block">
                    REGISTERED CONSULTATION BOOKING
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-newsreader">
                    Consultation with {latestAppt.doctorName || 'Specialist Doctor'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Token {latestAppt.tokenNumber || user?.token || '#101'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
                  Slot: {latestAppt.slotTime || 'Scheduled'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#18A999]" /> Specialist & Department
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {latestAppt.doctorName} ({latestAppt.specialization || latestAppt.department || 'Internal Medicine'})
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#18A999]" /> Location & Room
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {latestAppt.roomNumber || 'Consultation Room'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#18A999]" /> Symptoms Recorded
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {latestAppt.chiefComplaint || 'Recorded via AI Voice Intake'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <span className="text-[11px] text-slate-400">
                Ref ID: <strong className="font-mono text-slate-300">{latestAppt.appointmentId}</strong> • Status: <strong className="text-[#18A999]">{latestAppt.status || 'WAITING'}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Link href="/patient/reports">
                  <button className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black text-xs font-bold flex items-center gap-1 transition-all shadow-sm">
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay Fee / View Reports
                  </button>
                </Link>
                <Link href="/patient/documents">
                  <button className="px-3.5 py-1.5 rounded-xl bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold flex items-center gap-1 transition-all shadow-sm">
                    Upload Reports
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/interview" className="w-full min-w-0 block">
            <Card hover className="p-4 space-y-3 h-full flex flex-col justify-between w-full min-w-0">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-[#0F4C5C]/20 text-[#18A999] w-max border border-teal-200 dark:border-[#18A999]/30">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader leading-tight">AI Voice Intake</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">Speak your symptoms in Hindi or English with AI emergency analysis.</p>
              </div>
              <span className="text-xs font-bold text-[#18A999] flex items-center gap-1 pt-1 shrink-0">
                Launch Voice Assistant <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/documents" className="w-full min-w-0 block">
            <Card hover className="p-4 space-y-3 h-full flex flex-col justify-between w-full min-w-0">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-max border border-blue-200 dark:border-blue-900/50">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader leading-tight">Upload Medical Records</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">Upload past prescriptions, lab reports, and OCR scan documents.</p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1 shrink-0">
                Upload Records <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/reports" className="w-full min-w-0 block">
            <Card hover className="p-4 space-y-3 h-full flex flex-col justify-between w-full min-w-0">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-max border border-emerald-200 dark:border-emerald-900/50">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader leading-tight">Reports & Prescriptions</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">View registered consultation bookings, lab reports, and e-prescriptions.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 shrink-0">
                View All Records <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/bills" className="w-full min-w-0 block">
            <Card hover className="p-4 space-y-3 h-full flex flex-col justify-between w-full min-w-0">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 w-max border border-amber-200 dark:border-amber-900/50">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader leading-tight">Bills & Invoices</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">View consultation charges, diagnostic test receipts, and UPI payments.</p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1 shrink-0">
                View Invoices & Pay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
