"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi } from '@/services/api';
import { Users, FileCheck, Clock, AlertTriangle, Search, Eye, Sparkles } from 'lucide-react';

export default function DoctorDashboardPage() {
  const [patients, setPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await patientApi.getPatients();
      setPatients(data);
    }
    loadData();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus || p.intakeStatus === filterStatus;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.token.includes(searchTerm) || p.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">CLINICAL INTAKE PORTAL</span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-newsreader">
              Good morning, Dr. Sharma 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Here is your clinical intake overview for today, 28 Aug 2026.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border border-[#18A999]/30 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18A999] animate-pulse" />
              Live Intake Stream Active
            </span>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3 hover:border-[#18A999]/50">
            <div className="p-2.5 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-900/50">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patients Today</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">24</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-[#18A999]/50">
            <div className="p-2.5 rounded-xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Intakes Done</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">19</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-[#18A999]/50">
            <div className="p-2.5 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-900/50">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Awaiting Review</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">4</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3 hover:border-rose-500/50">
            <div className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/50">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Red Flag Cases</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">1</span>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                  <th className="py-2 px-3">Token</th>
                  <th className="py-2 px-3">Patient Name</th>
                  <th className="py-2 px-3">Age / Sex</th>
                  <th className="py-2 px-3">Chief Complaint</th>
                  <th className="py-2 px-3">AI Intake</th>
                  <th className="py-2 px-3">Red Flag</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                    <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white font-mono">{patient.token}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white font-newsreader text-xs">{patient.name}</div>
                      <span className="text-[9px] font-mono text-slate-400">{patient.abhaId}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-[#a1a1aa] text-[11px]">{patient.age} yrs • {patient.gender}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200 font-semibold text-[11px] max-w-xs truncate">
                      {patient.chiefComplaint}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={patient.intakeStatus === 'Completed' ? 'success' : 'warning'}>
                        {patient.intakeStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      {patient.redFlag === 'Attention Required' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1 w-max animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" /> Attention Required
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Normal</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={patient.status === 'Priority' ? 'danger' : patient.status === 'Waiting' ? 'warning' : 'neutral'}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link href={`/doctor/patients/${patient.id}`}>
                        <Button size="sm" variant={patient.redFlag === 'Attention Required' ? 'danger' : 'primary'} icon={Eye}>
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
