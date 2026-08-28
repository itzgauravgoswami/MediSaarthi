"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { UserCheck, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('dr.sharma@medisaarthi.health');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    login('doctor', { email });
    router.push('/doctor/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#18A999]/30 selection:text-white">
      {/* Glow & Gridlines */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-[#18A999]/15 dark:bg-[#18A999]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-[#6366F1]/15 dark:bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="fixed inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />
      <div className="max-w-md w-full bg-white dark:bg-black border border-slate-200/80 dark:border-[#27272a] p-8 rounded-3xl shadow-xl space-y-6 relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 relative mx-auto">
            <Image src="/logo/logo.png" alt="MediSaarthi Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-black">
            Medi<span className="text-[#18A999]">Saarthi</span> Doctor Portal
          </h1>
          <p className="text-xs text-slate-500">Sign in to access pre-consultation AI clinical summaries.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doctor Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18A999]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18A999]"
              />
            </div>
          </div>

          <Button size="lg" type="submit" fullWidth icon={ArrowRight} iconPosition="right">
            Sign In to Clinical Workspace
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-[#18A999]" />
          <span>Role-Based Access Control • HIPAA & ABDM Compliant</span>
        </div>
      </div>
    </div>
  );
}
