"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { getTranslation } from '@/locales/i18n';
import VoiceOrb from '@/components/patient/VoiceOrb';
import Button from '@/components/ui/Button';
import { SpeechManager } from '@/services/speechService';
import { Heart, Thermometer, Brain, Wind, ArrowRight } from 'lucide-react';

export default function PatientInterviewPage() {
  const router = useRouter();
  const { intakeState, setChiefComplaint, updateAnswer } = usePatientIntake();
  const lang = intakeState?.language || 'hi';

  const [voiceState, setVoiceState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [activeComplaint, setActiveComplaint] = useState(intakeState?.chiefComplaint || '');
  const [questionIndex, setQuestionIndex] = useState(0);

  const speechManagerRef = useRef(null);

  useEffect(() => {
    speechManagerRef.current = new SpeechManager(lang === 'hi' ? 'hi-IN' : 'en-IN');
  }, [lang]);

  const complaintWorkflows = {
    'Chest Pain': [
      { key: 'onset', question: lang === 'hi' ? 'दर्द कब शुरू हुआ था?' : 'When did the chest pain start?' },
      { key: 'location', question: lang === 'hi' ? 'दर्द सीने में किस जगह है? क्या हाथ में फैल रहा है?' : 'Where exact is the chest pain located? Does it radiate?' },
      { key: 'severity', question: lang === 'hi' ? '1 से 10 के पैमाने पर दर्द कितना तेज है?' : 'On a scale of 1 to 10, how severe is the pain?' },
      { key: 'breathlessness', question: lang === 'hi' ? 'क्या आपको सांस लेने में तकलीफ या पसीना आ रहा है?' : 'Are you experiencing shortness of breath or sweating?' }
    ],
    'Fever': [
      { key: 'onset', question: lang === 'hi' ? 'बुखार कितने दिनों से है?' : 'How many days have you had the fever?' },
      { key: 'temperature', question: lang === 'hi' ? 'क्या आपने तापमान नापा था?' : 'Did you measure your body temperature?' },
      { key: 'chills', question: lang === 'hi' ? 'क्या ठंड या कपकपी लग रही है?' : 'Are you experiencing chills or shivering?' }
    ]
  };

  const currentQuestions = complaintWorkflows[activeComplaint] || [
    { key: 'onset', question: lang === 'hi' ? 'आपकी मुख्य समस्या कब से शुरू हुई?' : 'When did your symptoms begin?' },
    { key: 'severity', question: lang === 'hi' ? 'यह समस्या कितनी गंभीर है?' : 'How severe are your symptoms?' }
  ];

  const handleOrbClick = () => {
    if (voiceState === 'listening') {
      speechManagerRef.current?.stopListening();
    } else {
      setVoiceState('listening');
      speechManagerRef.current?.startListening(
        (text) => {
          setTranscript(text);
        },
        (newState) => {
          setVoiceState(newState);
          if (newState === 'processing') {
            setTimeout(() => {
              handleVoiceResult(transcript || "Recorded symptom voice intake");
            }, 1200);
          }
        }
      );
    }
  };

  const handleSelectComplaint = (complaint) => {
    setActiveComplaint(complaint);
    setChiefComplaint(complaint);
    const initialQuestion = complaintWorkflows[complaint]?.[0]?.question || "Please describe your symptoms.";
    speakQuestion(initialQuestion);
  };

  const speakQuestion = (qText) => {
    setVoiceState('speaking');
    speechManagerRef.current?.speak(qText, () => {
      setVoiceState('idle');
    });
  };

  const handleVoiceResult = (text) => {
    if (!activeComplaint) {
      if (text.toLowerCase().includes('chest') || text.toLowerCase().includes('सीने')) {
        handleSelectComplaint('Chest Pain');
      } else {
        handleSelectComplaint('Fever');
      }
    } else {
      const qKey = currentQuestions[questionIndex]?.key || 'details';
      updateAnswer(qKey, text);
      if (questionIndex < currentQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
        speakQuestion(currentQuestions[questionIndex + 1].question);
      } else {
        setVoiceState('idle');
      }
    }
  };

  const handleNextStep = () => {
    router.push('/patient/documents');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
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

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative p-1 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#27272a]">
            <Image src="/logo/logo.png" alt="MediSaarthi" fill className="object-contain p-1" />
          </div>
          <span className="font-extrabold text-lg text-[#0F4C5C] dark:text-white font-newsreader">Medi<span className="text-[#18A999]">Saarthi</span></span>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-[#0F4C5C]/10 dark:bg-black text-[#18A999] rounded-full border border-[#18A999]/30 dark:border-[#27272a]">
          Step 3 of 4: AI Voice Intake
        </span>
      </header>

      {/* Main Voice Workspace */}
      <main className="max-w-3xl w-full mx-auto my-6 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight font-newsreader">
            {activeComplaint ? `${activeComplaint} Intake` : getTranslation(lang, 'voiceInterviewTitle')}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-[#a1a1aa]">
            {activeComplaint
              ? currentQuestions[questionIndex]?.question
              : getTranslation(lang, 'voiceInterviewSubtitle')}
          </p>
        </div>

        {/* Dynamic Voice Orb */}
        <VoiceOrb state={voiceState} onClick={handleOrbClick} />

        {/* Transcript Box */}
        {transcript && (
          <div className="w-full p-4 rounded-2xl bg-[#0F4C5C]/10 dark:bg-black border border-[#18A999]/40 text-xs md:text-sm text-[#18A999] font-medium italic">
            "{transcript}"
          </div>
        )}

        {/* Touch Complaint Options */}
        {!activeComplaint && (
          <div className="w-full space-y-3 pt-4 border-t border-slate-100 dark:border-[#27272a]">
            <p className="text-[11px] font-bold text-[#18A999] uppercase tracking-wider">
              {getTranslation(lang, 'chiefComplaints')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleSelectComplaint('Chest Pain')}
                className="p-4 rounded-2xl border border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold text-xs flex flex-col items-center gap-2 transition-all font-newsreader"
              >
                <Heart className="w-6 h-6 text-rose-500 animate-pulse" />
                <span>{getTranslation(lang, 'chestPain')}</span>
              </button>

              <button
                onClick={() => handleSelectComplaint('Fever')}
                className="p-4 rounded-2xl border border-amber-900/50 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex flex-col items-center gap-2 transition-all font-newsreader"
              >
                <Thermometer className="w-6 h-6 text-amber-500" />
                <span>{getTranslation(lang, 'fever')}</span>
              </button>

              <button
                onClick={() => handleSelectComplaint('Headache')}
                className="p-4 rounded-2xl border border-purple-900/50 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 font-bold text-xs flex flex-col items-center gap-2 transition-all font-newsreader"
              >
                <Brain className="w-6 h-6 text-purple-500" />
                <span>{getTranslation(lang, 'headache')}</span>
              </button>

              <button
                onClick={() => handleSelectComplaint('Breathlessness')}
                className="p-4 rounded-2xl border border-cyan-900/50 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 font-bold text-xs flex flex-col items-center gap-2 transition-all font-newsreader"
              >
                <Wind className="w-6 h-6 text-cyan-500" />
                <span>{getTranslation(lang, 'breathlessness')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full pt-4 flex justify-between items-center border-t border-slate-100 dark:border-[#27272a]">
          <span className="text-[11px] text-slate-400">Speech Recognition Engine Ready</span>
          <Button size="lg" onClick={handleNextStep} icon={ArrowRight} iconPosition="right">
            Proceed to Upload
          </Button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 relative z-10">
        MediSaarthi Clinical Engine • Patient Assisted Intake
      </footer>
    </div>
  );
}
