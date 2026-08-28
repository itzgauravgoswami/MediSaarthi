"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Loader2, Sparkles } from 'lucide-react';

export default function VoiceOrb({ state = 'idle', onClick }) {
  // state: 'idle' | 'listening' | 'processing' | 'speaking'

  const getStateConfig = () => {
    switch (state) {
      case 'listening':
        return {
          icon: Mic,
          label: 'Listening...',
          sublabel: 'Please speak now in your preferred language',
          bgGradient: 'from-emerald-400 via-[#18A999] to-teal-600',
          pingColor: 'bg-emerald-400/40',
          pulseScale: [1, 1.25, 1],
        };
      case 'processing':
        return {
          icon: Loader2,
          label: 'Processing clinical intent...',
          sublabel: 'Structuring medical symptoms with Gemini AI',
          bgGradient: 'from-indigo-500 via-purple-500 to-[#18A999]',
          pingColor: 'bg-purple-400/40',
          pulseScale: [1, 1.1, 1],
        };
      case 'speaking':
        return {
          icon: Volume2,
          label: 'MediSaarthi Speaking...',
          sublabel: 'Listening to question audio',
          bgGradient: 'from-teal-400 via-cyan-500 to-[#18A999]',
          pingColor: 'bg-cyan-400/40',
          pulseScale: [1, 1.2, 1],
        };
      case 'idle':
      default:
        return {
          icon: Sparkles,
          label: 'Tap to Speak',
          sublabel: 'Press the microphone to begin your intake',
          bgGradient: 'from-[#18A999] via-teal-600 to-[#0D9488]',
          pingColor: 'bg-[#18A999]/30',
          pulseScale: [1, 1.05, 1],
        };
    }
  };

  const config = getStateConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Rings */}
        <motion.div
          animate={{ scale: config.pulseScale }}
          transition={{ repeat: Infinity, duration: state === 'listening' ? 1.5 : 3, ease: 'easeInOut' }}
          className={`absolute w-44 h-44 rounded-full ${config.pingColor} opacity-75 blur-md`}
        />
        <motion.div
          animate={{ scale: config.pulseScale }}
          transition={{ repeat: Infinity, duration: state === 'listening' ? 2 : 4, ease: 'easeInOut', delay: 0.2 }}
          className={`absolute w-56 h-56 rounded-full ${config.pingColor} opacity-40 blur-xl`}
        />

        {/* Central Orb Button */}
        <button
          onClick={onClick}
          className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr ${config.bgGradient} p-1 shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none`}
        >
          <div className="w-full h-full rounded-full bg-slate-900/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white">
            <Icon className={`w-12 h-12 ${state === 'processing' ? 'animate-spin' : ''}`} />
          </div>
        </button>
      </div>

      {/* State Text Label */}
      <div className="mt-8 text-center max-w-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {config.label}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {config.sublabel}
        </p>
      </div>
    </div>
  );
}
