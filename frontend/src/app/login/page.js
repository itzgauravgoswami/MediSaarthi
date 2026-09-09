"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { 
  UserCheck, 
  Hospital, 
  Pill, 
  Lock, 
  Mail, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mic,
  FileText
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams?.get('role') || 'doctor';

  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(initialRole === 'admin' ? 'doctor' : initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  const roleConfigs = {
    doctor: {
      title: "Doctor Clinical Workspace",
      sub: "Access pre-consultation patient summaries & OCR medical records.",
      icon: UserCheck,
      badge: "Physician EMR",
      defaultEmail: "dr.sharma@medisaarthi.health",
      redirect: "/doctor/dashboard"
    },
    patient: {
      title: "Patient Intake Portal",
      sub: "Start AI voice intake, upload prescriptions, and view your token.",
      icon: Hospital,
      badge: "Patient OPD Kiosk",
      defaultEmail: "patient@medisaarthi.health",
      redirect: "/patient/dashboard"
    },
    pharmacy: {
      title: "Pharmacy Fulfillment Desk",
      sub: "Dispense OCR verified prescriptions & track hospital inventory.",
      icon: Pill,
      badge: "Hospital Pharmacy",
      defaultEmail: "pharmacy@medisaarthi.health",
      redirect: "/pharmacy/dashboard"
    }
  };

  const currentConfig = roleConfigs[selectedRole] || roleConfigs.doctor;

  const handleRoleSelect = (r) => {
    setSelectedRole(r);
    setEmail(roleConfigs[r].defaultEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(selectedRole, { email: email || currentConfig.defaultEmail, password });
    if (res.success) {
      router.push(currentConfig.redirect);
    } else {
      alert(res.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await login(selectedRole, { 
        email: decoded.email, 
        password: '••••••••••••', 
        name: decoded.name 
      });
      if (res.success) {
        router.push(currentConfig.redirect);
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error("Google sign in error", error);
    }
  };

  const handleDemoQuickLogin = async (r) => {
    const config = roleConfigs[r];
    const res = await login(r, { email: config.defaultEmail, password: 'password123' });
    if (res.success) {
      router.push(config.redirect);
    } else {
      alert(res.error);
    }
  };

  const handleSeamlessSignup = async () => {
    const res = await login(selectedRole, { email: email || currentConfig.defaultEmail, password });
    if (res.success) {
      router.push(currentConfig.redirect);
    } else {
      alert(res.error);
    }
  };

  return (
    <main className="max-w-4xl lg:max-w-5xl w-full mx-auto my-3 bg-white dark:bg-black border border-slate-200/90 dark:border-[#27272a] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
      {/* COLUMN 1: Brand Logo, Instructions & Highlights */}
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

          {/* Platform Instructions */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Role-Based Access
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-newsreader leading-tight text-slate-900 dark:text-white">
              AI Clinical Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Log in to access your role-specific dashboard. Prepare structured patient case histories & review OCR records.
            </p>
          </div>

          {/* Key Benefit Highlights */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-[#18A999]/10 text-[#18A999] shrink-0 mt-0.5">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Multilingual Voice AI Intake</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Supports 10+ regional Indian languages & accents.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-[#0F4C5C]/10 text-[#18A999] shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Intelligent Document OCR</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Instant extraction of prescriptions & lab reports.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-[#6366F1]/10 text-[#6366F1] shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">ABDM & Ayush Ready</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Standards-compliant clinical history logging.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3.5 border-t border-slate-200/80 dark:border-[#27272a] text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#18A999] shrink-0" />
          <span>Built for hospitals, OPDs, clinics & AYUSH institutions.</span>
        </div>
      </div>

      {/* COLUMN 2: Credentials Form & Google Sign-In */}
      <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center space-y-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase tracking-widest">
            {currentConfig.badge}
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold font-newsreader tracking-tight text-slate-900 dark:text-white">
            {currentConfig.title}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa]">{currentConfig.sub}</p>
        </div>

        {/* 3 Role Selector Tabs (Admin Removed) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#27272a]">
          {[
            { id: 'doctor', label: 'Doctor', icon: UserCheck },
            { id: 'patient', label: 'Patient', icon: Hospital },
            { id: 'pharmacy', label: 'Pharmacy', icon: Pill }
          ].map((item) => {
            const isSelected = selectedRole === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRoleSelect(item.id)}
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

        {/* Google Sign-In Button */}
        <div className="w-full flex justify-center py-1">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            shape="rectangular"
            theme="filled_black"
            text="signin_with"
            width="100%"
          />
        </div>

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
            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">
              {selectedRole} EMAIL / ID
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email || currentConfig.defaultEmail}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-[11px] bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#18A999]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-[11px] bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#18A999]"
              />
            </div>
          </div>

          <Button size="md" type="submit" fullWidth icon={ArrowRight} iconPosition="right">
            Sign In to {selectedRole.toUpperCase()} Dashboard
          </Button>
        </form>

        {/* Quick Demo 1-Click Login Shortcuts (Admin Removed) */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-[#27272a] space-y-2">
          <p className="text-[9px] font-bold text-center text-[#18A999] uppercase tracking-wider">
            Quick 1-Click Demo Login:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleDemoQuickLogin('doctor')}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#111111] hover:bg-[#0F4C5C]/20 border border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1 transition-all"
            >
              Doctor
            </button>
            <button
              onClick={() => handleDemoQuickLogin('patient')}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#111111] hover:bg-[#0F4C5C]/20 border border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1 transition-all"
            >
              Patient
            </button>
            <button
              onClick={() => handleDemoQuickLogin('pharmacy')}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#111111] hover:bg-[#0F4C5C]/20 border border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1 transition-all"
            >
              Pharmacy
            </button>
          </div>

          <div className="text-center pt-1">
            <Link href="/signup" className="text-[11px] font-bold text-[#18A999] hover:underline">
              Don't have an account? Create one now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1047124190772-23v55cpt6b306ktt20dsqd70c9n0er8r.apps.googleusercontent.com'}>
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Glow & Gridlines */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
          }}
        />

        <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading Login...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </GoogleOAuthProvider>
  );
}

