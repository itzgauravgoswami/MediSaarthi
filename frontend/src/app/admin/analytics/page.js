"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import { adminApi } from '@/services/api';
import { BarChart3, PieChart, Users, Globe, Clock, FileText, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await adminApi.getAnalytics();
      setStats(data);
    }
    load();
  }, []);

  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">System Analytics & Clinical KPIs</h1>
          <p className="text-xs text-slate-500">Operational performance metrics, language distribution, and intake throughput.</p>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Patients Today</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.patientsProcessedToday}</span>
            <span className="text-[10px] text-emerald-500 font-bold block">+18% vs yesterday</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Avg Intake Duration</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.avgIntakeDuration}</span>
            <span className="text-[10px] text-teal-500 font-bold block">Target &lt; 5.0 mins</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">OCR Documents Processed</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.docProcessingCount}</span>
            <span className="text-[10px] text-blue-500 font-bold block">94.8% Average Confidence</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Red Flags Flagged</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.redFlagCount}</span>
            <span className="text-[10px] text-rose-500 font-bold block">100% Escalated to Triage</span>
          </Card>
        </div>

        {/* Language Usage & Patient Volume Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Breakdown */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#18A999]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Language Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Voice & Touch</span>
            </div>

            <div className="space-y-3">
              {stats.languageDistribution.map((lang, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">{lang.name}</span>
                    <span className="text-slate-500">{lang.count} patients ({lang.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#18A999] to-teal-400 rounded-full"
                      style={{ width: `${lang.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily Patient Intake Volume */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#18A999]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Hourly Patient Throughput</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Today's Queue</span>
            </div>

            <div className="flex items-end justify-between h-48 pt-6 px-4">
              {stats.dailyThroughput.map((slot, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-bold text-[#18A999]">{slot.count}</span>
                  <div
                    className="w-8 rounded-t-xl bg-gradient-to-t from-[#18A999] to-teal-400 transition-all hover:opacity-90"
                    style={{ height: `${slot.count * 16}px` }}
                  />
                  <span className="text-[10px] text-slate-400 font-semibold">{slot.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
