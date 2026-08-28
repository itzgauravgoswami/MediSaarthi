"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PatientIntakeProvider } from '@/context/PatientIntakeContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';
import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

function DashboardContent({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // Allow demo viewing or redirect to login
    }
    // Auto collapse sidebar on mobile screen resize / initial load
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthenticated, router]);

  // Auth Guard Screen if logged out
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-[#18A999]/30 selection:text-white">
        {/* Background ambient lighting */}
        <div className="fixed top-20 right-10 w-96 h-96 bg-[#18A999]/15 dark:bg-[#18A999]/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="fixed bottom-10 left-10 w-96 h-96 bg-[#6366F1]/15 dark:bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Crisp Gridlines Overlay */}
        <div 
          className="fixed inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none z-0"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
          }}
        />

        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-md w-full">
          <div className="p-4 rounded-3xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30 shadow-teal-glow">
            <Lock className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-newsreader text-slate-900 dark:text-white">Authentication Required</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You must log in to access this role-based MediSaarthi clinical workspace.
            </p>
          </div>
          <Link href="/login">
            <Button size="lg" icon={LogIn}>
              Sign In to Access Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex font-sans selection:bg-[#18A999]/30 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed top-20 right-10 w-96 h-96 bg-[#18A999]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="fixed inset-0 bg-grid-pattern opacity-85 dark:opacity-50 pointer-events-none z-0"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Workspace */}
      <div className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${collapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'}`}>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <DashboardContent>{children}</DashboardContent>;
}
