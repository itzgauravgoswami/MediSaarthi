"use client";

import React from "react";

export default function Button({
  children,
  variant = "primary", // primary | secondary | outline | danger | ghost
  size = "md", // sm | md | lg | xl
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus-accessible disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizes = {
    xs: "px-2.5 py-1 text-[11px] gap-1 rounded-xl",
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2",
    lg: "px-5 py-2.5 text-sm gap-2.5 shadow-teal-glow",
    xl: "px-7 py-3.5 text-base gap-3 shadow-teal-glow"
  };

  const variants = {
    primary: "bg-gradient-to-r from-[#0F4C5C] via-[#126478] to-[#18A999] hover:opacity-95 text-white shadow-teal-glow border border-[#18A999]/30",
    secondary: "bg-slate-100 dark:bg-[#111111] hover:bg-slate-200 dark:hover:bg-[#1a1a1a] text-slate-900 dark:text-white border border-slate-200 dark:border-[#27272a]",
    outline: "border border-slate-300 dark:border-[#27272a] bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#111111]",
    danger: "bg-gradient-to-r from-rose-600 to-rose-700 hover:opacity-95 text-white shadow-md border border-rose-500/30",
    ghost: "bg-transparent text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-[#111111]"
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
