"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { adminApi } from '@/services/api';
import { Hospital, RefreshCw, CheckCircle2, AlertCircle, Wrench, Shield } from 'lucide-react';

export default function KiosksPage() {
  const [kiosks, setKiosks] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await adminApi.getKiosks();
      setKiosks(data);
    }
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hospital Kiosk Fleet Management</h1>
            <p className="text-xs text-slate-500">Monitor hardware status, active patient sessions, and software versions across OPD terminals.</p>
          </div>

          <Button size="sm" variant="outline" icon={RefreshCw}>Ping Kiosks</Button>
        </div>

        <Card className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Kiosk ID</th>
                  <th className="py-3 px-4">Hospital Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4">Current Session</th>
                  <th className="py-3 px-4 text-right">Software Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {kiosks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <Hospital className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-50" />
                      <p className="font-semibold text-sm">No hospital kiosks registered</p>
                      <p className="text-xs text-slate-500 mt-0.5">Connected OPD and triage terminals will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  kiosks.map((kiosk, idx) => (
                    <tr key={kiosk.id || kiosk._id || `kiosk-${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-black text-slate-900 dark:text-white">{kiosk.id || kiosk.kioskId}</td>
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{kiosk.location}</td>
                      <td className="py-4 px-4">
                        <Badge variant={kiosk.status === 'Online' ? 'success' : kiosk.status === 'Active Session' ? 'teal' : 'warning'}>
                          {kiosk.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{kiosk.lastActive ? new Date(kiosk.lastActive).toLocaleTimeString() : '—'}</td>
                      <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{kiosk.session || 'Idle'}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-400">{kiosk.version || 'v2.4.0'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
