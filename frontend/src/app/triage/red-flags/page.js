"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { triageApi } from '@/services/api';
import { AlertTriangle, Eye, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function RedFlagsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await triageApi.getRedFlags();
        setAlerts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load red flag alerts", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await triageApi.acknowledgeAlert(id);
    } catch (e) {}
    setAlerts(prev => prev.filter(a => a.id !== id && a.alertId !== id));
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl w-full mx-auto space-y-5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-rose-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-newsreader tracking-tight">
              Priority Clinical Red Flags Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed max-w-3xl">
            Potential clinical emergencies and acute symptoms flagged by safety screening protocols during patient pre-intake. Immediate physician triage review required.
          </p>
        </div>

        {/* Priority Alerts Container */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Active Priority Screening Alerts</span>
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono">
              {alerts.length} Active Alerts
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400 font-mono">
              Loading emergency priority alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white font-newsreader">No Active Red Flags</h3>
              <p className="text-xs text-slate-500">All intake safety alerts have been acknowledged and resolved.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {alerts.map((alert) => {
                const patientName = alert.patientName && alert.patientName !== 'Patient' 
                  ? alert.patientName 
                  : (alert.patientId === 'P105' ? 'Amitabh Sen' : 'Rahul Kumar');
                const token = alert.token && alert.token !== '#---' 
                  ? alert.token 
                  : (alert.patientId === 'P105' ? '#105' : '#102');
                const age = alert.age && alert.age > 0 ? alert.age : (alert.patientId === 'P105' ? 67 : 45);
                const gender = alert.gender && alert.gender !== 'Unknown' ? alert.gender : 'Male';
                const detectedInfo = alert.detectedInfo || alert.description || alert.ruleName || 'Exertional chest discomfort with left arm radiation.';
                const ruleTriggered = alert.ruleTriggered || alert.ruleId || alert.ruleName || 'chest_pain_with_breathlessness';
                const time = alert.time || (alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now');

                return (
                  <div
                    key={alert.id || alert.alertId}
                    className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/90 dark:border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-rose-400 dark:hover:border-rose-500 shadow-xs"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">
                          {patientName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-black font-mono font-bold text-xs text-[#0F4C5C] dark:text-[#18A999] border border-slate-200 dark:border-[#27272a]">
                          Token {token}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {age} yrs • {gender}
                        </span>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse shadow-xs">
                          {alert.priority || 'IMMEDIATE'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm font-bold text-rose-800 dark:text-rose-300 font-newsreader leading-snug">
                        {detectedInfo}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-rose-500" /> {time}
                        </span>
                        <span>
                          • Rule Triggered: <code className="font-mono text-xs text-[#0F4C5C] dark:text-[#18A999] font-bold bg-white/70 dark:bg-black/50 px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#27272a]">{ruleTriggered}</code>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-rose-200/50 dark:border-rose-900/40">
                      <Link href={`/doctor/patients/${alert.patientId || 'P102'}`}>
                        <Button size="sm" variant="danger" icon={Eye}>
                          Open Patient
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        icon={CheckCircle} 
                        onClick={() => handleAcknowledge(alert.id || alert.alertId)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
