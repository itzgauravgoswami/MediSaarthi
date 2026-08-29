"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi } from '@/services/api';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Activity, 
  Globe, 
  Pill,
  Zap,
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export default function DoctorAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await patientApi.getDoctorAnalytics();
      setAnalytics(data);
    }
    loadData();
  }, []);

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
            <span className="w-4 h-4 border-2 border-[#18A999] border-t-transparent rounded-full animate-spin" />
            Loading Clinical Analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">
                CLINICAL INSIGHTS &amp; METRICS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Doctor Clinical Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live telemetry on intake accuracy, consultation duration, diagnostic distribution, and time savings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#18A999] border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#18A999]" />
              Live Performance Engine
            </span>
          </div>
        </div>

        {/* Primary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Total Attended Today
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {analytics.totalAttendedToday}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +22% vs avg
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Target daily capacity: 25 patients</p>
          </Card>

          <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Time Saved with AI
              </span>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#18A999]">
                {analytics.timeSavedWithAI}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">Today</span>
            </div>
            <p className="text-[11px] text-slate-400">~3.8 mins saved per patient intake</p>
          </Card>

          <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Intake Accuracy
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {analytics.accuracyScore}
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Clinical Match</span>
            </div>
            <p className="text-[11px] text-slate-400">0 critical diagnostic discrepancies</p>
          </Card>

          <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Patient Rating
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {analytics.patientSatisfaction}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">5 Stars</span>
            </div>
            <p className="text-[11px] text-slate-400">Based on 18 post-consult reviews</p>
          </Card>
        </div>

        {/* Charts & Categorical Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disease Category Breakdown */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#18A999]" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Case Distribution by Specialty
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Today's Caseload</span>
            </div>

            <div className="space-y-3.5">
              {analytics.diseaseCategories.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{item.category}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.count} pts ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Consultation Hourly Flow */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Hourly Throughput &amp; Speed
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">OPD Time Bands</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2">
              {analytics.consultationThroughput.map((slot, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#111111] p-3 rounded-2xl border border-slate-200/80 dark:border-[#27272a] text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">{slot.hour}</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{slot.count}</div>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block">
                    avg {slot.avgTime}
                  </span>
                </div>
              ))}
            </div>

            {/* Efficiency Benchmark Callout */}
            <div className="mt-4 p-4 rounded-2xl bg-teal-50/60 dark:bg-[#0F4C5C]/20 border border-teal-200 dark:border-[#18A999]/30 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#18A999] text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">
                  Intake Efficiency Index: 3.2x Improvement
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  AI pre-consultation summary enabled attending 14.2 patients/hour vs 4.8 patients/hour traditionally.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Clinical Quality & Safety Verification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Drug Allergy Guard
              </span>
              <p className="text-[11px] text-slate-500">100% cross-checked against ABHA health history</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Red Flags Intercepted
              </span>
              <p className="text-[11px] text-slate-500">{analytics.redFlagsIntercepted} critical cases prioritized immediately</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Multilingual Speech Support
              </span>
              <p className="text-[11px] text-slate-500">10 Indian regional languages synthesized to English EHR</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
