"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { adminApi } from '@/services/api';
import { Hospital, Users, FileText, ShieldCheck, Activity, BarChart3, Loader2, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      setError('Unable to load dashboard statistics. Please try again.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

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
              MongoDB Connected
            </span>
            <button
              onClick={loadStats}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Refresh stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadStats}
              className="ml-4 px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 text-xs font-bold hover:bg-rose-200 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Operational KPI Grid — Real MongoDB Counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#18A999]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Patients</span>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
              ) : (
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {stats?.totalPatients ?? 0}
                </span>
              )}
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registered Kiosks</span>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
              ) : (
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {stats?.totalKiosks ?? 0}
                </span>
              )}
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Documents Uploaded</span>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
              ) : (
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {stats?.totalDocuments ?? 0}
                </span>
              )}
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#18A999]/10 text-[#18A999]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verification Rate</span>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
              ) : (
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {stats?.verificationRate ?? '—'}
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Empty State */}
        {!loading && !error && stats?.totalPatients === 0 && (
          <Card className="p-8 text-center text-slate-500 space-y-2">
            <Activity className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold">No data yet</p>
            <p className="text-xs text-slate-400">Patient intake, documents, and kiosk data will appear here once records are created.</p>
          </Card>
        )}

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
                  <span className="text-[11px] text-slate-400">
                    {stats?.totalKiosks > 0 ? `${stats.totalKiosks} terminal(s) registered` : 'No kiosks registered yet'}
                  </span>
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
