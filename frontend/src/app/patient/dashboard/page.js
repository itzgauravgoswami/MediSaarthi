"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Mic, FileText, Clock, HeartPulse, ShieldCheck, CheckCircle2, ArrowRight, User, Stethoscope } from 'lucide-react';

export default function PatientDashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Patient Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">PATIENT CLINICAL PORTAL</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader">
              Welcome back, {user?.name || 'Rahul Kumar'} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Token <span className="font-mono font-bold text-[#18A999]">#102</span> • ABHA ID: <span className="font-mono">91-4829-1039-4821</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/patient/doctors">
              <span className="px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 text-[#18A999] hover:bg-[#18A999] hover:text-white border border-[#18A999]/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs">
                <Stethoscope className="w-3.5 h-3.5" />
                Find Doctors
              </span>
            </Link>
          </div>
        </div>

        {/* Consultation Status Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#0F4C5C] via-[#148e81] to-[#0F4C5C] text-white border border-[#18A999]/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-white border border-white/20 shrink-0">
                <HeartPulse className="w-5 h-5 animate-pulse text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm md:text-base font-newsreader text-white">Pre-Consultation Intake Recorded</h3>
                <p className="text-xs text-teal-100/90 leading-relaxed">Your AI Voice Intake and prescriptions have been sent to Dr. Sharma.</p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/25 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shrink-0">
              Est. Wait: ~5 mins
            </span>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/interview" className="w-full min-w-0 block">
            <Card hover className="p-4 space-y-3 h-full flex flex-col justify-between w-full min-w-0">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-[#0F4C5C]/20 text-[#18A999] w-max border border-teal-200 dark:border-[#18A999]/30">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader leading-tight">AI Voice Intake</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">Speak your symptoms in Hindi or English using animated Voice Orb.</p>
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
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">View uploaded lab reports, OCR summaries, and doctor e-prescriptions.</p>
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
