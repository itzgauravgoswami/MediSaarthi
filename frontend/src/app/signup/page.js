"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { 
  UserCheck, 
  Hospital, 
  Pill, 
  Shield, 
  User, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mic,
  FileText,
  Clock
} from 'lucide-react';

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [role, setRoleState] = useState('doctor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const redirects = {
    doctor: '/doctor/dashboard',
    patient: '/patient/dashboard',
    pharmacy: '/pharmacy/dashboard',
    admin: '/admin/dashboard'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(role, name || 'New Healthcare User', email);
    router.push(redirects[role] || '/doctor/dashboard');
  };

  const handleGoogleSignUp = () => {
    login(role, { email: email || `${role}.user@medisaarthi.health` });
    router.push(redirects[role] || '/doctor/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
      {/* Glow & Gridlines */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      {/* 2-COLUMN SIGNUP CONTAINER */}
      <main className="max-w-4xl lg:max-w-5xl w-full mx-auto my-3 bg-white dark:bg-black border border-slate-200/90 dark:border-[#27272a] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* COLUMN 1: Brand Logo, Instructions & Highlights (Hidden on mobile, visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[#0F4C5C]/15 via-[#0F4C5C]/5 to-transparent border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-[#27272a] p-6 md:p-8 flex-col justify-between space-y-5">
          <div className="space-y-5">
            {/* Logo & Title Header */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 relative p-1 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a] shadow-sm group-hover:scale-105 transition-transform">
                <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain p-0.5" />
              </div>
              <span className="font-extrabold text-2xl text-[#0F4C5C] dark:text-white font-newsreader tracking-tight">
                Medi<span className="text-[#18A999]">Saarthi</span>
              </span>
            </Link>

            {/* Registration Instructions */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Join Ecosystem
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-newsreader leading-tight text-slate-900 dark:text-white">
                Create Account & Intake
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Register as a doctor, patient, pharmacist, or admin to access AI healthcare workflows.
              </p>
            </div>

            {/* Key Benefits List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded-lg bg-[#18A999]/10 text-[#18A999] shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Instant Summaries</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Saves 4 min per consultation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded-lg bg-[#0F4C5C]/10 text-[#18A999] shrink-0 mt-0.5">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Voice Kiosk Intake</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">OPD queue tokening & history.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded-lg bg-[#6366F1]/10 text-[#6366F1] shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">OCR Parsing</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Prescriptions & diagnostic labs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Note */}
          <div className="pt-3.5 border-t border-slate-200/80 dark:border-[#27272a] text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#18A999] shrink-0" />
            <span>ABDM & HIPAA Standards Compliant.</span>
          </div>
        </div>

        {/* COLUMN 2: Credentials Form & Google Sign-In */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center space-y-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase tracking-widest">
              REGISTRATION
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold font-newsreader tracking-tight text-slate-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa]">Select your platform role to get started.</p>
          </div>

          {/* 4 Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#27272a]">
            {[
              { id: 'doctor', label: 'Doctor', icon: UserCheck },
              { id: 'patient', label: 'Patient', icon: Hospital },
              { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
              { id: 'admin', label: 'Admin', icon: Shield }
            ].map((item) => {
              const isSelected = role === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRoleState(item.id)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-xs'
                      : 'text-slate-600 dark:text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-2 px-3 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-[#161616] text-slate-700 dark:text-slate-200 font-bold text-[11px] rounded-full border border-slate-200 dark:border-[#27272a] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <GoogleIcon />
            <span>Sign Up with Google</span>
          </button>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-[#27272a] w-full" />
            <span className="bg-white dark:bg-black px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 absolute">
              Or With Email
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">FULL NAME</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Dr. Ananya Sharma / Rahul Kumar..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-[11px] bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#18A999]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="user@medisaarthi.health"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-[11px] bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#18A999]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">PASSWORD</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-[11px] bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#18A999]"
                />
              </div>
            </div>

            <Button size="md" type="submit" fullWidth icon={ArrowRight} iconPosition="right">
              Register & Access {role.toUpperCase()} Portal
            </Button>
          </form>

          {/* Footer Link to Login */}
          <div className="text-center pt-1.5 border-t border-slate-100 dark:border-[#27272a]">
            <Link href="/login" className="text-[11px] font-bold text-[#18A999] hover:underline">
              Already have an account? Sign In
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

