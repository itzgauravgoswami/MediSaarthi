"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DEMO_AYUSH_DATA } from '@/services/demoDataService';
import { Leaf, Edit3, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function AyushWorkspacePage() {
  const [clinicalMode, setClinicalMode] = useState('AYUSH');
  const [openSection, setOpenSection] = useState('prakriti');
  const ayushRecord = DEMO_AYUSH_DATA['P102'];

  const parikshaFields = [
    { key: 'prakriti', title: '1. Prakriti (Prakriti Pariksha)', desc: 'Constitutional Body Type & Dosha Predominance' },
    { key: 'vikriti', title: '2. Vikriti (Morbidity Assessment)', desc: 'Pathological State & Imbalanced Doshas' },
    { key: 'sara', title: '3. Sara (Tissue Quality)', desc: 'Excellence of Dhatus (Rasa, Rakta, Mamsa, Meda, Asthi)' },
    { key: 'samhanana', title: '4. Samhanana (Body Built)', desc: 'Compactness of Body Structure & Symmetry' },
    { key: 'pramana', title: '5. Pramana (Anthropometry)', desc: 'Physical Body Dimensions & Proportions' },
    { key: 'satmya', title: '6. Satmya (Habituation)', desc: 'Wholesomeness & Dietary Adaptability' },
    { key: 'sattva', title: '7. Sattva (Mental Temperament)', desc: 'Psychological Endurance & Mental Strength' },
    { key: 'aharaShakti', title: '8. Ahara Shakti (Digestive Capacity)', desc: 'Abhavarana & Jarana Shakti (Agni status)' },
    { key: 'vyayamaShakti', title: '9. Vyayama Shakti (Exercise Capacity)', desc: 'Physical Capacity & Stamina' },
    { key: 'vaya', title: '10. Vaya (Age Stage)', desc: 'Age Category (Balya, Madhyama, Vardhakya)' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-black text-white p-6 rounded-3xl border border-emerald-800 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-800/50 text-emerald-300 border border-emerald-700">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">TRADITIONAL MEDICINE</span>
              <h1 className="text-xl font-extrabold font-newsreader">AYUSH Pariksha Portal</h1>
              <p className="text-xs text-emerald-200">Dashavidha Pariksha 10-Fold Clinical Assessment Module</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black p-1.5 rounded-full border border-emerald-800">
            <span className="text-xs font-bold text-emerald-400 px-2 uppercase tracking-wider text-[10px]">Mode:</span>
            <button
              onClick={() => setClinicalMode('Allopathic')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                clinicalMode === 'Allopathic' ? 'bg-white text-black shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              Allopathic
            </button>
            <button
              onClick={() => setClinicalMode('AYUSH')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                clinicalMode === 'AYUSH' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              AYUSH
            </button>
          </div>
        </div>

        {/* Patient Select Card */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30 font-extrabold flex items-center justify-center text-sm font-newsreader">
              RK
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-newsreader">Rahul Kumar (Token #102)</h3>
              <span className="text-xs text-slate-400">45 yrs • Male • Chief Complaint: Chest Pain (Hridaya Shoola)</span>
            </div>
          </div>
          <Badge variant="teal">AYUSH Mode Active</Badge>
        </Card>

        {/* Accordion List */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">Dashavidha Pariksha Evaluation</h2>
            </div>
            <Button size="sm" variant="outline" icon={Edit3}>Edit AYUSH Record</Button>
          </div>

          <div className="space-y-3">
            {parikshaFields.map((field) => {
              const isOpen = openSection === field.key;
              const val = ayushRecord.dashavidhaPariksha[field.key] || 'Assessed';

              return (
                <div
                  key={field.key}
                  className="rounded-2xl border border-slate-200 dark:border-[#27272a] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenSection(isOpen ? null : field.key)}
                    className="w-full p-4 bg-slate-50 dark:bg-[#111111] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] flex items-center justify-between text-left"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block font-newsreader">{field.title}</span>
                      <span className="text-[11px] text-slate-400">{field.desc}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {val}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 bg-white dark:bg-black border-t border-slate-100 dark:border-[#27272a] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white block mb-1 font-newsreader">Clinical Observation & Notes:</strong>
                      <p className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 text-emerald-200 font-medium">
                        {val}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
