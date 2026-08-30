"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Pill, PackageCheck, CheckCircle2, Clock, AlertCircle, FileText, Search } from 'lucide-react';

export default function PharmacyDashboardPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  // TODO: Load from GET /api/v1/documents?type=prescription when pharmacy API is implemented


  const [searchTerm, setSearchTerm] = useState('');

  const handleDispense = (id) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'Dispensed' } : p));
  };

  const filtered = prescriptions.filter(p => p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || p.token.includes(searchTerm) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Pharmacy Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">HOSPITAL PHARMACY PORTAL</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader">
              Pharmacy Dashboard 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Central OPD Pharmacy Desk • Prescription OCR Verification & Dispensing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Pharmacy Inventory Sync Active
            </span>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Rx Received Today</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{prescriptions.length}</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Dispensed & Verified</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">14</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Pending Fulfillment</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">4</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Low Stock Alerts</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">2</span>
            </div>
          </Card>
        </div>

        {/* Quick Navigation Cards to Pharmacy Pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/pharmacy/prescriptions" className="block group">
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#0F4C5C]/20 text-[#18A999] group-hover:scale-110 transition-transform">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Prescription Queue
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">3</span>
                  </div>
                  <div className="text-[10px] text-slate-400">View & dispense pending orders</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-[#18A999] transition-colors">→</span>
            </div>
          </a>

          <a href="/pharmacy/inventory" className="block group">
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 group-hover:scale-110 transition-transform">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Medication Inventory</div>
                  <div className="text-[10px] text-slate-400">Stock levels & restock management</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-[#18A999] transition-colors">→</span>
            </div>
          </a>

          <a href="/pharmacy/logs" className="block group">
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-950/40 text-cyan-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Fulfillment Logs</div>
                  <div className="text-[10px] text-slate-400">Audit trail & digital receipts</div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-[#18A999] transition-colors">→</span>
            </div>
          </a>
        </div>

        {/* Prescription Queue Table */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">Prescription Fulfillment Queue</h2>
              <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa]">OCR verified prescriptions and EMR medication orders ready for dispensing.</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search prescription or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-[11px] bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-[#18A999]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                  <th className="py-2 px-3">Rx ID</th>
                  <th className="py-2 px-3">Patient Name</th>
                  <th className="py-2 px-3">Token</th>
                  <th className="py-2 px-3">Prescribed Medications</th>
                  <th className="py-2 px-3">Prescribing Physician</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                {filtered.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                    <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white font-mono">{rx.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white font-newsreader text-xs">{rx.patientName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{rx.token}</td>
                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        {rx.medications.map((m, i) => (
                          <span key={i} className="block text-[11px] text-slate-700 dark:text-slate-200 font-mono">
                            • {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-[#a1a1aa] font-medium text-[11px]">{rx.doctor}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={rx.status === 'Dispensed' ? 'success' : 'warning'}>
                        {rx.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {rx.status === 'Pending' ? (
                        <Button size="sm" variant="primary" icon={PackageCheck} onClick={() => handleDispense(rx.id)}>
                          Dispense Meds
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled
                        </span>
                      )}
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
