"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Calendar, 
  Mic, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Hospital,
  Pill,
  PackageCheck,
  ClipboardList,
  Stethoscope,
  Globe,
  Receipt
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();

  const doctorNav = [
    { name: 'Doctor Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Patients Queue', href: '/doctor/patients', icon: Users },
    { name: 'Attended Patients', href: '/doctor/attended', icon: UserCheck },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { name: 'Analytics', href: '/doctor/analytics', icon: BarChart3 },
    { name: 'Red Flags Desk', href: '/triage/red-flags', icon: AlertTriangle, badge: '1' },
    { name: 'AYUSH Workspace', href: '/ayush', icon: Activity },
  ];

  const patientNav = [
    { name: 'Patient Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Find Doctors', href: '/patient/doctors', icon: Stethoscope },
    { name: 'Reports & Prescriptions', href: '/patient/reports', icon: ClipboardList, badge: '5' },
    { name: 'Bills & Invoices', href: '/patient/bills', icon: Receipt },
    { name: 'AI Voice Intake', href: '/patient/interview', icon: Mic },
    { name: 'Upload Documents', href: '/patient/documents', icon: FileText },
    { name: 'Language Select', href: '/patient/language', icon: Globe },
    { name: 'Informed Consent', href: '/patient/consent', icon: ShieldAlert },
  ];

  const pharmacyNav = [
    { name: 'Pharmacy Dashboard', href: '/pharmacy/dashboard', icon: LayoutDashboard },
    { name: 'Prescription Queue', href: '/pharmacy/prescriptions', icon: Pill, badge: '3' },
    { name: 'Medication Inventory', href: '/pharmacy/inventory', icon: PackageCheck },
    { name: 'Fulfillment Logs', href: '/pharmacy/logs', icon: ClipboardList },
  ];

  const adminNav = [
    { name: 'Admin Console', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics & KPIs', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Kiosk Fleet', href: '/admin/kiosks', icon: Hospital },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  let navItems = doctorNav;
  if (role === 'patient') navItems = patientNav;
  if (role === 'pharmacy') navItems = pharmacyNav;
  if (role === 'admin') navItems = adminNav;

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          title="Close Sidebar Menu"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white dark:bg-black border-r border-slate-200 dark:border-[#27272a] transition-all duration-300 flex flex-col justify-between ${
          collapsed 
            ? '-translate-x-full md:translate-x-0 md:w-20' 
            : 'translate-x-0 w-64 shadow-2xl md:shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 px-5 flex items-center justify-between border-b border-slate-100 dark:border-[#27272a]">
            <Link href="/" className="flex items-center gap-3 overflow-hidden group">
              <div className="w-10 h-10 relative shrink-0 p-1 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a]">
                <Image
                  src="/logo/logo.png"
                  alt="MediSaarthi Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg text-[#0F4C5C] dark:text-white leading-none font-newsreader flex items-center gap-1">
                    MediSaarthi
                    <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse"></span>
                  </span>
                  <span className="text-[9px] font-bold text-[#18A999] tracking-widest uppercase mt-1">
                    AI Clinical Intake
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] border border-slate-200 dark:border-[#27272a] transition-all flex items-center justify-center"
              title={collapsed ? "Expand Sidebar" : "Close Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4 text-[#18A999]" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Role Badge */}
          {!collapsed && (
            <div className="px-4 py-2.5 mx-3 mt-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">PORTAL ROLE</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C5C]/10 text-[#18A999] uppercase border border-[#18A999]/30">
                {role || 'doctor'}
              </span>
            </div>
          )}

          {/* Navigation List */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      setCollapsed(true);
                    }
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full font-semibold text-xs transition-all relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-teal-glow font-bold'
                      : 'text-slate-700 dark:text-[#a1a1aa] hover:text-[#0F4C5C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#18A999]'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}

                  {item.badge && !collapsed && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-black text-white text-xs rounded-xl border border-[#27272a] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-[#27272a]">
        {!collapsed && user && (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate font-newsreader">{user.name}</span>
                <span className="text-[10px] text-slate-400 truncate">{user.hospital}</span>
              </div>
            </div>
            <button onClick={logout} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-black transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  </>
  );
}
