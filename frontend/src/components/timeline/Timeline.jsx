"use client";

import React from 'react';
import { Card, Badge } from '@/components/ui/Card';
import { Stethoscope, Pill, TestTube, Hospital, FileText, Calendar } from 'lucide-react';

export default function Timeline({ timelineEvents = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Consultation': return Stethoscope;
      case 'Prescription':
      case 'Medication': return Pill;
      case 'Investigation': return TestTube;
      case 'Hospitalization': return Hospital;
      default: return FileText;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'Consultation': return 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white border-[#18A999]';
      case 'Prescription':
      case 'Medication': return 'bg-blue-600 text-white border-blue-400';
      case 'Investigation': return 'bg-amber-600 text-white border-amber-400';
      case 'Hospitalization': return 'bg-rose-600 text-white border-rose-400';
      default: return 'bg-purple-600 text-white border-purple-400';
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#18A999]" />
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-newsreader">Chronological Medical Timeline</h3>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{timelineEvents.length} Recorded Events</span>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#27272a]">
        {timelineEvents.map((evt) => {
          const Icon = getIcon(evt.type);
          const colorClass = getColor(evt.type);

          return (
            <div key={evt.id} className="relative group">
              {/* Node */}
              <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full ${colorClass} flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-black`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Event Box */}
              <div className="ml-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1 hover:border-[#18A999]/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{evt.date}</span>
                  <Badge variant={evt.badge === 'Red Flag' ? 'danger' : 'teal'}>{evt.badge || evt.type}</Badge>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white font-newsreader">{evt.title}</h4>
                <p className="text-xs text-slate-600 dark:text-[#a1a1aa] leading-relaxed">{evt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
