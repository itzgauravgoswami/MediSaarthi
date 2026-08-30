"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Pill, 
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  FileText, 
  AlertTriangle, 
  User, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Printer, 
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function PrescriptionQueuePage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingRx, setLoadingRx] = useState(false);
  // TODO: Load from GET /api/v1/documents?type=prescription when pharmacy API is implemented
  // prescriptions are empty until real prescriptions are created by doctors


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRx, setSelectedRx] = useState(null);
  const [viewOcrRx, setViewOcrRx] = useState(null);
  const [pharmacistPin, setPharmacistPin] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDispenseConfirm = () => {
    if (!selectedRx) return;
    setPrescriptions(prev => prev.map(p => p.id === selectedRx.id ? { ...p, status: 'Dispensed' } : p));
    showToast(`Prescription ${selectedRx.id} for ${selectedRx.patientName} successfully dispensed!`);
    setSelectedRx(null);
    setPharmacistPin('');
  };

  const filteredPrescriptions = Array.isArray(prescriptions) ? prescriptions.filter(rx => {
    const name = rx?.patientName || '';
    const id = rx?.id || '';
    const token = rx?.token || '';
    const doctor = rx?.doctor || '';
    const term = (searchTerm || '').toLowerCase();

    const matchesSearch = 
      name.toLowerCase().includes(term) || 
      id.toLowerCase().includes(term) || 
      token.toLowerCase().includes(term) ||
      doctor.toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'All' || rx?.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const pendingCount = prescriptions.filter(p => p.status === 'Pending').length;
  const urgentCount = prescriptions.filter(p => p.priority === 'Urgent' && p.status === 'Pending').length;
  const dispensedCount = prescriptions.filter(p => p.status === 'Dispensed').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">PHARMACY FULFILLMENT DESK</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black border border-rose-500/20">
                LIVE QUEUE
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader flex items-center gap-2">
              Prescription Queue & Verification
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Real-time OPD prescriptions, AI OCR digitized orders, and dosage verification workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#18A999]" />
              <span>Avg Fulfillment: <b>2.4 mins</b></span>
            </div>
          </div>
        </div>

        {/* KPI Summaries */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Rx Queue</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-newsreader">{prescriptions.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
              <Pill className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Fulfillment</span>
              <span className="text-2xl font-black text-amber-500 font-newsreader">{pendingCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-900/50">
              <Clock className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Urgent Priority</span>
              <span className="text-2xl font-black text-rose-500 font-newsreader">{urgentCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-950/40 text-rose-400 border border-rose-900/50">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dispensed Today</span>
              <span className="text-2xl font-black text-emerald-400 font-newsreader">{dispensedCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              <PackageCheck className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#111111] rounded-full border border-slate-200 dark:border-[#27272a] self-start">
              {['All', 'Pending', 'Urgent', 'Dispensed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    statusFilter === tab
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {tab} {tab === 'Pending' && `(${pendingCount})`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, Rx ID or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999]"
              />
            </div>
          </div>

          {/* Prescription Cards List */}
          <div className="space-y-3">
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Pill className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#18A999]" />
                <p className="text-sm font-semibold">No prescriptions found matching search criteria.</p>
              </div>
            ) : (
              filteredPrescriptions.map(rx => (
                <div 
                  key={rx.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    rx.priority === 'Urgent' && rx.status === 'Pending'
                      ? 'bg-rose-950/10 border-rose-500/40 dark:bg-rose-950/20'
                      : rx.status === 'Dispensed'
                      ? 'bg-slate-50/50 dark:bg-[#111111]/40 border-slate-200 dark:border-[#27272a] opacity-80'
                      : 'bg-white dark:bg-black border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Patient & Prescription Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#27272a]">
                          {rx.id}
                        </span>
                        <span className="text-xs font-bold text-[#18A999] bg-[#0F4C5C]/20 px-2 py-0.5 rounded-full border border-[#18A999]/30">
                          Token {rx.token}
                        </span>
                        <Badge variant={rx.status === 'Dispensed' ? 'success' : 'warning'}>
                          {rx.status}
                        </Badge>
                        {rx.priority === 'Urgent' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase animate-pulse">
                            URGENT
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto sm:ml-0 font-medium">
                          {rx.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm font-newsreader">{rx.patientName}</span>
                        <span className="text-slate-400">• {rx.patientAge}</span>
                        <span className="text-slate-400">• {rx.phone}</span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#18A999]" />
                        <span>Prescribed by: <strong className="text-slate-700 dark:text-slate-200">{rx.doctor}</strong></span>
                      </div>

                      {rx.diagnosis && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-[#111111] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#27272a] inline-block">
                          Diagnosis: {rx.diagnosis}
                        </div>
                      )}
                    </div>

                    {/* Prescribed Medications Preview */}
                    <div className="bg-slate-50 dark:bg-[#111111] p-3 rounded-xl border border-slate-200 dark:border-[#27272a] space-y-1.5 lg:w-96">
                      <div className="text-[10px] font-extrabold uppercase text-[#18A999] tracking-wider flex items-center justify-between">
                        <span>Medications ({rx.medications.length})</span>
                        <button 
                          onClick={() => setViewOcrRx(rx)}
                          className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <Eye className="w-3 h-3" /> View OCR Slip
                        </button>
                      </div>
                      {rx.medications.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-medium border-b border-slate-200 dark:border-[#27272a] last:border-0 pb-1 last:pb-0">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                            <span className="text-[10px] text-slate-400 block">{m.dose}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#18A999] font-mono">Qty: {m.qty}</span>
                            <span className={`text-[9px] block font-semibold ${m.stock.includes('Low') ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {m.stock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0">
                      {rx.status === 'Pending' ? (
                        <Button 
                          size="sm" 
                          variant="primary" 
                          icon={PackageCheck} 
                          onClick={() => setSelectedRx(rx)}
                          className="w-full sm:w-auto"
                        >
                          Dispense
                        </Button>
                      ) : (
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-900/40">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled
                        </div>
                      )}

                      <Button 
                        size="sm" 
                        variant="secondary" 
                        icon={FileText}
                        onClick={() => setViewOcrRx(rx)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Dispense Verification Modal */}
        {selectedRx && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] max-w-xl w-full rounded-3xl p-6 space-y-5 shadow-2xl relative">
              <button 
                onClick={() => setSelectedRx(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#27272a]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-newsreader">
                    Confirm Medication Dispensing
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify dosage, batch allocation, and enter pharmacist PIN.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#111111] p-4 rounded-2xl border border-slate-200 dark:border-[#27272a] space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Rx Number: <strong className="text-white font-mono">{selectedRx.id}</strong></span>
                  <span className="text-slate-400">Token: <strong className="text-[#18A999]">{selectedRx.token}</strong></span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedRx.patientName} ({selectedRx.patientAge})</div>
                <div className="text-slate-400">Doctor: {selectedRx.doctor}</div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase text-[#18A999] tracking-wider block">
                  Allocated Batches & Inventory Verification
                </span>
                {selectedRx.medications.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-xs font-medium border border-slate-200 dark:border-[#27272a]">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.dose}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-400 font-bold">Batch: {m.batch}</div>
                      <div className="text-[10px] text-slate-400">Qty: {m.qty} Units</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Pharmacist Verification Code / PIN
                </label>
                <input 
                  type="password" 
                  placeholder="Enter 4-digit PIN (e.g. 8842)" 
                  value={pharmacistPin}
                  onChange={(e) => setPharmacistPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setSelectedRx(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  icon={CheckCircle2} 
                  disabled={!pharmacistPin}
                  onClick={handleDispenseConfirm}
                >
                  Verify & Dispense Meds
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Prescription Details & OCR Slip Modal */}
        {viewOcrRx && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] max-w-2xl w-full rounded-3xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setViewOcrRx(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#27272a]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-newsreader">
                    MediSaarthi AI Prescription OCR Verification
                  </h2>
                  <p className="text-xs text-slate-400">
                    Digitized handwriting extraction and physician signature verification.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Simulated Scanned Slip */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Scanned OPD Prescription Slip
                  </div>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center space-y-2 bg-slate-950">
                    <FileText className="w-10 h-10 text-[#18A999] mx-auto opacity-70" />
                    <div className="text-xs font-bold text-slate-300">OPD Slip #{viewOcrRx.token}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Digital Signature: Verified ✓</div>
                    <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 py-1 rounded">
                      AI OCR Confidence: 99.4%
                    </div>
                  </div>
                  <Button size="sm" variant="outline" icon={Printer} className="w-full text-xs">
                    Print Scanned Slip
                  </Button>
                </div>

                {/* Extracted Details */}
                <div className="space-y-3">
                  <div className="text-[10px] font-extrabold uppercase text-[#18A999] tracking-wider">
                    Extracted Prescription Record
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div><span className="text-slate-500">Patient:</span> <strong>{viewOcrRx.patientName}</strong> ({viewOcrRx.patientAge})</div>
                    <div><span className="text-slate-500">Physician:</span> <strong>{viewOcrRx.doctor}</strong></div>
                    <div><span className="text-slate-500">Diagnosis:</span> {viewOcrRx.diagnosis}</div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-white">Prescribed Drugs:</div>
                    {viewOcrRx.medications.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] text-xs">
                        <div className="font-bold text-[#18A999]">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.dose} • Qty: {m.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-[#27272a]">
                <Button variant="secondary" onClick={() => setViewOcrRx(null)}>
                  Close Viewer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
