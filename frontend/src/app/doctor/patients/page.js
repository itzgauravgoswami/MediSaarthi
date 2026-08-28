"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi } from '@/services/api';
import { Users, Search, Eye, Filter } from 'lucide-react';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await patientApi.getPatients();
      setPatients(data);
    }
    load();
  }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.token.includes(search));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Patient Records Directory</h1>
            <p className="text-xs text-slate-500">Access full clinical summaries, medical timelines, and OCR records.</p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#18A999]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(patient => (
            <Card key={patient.id} hover className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#18A999]/10 text-[#18A999] flex items-center justify-center font-extrabold text-sm">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{patient.name}</h3>
                    <span className="text-[11px] text-slate-400">{patient.age} yrs • {patient.gender}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {patient.token}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chief Complaint</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">
                  {patient.chiefComplaint}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <Badge variant={patient.redFlag === 'Attention Required' ? 'danger' : 'success'}>
                  {patient.redFlag}
                </Badge>

                <Link href={`/doctor/patients/${patient.id}`}>
                  <Button size="sm" variant="primary" icon={Eye}>
                    View Workspace
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
