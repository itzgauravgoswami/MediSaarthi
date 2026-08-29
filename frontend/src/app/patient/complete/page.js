"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { CheckCircle, Clock, Hospital, UserCheck, Stethoscope } from 'lucide-react';

export default function PatientCompletePage() {
  return (
    <DashboardLayout>
      <div className="max-w-xl w-full mx-auto my-6 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 md:p-12 rounded-3xl shadow-2xl text-center space-y-6 relative z-10">
        <div className="w-20 h-20 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-teal-glow">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30">
            Token #102 Generated
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-newsreader tracking-tight">Information Transmitted</h2>
          <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
            Your intake summary and medical timeline have been securely sent to Dr. Sharma's clinical portal.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <Clock className="w-4 h-4 text-[#18A999]" />
          <span>Estimated Wait Time: ~5 minutes</span>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-[#27272a] flex flex-col sm:flex-row gap-3">
          <Link href="/patient/doctors" className="w-full">
            <Button size="lg" variant="outline" fullWidth icon={Stethoscope}>
              Find & Book Doctors
            </Button>
          </Link>
          <Link href="/doctor/dashboard" className="w-full">
            <Button size="lg" variant="primary" fullWidth icon={UserCheck}>
              Switch to Doctor View
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
