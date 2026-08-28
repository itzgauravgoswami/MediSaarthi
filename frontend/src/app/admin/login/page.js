"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login('admin');
    router.push('/admin/dashboard');
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
      <div className="max-w-md w-full bg-white dark:bg-black border border-slate-200/80 dark:border-[#27272a] p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 relative mx-auto">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-black">Medi<span className="text-[#18A999]">Saarthi</span> System Admin</h1>
          <p className="text-xs text-slate-400">Operational & Hospital Fleet Management Console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Account</label>
            <input
              type="email"
              defaultValue="admin@medisaarthi.health"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#18A999]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Passkey</label>
            <input
              type="password"
              defaultValue="••••••••••••"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#18A999]"
            />
          </div>
          <Button size="lg" type="submit" fullWidth icon={ArrowRight} iconPosition="right">
            Access Operations Console
          </Button>
        </form>
      </div>
    </div>
  );
}
