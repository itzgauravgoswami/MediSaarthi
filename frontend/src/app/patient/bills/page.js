"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Receipt, 
  CreditCard, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  QrCode, 
  FileText, 
  Pill, 
  Sparkles,
  Smartphone,
  Wallet,
  AlertCircle
} from 'lucide-react';

export default function PatientBillsPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'paid' | 'insurance'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Real Hospital Bills and Invoices
  const [bills, setBills] = useState([]);

  // Load custom paid invoices from localStorage & check receipt URL param
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('medisaarthi_invoices');
      if (stored) {
        const customInvoices = JSON.parse(stored);
        if (Array.isArray(customInvoices) && customInvoices.length > 0) {
          setBills(customInvoices);
        }
      }

      // Check if receipt param is present in URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const receiptId = params.get('receipt');
        if (receiptId) {
          setTimeout(() => {
            setBills(currentBills => {
              const matched = currentBills.find(b => b.id === receiptId || b.id.includes(receiptId) || (b.appointmentId && b.appointmentId === receiptId));
              if (matched) {
                setSelectedBillForReceipt(matched);
              }
              return currentBills;
            });
          }, 200);
        }
      }
    } catch (e) {
      console.warn('[Bills Init Note]', e);
    }
  }, []);

  const handlePayBill = (billId) => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setBills(prev => {
        const updated = prev.map(b => b.id === billId ? { ...b, status: 'Paid', paymentMethod: 'UPI (Instant Kiosk Pay)' } : b);
        try {
          localStorage.setItem('medisaarthi_invoices', JSON.stringify(updated.filter(b => b.status === 'Paid')));
        } catch (e) {}
        return updated;
      });
      setPaymentSuccess(false);
      setSelectedBillForPay(null);
    }, 1500);
  };

  const filteredBills = bills.filter(b => {
    if (activeTab === 'pending' && b.status !== 'Pending') return false;
    if (activeTab === 'paid' && b.status !== 'Paid') return false;
    if (activeTab === 'insurance' && b.status !== 'Insurance Settled') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || 
           b.id.toLowerCase().includes(q) || 
           b.doctor.toLowerCase().includes(q) || 
           b.hospital.toLowerCase().includes(q);
  });

  const totalPaid = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0);
  const totalPending = bills.filter(b => b.status === 'Pending').reduce((acc, b) => acc + b.amount, 0);
  const totalInsurance = bills.filter(b => b.status === 'Insurance Settled').reduce((acc, b) => acc + b.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl w-full mx-auto space-y-4">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F4C5C]/20 via-[#18A999]/10 to-transparent border border-[#18A999]/25 dark:border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#18A999]/20 text-[#18A999]">
                <Receipt className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader tracking-tight">
                {isHindi ? 'अस्पताल बिल एवं भुगतान रसीदें' : 'Hospital Bills & Payment Invoices'}
              </h1>
              {user?.token && (
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#18A999]/15 text-[#18A999] border border-[#18A999]/30 font-mono">
                  Token {user.token}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-[#a1a1aa] max-w-xl leading-relaxed">
              {isHindi 
                ? 'अस्पताल के सभी ओपीडी परामर्श शुल्क, लैब इनवॉइस और भुगतान रसीदें देखें।'
                : 'Manage consultation invoices, diagnostic lab receipts, and digital hospital payment transactions.'}
            </p>
          </div>

          {/* Patient ABHA & Quick Metric Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] text-xs">
              <span className="text-[10px] text-slate-400 block font-mono">LINKED ABHA ID</span>
              <span className="font-extrabold text-[#18A999] font-mono">{user?.abhaId || 'Verified'}</span>
            </div>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-3.5 flex items-center justify-between hover:border-[#18A999]/50">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                {isHindi ? 'कुल भुगतान किया' : 'Total Paid Amount'}
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between hover:border-amber-500/50">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                {isHindi ? 'लंबित ओपीडी शुल्क' : 'Pending Invoices'}
              </span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                ₹{totalPending.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between hover:border-[#18A999]/50">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                {isHindi ? 'आयुष्मान / बीमा कवर' : 'Ayushman / PMJAY Covered'}
              </span>
              <span className="text-xl font-extrabold text-[#18A999] font-mono">
                ₹{totalInsurance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-[#0F4C5C]/20 text-[#18A999] border border-teal-200 dark:border-[#18A999]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] p-3 sm:p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#18A999]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi 
                  ? "इनवॉइस नंबर, डॉक्टर, टेस्ट या अस्पताल खोजें..." 
                  : "Search invoice ID, doctor, lab test or category (e.g. INV-2026, Lipid, ECG)..."}
                className="w-full pl-10 pr-8 py-2 text-xs bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: isHindi ? 'सभी इनवॉइस' : 'All Invoices', count: bills.length },
                { id: 'pending', label: isHindi ? 'लंबित भुगतान' : 'Pending', count: bills.filter(b => b.status === 'Pending').length },
                { id: 'paid', label: isHindi ? 'भुगतान रसीदें' : 'Paid Receipts', count: bills.filter(b => b.status === 'Paid').length },
                { id: 'insurance', label: isHindi ? 'आयुष्मान क्लेम' : 'PMJAY Claims', count: bills.filter(b => b.status === 'Insurance Settled').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 dark:bg-white/20 font-mono">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bills & Invoices List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-newsreader">
              <Receipt className="w-4 h-4 text-[#18A999]" />
              <span>{isHindi ? 'विस्तृत इनवॉइस एवं बिल विवरण' : 'Itemized Hospital Invoices & Statements'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{filteredBills.length} Invoices</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBills.map((bill) => (
              <div 
                key={bill.id}
                className={`bg-white dark:bg-[#111111] border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between transition-all ${
                  bill.status === 'Pending'
                    ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-400/30'
                    : 'border-slate-200 dark:border-[#27272a] hover:border-[#18A999]'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Bill Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F4C5C]/15 text-[#18A999] font-mono">
                          {bill.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {bill.date}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-newsreader leading-snug">
                        {isHindi ? bill.titleHindi : bill.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#18A999]" />
                        <span>{bill.hospital}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                      bill.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse'
                        : bill.status === 'Insurance Settled'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    }`}>
                      {isHindi ? bill.statusHindi : bill.status}
                    </span>
                  </div>

                  {/* Itemized Breakdown */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-1.5 text-xs">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block font-bold">
                      {isHindi ? 'शुल्क विवरण (Itemized Charges):' : 'Itemized Charges:'}
                    </span>
                    <div className="space-y-1">
                      {bill.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[240px]">
                            {item.item}
                          </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                            {item.amount < 0 ? `-₹${Math.abs(item.amount)}` : item.amount === 0 ? 'FREE' : `₹${item.amount}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method / Due Info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{bill.status === 'Pending' ? `Due: ${bill.dueDate}` : `Mode: ${bill.paymentMethod}`}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {isHindi ? 'कुल देय:' : 'Total: '} 
                      <strong className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400 ml-1">
                        ₹{bill.amount.toLocaleString('en-IN')}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-[#1f1f23] flex items-center justify-between gap-2">
                  <button 
                    onClick={() => setSelectedBillForReceipt(bill)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] hover:text-[#18A999] text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#18A999]" />
                    <span>{isHindi ? 'रसीद देखें' : 'View Receipt'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {bill.status === 'Pending' ? (
                      <button 
                        onClick={() => setSelectedBillForPay(bill)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'यूपीआई भुगतान' : 'Pay via UPI / Card'}</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => alert(`Downloading official Tax Invoice ${bill.id}...`)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 text-[#18A999] border border-[#18A999]/30 text-xs font-bold flex items-center gap-1 hover:bg-[#18A999] hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBills.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0F4C5C]/10 text-[#18A999] flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-newsreader">
              {isHindi ? 'कोई बिल या इनवॉइस नहीं मिला' : 'No Bills or Invoices Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isHindi 
                ? 'कृपया अलग कीवर्ड खोजें अथवा सभी इनवॉइस देखें।' 
                : 'Try adjusting your search query or reset the filter tabs.'}
            </p>
            <Button size="sm" onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
              {isHindi ? 'सभी इनवॉइस देखें' : 'View All Invoices'}
            </Button>
          </div>
        )}
      </div>

      {/* Pay Now UPI / Card Modal */}
      {selectedBillForPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedBillForPay(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-3 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">
                  {isHindi ? 'भुगतान सफल रहा!' : 'Payment Completed Successfully!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'आपकी भुगतान रसीद पंजीकृत हो गई है।' : `Transaction confirmed for ${selectedBillForPay.id}. Receipt updated.`}
                </p>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  Paid: ₹{selectedBillForPay.amount} via UPI • Verified & Recorded
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#18A999] uppercase font-bold tracking-wider">
                    {selectedBillForPay.id}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-newsreader">
                    {isHindi ? 'त्वरित डिजिटल भुगतान' : 'Instant Digital Payment'}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedBillForPay.title}</p>
                </div>

                {/* Amount Pill */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Payable Amount</span>
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹{selectedBillForPay.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* UPI QR Code Simulator */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F4C5C]/10 to-transparent border border-[#18A999]/30 flex flex-col items-center space-y-2 text-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Scan using Google Pay, PhonePe, or Paytm
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">UPI ID: maxhospital.delhi@icici</span>
                </div>

                {/* Direct Pay Action */}
                <div className="space-y-2 pt-1">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handlePayBill(selectedBillForPay.id)}
                    icon={CheckCircle2}
                  >
                    {isHindi ? 'भुगतान पूर्ण करें (सिम्युलेट करें)' : 'Simulate 1-Click UPI Payment'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Official Invoice / Receipt Modal */}
      {selectedBillForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBillForReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 dark:border-[#27272a] pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#18A999] font-mono uppercase">
                  {selectedBillForReceipt.id}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">GSTIN: 07AAACM4819Q1ZT</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">
                {selectedBillForReceipt.hospital}
              </h3>
              <p className="text-xs text-slate-500">Patient: {user?.name || '—'} {user?.abhaId ? `• ABHA: ${user.abhaId}` : ''} {user?.token ? `• Token ${user.token}` : ''}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Description:</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedBillForReceipt.title}</p>
              <p className="text-[11px] text-slate-500">{selectedBillForReceipt.doctor}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                Itemized Tariff:
              </span>
              <div className="space-y-1">
                {selectedBillForReceipt.breakdown.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">{item.item}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.amount < 0 ? `-₹${Math.abs(item.amount)}` : item.amount === 0 ? 'FREE' : `₹${item.amount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Final Net Payable / Paid:</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{selectedBillForReceipt.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-[#27272a]">
              <span className="text-[10px] text-slate-400 font-mono">Digitally Signed & ABDM Linked</span>
              <Button size="sm" onClick={() => alert(`Tax invoice PDF ${selectedBillForReceipt.id} download initiated.`)} icon={Download}>
                Download Tax Invoice PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
