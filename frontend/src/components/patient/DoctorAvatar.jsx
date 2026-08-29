"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { UserCheck, Stethoscope, Heart, Brain, Activity, Leaf, Shield, User } from 'lucide-react';

export default function DoctorAvatar({ 
  src, 
  name = 'Doctor', 
  specialty = '', 
  className = '', 
  size = 'md', // sm (w-12 h-12) | md (w-16 h-16) | lg (w-20 h-20)
  showStatus = true 
}) {
  const [imageError, setImageError] = useState(false);

  // Extract initials (e.g. "Dr. Sameer Malhotra" -> "SM", "Vaidya Devendra Triguna" -> "DT")
  const getInitials = (fullName) => {
    const clean = fullName.replace(/^(Dr\.|Vaidya|Prof\.|Dr|Vd)\s+/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (clean.slice(0, 2) || 'DR').toUpperCase();
  };

  const initials = getInitials(name);

  // Pick deterministic vibrant clinical gradient based on doctor name
  const gradients = [
    'from-[#0F4C5C] to-[#18A999]',
    'from-emerald-700 to-teal-500',
    'from-cyan-700 to-blue-600',
    'from-indigo-700 to-purple-600',
    'from-teal-800 to-emerald-600',
    'from-sky-700 to-teal-600'
  ];

  const charSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const selectedGradient = gradients[charSum % gradients.length];

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-[#27272a] select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {!imageError && src ? (
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          sizes="90px"
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-tr ${selectedGradient} text-white flex flex-col items-center justify-center font-bold tracking-wider relative`}>
          <div className="flex items-center justify-center">
            <span className="font-mono text-sm sm:text-base font-extrabold">{initials}</span>
          </div>
          <span className="text-[8px] opacity-80 uppercase tracking-tighter">MD</span>
        </div>
      )}

      {/* Online / OPD Status Indicator */}
      {showStatus && (
        <span 
          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-black shadow-xs z-10" 
          title="Available for OPD" 
        />
      )}
    </div>
  );
}
