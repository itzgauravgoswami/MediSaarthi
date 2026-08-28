"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Hospital, Users, FileText, AlertTriangle, ShieldCheck, Activity, BarChart3, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Hospital Operations & System Admin</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status of hospital kiosks, AI pipeline throughput, and security audit logs.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              All Systems Operational (100% Uptime)
            </span>
          </div>
        </div>

        {/* Operational KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#18A999]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Patients Intake</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">1,248</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Kiosks</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">4 Fleet</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OCR Documents Parsed</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">3,890</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#18A999]/10 text-[#18A999]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Doctor Verification Rate</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">98.4%</span>
            </div>
          </Card>
        </div>

        {/* Impact Summary Banner */}
        <Card className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0D9488] text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#18A999]" />
              MediSaarthi Clinical Impact Index
            </h3>
            <span className="text-[11px] text-slate-300 font-medium">Prototype / Sandbox Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-center">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[11px] text-slate-300 block">Traditional Intake Time</span>
              <span className="text-lg font-bold text-rose-300 mt-0.5 block">8–12 mins</span>
              <span className="text-[10px] text-slate-400">Manual history taking per patient</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[11px] text-slate-300 block">MediSaarthi AI Intake</span>
              <span className="text-lg font-bold text-emerald-300 mt-0.5 block">3.4 mins</span>
              <span className="text-[10px] text-slate-400">Multilingual voice & touch structured</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[11px] text-slate-300 block">Doctor Consultation Efficiency</span>
              <span className="text-lg font-bold text-teal-300 mt-0.5 block">+ 40% Capacity</span>
              <span className="text-[10px] text-slate-400">Pre-compiled clinical summaries</span>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/admin/analytics">
            <Card hover className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#18A999]" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Analytics & Charts</h4>
                  <span className="text-[11px] text-slate-400">View patient throughput & language split</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/kiosks">
            <Card hover className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hospital className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Kiosk Fleet</h4>
                  <span className="text-[11px] text-slate-400">4 Hardware terminals online</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/audit-logs">
            <Card hover className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Audit Logs</h4>
                  <span className="text-[11px] text-slate-400">Security event verification</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
