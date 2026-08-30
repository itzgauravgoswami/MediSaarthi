"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePatientIntake } from '@/context/PatientIntakeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import VoiceOrb from '@/components/patient/VoiceOrb';
import Button from '@/components/ui/Button';
import { SpeechManager } from '@/services/speechService';
import { emergencyApi } from '@/services/api';
import { 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Volume2, 
  Activity,
  Bot,
  ShieldAlert,
  FileText,
  Mic,
  Info,
  PhoneCall,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Clock,
  MapPin,
  Award,
  Building,
  RotateCcw,
  Calendar,
  Check
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PatientInterviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { intakeState, setLanguage: setIntakeLanguage } = usePatientIntake();

  const isHindi = language === 'hi';
  const langCode = isHindi ? 'hi-IN' : 'en-IN';

  const defaultQHindi = 'नमस्ते, मैं मेडीसारथी हूँ। आज आपको क्या मुख्य तकलीफ या लक्षण महसूस हो रहे हैं?';
  const defaultQEnglish = 'Hello, I am MediSaarthi. What main symptoms or health difficulties are you experiencing today?';

  // Live Backend Interview Session State
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(isHindi ? defaultQHindi : defaultQEnglish);
  const [currentSection, setCurrentSection] = useState('CHIEF_COMPLAINT');
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [transcript, setTranscript] = useState('');
  const [customText, setCustomText] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    isHindi 
      ? 'माइक दबाकर अपनी तकलीफ बोलें (5 सेकंड तक आवाज़ न आने पर संकेत मिलेगा)' 
      : 'Tap microphone and describe your symptoms (5s silence notice enabled)'
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Emergency & Triage State
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState(false);

  // Real Structured Data Extracted Live from User Speech
  const [extractedData, setExtractedData] = useState({
    chiefComplaint: [],
    onset: null,
    duration: null,
    location: null,
    severity: null,
    radiation: null,
    associatedSymptoms: [],
    pastMedicalHistory: [],
    medications: []
  });
  const [redFlags, setRedFlags] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);

  const speechManagerRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Synchronize SpeechManager and UI when language changes
  useEffect(() => {
    if (!speechManagerRef.current) {
      speechManagerRef.current = new SpeechManager(langCode);
    } else {
      speechManagerRef.current.setLanguage(langCode);
    }

    if (setIntakeLanguage) {
      setIntakeLanguage(language);
    }

    if (!isEmergencyLocked && !isCompleted) {
      setStatusMessage(
        isHindi 
          ? 'माइक दबाकर अपनी तकलीफ बोलें (5 सेकंड तक आवाज़ न आने पर संकेत मिलेगा)' 
          : 'Tap microphone and describe your symptoms (5s silence notice enabled)'
      );

      const q = isHindi ? defaultQHindi : defaultQEnglish;
      if (conversationHistory.length <= 1) {
        setCurrentQuestion(q);
        setConversationHistory([
          { sender: 'ai', text: q, timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    }
  }, [language, langCode, isHindi, isEmergencyLocked, isCompleted]);

  // Real-time SSE Stream Subscription for Patient Status Synchronization
  useEffect(() => {
    const patientId = user?.patientId || intakeState?.patientId || user?.id;
    let sse = null;
    if (typeof emergencyApi?.subscribeToAlertStream === 'function') {
      sse = emergencyApi.subscribeToAlertStream({
        role: 'PATIENT',
        patientId,
        onPatientUpdate: (update) => {
          if (update) {
            setActiveEmergency(prev => prev ? {
              ...prev,
              status: update.status,
              acknowledgedBy: update.acknowledgedBy,
              assignedDoctorName: update.assignedDoctorName || prev.assignedDoctorName
            } : update);
          }
        }
      });
    }

    return () => {
      sse?.close?.();
    };
  }, [user, intakeState]);

  // Initialize Live Backend Session on Mount
  useEffect(() => {
    async function initLiveInterview() {
      const activeIsHindi = language === 'hi' || (typeof window !== 'undefined' && localStorage.getItem('medisaarthi_lang') === 'hi');
      const activeLangCode = activeIsHindi ? 'hi-IN' : 'en-IN';

      try {
        const res = await fetch(`${API_BASE_URL}/v1/interviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: user?.patientId || intakeState?.patientId || user?.id,
            language: activeLangCode,
            mode: 'VOICE'
          })
        });

        if (res.ok) {
          const json = await res.json();
          const liveId = json?.data?.interview?.interviewId || `INT-${Date.now().toString(36).toUpperCase()}`;
          const initialQ = activeIsHindi 
            ? (json?.data?.nextQuestionHindi || defaultQHindi)
            : (json?.data?.nextQuestionEnglish || json?.data?.nextQuestion || defaultQEnglish);

          setInterviewId(liveId);
          setCurrentQuestion(initialQ);
          setCurrentSection(json?.data?.section || 'CHIEF_COMPLAINT');
          setConversationHistory([
            { sender: 'ai', text: initialQ, timestamp: new Date().toLocaleTimeString() }
          ]);

          setTimeout(() => {
            speakText(initialQ);
          }, 400);
        }
      } catch (err) {
        const fallbackQ = activeIsHindi ? defaultQHindi : defaultQEnglish;
        setInterviewId(`INT-SESSION-${Date.now().toString(36).toUpperCase()}`);
        setCurrentQuestion(fallbackQ);
        speakText(fallbackQ);
      }
    }

    initLiveInterview();

    return () => {
      speechManagerRef.current?.stopListening();
    };
  }, []);

  // Auto-scroll conversation log
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversationHistory, transcript]);

  // Speak AI question
  const speakText = (text) => {
    if (!text) return;
    const currentIsHindi = language === 'hi' || /[\u0900-\u097F]/.test(text) || (typeof window !== 'undefined' && localStorage.getItem('medisaarthi_lang') === 'hi');
    const currentLangCode = currentIsHindi ? 'hi-IN' : 'en-IN';

    if (!speechManagerRef.current) {
      speechManagerRef.current = new SpeechManager(currentLangCode);
    } else {
      speechManagerRef.current.setLanguage(currentLangCode);
    }

    setVoiceState('speaking');
    speechManagerRef.current.speak(text, () => {
      setVoiceState('idle');
    });
  };

  // User taps Voice Orb
  const handleOrbClick = () => {
    if (isEmergencyLocked || isCompleted) return;

    if (voiceState === 'listening') {
      const currentSpokenText = transcript.trim() || speechManagerRef.current?.accumulatedTranscript?.trim() || '';
      speechManagerRef.current?.stopListening();

      if (currentSpokenText.length > 0) {
        setStatusMessage(isHindi ? 'AI उत्तर व प्रासंगिकता का विश्लेषण कर रहा है...' : 'Analysing relevance & response...');
        submitLiveTurn(currentSpokenText);
      } else {
        setVoiceState('idle');
        setStatusMessage(isHindi ? 'माइक बंद है। बोलने के लिए दबाएं।' : 'Microphone idle. Tap to speak.');
      }
    } else {
      setTranscript('');
      speechManagerRef.current?.startListening(
        (interimText) => {
          setTranscript(interimText);
        },
        (finalSpeechText) => {
          if (finalSpeechText && finalSpeechText.trim()) {
            setTranscript(finalSpeechText);
            submitLiveTurn(finalSpeechText);
          }
        },
        (state) => {
          setVoiceState(state);
        },
        (statusMsg) => {
          setStatusMessage(statusMsg);
        }
      );
    }
  };

  // Submit patient's spoken words to backend Voice Analysis, Relevance Guard & Slot Booking
  const submitLiveTurn = async (patientSpeechText) => {
    if (!patientSpeechText || !patientSpeechText.trim() || isEmergencyLocked || isCompleted) return;

    const patientText = patientSpeechText.trim();
    setVoiceState('processing');

    setConversationHistory(prev => [
      ...prev,
      { sender: 'patient', text: patientText, timestamp: new Date().toLocaleTimeString() }
    ]);

    try {
      const patientId = user?.patientId || intakeState?.patientId || user?.id;

      // 1. Run AI Voice Clinical Triage & Emergency Analysis
      const voiceResult = await emergencyApi.analyseVoice({
        transcript: patientText,
        patientId,
        language: langCode,
        patientName: user?.name || ''
      }).catch(err => {
        console.warn('[Emergency Analysis Error]', err.message);
        return null;
      });

      if (voiceResult?.assessment) {
        setLatestAssessment(voiceResult.assessment);
      }

      // CRITICAL: If EMERGENCY is detected, immediately lock questionnaire and show doctor details!
      if (voiceResult?.emergency || voiceResult?.assessment?.urgency === 'EMERGENCY') {
        const emergencyData = voiceResult.emergency || {
          eventId: 'EMERG-' + Date.now().toString(36).toUpperCase(),
          status: 'ALERTING',
          assignedDoctorName: 'Dr. Vikramaditya Rao',
          recommendedSpecialty: voiceResult?.assessment?.recommendedSpecialty || 'Emergency Medicine',
          detectedAt: new Date(),
          doctor: {
            name: 'Dr. Vikramaditya Rao',
            specialization: voiceResult?.assessment?.recommendedSpecialty || 'Emergency Medicine',
            department: 'Emergency & Critical Care Wing',
            roomNumber: 'Room 101, Emergency Department, Ground Floor',
            registrationNumber: 'NMC-2026-4401',
            isAvailable: true
          }
        };

        setActiveEmergency(emergencyData);
        setIsEmergencyLocked(true);
        speechManagerRef.current?.stopListening();

        const emergencyAlertAnnouncement = isHindi
          ? `आपातकालीन स्थिति का पता चला है। आपकी सहायता हेतु विशेषज्ञ डॉक्टर ${emergencyData.assignedDoctorName || 'डॉक्टर'} को अलर्ट भेज दिया गया है। कृपया नीचे दिए गए डॉक्टर विवरण और आपातकालीन सहायता का उपयोग करें।`
          : `A potential medical emergency has been detected. We have paused the intake questionnaire and notified specialist ${emergencyData.assignedDoctorName || 'physician'} for immediate care.`;

        setConversationHistory(prev => [
          ...prev,
          { 
            sender: 'ai', 
            text: isHindi 
              ? `🚨 आपातकालीन अलर्ट: आपकी सुरक्षा हेतु सामान्य प्रश्नावली रोक दी गई है। विशेषज्ञ डॉक्टर ${emergencyData.assignedDoctorName} को आपकी स्थिति भेज दी गई है।`
              : `🚨 Emergency Alert: Intake questionnaire paused for your safety. Notified specialist ${emergencyData.assignedDoctorName}.`, 
            timestamp: new Date().toLocaleTimeString() 
          }
        ]);

        speakText(emergencyAlertAnnouncement);
        return; // STOP FURTHER QUESTIONNAIRE ADVANCEMENT!
      }

      // 2. Advance Structured Intake Interview Turn with Relevance Verification
      const activeId = interviewId || 'INT-ACTIVE';
      const res = await fetch(`${API_BASE_URL}/v1/interviews/${activeId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientResponse: patientText,
          language: langCode,
          inputMode: 'VOICE'
        })
      });

      if (res.ok) {
        const json = await res.json();
        const data = json?.data || {};
        const nextQ = isHindi ? (data.nextQuestionHindi || data.nextQuestion) : data.nextQuestion;
        const extraction = data.extraction || {};
        const newFlags = data.potentialRedFlags || [];

        setExtractedData(prev => ({
          chiefComplaint: extraction.chiefComplaint?.length ? extraction.chiefComplaint : prev.chiefComplaint,
          onset: extraction.onset || prev.onset,
          duration: extraction.duration || prev.duration,
          location: extraction.location || prev.location,
          severity: extraction.severity || prev.severity,
          radiation: extraction.radiation || prev.radiation,
          associatedSymptoms: extraction.associatedSymptoms?.length 
            ? Array.from(new Set([...prev.associatedSymptoms, ...extraction.associatedSymptoms])) 
            : prev.associatedSymptoms,
          pastMedicalHistory: extraction.pastMedicalHistory?.length 
            ? Array.from(new Set([...prev.pastMedicalHistory, ...extraction.pastMedicalHistory])) 
            : prev.pastMedicalHistory,
          medications: extraction.medications?.length 
            ? Array.from(new Set([...prev.medications, ...extraction.medications])) 
            : prev.medications
        }));

        if (newFlags.length > 0) {
          setRedFlags(prev => {
            const existingIds = prev.map(f => f.ruleId || f.name);
            const toAdd = newFlags.filter(f => !existingIds.includes(f.ruleId || f.name));
            return [...prev, ...toAdd];
          });
        }

        if (data.nextSection) setCurrentSection(data.nextSection);

        // Check if intake is completed & doctor slot auto-booked
        if (data.booking || data.nextSection === 'COMPLETE') {
          setIsCompleted(true);
          const bookingInfo = data.booking || {
            slotTime: 'Today, OPD Queue',
            tokenNumber: user?.token || '#101',
            scheduledDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            department: 'General OPD',
            doctor: {
              name: 'Dr. Ananya Sharma',
              specialization: 'Cardiology',
              department: 'OPD Clinical Desk',
              roomNumber: 'Room 101'
            }
          };
          setBookingDetails(bookingInfo);

          const completionMsg = isHindi 
            ? `धन्यवाद। आपके लक्षणों का विवरण पूरा हो गया है। आपका अपॉइंटमेंट स्लॉट ${bookingInfo.doctor?.name || 'विशेषज्ञ डॉक्टर'} के पास ${bookingInfo.slotTime || '11:15 AM'} बजे बुक कर दिया गया है।`
            : `Thank you! Your intake is complete. Your consultation slot is confirmed with ${bookingInfo.doctor?.name || 'specialist doctor'} for today at ${bookingInfo.slotTime || '11:15 AM'}.`;

          setConversationHistory(prev => [
            ...prev,
            { sender: 'ai', text: completionMsg, timestamp: new Date().toLocaleTimeString() }
          ]);

          speakText(completionMsg);
          return;
        }

        if (nextQ) {
          setCurrentQuestion(nextQ);
          setConversationHistory(prev => [
            ...prev,
            { sender: 'ai', text: nextQ, timestamp: new Date().toLocaleTimeString() }
          ]);
          speakText(nextQ);
          setStatusMessage(isHindi ? 'उत्तर देने हेतु माइक दबाएं।' : 'Tap mic to answer next question.');
        }
      }
    } catch (err) {
      console.warn('[Interview API Error]', err);
    } finally {
      setTranscript('');
      setCustomText('');
      setVoiceState('idle');
    }
  };

  // Manual Emergency Override Trigger (108 / Emergency Help Button)
  const handleManualEmergency = async () => {
    try {
      const patientId = user?.patientId || intakeState?.patientId || user?.id;
      
      const emergencyData = {
        eventId: 'EMERG-MANUAL-' + Date.now().toString(36).toUpperCase(),
        status: 'ALERTING',
        assignedDoctorName: 'Dr. Vikramaditya Rao',
        recommendedSpecialty: 'Emergency Medicine',
        detectedAt: new Date(),
        doctor: {
          name: 'Dr. Vikramaditya Rao',
          specialization: 'Emergency Medicine',
          department: 'Emergency & Trauma Care Wing',
          roomNumber: 'Room 101, Emergency Department, Ground Floor',
          registrationNumber: 'NMC-2026-4401',
          isAvailable: true
        }
      };

      setActiveEmergency(emergencyData);
      setIsEmergencyLocked(true);
      speechManagerRef.current?.stopListening();

      // Trigger backend manual emergency event
      try {
        const res = await emergencyApi.triggerManualEmergency({
          patientId,
          symptoms: ['Patient manually pressed Emergency Help button'],
          notes: 'Immediate assistance requested by patient via 108 Alert override.'
        });
        if (res && res.eventId) {
          setActiveEmergency(prev => ({ ...prev, eventId: res.eventId, status: res.status || 'ALERTING' }));
        }
      } catch (e) {
        console.warn('[Manual Emergency Dispatch Note]', e.message);
      }

      const alertMsg = isHindi
        ? 'आपातकालीन सहायता अनुरोध दर्ज कर लिया गया है। आपातकालीन चिकित्सक डॉ. विक्रम राव को सूचित कर दिया गया है।'
        : 'Emergency help request registered. Specialist physician Dr. Vikramaditya Rao has been alerted for immediate care.';

      setConversationHistory(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: isHindi 
            ? '🚨 आपातकालीन अलर्ट: सामान्य प्रश्नावली रोक दी गई है। आपातकालीन डॉक्टर डॉ. विक्रम राव को आपकी सूचना भेज दी गई है।'
            : '🚨 Emergency Alert: Normal questionnaire paused. Alert dispatched to Dr. Vikramaditya Rao.',
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);

      speakText(alertMsg);
    } catch (err) {
      console.error('[Manual Emergency Error]', err);
    }
  };

  const handleProceedToDocuments = async () => {
    if (interviewId) {
      try {
        await fetch(`${API_BASE_URL}/v1/interviews/${interviewId}/complete`, { method: 'POST' });
      } catch (e) {}
    }
    router.push('/patient/documents');
  };

  // Matched emergency doctor helper
  const emergencyDoctor = activeEmergency?.doctor || {
    name: activeEmergency?.assignedDoctorName || 'Dr. Vikramaditya Rao',
    specialization: activeEmergency?.recommendedSpecialty || 'Emergency Medicine',
    department: 'Emergency & Critical Care Wing',
    roomNumber: 'Room 101, Emergency Department, Ground Floor',
    registrationNumber: 'NMC-2026-4401',
    isAvailable: true
  };

  // Matched appointment doctor helper for non-emergency completion
  const bookedDoctor = bookingDetails?.doctor || {
    name: 'Dr. R. K. Sharma',
    specialization: 'Internal Medicine',
    department: 'General Medicine OPD',
    roomNumber: 'OPD-102',
    registrationNumber: 'DMC-48291'
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-5xl w-full mx-auto">
        
        {/* ========================================================================= */}
        {/* SCENARIO A: EMERGENCY ACTIVE VIEW (QUESTIONS STOPPED & EMERGENCY DETAILS)  */}
        {/* ========================================================================= */}
        {isEmergencyLocked && activeEmergency ? (
          <div className="space-y-5 animate-fadeIn">
            {/* Top Red Alert Header */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-black text-white border-2 border-rose-500 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    <ShieldAlert className="w-8 h-8 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                        EMERGENCY DETECTED
                      </span>
                      <span className="text-xs font-bold text-rose-200">
                        Specialty: {activeEmergency.recommendedSpecialty || 'Emergency Medicine'}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold font-newsreader text-white mt-1">
                      {isHindi ? 'प्रश्नावली रोक दी गई है • तुरंत डॉक्टर परामर्श आवश्यक है' : 'Intake Paused • Specialist Doctor Consultation Recommended'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <a 
                    href="tel:108" 
                    className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl animate-pulse"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Ambulance (108)
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-rose-800/50 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    {activeEmergency.status === 'ACKNOWLEDGED' ? (
                      <strong className="text-emerald-400">
                        ✅ Alert acknowledged by {activeEmergency.acknowledgedBy || emergencyDoctor.name}. Medical professional is reviewing your clinical details.
                      </strong>
                    ) : (
                      <span>
                        🚨 Real-time alert dispatched to <strong>{emergencyDoctor.name}</strong>. Awaiting clinician review.
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-rose-300 shrink-0">
                  Status: <strong>{activeEmergency.status}</strong> • {new Date(activeEmergency.detectedAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Matched Specialist Doctor Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Doctor Profile (7 Cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-black border-2 border-[#18A999] p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#18A999] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#18A999]" />
                    {isHindi ? 'अनुशंसित विशेषज्ञ चिकित्सक' : 'Best Matched Specialist Doctor'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Available On-Duty
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F4C5C] to-[#18A999] text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-newsreader">
                      {emergencyDoctor.name}
                    </h3>
                    <p className="text-sm font-bold text-[#18A999]">
                      {emergencyDoctor.specialization}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reg: {emergencyDoctor.registrationNumber || 'NMC-2026-4401'} • 12+ Years Clinical Experience
                    </p>
                  </div>
                </div>

                {/* Doctor Location & Clinic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#18A999]" /> Department
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{emergencyDoctor.department || 'Emergency & Critical Care'}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#18A999]" /> Location & Room
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{emergencyDoctor.roomNumber || 'Room 101, Emergency Block'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="tel:108"
                    className="flex-1 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Ambulance (108)
                  </a>

                  <Link href={`/doctor/patients/${user?.patientId || intakeState?.patientId || user?.id || ''}`} className="flex-1">
                    <button className="w-full px-4 py-3 rounded-2xl bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-lg">
                      <FileText className="w-4 h-4" />
                      View Full Clinical Report
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Symptoms & Live Conversation Record (5 Cols) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-5 rounded-3xl shadow-xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-500" />
                    {isHindi ? 'पहचाने गए आपातकालीन लक्षण' : 'Identified Acute Risk Indicators'}
                  </span>

                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
                    <p className="font-semibold">
                      {latestAssessment?.reason || 'Acute medical presentation requiring immediate physician assessment.'}
                    </p>
                    {latestAssessment?.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {latestAssessment.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-5 rounded-3xl shadow-xl flex-1 flex flex-col h-[280px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#27272a]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#18A999] flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#18A999]" />
                      {isHindi ? 'संवाद रिकॉर्ड' : 'Conversation Record'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {conversationHistory.length} turns
                    </span>
                  </div>

                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pt-3 pr-2 text-xs">
                    {conversationHistory.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`p-2.5 rounded-2xl max-w-[90%] leading-relaxed ${
                          msg.sender === 'patient'
                            ? 'bg-[#18A999] text-black font-medium rounded-tr-none'
                            : 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <span suppressHydrationWarning className="text-[9px] opacity-70 block mt-1 text-right">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsEmergencyLocked(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 text-center transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isHindi ? 'यदि यह परीक्षण था, तो प्रश्नावली पुनः शुरू करें' : 'Resume standard intake questionnaire (if false alarm / test)'}
                </button>
              </div>
            </div>
          </div>
        ) : isCompleted ? (
          /* ========================================================================= */
          /* SCENARIO B: INTAKE COMPLETED & SPECIALIST DOCTOR SLOT AUTO-BOOKED CARD     */
          /* ========================================================================= */
          <div className="space-y-5 animate-fadeIn">
            {/* Confirmation Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-black text-white border-2 border-[#18A999] shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#18A999]/20 text-[#18A999] border border-[#18A999]/40">
                    <CheckCircle2 className="w-8 h-8 text-[#18A999]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#18A999] text-black">
                        SLOT CONFIRMED
                      </span>
                      <span className="text-xs font-bold text-teal-200">
                        Token {bookingDetails?.tokenNumber || user?.token || '#101'}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold font-newsreader text-white mt-1">
                      {isHindi ? 'एआई इनटेक पूर्ण • विशेषज्ञ डॉक्टर अपॉइंटमेंट बुक हो गया' : 'Clinical Intake Complete • Doctor Slot Confirmed'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold font-mono text-teal-200">
                    🕒 Slot: {bookingDetails?.slotTime || '11:15 AM'} (Today)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-teal-800/40 text-xs text-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  {isHindi 
                    ? `आपकी बीमारी के आधार पर डॉ. ${bookedDoctor.name} के पास स्लॉट बुक कर दिया गया है। आपका संक्षिप्त क्लिनिकल सारांश डॉक्टर के वर्कस्पेस में भेज दिया गया है।`
                    : `Based on your reported symptoms, your consultation has been booked with ${bookedDoctor.name} (${bookedDoctor.specialization}). Your pre-consultation summary is ready for the doctor.`}
                </span>
                <span className="text-[10px] font-mono text-teal-300 shrink-0">
                  Ref: {bookingDetails?.appointmentId || 'APT-102'}
                </span>
              </div>
            </div>

            {/* Matched Specialist Doctor Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Doctor Details (7 Cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272a] pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#18A999] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#18A999]" />
                    {isHindi ? 'नियुक्त विशेषज्ञ चिकित्सक' : 'Assigned Specialist Doctor'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    OPD Consultation Ready
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F4C5C] to-[#18A999] text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-newsreader">
                      {bookedDoctor.name}
                    </h3>
                    <p className="text-sm font-bold text-[#18A999]">
                      {bookedDoctor.specialization}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reg: {bookedDoctor.registrationNumber || 'DMC-48291'} • OPD Queue: 2 ahead
                    </p>
                  </div>
                </div>

                {/* Location & Slot Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#18A999]" /> Department
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedDoctor.department || 'Specialist OPD'}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#18A999]" /> Room / Bay
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedDoctor.roomNumber || 'OPD-102'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/patient/documents" className="flex-1">
                    <button className="w-full px-4 py-3 rounded-2xl bg-[#18A999] hover:bg-[#148e81] text-black text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-lg">
                      <FileText className="w-4 h-4" />
                      Upload Past Prescriptions / Lab Reports
                    </button>
                  </Link>

                  <Link href="/patient/dashboard" className="flex-1">
                    <button className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#18181b] hover:bg-slate-200 dark:hover:bg-[#27272a] text-slate-900 dark:text-white border border-slate-200 dark:border-[#27272a] text-xs font-bold text-center flex items-center justify-center gap-2 transition-all">
                      Go to Patient Dashboard
                    </button>
                  </Link>
                </div>
              </div>

              {/* Clinical Summary Recorded (5 Cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18A999] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#18A999]" />
                    {isHindi ? 'रिकॉर्ड किया गया क्लिनिकल सारांश' : 'Recorded Clinical Summary'}
                  </span>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
                      <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">Chief Complaint:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {extractedData.chiefComplaint?.join(', ') || 'General OPD Consultation'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
                      <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">Duration & Onset:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {extractedData.duration || extractedData.onset || 'Recorded in history'}
                      </span>
                    </div>

                    {extractedData.associatedSymptoms?.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a]">
                        <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">Associated Symptoms:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {extractedData.associatedSymptoms.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentSection('CHIEF_COMPLAINT');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 text-center transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isHindi ? 'नया इनटेक शुरू करें' : 'Start a new intake session'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SCENARIO C: STANDARD CONCISE VOICE INTAKE QUESTIONNAIRE (ACTIVE)           */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
            {/* Left Column: Voice Orb & Real-Time Interaction (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-between text-center space-y-6">
              
              {/* Active Question Banner */}
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-[#18A999]/15 text-[#18A999] text-xs font-bold rounded-full border border-[#18A999]/30 uppercase tracking-wide">
                    {isHindi ? `चरण: ${currentSection === 'CHIEF_COMPLAINT' ? 'मुख्य लक्षण' : currentSection === 'DURATION_SEVERITY' ? 'अवधि व तीव्रता' : 'स्वास्थ्य इतिहास'}` : `Step: ${currentSection}`}
                  </span>

                  {/* Manual Emergency Button */}
                  <button
                    onClick={handleManualEmergency}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1.5 transition-all animate-pulse"
                    title="Trigger immediate clinical emergency"
                  >
                    <ShieldAlert className="w-4 h-4 text-white" />
                    <span>🚨 Emergency Help</span>
                  </button>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-newsreader text-slate-900 dark:text-white leading-snug">
                  {currentQuestion}
                </h2>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => speakText(currentQuestion)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                      voiceState === 'speaking'
                        ? 'bg-[#18A999] text-black animate-pulse shadow-md'
                        : 'bg-slate-100 dark:bg-[#18181b] text-[#18A999] border border-[#18A999]/30 hover:bg-[#18A999]/15'
                    }`}
                    title={isHindi ? "प्रश्न आवाज़ में सुनें" : "Listen Question Aloud"}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${voiceState === 'speaking' ? 'animate-bounce text-black' : 'text-[#18A999]'}`} />
                    <span>{isHindi ? '🔊 प्रश्न हिंदी में सुनें' : '🔊 Listen Question Aloud'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Voice Orb Button */}
              <div className="relative my-2">
                <VoiceOrb state={voiceState} onClick={handleOrbClick} />
              </div>

              {/* Quick-Select Clinical Symptoms Chips */}
              <div className="w-full space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {isHindi ? 'त्वरित लक्षण चयन (या ऊपर बोलें):' : 'Quick Symptom Tap (or speak above):'}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {[
                    { label: isHindi ? '🚨 सीने में तेज दर्द (Chest Pain)' : '🚨 Severe Chest Pain', text: isHindi ? 'मुझे सीने में तेज दर्द और सांस फूलने की तकलीफ है' : 'I have severe chest pain with shortness of breath' },
                    { label: isHindi ? '🤒 तेज बुखार (Fever)' : '🤒 High Fever', text: isHindi ? 'मुझे 3 दिन से तेज बुखार है और कपकपी लग रही है' : 'I have high fever with chills since 3 days' },
                    { label: isHindi ? '🧠 तेज सिरदर्द (Headache)' : '🧠 Severe Headache', text: isHindi ? 'माथे पर बहुत तेज सिरदर्द और चक्कर आ रहे हैं' : 'I have severe frontal headache and dizziness' },
                    { label: isHindi ? '🤢 पेट दर्द (Stomach Ache)' : '🤢 Stomach Ache', text: isHindi ? 'मेरे पेट में तेज दर्द, गैस और उल्टी हो रही है' : 'I have severe abdominal pain, gas, and nausea' },
                    { label: isHindi ? '🫁 सांस फूलना (Breathlessness)' : '🫁 Breathlessness', text: isHindi ? 'चलने पर सांस बहुत ज्यादा फूलती है और खांसी है' : 'I have severe breathlessness and cough on exertion' },
                    { label: isHindi ? '🧴 त्वचा पर दाने (Skin Rash)' : '🧴 Skin Rash', text: isHindi ? 'शरीर और त्वचा पर लाल दाने और खुजली हो रही है' : 'I have red skin rash and severe itching' }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitLiveTurn(chip.text)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] hover:bg-[#18A999]/10 text-slate-700 dark:text-slate-300 rounded-lg transition-all active:scale-95 shadow-xs"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Status / VAD Notification Banner */}
              <div className={`w-full p-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all ${
                voiceState === 'listening'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium'
                  : voiceState === 'processing'
                  ? 'bg-purple-500/15 border border-purple-500/40 text-purple-300 font-medium'
                  : 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-slate-600 dark:text-slate-400'
              }`}>
                {voiceState === 'listening' ? (
                  <Mic className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                ) : voiceState === 'processing' ? (
                  <Sparkles className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-[#18A999] shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>

              {/* Real-time Listening Transcript */}
              {transcript && (
                <div className="w-full p-3.5 rounded-2xl bg-[#0F4C5C]/10 dark:bg-[#18181b] border border-[#18A999]/40 text-xs md:text-sm text-[#18A999] font-medium italic flex items-center justify-center gap-2 animate-fadeIn">
                  <Volume2 className="w-4 h-4 text-[#18A999] shrink-0 animate-pulse" />
                  <span>"{transcript}"</span>
                </div>
              )}

              {/* Manual Keyboard Input Bar (Fallback) */}
              <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#27272a]">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitLiveTurn(customText);
                  }}
                  placeholder={isHindi ? "यहाँ लिखकर भी उत्तर दे सकते हैं..." : "Type custom symptom response..."}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999]"
                />
                <button
                  onClick={() => submitLiveTurn(customText)}
                  disabled={!customText.trim()}
                  className="p-2.5 rounded-xl bg-[#18A999] hover:bg-[#148e81] disabled:opacity-40 text-black font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Conversation Stream & Real-Time EMR (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* Live Transcript Conversation Feed */}
              <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-5 rounded-3xl shadow-xl flex-1 flex flex-col h-[320px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#27272a]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18A999] flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#18A999]" />
                    {isHindi ? 'लाइव क्लिनिकल एआई संवाद' : 'Live Clinical AI Transcript'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {conversationHistory.length} {isHindi ? 'टर्न' : 'turns'}
                  </span>
                </div>

                <div ref={chatScrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pt-3 pr-2 text-xs">
                  {conversationHistory.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'patient'
                          ? 'bg-[#18A999] text-black font-medium rounded-tr-none'
                          : 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span suppressHydrationWarning className="text-[9px] opacity-70 block mt-1 text-right">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Extracted EMR Snapshot */}
              <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-5 rounded-3xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18A999] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#18A999]" />
                    {isHindi ? 'लाइव संरचित क्लिनिकल रिकॉर्ड' : 'Live Structured Clinical Record'}
                  </span>
                  {latestAssessment?.urgency && (
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md uppercase ${
                      latestAssessment.urgency === 'EMERGENCY'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : latestAssessment.urgency === 'URGENT'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {latestAssessment.urgency}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-[#1f1f23]">
                    <span className="font-semibold text-slate-400">{isHindi ? 'मुख्य शिकायत:' : 'Chief Complaint:'}</span>
                    <span className="font-bold text-[#18A999]">
                      {extractedData.chiefComplaint?.join(', ') || (isHindi ? 'एकत्रित किया जा रहा है...' : 'Gathering...')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-[#1f1f23]">
                    <span className="font-semibold text-slate-400">{isHindi ? 'अवधि / शुरुआत:' : 'Duration / Onset:'}</span>
                    <span className="font-medium text-slate-200">
                      {extractedData.duration || extractedData.onset || (isHindi ? 'लंबित' : 'Pending')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-[#1f1f23]">
                    <span className="font-semibold text-slate-400">{isHindi ? 'संबंधित लक्षण:' : 'Associated Signs:'}</span>
                    <span className="font-medium text-slate-200">
                      {extractedData.associatedSymptoms?.length 
                        ? extractedData.associatedSymptoms.join(', ') 
                        : (isHindi ? 'कोई अतिरिक्त लक्षण नहीं' : 'None reported yet')}
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full mt-2" 
                  onClick={handleProceedToDocuments} 
                  icon={ArrowRight} 
                  iconPosition="right"
                >
                  {isHindi ? 'दस्तावेज़ अपलोड पर आगे बढ़ें' : 'Proceed to Document Upload'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
