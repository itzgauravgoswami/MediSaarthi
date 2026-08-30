"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi, emergencyApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  Search, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  CornerUpRight, 
  Loader2,
  Stethoscope,
  Activity,
  PhoneCall
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();
  const [patients, setPatients] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const doctorName = user?.name;
  const doctorId = user?.doctorId || user?.id;

  // Role Guard & Load Initial Patient Queue & Active Emergency Alerts
  useEffect(() => {
    if (userRole === 'patient') {
      router.replace('/patient/dashboard');
      return;
    }
    if (userRole === 'pharmacy') {
      router.replace('/pharmacy/dashboard');
      return;
    }
    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const [patientsData, alertsData] = await Promise.all([
          patientApi.getPatients().catch(() => []),
          emergencyApi.getActiveAlerts(doctorId).catch(() => [])
        ]);

        setPatients(patientsData || []);
        setActiveAlerts(alertsData || []);
      } catch (err) {
        console.error('[Doctor Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [doctorId]);

  // Subscribe to Real-Time SSE Emergency Stream
  useEffect(() => {
    let sse = null;
    if (typeof emergencyApi?.subscribeToAlertStream === 'function') {
      sse = emergencyApi.subscribeToAlertStream({
        role: 'DOCTOR',
        userId: doctorId,
        onAlert: (alert) => {
          if (alert) {
            setActiveAlerts(prev => {
              const exists = prev.some(a => a.eventId === alert.eventId);
              if (exists) return prev.map(a => a.eventId === alert.eventId ? { ...a, ...alert } : a);
              return [alert, ...prev];
            });
          }
        },
        onStatusUpdate: (update) => {
          if (update) {
            setActiveAlerts(prev => {
              if (update.status === 'RESOLVED' || update.status === 'CANCELLED') {
                return prev.filter(a => a.eventId !== update.eventId);
              }
              return prev.map(a => a.eventId === update.eventId ? { ...a, ...update } : a);
            });
          }
        }
      });
    }

    return () => {
      sse?.close?.();
    };
  }, [doctorId]);

  // Action: Doctor Acknowledges Emergency Alert
  const handleAcknowledge = async (eventId) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: 'ack' }));
      const updated = await emergencyApi.acknowledgeEmergency(eventId, doctorName, doctorId);
      setActiveAlerts(prev => prev.map(a => a.eventId === eventId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: doctorName } : a));
    } catch (err) {
      console.error('[Acknowledge Error]', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  // Action: Doctor Escalates Alert to Secondary Doctor
  const handleEscalate = async (eventId) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: 'esc' }));
      const updated = await emergencyApi.escalateEmergency(eventId, 'Clinician requested immediate escalation');
      setActiveAlerts(prev => prev.map(a => a.eventId === eventId ? { ...a, status: 'ALERTING', escalationLevel: (a.escalationLevel || 0) + 1 } : a));
    } catch (err) {
      console.error('[Escalate Error]', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  // Action: Doctor Resolves Emergency Alert
  const handleResolve = async (eventId) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: 'res' }));
      await emergencyApi.resolveEmergency(eventId, 'Patient evaluated & stabilized by physician.', doctorName, doctorId);
      setActiveAlerts(prev => prev.filter(a => a.eventId !== eventId));
    } catch (err) {
      console.error('[Resolve Error]', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  // Filtered Patients List
  const filteredPatients = patients.filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus || p.intakeStatus === filterStatus;
    const nameStr = (p.name || '').toLowerCase();
    const tokenStr = (p.token || '').toLowerCase();
    const complaintStr = (p.chiefComplaint || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return matchesStatus && (nameStr.includes(search) || tokenStr.includes(search) || complaintStr.includes(search));
  });

  // Dynamic KPI counts computed from real database data
  const totalPatientsCount = patients.length;
  const intakesDoneCount = patients.filter(p => p.intakeStatus === 'Completed').length;
  const awaitingReviewCount = patients.filter(p => p.status === 'Waiting' || p.status === 'Triage Review').length;
  const redFlagsCount = activeAlerts.length + patients.filter(p => p.priority === 'High' || p.redFlag === 'Attention Required').length;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">CLINICAL INTAKE & TRIAGE PORTAL</span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-newsreader">
              Good day, {doctorName || 'Doctor'} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Real-time clinical intake stream and live AI medical emergency triage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
              Live SSE Triage Active
            </span>
          </div>
        </div>

        {/* Real-time Emergency Alert Notifications */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                🚨 Real-Time Emergency Alerts ({activeAlerts.length})
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.eventId} 
                  className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-black text-white border-2 border-rose-500/80 shadow-2xl space-y-3 transition-all animate-fadeIn"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-800/40 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                        <Activity className="w-6 h-6 text-rose-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                            {alert.severity || 'EMERGENCY'}
                          </span>
                          <span className="text-sm font-bold font-newsreader text-white">
                            {alert.patientName} {alert.patientToken ? `(Token ${alert.patientToken})` : ''}
                          </span>
                          <span className="text-[11px] text-rose-300">
                            {alert.patientAge ? `${alert.patientAge} yrs` : ''} • {alert.patientGender || ''}
                          </span>
                        </div>
                        <p className="text-xs text-rose-200 mt-0.5">
                          Recommended Specialty: <strong className="text-rose-100">{alert.recommendedSpecialty || 'Emergency Medicine'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        alert.status === 'ACKNOWLEDGED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      }`}>
                        Status: {alert.status}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms & Risk Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-rose-800/30">
                      <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">Reported Symptoms:</span>
                      <p className="text-rose-100 font-medium">{alert.symptoms?.join(', ') || 'Acute symptoms reported in voice intake'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-rose-800/30">
                      <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">Risk Indicators / Action:</span>
                      <p className="text-rose-100 font-medium">{alert.riskIndicators?.join(', ') || 'Immediate human clinician review required'}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-[10px] text-rose-300 font-mono">
                      Detected: {new Date(alert.detectedAt || Date.now()).toLocaleTimeString()} {alert.acknowledgedBy ? `• Acknowledged by ${alert.acknowledgedBy}` : ''}
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.status !== 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => handleAcknowledge(alert.eventId)}
                          disabled={actionLoading[alert.eventId] === 'ack'}
                          className="px-3.5 py-1.5 rounded-xl bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {actionLoading[alert.eventId] === 'ack' ? 'Acknowledging...' : '✅ Acknowledge'}
                        </button>
                      )}

                      <Link href={`/doctor/patients/${alert.patientId || 'unknown'}`}>
                        <button className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all">
                          View Patient Record
                        </button>
                      </Link>

                      <button
                        onClick={() => handleEscalate(alert.eventId)}
                        disabled={actionLoading[alert.eventId] === 'esc'}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-semibold border border-amber-500/40 transition-all disabled:opacity-50"
                      >
                        {actionLoading[alert.eventId] === 'esc' ? 'Escalating...' : '⚡ Escalate'}
                      </button>

                      <button
                        onClick={() => handleResolve(alert.eventId)}
                        disabled={actionLoading[alert.eventId] === 'res'}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all disabled:opacity-50"
                      >
                        {actionLoading[alert.eventId] === 'res' ? 'Resolving...' : '✓ Resolve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3 hover:border-blue-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Registered Patients</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalPatientsCount}</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-teal-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-[#0F4C5C]/20 text-teal-600 dark:text-[#18A999] border border-teal-200 dark:border-[#18A999]/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">AI Intakes Completed</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{intakesDoneCount}</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-amber-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Awaiting Review</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{awaitingReviewCount}</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-rose-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Priority Triage Alerts</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{redFlagsCount}</span>
            </div>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">Patient Intake Queue</h2>
              <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa]">Real-time patient check-in status and pre-consultation intake summaries.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter queue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 text-[11px] bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-[#18A999]"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 text-[11px] bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-700 dark:text-slate-300 font-bold focus:ring-1 focus:ring-[#18A999]"
              >
                <option value="All">All Statuses</option>
                <option value="Waiting">Waiting</option>
                <option value="In Progress">In Progress</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-[#18A999]" />
                <span>Loading patient queue from database...</span>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No patients found in queue.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                    <th className="py-2 px-3">Token</th>
                    <th className="py-2 px-3">Patient Name</th>
                    <th className="py-2 px-3">Age / Sex</th>
                    <th className="py-2 px-3">Chief Complaint</th>
                    <th className="py-2 px-3">AI Intake</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                  {filteredPatients.map((patient) => {
                    const pid = patient.patientId || patient.id || patient._id;
                    const isUrgent = patient.priority === 'High' || patient.redFlag === 'Attention Required';

                    return (
                      <tr key={pid} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                        <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white font-mono">{patient.token}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white font-newsreader text-xs">{patient.name}</div>
                          <span className="text-[9px] font-mono text-slate-400">{patient.abhaId}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-[#a1a1aa] text-[11px]">{patient.age} yrs • {patient.gender}</td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200 font-semibold text-[11px] max-w-xs truncate">
                          {patient.chiefComplaint || 'General consultation intake'}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant={patient.intakeStatus === 'Completed' ? 'success' : 'warning'}>
                            {patient.intakeStatus || 'Pending'}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          {isUrgent ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 flex items-center gap-1 w-max animate-pulse">
                              <AlertTriangle className="w-2.5 h-2.5" /> High Priority
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant={patient.status === 'Priority' ? 'danger' : patient.status === 'Waiting' ? 'warning' : 'neutral'}>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Link href={`/doctor/patients/${pid}`}>
                            <Button size="sm" variant={isUrgent ? 'danger' : 'primary'} icon={Eye}>
                              Review
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
