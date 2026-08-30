"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Search, Bell, Moon, Sun, AlertTriangle, ShieldCheck, LogOut, User, Menu } from 'lucide-react';

export default function Topbar({ collapsed, setCollapsed }) {
  const { role, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 sm:h-20 border-b border-slate-200 dark:border-[#27272a] bg-white/95 dark:bg-black/95 backdrop-blur-xl sticky top-0 z-30 px-2.5 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left Section: Hamburger Toggle & Search Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-w-md">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-[#111111] text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] hover:bg-slate-200 dark:hover:bg-[#1a1a1a] transition-all focus-accessible shadow-xs shrink-0"
          title={collapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
        >
          <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>

        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${role ? role : 'portal'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-[11px] sm:text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999] focus:ring-1 focus:ring-[#18A999] transition-all truncate"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Active Portal Role Tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
          <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{role} Portal</span>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all focus-accessible shadow-sm shrink-0"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F4C5C]" />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 sm:p-2 rounded-full bg-slate-100 dark:bg-black text-slate-700 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all relative shrink-0"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#18A999]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-18 sm:top-auto sm:mt-3 w-[calc(100vw-24px)] max-w-sm bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-2.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white font-newsreader">System Alerts</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono">
                  2 Active
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/triage/red-flags"
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 hover:border-rose-400 transition-all group"
                >
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>Red Flag Alert — View Triage Dashboard</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                    A critical symptom was detected during AI voice intake. Immediate review required.
                  </p>
                </Link>
                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>OCR Verification Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    Document OCR verification completed successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-[#27272a]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F4C5C] to-[#18A999] text-white flex items-center justify-center font-bold text-xs shadow-md">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white font-newsreader">{user?.name || 'User'}</span>
            <span className="text-[9px] text-slate-400 font-mono capitalize">{role}</span>
          </div>
          <button onClick={logout} className="p-1.5 ml-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
