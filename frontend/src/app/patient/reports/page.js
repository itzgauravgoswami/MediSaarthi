"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { appointmentApi } from '@/services/api';
import { 
  FileText, 
  Pill, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  Search, 
  UploadCloud, 
  QrCode, 
  Clock, 
  X,
  FileCheck,
  FolderArchive,
  Image as ImageIcon,
  CheckCircle2,
  FileSpreadsheet,
  Share2,
  Stethoscope,
  Activity,
  MapPin,
  UserCheck,
  CreditCard,
  Receipt,
  Smartphone,
  Sparkles,
  Wallet
} from 'lucide-react';

export default function PatientReportsPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const { user } = useAuth();
  const { intakeState } = usePatientIntake();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'bookings' | 'prescriptions' | 'reports' | 'previous'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState(null);
  const [registeredBookings, setRegisteredBookings] = useState([]);
  const [selectedBookingForPay, setSelectedBookingForPay] = useState(null);
  const [paidBookings, setPaidBookings] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      const patientId = user?.patientId || user?.id;
      if (!patientId) {
        setRegisteredBookings([]);
        return;
      }
      try {
        if (typeof appointmentApi?.getPatientAppointments === 'function') {
          const appts = await appointmentApi.getPatientAppointments(patientId);
          setRegisteredBookings(appts || []);
        }
      } catch (e) {}

      try {
        const storedPaid = localStorage.getItem('medisaarthi_paid_bookings');
        if (storedPaid) {
          setPaidBookings(JSON.parse(storedPaid));
        }
      } catch (e) {}
    }
    loadBookings();
  }, [user]);

  const handlePayConsultation = (bk) => {
    setPaymentSuccess(true);
    const invoiceId = `INV-2026-${bk.appointmentId || 'OPD-102'}`;
    const newInvoice = {
      id: invoiceId,
      appointmentId: bk.appointmentId || 'APT-102',
      title: `Doctor OPD Consultation - ${bk.doctorName}`,
      titleHindi: `डॉक्टर ओपीडी परामर्श - ${bk.doctorName}`,
      doctor: `${bk.doctorName} (${bk.specialization || bk.department || 'Specialist'})`,
      hospital: 'Max Super Speciality Hospital, New Delhi',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: 'OPD Consultation',
      categoryHindi: 'ओपीडी परामर्श',
      amount: 500,
      status: 'Paid',
      statusHindi: 'सफलतापूर्वक भुगतान किया',
      paymentMethod: 'Google Pay (UPI Ref: UPI-' + Date.now() + ')',
      paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      dueDate: 'Paid Online',
      breakdown: [
        { item: 'Specialist Doctor OPD Consultation Fee', amount: 500 },
        { item: 'AI Multilingual Voice Intake & EMR Triaging', amount: 0, note: 'Free / Included' },
        { item: 'Hospital Token Registration & Queue Pass', amount: 0, note: 'Waived' }
      ]
    };

    setTimeout(() => {
      setPaidBookings(prev => {
        const updated = { ...prev, [bk.appointmentId || bk.id]: true };
        try {
          localStorage.setItem('medisaarthi_paid_bookings', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      try {
        const stored = localStorage.getItem('medisaarthi_invoices');
        const existingInvoices = stored ? JSON.parse(stored) : [];
        const filtered = existingInvoices.filter(inv => inv.id !== invoiceId && inv.appointmentId !== bk.appointmentId);
        localStorage.setItem('medisaarthi_invoices', JSON.stringify([newInvoice, ...filtered]));
      } catch (e) {}

      setPaymentSuccess(false);
      setSelectedBookingForPay(null);
    }, 1500);
  };

  // Prescriptions and diagnostic reports come from the Document API
  // Empty arrays shown until API is connected to document service
  const prescriptions = [];
  const diagnosticReports = [];
  const previousUploadedDocuments = [];


  // Dynamic filter
  const filteredPrescriptions = prescriptions.filter(rx => {
    if (activeTab === 'reports' || activeTab === 'previous') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return rx.doctorName.toLowerCase().includes(q) || 
           rx.diagnosis.toLowerCase().includes(q) || 
           rx.hospital.toLowerCase().includes(q) ||
           rx.medications.some(m => m.name.toLowerCase().includes(q));
  });

  const filteredReports = diagnosticReports.filter(rep => {
    if (activeTab === 'prescriptions' || activeTab === 'previous') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return rep.title.toLowerCase().includes(q) || 
           rep.lab.toLowerCase().includes(q) || 
           rep.type.toLowerCase().includes(q) ||
           rep.summary.toLowerCase().includes(q);
  });

  const filteredBookings = registeredBookings.filter(bk => {
    if (activeTab === 'prescriptions' || activeTab === 'reports' || activeTab === 'previous') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (bk.doctorName || '').toLowerCase().includes(q) ||
      (bk.specialization || '').toLowerCase().includes(q) ||
      (bk.chiefComplaint || '').toLowerCase().includes(q) ||
      (bk.appointmentId || '').toLowerCase().includes(q) ||
      (bk.roomNumber || '').toLowerCase().includes(q)
    );
  });

  const filteredPreviousDocs = previousUploadedDocuments.filter(doc => {
    if (activeTab === 'bookings' || activeTab === 'prescriptions' || activeTab === 'reports') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return doc.title.toLowerCase().includes(q) ||
           doc.category.toLowerCase().includes(q) ||
           doc.hospital.toLowerCase().includes(q) ||
           doc.summary.toLowerCase().includes(q);
  });

  const totalCount = filteredBookings.length + filteredPrescriptions.length + filteredReports.length + filteredPreviousDocs.length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl w-full mx-auto space-y-4">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F4C5C]/20 via-[#18A999]/10 to-transparent border border-[#18A999]/25 dark:border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#18A999]/20 text-[#18A999]">
                <FileCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader tracking-tight">
                {isHindi ? 'स्वास्थ्य रिपोर्ट एवं डॉक्टर के पर्चे' : 'Medical Reports & Prescriptions Vault'}
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#18A999]/15 text-[#18A999] border border-[#18A999]/30 font-mono">
                {registeredBookings.length + prescriptions.length + diagnosticReports.length + previousUploadedDocuments.length} {isHindi ? 'दस्तावेज़ सुरक्षित' : 'Records Saved'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#a1a1aa] max-w-xl leading-relaxed">
              {isHindi 
                ? 'मैक्स सुपर स्पेशलिटी अस्पताल के सभी लैब टेस्ट, डॉक्टर ई-पर्चे एवं आपके पूर्व अपलोड किए गए दस्तावेज़ सुरक्षित देखें।'
                : 'Access diagnostic lab reports, doctor e-prescriptions, and previous medical documents uploaded across your visits.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/patient/documents">
              <Button size="sm" variant="primary" icon={UploadCloud}>
                {isHindi ? 'नया रिपोर्ट अपलोड करें' : 'Upload New Document'}
              </Button>
            </Link>
          </div>
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
                  ? "दवा, डॉक्टर, डिस्चार्ज समरी, एक्स-रे या टेस्ट खोजें (उदा. Telmisartan, X-Ray, Lipid)..." 
                  : "Search prescription, doctor, discharge summary, X-ray or lab test (e.g. Telmisartan, X-Ray, ECG)..."}
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
                { id: 'all', label: isHindi ? 'सभी रिकॉर्ड' : 'All Records', count: registeredBookings.length + prescriptions.length + diagnosticReports.length + previousUploadedDocuments.length },
                { id: 'bookings', label: isHindi ? 'पंजीकृत डॉक्टर बुकिंग' : 'Doctor Consultations', count: registeredBookings.length },
                { id: 'prescriptions', label: isHindi ? 'डॉक्टर पर्चे (Rx)' : 'Doctor Prescriptions', count: prescriptions.length },
                { id: 'reports', label: isHindi ? 'लैब रिपोर्ट' : 'Lab Reports', count: diagnosticReports.length },
                { id: 'previous', label: isHindi ? 'पूर्व अपलोड दस्तावेज़' : 'Previous Documents', count: previousUploadedDocuments.length }
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

        {/* SECTION 0: REGISTERED VOICE-ASSISTED CONSULTATIONS & DOCTOR BOOKINGS */}
        {(activeTab === 'all' || activeTab === 'bookings') && filteredBookings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-newsreader">
                <Stethoscope className="w-4 h-4 text-[#18A999]" />
                <span>{isHindi ? 'पंजीकृत डॉक्टर परामर्श व वॉइस सारांश (Registered Bookings)' : 'Voice-Assisted Doctor Consultations & Triage Bookings'}</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredBookings.length} Bookings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((bk) => (
                <div 
                  key={bk.appointmentId || bk.id}
                  className="bg-white dark:bg-[#111111] border-2 border-[#18A999]/40 hover:border-[#18A999] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-[#1f1f23] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#18A999]/20 text-[#18A999] font-mono">
                          {bk.appointmentId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 font-mono">
                          Token {bk.tokenNumber || user?.token || 'Assigned'}
                        </span>
                        {bk.redFlagPresent && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white font-mono animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-newsreader">
                        {bk.doctorName}
                      </h3>
                      <p className="text-[11px] text-[#18A999] font-bold">
                        {bk.specialization || bk.department}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block font-mono">
                        🕒 {bk.slotTime || '11:15 AM'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {bk.roomNumber || 'Room OPD-102'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Recorded Complaint / Symptoms:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bk.chiefComplaint || 'Pre-consultation clinical intake recorded'}</p>
                  </div>

                  {/* Payment & Action Strip */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f1f23] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {paidBookings[bk.appointmentId || bk.id] ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'परामर्श शुल्क भुगतान संपन्न (₹500)' : 'Fee Paid: ₹500 (Confirmed)'}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-extrabold text-amber-500 dark:text-amber-400">
                            Fee: ₹500
                          </span>
                          <button
                            onClick={() => setSelectedBookingForPay(bk)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isHindi ? 'फीस भुगतान करें (₹500)' : 'Pay Consultation Fee'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {paidBookings[bk.appointmentId || bk.id] && (
                        <Link href={`/patient/bills?receipt=INV-2026-${bk.appointmentId || 'OPD-102'}`}>
                          <button className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] hover:text-[#18A999] text-xs font-semibold flex items-center gap-1 transition-all">
                            <Receipt className="w-3.5 h-3.5 text-[#18A999]" />
                            <span>{isHindi ? 'रसीद देखें' : 'View Receipt'}</span>
                          </button>
                        </Link>
                      )}

                      <Link href={`/doctor/patients/${user?.patientId || bk.patientId || ''}`}>
                        <button className="px-3 py-1.5 rounded-xl bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold transition-all shadow-xs">
                          {isHindi ? 'क्लिनिकल समरी' : 'Clinical Summary'}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: DOCTOR E-PRESCRIPTIONS */}
        {(activeTab === 'all' || activeTab === 'prescriptions') && filteredPrescriptions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-newsreader">
                <Pill className="w-4 h-4 text-[#18A999]" />
                <span>{isHindi ? 'डॉक्टर द्वारा जारी ई-पर्चे (Doctor Prescriptions)' : 'Authorized Doctor Prescriptions (Rx)'}</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredPrescriptions.length} Records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrescriptions.map((rx) => (
                <div 
                  key={rx.id}
                  className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 transition-all"
                >
                  {/* Rx Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-[#1f1f23] pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F4C5C]/15 text-[#18A999] font-mono">
                          {rx.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {rx.date}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-newsreader">
                        {rx.doctorName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">{rx.doctorQualification}</p>
                    </div>

                    <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-[#18A999] shrink-0" title="ABDM Verified Prescription">
                      <QrCode className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">DIAGNOSIS / रोग निदान:</span>
                    <p className="text-xs font-bold text-[#0F4C5C] dark:text-[#18A999] leading-snug">
                      {isHindi ? rx.diagnosisHindi : rx.diagnosis}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                      <Building2 className="w-3 h-3 text-[#18A999]" />
                      <span>{rx.hospital}</span>
                    </p>
                  </div>

                  {/* Prescribed Medications */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      {isHindi ? 'निर्धारित दवाएं (Prescribed Rx):' : 'Prescribed Medications:'}
                    </span>
                    <div className="space-y-1.5">
                      {(rx.medications || []).map((med, mIdx) => (
                        <div key={mIdx} className="p-2 rounded-lg bg-slate-50/70 dark:bg-[#161616] border border-slate-100 dark:border-[#222226] text-xs flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{med.name}</span>
                            <span className="text-[10px] text-[#18A999] ml-1.5 font-mono">({med.dosage})</span>
                            <p className="text-[10px] text-slate-400">{med.instructions}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-bold block">
                              {med.frequency}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{med.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f1f23] flex items-center justify-between gap-2">
                    <span className="text-[9px] text-slate-400 font-mono">Reg: {rx.mciRegNo}</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setSelectedRecordForPreview({ type: 'rx', data: rx })}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#18A999]" />
                        <span>{isHindi ? 'विवरण' : 'View Rx'}</span>
                      </button>
                      <button 
                        onClick={() => alert(`Downloading e-Prescription ${rx.id}...`)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 text-[#18A999] border border-[#18A999]/30 text-xs font-bold flex items-center gap-1 hover:bg-[#18A999] hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: DIAGNOSTIC & LAB REPORTS */}
        {(activeTab === 'all' || activeTab === 'reports') && filteredReports.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-newsreader">
                <FileText className="w-4 h-4 text-[#18A999]" />
                <span>{isHindi ? 'अपलोड की गई डायग्नोस्टिक लैब रिपोर्ट (Lab Reports)' : 'Uploaded Diagnostic & Lab Reports'}</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredReports.length} Reports</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 rounded-xl bg-[#0F4C5C]/10 text-[#18A999]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                        rep.statusColor === 'amber'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-newsreader line-clamp-1">
                        {isHindi ? rep.titleHindi : rep.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">{rep.lab} • {rep.date}</p>
                    </div>

                    {/* Biomarker highlights */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">OCR Extracted Highlights:</span>
                      <div className="space-y-1">
                        {(rep.keyFindings || []).slice(0, 3).map((f, fIdx) => (
                          <div key={fIdx} className="flex justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-400 truncate">{f.marker}:</span>
                            <span className={`font-mono font-bold ${f.flag === 'High' ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f1f23] flex items-center justify-between gap-2">
                    <span className="text-[9px] text-[#18A999] font-mono font-bold">{rep.ocrConfidence}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedRecordForPreview({ type: 'report', data: rep })}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] text-xs font-semibold transition-all"
                      >
                        {isHindi ? 'देखें' : 'View'}
                      </button>
                      <button
                        onClick={() => alert(`Downloading report ${rep.id}...`)}
                        className="p-1 rounded-lg bg-[#0F4C5C]/10 text-[#18A999] hover:bg-[#18A999] hover:text-white transition-all"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: PREVIOUS DOCUMENTS UPLOADED BY USER */}
        {(activeTab === 'all' || activeTab === 'previous') && filteredPreviousDocs.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-newsreader">
                <FolderArchive className="w-4 h-4 text-[#18A999]" />
                <span>{isHindi ? 'पूर्व में अपलोड किए गए दस्तावेज़ (Previous Uploaded Documents)' : 'Previous Medical Documents Uploaded by You'}</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredPreviousDocs.length} Documents</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPreviousDocs.map((pDoc) => (
                <div
                  key={pDoc.id}
                  className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-teal-50 dark:bg-[#0F4C5C]/20 text-[#18A999] border border-teal-200 dark:border-[#18A999]/30">
                          {pDoc.fileType.includes('Image') ? (
                            <ImageIcon className="w-5 h-5" />
                          ) : (
                            <FileSpreadsheet className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F4C5C]/10 text-[#18A999] font-mono uppercase">
                            {isHindi ? pDoc.categoryHindi : pDoc.category}
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-newsreader leading-snug mt-0.5">
                            {isHindi ? pDoc.titleHindi : pDoc.title}
                          </h3>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono shrink-0">
                        {pDoc.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#18A999]" />
                        {pDoc.hospital}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {pDoc.date}
                      </span>
                      <span>•</span>
                      <span>{pDoc.fileSize}</span>
                    </div>

                    {/* Summary / Extracted Info */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs">
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block">
                        {isHindi ? 'दस्तावेज़ सारांश एवं निष्कर्ष:' : 'Extracted Clinical Summary:'}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {isHindi ? pDoc.summaryHindi : pDoc.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f1f23] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#18A999] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {pDoc.ocrConfidence}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedRecordForPreview({ type: 'previous_doc', data: pDoc })}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#18A999]" />
                        <span>{isHindi ? 'देखें' : 'View'}</span>
                      </button>
                      <button
                        onClick={() => alert(`Downloading archived file: ${pDoc.title}...`)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 text-[#18A999] border border-[#18A999]/30 text-xs font-bold flex items-center gap-1 hover:bg-[#18A999] hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{pDoc.fileType.includes('Image') ? 'JPG' : 'PDF'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0F4C5C]/10 text-[#18A999] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-newsreader">
              {isHindi ? 'कोई रिपोर्ट या पर्चा नहीं मिला' : 'No Records or Documents Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isHindi 
                ? 'कृपया अलग कीवर्ड खोजें अथवा नया रिपोर्ट अपलोड करें।' 
                : 'Try adjusting your search query or upload your previous medical documents.'}
            </p>
            <Button size="sm" onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
              {isHindi ? 'सभी दस्तावेज़ देखें' : 'View All Records'}
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal for Prescription, Report, or Previous Uploaded Doc */}
      {selectedRecordForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecordForPreview(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {selectedRecordForPreview.type === 'rx' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#27272a] pb-3">
                  <div className="p-2.5 rounded-xl bg-[#0F4C5C]/10 text-[#18A999]">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#18A999] uppercase font-bold">{selectedRecordForPreview.data.id}</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">
                      {selectedRecordForPreview.data.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedRecordForPreview.data.hospital}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Diagnosis:</span>
                  <p className="text-xs font-bold text-[#0F4C5C] dark:text-[#18A999]">{selectedRecordForPreview.data.diagnosis}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Medication Schedule:</span>
                  {(selectedRecordForPreview.data.medications || []).map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span>{m.name} ({m.dosage})</span>
                        <span className="text-emerald-500 font-mono">{m.frequency}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{m.instructions} • Duration: {m.duration}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-[#0F4C5C]/20 border border-teal-200/50 dark:border-[#18A999]/30 text-xs">
                  <span className="text-[10px] font-bold text-[#18A999] uppercase font-mono block">Physician Advice:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedRecordForPreview.data.dietaryAdvice}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-[#27272a] text-xs">
                  <span className="text-slate-400 font-mono">MCI: {selectedRecordForPreview.data.mciRegNo}</span>
                  <Button size="sm" onClick={() => alert('e-Prescription PDF download initiated.')} icon={Download}>
                    Download e-Prescription
                  </Button>
                </div>
              </div>
            ) : selectedRecordForPreview.type === 'report' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#27272a] pb-3">
                  <div className="p-2.5 rounded-xl bg-[#0F4C5C]/10 text-[#18A999]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#18A999] uppercase font-bold">{selectedRecordForPreview.data.id}</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">
                      {selectedRecordForPreview.data.title}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedRecordForPreview.data.lab} • {selectedRecordForPreview.data.date}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Extracted Test Values:</span>
                  <div className="space-y-1.5">
                    {(selectedRecordForPreview.data.keyFindings || []).map((f, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{f.marker}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Normal: {f.normal}</span>
                        </div>
                        <div className="text-right font-mono font-bold">
                          <span className={f.flag === 'High' ? 'text-amber-500' : 'text-slate-900 dark:text-white'}>{f.value}</span>
                          <span className="block text-[9px] text-slate-400 uppercase">{f.flag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Clinical Impression:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedRecordForPreview.data.summary}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-[#27272a]">
                  <span className="text-[10px] text-emerald-500 font-bold font-mono">OCR Validated • Tamper-evident</span>
                  <Button size="sm" onClick={() => alert('Downloading report file...')} icon={Download}>
                    Download Report
                  </Button>
                </div>
              </div>
            ) : (
              /* Previous Document Preview */
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#27272a] pb-3">
                  <div className="p-2.5 rounded-xl bg-[#0F4C5C]/10 text-[#18A999]">
                    <FolderArchive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#18A999] uppercase font-bold">{selectedRecordForPreview.data.id}</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-newsreader">
                      {selectedRecordForPreview.data.title}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedRecordForPreview.data.hospital} • {selectedRecordForPreview.data.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a]">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">Category:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedRecordForPreview.data.category}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a]">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">File Format & Size:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedRecordForPreview.data.fileType} ({selectedRecordForPreview.data.fileSize})</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Archived Content Summary:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{selectedRecordForPreview.data.summary}</p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-[#0F4C5C]/20 border border-[#18A999]/30 text-xs flex items-center justify-between">
                  <span className="text-[#18A999] font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {selectedRecordForPreview.data.ocrConfidence}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Status: {selectedRecordForPreview.data.status}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-[#27272a]">
                  <span className="text-[10px] text-slate-400 font-mono">Encrypted ABDM Record</span>
                  <Button size="sm" onClick={() => alert(`Downloading ${selectedRecordForPreview.data.title}...`)} icon={Download}>
                    Download Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pay Consultation Fee Modal */}
      {selectedBookingForPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedBookingForPay(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">
                  {isHindi ? 'परामर्श शुल्क भुगतान सफल रहा!' : 'Consultation Payment Completed!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi 
                    ? `डॉ. ${selectedBookingForPay.doctorName} के लिए ₹500 का भुगतान दर्ज हो गया है। रसीद इनवॉइस में उपलब्ध है।`
                    : `Transaction confirmed for ${selectedBookingForPay.appointmentId || 'Appointment'}. Official tax invoice generated.`}
                </p>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  Paid: ₹500 via UPI • Token {selectedBookingForPay.tokenNumber || user?.token || 'Confirmed'}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link href={`/patient/bills?receipt=INV-2026-${selectedBookingForPay.appointmentId || 'OPD'}`}>
                    <Button variant="primary" fullWidth icon={Receipt}>
                      {isHindi ? 'बिल व इनवॉइस में रसीद देखें' : 'View Receipt in Bills & Invoices'}
                    </Button>
                  </Link>
                  <Button variant="secondary" fullWidth onClick={() => setSelectedBookingForPay(null)}>
                    {isHindi ? 'बंद करें' : 'Close'}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono text-[#18A999] uppercase font-bold tracking-wider">
                    {selectedBookingForPay.appointmentId || 'OPD CONSULTATION'}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-newsreader">
                    {isHindi ? 'डॉक्टर परामर्श शुल्क का भुगतान' : 'Pay OPD Consultation Fee'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedBookingForPay.doctorName} • {selectedBookingForPay.specialization || 'Specialist OPD'}
                  </p>
                </div>

                {/* Consultation Details & Amount */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Doctor Slot:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBookingForPay.slotTime || 'Today'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Token Number:</span>
                    <span className="font-bold text-emerald-500 font-mono">{selectedBookingForPay.tokenNumber || user?.token || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{selectedBookingForPay.roomNumber || 'Consultation Desk'}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-[#27272a] pt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Total Consultation Fee:</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹500
                    </span>
                  </div>
                </div>

                {/* UPI QR Code Simulator */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F4C5C]/10 to-transparent border border-[#18A999]/30 flex flex-col items-center space-y-2 text-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Scan via Google Pay, PhonePe, or Paytm
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">UPI ID: maxhospital.delhi@icici</span>
                </div>

                {/* Direct Pay Action */}
                <div className="space-y-2 pt-1">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handlePayConsultation(selectedBookingForPay)}
                    icon={CheckCircle2}
                  >
                    {isHindi ? '₹500 का यूपीआई भुगतान पूर्ण करें' : 'Simulate UPI Payment (₹500)'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
