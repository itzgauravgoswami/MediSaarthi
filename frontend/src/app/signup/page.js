"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { 
  UserCheck, 
  Hospital, 
  Pill, 
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

function SignupFormContent() {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [role, setRoleState] = useState('doctor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirects = {
    doctor: '/doctor/dashboard',
    patient: '/patient/dashboard',
    pharmacy: '/pharmacy/dashboard'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup({ role, name: name || 'New Healthcare User', email, password });
    if (res.success) {
      router.push(redirects[role] || '/doctor/dashboard');
    } else {
      alert(res.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await login(role, { 
        email: decoded.email, 
        password: '••••••••••••', 
        name: decoded.name 
      });
      if (res.success) {
        router.push(redirects[role] || '/doctor/dashboard');
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error("Google sign up error", error);
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
              Register as a doctor, patient, or pharmacist to access AI healthcare workflows.
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

        {/* 3 Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#27272a]">
          {[
            { id: 'doctor', label: 'Doctor', icon: UserCheck },
            { id: 'patient', label: 'Patient', icon: Hospital },
            { id: 'pharmacy', label: 'Pharmacy', icon: Pill }
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
        <div className="w-full flex justify-center py-1">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            shape="rectangular"
            theme="filled_black"
            text="signup_with"
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
            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-0.5 font-newsreader uppercase">FULL NAME</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter your full name..."
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
  );
}

export default function SignupPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1047124190772-23v55cpt6b306ktt20dsqd70c9n0er8r.apps.googleusercontent.com'}>
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
        
        <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading Signup...</div>}>
          <SignupFormContent />
        </Suspense>
      </div>
    </GoogleOAuthProvider>
  );
}
