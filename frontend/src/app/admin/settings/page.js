"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Settings, ShieldCheck, Database, Key, Check } from 'lucide-react';

export default function SettingsPage() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [geminiKey, setGeminiKey] = useState('••••••••••••••••••••••••••••••••');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">System Settings & Integrations</h1>
          <p className="text-xs text-slate-500">Configure AI model providers, FHIR / ABDM adapters, and sandbox demo toggles.</p>
        </div>

        <Card className="p-6 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Sandbox & Demo Engine</h3>
            <Badge variant={sandboxMode ? 'teal' : 'neutral'}>
              {sandboxMode ? 'Demo Mode Active' : 'Live API Active'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">Offline Sandbox Fallback</span>
              <span className="text-xs text-slate-500">Allow complete UI workflow execution using mock clinical datasets when APIs are unreachable.</span>
            </div>

            <button
              onClick={() => setSandboxMode(!sandboxMode)}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${sandboxMode ? 'bg-[#18A999]' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${sandboxMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Gemini Configuration */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Google Gemini AI Configuration</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Gemini API Key</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#18A999]"
                />
              </div>
            </div>
          </div>

          {/* ABDM & FHIR Status */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Interoperability & Data Models</h3>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
              <strong className="block font-bold">ABDM / Sandbox Integration:</strong>
              This environment runs on MediSaarthi FHIR R4 mock adapter schemas (`PatientMapper`, `ObservationMapper`). Real ABDM Milestone 1 & 2 APIs will connect seamlessly via environment variables.
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button size="md" variant="primary" onClick={handleSave} icon={Check}>
              {saved ? 'Settings Saved!' : 'Save System Settings'}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
