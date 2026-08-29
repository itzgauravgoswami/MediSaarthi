"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { patientApi } from '@/services/api';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Pill, 
  Calendar, 
  FileText, 
  Printer, 
  ChevronRight,
  Sparkles,
  Star,
  Activity,
  X,
  Stethoscope
} from 'lucide-react';

export default function AttendedPatientsPage() {
  const [attendedPatients, setAttendedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await patientApi.getAttendedPatients();
      setAttendedPatients(data);
    }
    loadData();
  }, []);

  const filtered = attendedPatients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.abhaId.includes(searchTerm);
    
    const matchesFilter = outcomeFilter === 'All' || p.outcome.toLowerCase().includes(outcomeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                <UserCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                CLINICAL ARCHIVE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Attended Patients Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review completed consultations, finalized diagnoses, issued prescriptions, and encounter notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {attendedPatients.length} Patients Consulted Today
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Total Attended</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{attendedPatients.length}</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Avg Duration</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">4.2 mins</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">AI Match Score</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">98.6%</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Satisfaction</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">4.9 / 5.0</span>
            </div>
          </Card>
        </div>

        {/* Search & Filter Controls */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search attended patients by name, token, diagnosis, or ABHA ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#18A999]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                aria-label="Filter attended patients by clinical outcome"
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-700 dark:text-slate-300 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#18A999]"
              >
                <option value="All">All Outcomes</option>
                <option value="Prescribed">Prescribed & Discharged</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Refill">Routine Refill</option>
                <option value="Referred">Referred</option>
              </select>
            </div>
          </div>

          {/* Attended Patients Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Token & Time</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Age / Sex</th>
                  <th className="py-2.5 px-3">Final Diagnosis</th>
                  <th className="py-2.5 px-3">Prescription Summary</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">AI Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400 text-xs">
                      No attended patients found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-black text-slate-900 dark:text-white font-mono block">{patient.token}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {patient.attendedAt.split(', ')[1]} ({patient.consultationDuration})
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{patient.name}</div>
                        <span className="text-[9px] font-mono text-slate-400 block">{patient.abhaId}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                        {patient.age} yrs • {patient.gender}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                          {patient.diagnosis}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          CC: {patient.chiefComplaint}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 block truncate font-mono">
                          {patient.rxSummary}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={
                          patient.outcome.includes('Discharged') ? 'success' :
                          patient.outcome.includes('Follow-up') ? 'primary' :
                          patient.outcome.includes('Refill') ? 'neutral' : 'warning'
                        }>
                          {patient.outcome}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1 w-max">
                          <Sparkles className="w-2.5 h-2.5" /> {patient.aiAccuracyRating}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          icon={Eye}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Patient Consultation Summary Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedPatient(null)}
                aria-label="Close patient details modal"
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-base border border-emerald-200 dark:border-emerald-800">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedPatient.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedPatient.token}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedPatient.age} yrs • {selectedPatient.gender} • ABHA: {selectedPatient.abhaId} • {selectedPatient.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-[#111111] p-3 rounded-2xl border border-slate-200/60 dark:border-[#27272a] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Attended At</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.attendedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Encounter Duration</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.consultationDuration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Accuracy</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedPatient.aiAccuracyRating}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Outcome</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedPatient.outcome}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chief Complaint</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPatient.chiefComplaint}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Diagnosis</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 text-emerald-600 dark:text-emerald-400">
                    {selectedPatient.diagnosis}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Prescription & Medication Plan</span>
                  <div className="p-3 bg-slate-50 dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#27272a] font-mono text-xs text-slate-800 dark:text-slate-200 mt-1">
                    {selectedPatient.rxSummary}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Doctor Encounter Notes</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#111111] p-3 rounded-xl border border-slate-200 dark:border-[#27272a] mt-1 leading-relaxed">
                    {selectedPatient.doctorNotes}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  icon={Printer}
                  onClick={() => alert(`Printing official clinical summary for ${selectedPatient.name}`)}
                >
                  Print Summary & Rx
                </Button>

                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => setSelectedPatient(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
