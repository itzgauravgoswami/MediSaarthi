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
    <header className="h-20 border-b border-slate-200 dark:border-[#27272a] bg-white/95 dark:bg-black/95 backdrop-blur-xl sticky top-0 z-30 px-3 sm:px-4 md:px-8 flex items-center justify-between gap-3 sm:gap-4">
      {/* Left Section: Hamburger Toggle & Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#111111] text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] hover:bg-slate-200 dark:hover:bg-[#1a1a1a] transition-all focus-accessible shadow-xs shrink-0"
          title={collapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search in ${role ? role.toUpperCase() : 'PORTAL'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999] focus:ring-1 focus:ring-[#18A999] transition-all"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Active Portal Role Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
          <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{role} Portal</span>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-black text-[#18A999] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all focus-accessible shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0F4C5C]" />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-black text-slate-700 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-all relative"
          >
            <Bell className="w-4 h-4 text-[#18A999]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-3xl shadow-2xl p-5 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white font-newsreader">System Alerts</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  2 Active
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/triage/red-flags"
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 rounded-2xl bg-rose-950/40 border border-rose-900/50 hover:border-rose-500 transition-all"
                >
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Red Flag: Rahul Kumar (#102)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Exertional substernal chest pain reported via voice intake.
                  </p>
                </Link>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>OCR Verification Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Prescription DOC-101 verified with 94% accuracy.</p>
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
