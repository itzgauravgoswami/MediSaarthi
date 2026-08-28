"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Mic, FileText, Clock, HeartPulse, ShieldCheck, CheckCircle2, ArrowRight, User } from 'lucide-react';

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
            <span className="px-3 py-1 rounded-full bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Assigned to Dr. Sharma (Cardiology)
            </span>
          </div>
        </div>

        {/* Consultation Status Card */}
        <Card className="p-4 space-y-2 bg-gradient-to-r from-slate-950 via-[#0F4C5C]/40 to-black text-white border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#18A999]/20 text-[#18A999] border border-[#18A999]/30">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm font-newsreader">Pre-Consultation Intake Recorded</h3>
                <p className="text-xs text-slate-300">Your AI Voice Intake and prescriptions have been sent to Dr. Sharma.</p>
              </div>
            </div>
            <Badge variant="teal">Est. Wait: ~5 mins</Badge>
          </div>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/patient/interview">
            <Card hover className="p-4 space-y-2.5 h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-[#0F4C5C]/10 text-[#18A999] w-max border border-[#18A999]/30">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader">AI Voice Intake</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Speak your symptoms in Hindi or English using animated Voice Orb.</p>
              </div>
              <span className="text-xs font-bold text-[#18A999] flex items-center gap-1">
                Launch Voice Assistant <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/documents">
            <Card hover className="p-4 space-y-2.5 h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-blue-950/40 text-blue-400 w-max border border-blue-900/50">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader">Upload Medical Records</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Upload past prescriptions, lab reports, and OCR scan documents.</p>
              </div>
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                Upload Records <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/review">
            <Card hover className="p-4 space-y-2.5 h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 w-max border border-emerald-900/50">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader">Review Information</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">Review captured symptoms, medication list, and intake report.</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                Review Summary <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>

          <Link href="/patient/consent">
            <Card hover className="p-4 space-y-2.5 h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-purple-950/40 text-purple-400 w-max border border-purple-900/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader">Informed Consent</h4>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">View digital consent agreement with audio playback assistance.</p>
              </div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                View Consent <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
