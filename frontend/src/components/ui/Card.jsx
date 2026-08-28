"use client";

import React from "react";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 relative overflow-hidden ${
        hover ? "hover:border-[#18A999]/50 hover:shadow-teal-glow/20 hover:scale-[1.005]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "neutral", className = "" }) {
  const variants = {
    neutral: "bg-slate-100 dark:bg-black text-slate-700 dark:text-[#a1a1aa] border-slate-200 dark:border-[#27272a]",
    teal: "bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] border-[#18A999]/30 dark:border-[#27272a]",
    warning: "bg-amber-50 dark:bg-black text-amber-600 dark:text-amber-400 border-amber-200 dark:border-[#27272a]",
    danger: "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 animate-pulse",
    success: "bg-emerald-50 dark:bg-black text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-[#27272a]"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
