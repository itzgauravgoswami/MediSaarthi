"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ClipboardList, 
  Search, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  FileText, 
  X, 
  UserCheck, 
  ShieldCheck, 
  TrendingUp,
  Receipt,
  QrCode
} from 'lucide-react';

export default function FulfillmentLogsPage() {
  const [logs, setLogs] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    showToast("Exporting fulfillment audit logs as CSV file...");
  };

  const filteredLogs = logs.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.rxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.token.includes(searchTerm) ||
    log.pharmacist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = logs.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">AUDIT & COMPLIANCE REGISTRY</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader flex items-center gap-2">
              Pharmacy Fulfillment Logs
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Immutable audit trail of dispensed medications, batch tracing, and digital receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
              Export Audit CSV
            </Button>
          </div>
        </div>

        {/* KPI Summaries */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fulfilled Orders</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-newsreader">{logs.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
              <ClipboardList className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Value Dispensed</span>
              <span className="text-2xl font-black text-emerald-400 font-newsreader">₹{totalValue.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Verification Time</span>
              <span className="text-2xl font-black text-[#18A999] font-newsreader">2.8 min</span>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-950/40 text-cyan-400 border border-cyan-900/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pharmacists On Audit</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-newsreader">2</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-950/40 text-indigo-400 border border-indigo-900/50">
              <UserCheck className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Logs Table Card */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">
              Dispensary Transaction Audit Trail
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search log ID, patient, or pharmacist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                  <th className="py-3 px-3">Fulfillment ID & Timestamp</th>
                  <th className="py-3 px-3">Patient & Token</th>
                  <th className="py-3 px-3">Prescribing Physician</th>
                  <th className="py-3 px-3">Dispensed Items Summary</th>
                  <th className="py-3 px-3">Total Cost</th>
                  <th className="py-3 px-3">Verified Pharmacist</th>
                  <th className="py-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-50" />
                      <p className="font-semibold text-sm">No pharmacy fulfillment transactions recorded</p>
                      <p className="text-xs text-slate-500 mt-0.5">Dispensed prescriptions and verified medication logs will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white font-newsreader">{log.patientName}</div>
                      <div className="text-[10px] font-mono text-[#18A999]">Token {log.token} • Rx: {log.rxId}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {log.doctor}
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        {log.medications.map((m, i) => (
                          <div key={i} className="text-[11px] text-slate-700 dark:text-slate-200">
                            • {m.name} (Qty: {m.qty}) <span className="text-[9px] font-mono text-slate-400">[{m.batch}]</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      ₹{log.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{log.pharmacist}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        icon={Receipt}
                        onClick={() => setSelectedLog(log)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </Card>

        {/* Digital Invoice / Receipt Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] max-w-lg w-full rounded-3xl p-6 space-y-5 shadow-2xl relative">
              <button 
                onClick={() => setSelectedLog(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#27272a]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-200 dark:border-[#27272a] pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#18A999] tracking-widest uppercase">MEDISAARTHI OPD PHARMACY</span>
                  <span className="text-[10px] font-mono text-slate-400">GSTIN: 07AAACH1102P1Z5</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-newsreader">
                  Official Medicine Receipt
                </h2>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                  <span>Receipt #: <strong className="text-white font-mono">{selectedLog.id}</strong></span>
                  <span>Date: {selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#111111] p-3 rounded-2xl border border-slate-200 dark:border-[#27272a] space-y-1 text-xs">
                <div><span className="text-slate-400">Patient Name:</span> <strong className="text-white">{selectedLog.patientName}</strong> (Token {selectedLog.token})</div>
                <div><span className="text-slate-400">Prescribing Doctor:</span> <strong className="text-slate-300">{selectedLog.doctor}</strong></div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Itemized Breakdown</div>
                <div className="border border-slate-200 dark:border-[#27272a] rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-[#111111] text-[10px] font-bold text-slate-400 uppercase">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2">Batch</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#27272a]">
                      {selectedLog.medications.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-semibold text-white">{m.name}</td>
                          <td className="p-2 font-mono text-[10px] text-slate-400">{m.batch}</td>
                          <td className="p-2 text-center font-mono">{m.qty}</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-400">₹{m.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#27272a]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-400" />
                  <div className="text-[9px] text-slate-400 font-mono leading-tight">
                    Digital Verification Stamp<br />
                    Verified by: {selectedLog.pharmacist}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount Paid</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">₹{selectedLog.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
                <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
