"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { triageApi } from '@/services/api';
import { AlertTriangle, Eye, CheckCircle, Clock } from 'lucide-react';

export default function RedFlagsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await triageApi.getRedFlags();
      setAlerts(data);
    }
    load();
  }, []);

  const handleAcknowledge = async (id) => {
    await triageApi.acknowledgeAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-black text-white p-6 rounded-3xl shadow-2xl border border-rose-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
            <h1 className="text-xl font-extrabold font-newsreader">Priority Clinical Red Flags Desk</h1>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed max-w-3xl">
            Potential clinical red flags detected by rule-based safety screening during pre-consultation intake. Requires immediate review by qualified healthcare staff.
          </p>
        </div>

        {/* Priority Alerts Table */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">Active Priority Screening Alerts</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              {alerts.length} Active Alerts
            </span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-rose-500"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">{alert.patientName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-black font-mono font-bold text-xs text-slate-400 border border-slate-200 dark:border-[#27272a]">
                      Token {alert.token}
                    </span>
                    <span className="text-xs text-slate-400">{alert.age} yrs • {alert.gender}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      {alert.priority}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-rose-300 font-newsreader">
                    {alert.detectedInfo}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400" /> {alert.time}</span>
                    <span>• Rule Triggered: <code className="font-mono text-xs text-[#18A999]">{alert.ruleTriggered}</code></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/doctor/patients/${alert.patientId}`}>
                    <Button size="sm" variant="danger" icon={Eye}>
                      Open Patient
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" icon={CheckCircle} onClick={() => handleAcknowledge(alert.id)}>
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
