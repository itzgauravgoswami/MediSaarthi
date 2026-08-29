"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { usePatientIntake } from '@/context/PatientIntakeContext';
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
  Share2
} from 'lucide-react';

export default function PatientReportsPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const { user } = useAuth();
  const { intakeState } = usePatientIntake();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'prescriptions' | 'reports' | 'previous'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState(null);

  // Doctor e-Prescriptions
  const prescriptions = [
    {
      id: 'RX-2026-8819',
      doctorName: 'Dr. Arvind Mehta',
      doctorQualification: 'MBBS, MD (Med), DM (Cardiology), FACC',
      hospital: 'Max Super Speciality Hospital, New Delhi',
      date: '28 Aug 2026',
      department: 'Cardiology OPD Desk A',
      diagnosis: 'Grade II Essential Hypertension & Exertional Angina',
      diagnosisHindi: 'ग्रेड II उच्च रक्तचाप एवं परिश्रम जनित सीने का दर्द',
      mciRegNo: 'MCI-74829/DL',
      qrCodeData: 'MEDISAARTHI-RX-VERIFIED-8819',
      medications: [
        { name: 'Tab. Telmisartan', dosage: '40 mg', frequency: '1-0-0 (Morning)', duration: '30 Days', instructions: 'Take after breakfast with water' },
        { name: 'Tab. Atorvastatin', dosage: '20 mg', frequency: '0-0-1 (Night)', duration: '30 Days', instructions: 'Take at bedtime for lipid control' },
        { name: 'Tab. Sorbitrate', dosage: '5 mg', frequency: 'SOS (As needed)', duration: '15 Days', instructions: 'Sublingual (under the tongue) during acute chest heaviness' }
      ],
      dietaryAdvice: 'Low-sodium cardiac diet (<2g salt/day), restrict fried foods, 30 min light walking daily.',
      dietaryAdviceHindi: 'कम नमक वाला हृदय आहार (<2 ग्राम नमक/दिन), तला हुआ खाना न खाएं, प्रतिदिन 30 मिनट टहलें।'
    },
    {
      id: 'RX-2026-6421',
      doctorName: 'Dr. Sameer Malhotra',
      doctorQualification: 'MBBS, MD (Psychiatry - AIIMS)',
      hospital: 'Max Super Speciality Hospital, New Delhi',
      date: '14 Aug 2026',
      department: 'Behavioral Sciences & Neuro-Psychiatry',
      diagnosis: 'Generalized Anxiety Disorder (GAD) & Insomnia',
      diagnosisHindi: 'सामान्यीकृत चिंता विकार एवं अनिद्रा',
      mciRegNo: 'MCI-52910/DL',
      qrCodeData: 'MEDISAARTHI-RX-VERIFIED-6421',
      medications: [
        { name: 'Tab. Escitalopram', dosage: '10 mg', frequency: '1-0-0 (Morning)', duration: '20 Days', instructions: 'Take after breakfast' },
        { name: 'Tab. Clonazepam', dosage: '0.25 mg', frequency: '0-0-1 (Bedtime)', duration: '7 Days', instructions: 'Only if unable to sleep' }
      ],
      dietaryAdvice: 'Avoid caffeine/tea after 6 PM, practice 15 min mindfulness breathing exercises before sleep.',
      dietaryAdviceHindi: 'शाम 6 बजे के बाद चाय/कॉफ़ी न लें, सोने से पहले 15 मिनट गहरी सांस लेने का अभ्यास करें।'
    }
  ];

  // Uploaded Diagnostic & Lab Reports
  const diagnosticReports = [
    {
      id: 'REP-LAB-1092',
      title: 'Comprehensive Lipid Profile & Blood Chemistry',
      titleHindi: 'लिपिड प्रोफाइल एवं रक्त परीक्षण रिपोर्ट',
      date: '27 Aug 2026',
      lab: 'Max Healthcare Central Laboratories',
      type: 'Blood Pathology',
      fileSize: '1.8 MB',
      ocrConfidence: '98% OCR Match',
      status: 'Attention Required',
      statusColor: 'amber',
      keyFindings: [
        { marker: 'Total Cholesterol', value: '238 mg/dL', normal: '< 200 mg/dL', flag: 'High' },
        { marker: 'LDL (Bad Cholesterol)', value: '154 mg/dL', normal: '< 100 mg/dL', flag: 'High' },
        { marker: 'HDL (Good Cholesterol)', value: '44 mg/dL', normal: '> 40 mg/dL', flag: 'Normal' },
        { marker: 'Serum Creatinine', value: '0.92 mg/dL', normal: '0.7 - 1.2 mg/dL', flag: 'Normal' },
        { marker: 'HbA1c (Sugar)', value: '6.4%', normal: '< 5.7%', flag: 'Pre-diabetic' }
      ],
      summary: 'Elevated serum cholesterol and LDL detected. Clinical lipid management initiated by cardiologist.'
    },
    {
      id: 'REP-ECG-4810',
      title: '12-Lead Electrocardiogram (ECG Tracing)',
      titleHindi: '12-लीड ईसीजी (हृदय गति) रिपोर्ट',
      date: '28 Aug 2026',
      lab: 'Max Super Speciality Cardiology Lab',
      type: 'Cardiac Diagnostics',
      fileSize: '2.4 MB',
      ocrConfidence: '96% AI Validated',
      status: 'Doctor Reviewed',
      statusColor: 'emerald',
      keyFindings: [
        { marker: 'Heart Rate', value: '82 bpm', normal: '60 - 100 bpm', flag: 'Normal' },
        { marker: 'Rhythm', value: 'Normal Sinus Rhythm', normal: 'Sinus', flag: 'Normal' },
        { marker: 'ST Segment', value: 'Non-specific T-wave flattening in V4-V6', normal: 'Isoelectric', flag: 'Mild Ischemia' }
      ],
      summary: 'Normal sinus rhythm with subtle inferolateral repolarization changes under exertional stress.'
    },
    {
      id: 'REP-HEM-3019',
      title: 'Complete Blood Count (CBC) & ESR Panel',
      titleHindi: 'कम्पलीट ब्लड काउंट (सीबीसी) एवं ईएसआर',
      date: '10 Aug 2026',
      lab: 'Max Healthcare Central Laboratories',
      type: 'Hematology',
      fileSize: '1.2 MB',
      ocrConfidence: '99% Verified',
      status: 'Normal',
      statusColor: 'emerald',
      keyFindings: [
        { marker: 'Hemoglobin (Hb)', value: '14.6 g/dL', normal: '13.5 - 17.5 g/dL', flag: 'Normal' },
        { marker: 'Total Leukocyte Count (TLC)', value: '7,400 /mcL', normal: '4,000 - 11,000', flag: 'Normal' },
        { marker: 'Platelet Count', value: '2.65 Lakhs', normal: '1.5 - 4.5 Lakhs', flag: 'Normal' },
        { marker: 'ESR (1st Hour)', value: '12 mm/hr', normal: '< 15 mm/hr', flag: 'Normal' }
      ],
      summary: 'All hematological parameters within healthy biological reference intervals.'
    }
  ];

  // Previous Documents Uploaded by User
  const previousUploadedDocuments = [
    {
      id: 'DOC-PREV-001',
      title: 'Inpatient Hospital Discharge Summary (2025)',
      titleHindi: 'अस्पताल डिस्चार्ज सारांश (2025)',
      category: 'Discharge Summary',
      categoryHindi: 'डिस्चार्ज समरी',
      hospital: 'Max Super Speciality Hospital, New Delhi',
      date: '12 May 2025',
      fileType: 'PDF Document',
      fileSize: '3.1 MB',
      ocrConfidence: '99% OCR Verified',
      status: 'Archived Record',
      statusColor: 'teal',
      summary: 'Admitted for acute exertional chest tightness. Coronary angiography revealed non-obstructive CAD. Stabilized on medical therapy and discharged in stable condition.',
      summaryHindi: 'सीने में जकड़न के लिए भर्ती। कोरोनरी एंजियोग्राफी में मामूली बदलाव। दवाओं द्वारा स्थिर कर डिस्चार्ज किया गया।'
    },
    {
      id: 'DOC-PREV-002',
      title: 'Past OPD Prescription Slip & Medication History',
      titleHindi: 'पिछला ओपीडी पर्चा एवं दवा इतिहास',
      category: 'Handwritten Prescription',
      categoryHindi: 'हस्तलिखित पर्चा',
      hospital: 'Max Super Speciality Hospital, New Delhi',
      date: '15 Jan 2026',
      fileType: 'Image Scan (JPG)',
      fileSize: '1.5 MB',
      ocrConfidence: '95% Handwriting OCR',
      status: 'Digitized by Kiosk',
      statusColor: 'emerald',
      summary: 'Prescribed Tab. Telmisartan 40mg (OD), Tab. Pantoprazole 40mg (OD fasting). Advice: Routine BP self-monitoring twice a week.',
      summaryHindi: 'दवाएं: टेल्मिसार्टन 40 मिलीग्राम (प्रतिदिन), पेंटोप्राजोल 40 मिलीग्राम। सप्ताह में 2 बार बीपी जांचने की सलाह।'
    },
    {
      id: 'DOC-PREV-003',
      title: 'Digital Chest X-Ray (PA View Radiograph)',
      titleHindi: 'छाती का एक्स-रे डिजिटल रिपोर्ट',
      category: 'Radiology Imaging',
      categoryHindi: 'रेडियोलॉजी रिपोर्ट',
      hospital: 'Max Super Speciality Imaging Center',
      date: '20 Nov 2025',
      fileType: 'Radiology Scan (PDF)',
      fileSize: '4.2 MB',
      ocrConfidence: 'Radiologist Signed',
      status: 'Verified Scan',
      statusColor: 'emerald',
      summary: 'Normal cardiothoracic ratio (CTR < 50%). Bronchovascular markings normal. Both costophrenic angles clear. No focal consolidation or effusion.',
      summaryHindi: 'हृदय का आकार सामान्य (<50%)। फेफड़े पूरी तरह से साफ। कोई संक्रमण या द्रव नहीं।'
    },
    {
      id: 'DOC-PREV-004',
      title: 'Ayushman Bharat Digital Health Card (ABHA)',
      titleHindi: 'आयुष्मान भारत डिजिटल हेल्थ आईडी (ABHA)',
      category: 'ABDM Health Identity',
      categoryHindi: 'एबीएचए पहचान पत्र',
      hospital: 'National Health Authority (NHA)',
      date: '01 Jan 2026',
      fileType: 'Digital Identity Card',
      fileSize: '850 KB',
      ocrConfidence: 'Aadhaar Verified',
      status: 'Active Identity',
      statusColor: 'teal',
      summary: 'ABHA ID: 91-4829-1039-4821. Linked with National Health Stack. Consents active for emergency data sharing across Max Super Speciality Network.',
      summaryHindi: 'एबीएचए आईडी: 91-4829-1039-4821 आधार से प्रमाणित। मैक्स नेटवर्क पर आपातकालीन डेटा साझाकरण सक्रिय।'
    }
  ];

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

  const filteredPreviousDocs = previousUploadedDocuments.filter(doc => {
    if (activeTab === 'prescriptions' || activeTab === 'reports') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return doc.title.toLowerCase().includes(q) ||
           doc.category.toLowerCase().includes(q) ||
           doc.hospital.toLowerCase().includes(q) ||
           doc.summary.toLowerCase().includes(q);
  });

  const totalCount = filteredPrescriptions.length + filteredReports.length + filteredPreviousDocs.length;

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
                {prescriptions.length + diagnosticReports.length + previousUploadedDocuments.length} {isHindi ? 'दस्तावेज़ सुरक्षित' : 'Records Saved'}
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
                { id: 'all', label: isHindi ? 'सभी रिकॉर्ड' : 'All Records', count: prescriptions.length + diagnosticReports.length + previousUploadedDocuments.length },
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
                      {rx.medications.map((med, mIdx) => (
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
                        {rep.keyFindings.slice(0, 3).map((f, fIdx) => (
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
                  {selectedRecordForPreview.data.medications.map((m, idx) => (
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
                    {selectedRecordForPreview.data.keyFindings.map((f, idx) => (
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
    </DashboardLayout>
  );
}
