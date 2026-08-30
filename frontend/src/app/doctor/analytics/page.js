"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { patientApi } from '@/services/api';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Globe,
  Loader2,
  RefreshCw,
  ServerCrash
} from 'lucide-react';

export default function DoctorAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const data = await patientApi.getDoctorAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Unable to load analytics. Please try again.');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
            <Loader2 className="w-5 h-5 animate-spin text-[#18A999]" />
            Loading Clinical Analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
          <ServerCrash className="w-12 h-12 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">{error}</p>
            <p className="text-xs text-slate-400 mt-1">Analytics are computed from live MongoDB data.</p>
          </div>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 rounded-xl bg-[#18A999] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#148e81] transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const hasData = analytics && (analytics.totalAttendedToday > 0 || analytics.redFlagsIntercepted > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">
                CLINICAL INSIGHTS & METRICS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Doctor Clinical Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live telemetry computed from MongoDB — intake counts, red flags, and throughput.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all self-start"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Empty State */}
        {!hasData && (
          <Card className="p-8 text-center space-y-3">
            <Activity className="w-10 h-10 mx-auto text-slate-300" />
            <div>
              <p className="font-semibold text-slate-600 dark:text-slate-300">No analytics data yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Analytics will populate as patients complete AI voice intakes and doctors attend consultations.
              </p>
            </div>
          </Card>
        )}

        {hasData && (
          <>
            {/* Primary KPI Cards — Real DB Counts */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Consultations Today
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {analytics.totalAttendedToday}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Completed AI intake interviews today</p>
              </Card>

              <Card className="p-4 space-y-2 hover:border-rose-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Red Flags Today
                  </span>
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {analytics.redFlagsIntercepted}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Critical cases prioritized for immediate review</p>
              </Card>

              <Card className="p-4 space-y-2 hover:border-teal-500/40 transition-all col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Multilingual Support
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">10 Indian regional languages supported</p>
              </Card>
            </div>

            {/* Hourly Throughput */}
            {analytics.consultationThroughput && analytics.consultationThroughput.length > 0 && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Hourly Consultation Throughput
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Today's OPD</span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2">
                  {analytics.consultationThroughput.map((slot, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#111111] p-3 rounded-2xl border border-slate-200/80 dark:border-[#27272a] text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">{slot.hour}</span>
                      <div className="text-xl font-black text-slate-900 dark:text-white">{slot.count}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Disease Categories — shown only if available */}
            {analytics.diseaseCategories && analytics.diseaseCategories.length > 0 && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Activity className="w-5 h-5 text-[#18A999]" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Case Distribution by Specialty
                  </h3>
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
                          className="h-full rounded-full bg-[#18A999]"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Clinical quality card */}
            <Card className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  AI Clinical Safety Guard
                </span>
                <p className="text-[11px] text-slate-500">
                  All patient intakes cross-checked against ABHA health history. Red flags escalated immediately.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
