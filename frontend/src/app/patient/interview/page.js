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
  Info
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

  // Live Backend Interview Session
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
  const [showNotifications, setShowNotifications] = useState(false);

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

    setStatusMessage(
      isHindi 
        ? 'माइक दबाकर अपनी तकलीफ बोलें (5 सेकंड तक आवाज़ न आने पर संकेत मिलेगा)' 
        : 'Tap microphone and describe your symptoms (5s silence notice enabled)'
    );

    // If conversation is at initial greeting or holding English greeting in Hindi mode, enforce Hindi question
    const q = isHindi ? defaultQHindi : defaultQEnglish;
    if (conversationHistory.length <= 1) {
      setCurrentQuestion(q);
      setConversationHistory([
        { sender: 'ai', text: q, timestamp: new Date().toLocaleTimeString() }
      ]);
    } else if (isHindi && currentQuestion === defaultQEnglish) {
      setCurrentQuestion(defaultQHindi);
      setConversationHistory(prev => prev.map((item, i) => i === 0 && item.text === defaultQEnglish ? { ...item, text: defaultQHindi } : item));
    }
  }, [language, langCode, isHindi]);

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
            patientId: intakeState?.patientId || 'P102',
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

  // Speak AI question via Dual Speech Engine (WebSpeech + Studio Audio Fallback)
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
    if (voiceState === 'listening') {
      const currentSpokenText = transcript.trim() || speechManagerRef.current?.accumulatedTranscript?.trim() || '';
      speechManagerRef.current?.stopListening();

      if (currentSpokenText.length > 0) {
        setStatusMessage(isHindi ? 'AI उत्तर तैयार कर रहा है...' : 'Processing with AI...');
        submitLiveTurn(currentSpokenText);
      } else {
        setVoiceState('idle');
        setStatusMessage(isHindi ? 'माइक बंद है। बोलने के लिए दबाएं या नीचे दिए लक्षण चुनें।' : 'Microphone idle. Tap to speak or select a symptom below.');
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

  // Submit patient's spoken words to backend Gemini AI
  const submitLiveTurn = async (patientSpeechText) => {
    if (!patientSpeechText || !patientSpeechText.trim()) return;

    const patientText = patientSpeechText.trim();
    setVoiceState('processing');

    setConversationHistory(prev => [
      ...prev,
      { sender: 'patient', text: patientText, timestamp: new Date().toLocaleTimeString() }
    ]);

    try {
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

        if (nextQ) {
          setCurrentQuestion(nextQ);
          setConversationHistory(prev => [
            ...prev,
            { sender: 'ai', text: nextQ, timestamp: new Date().toLocaleTimeString() }
          ]);
          speakText(nextQ);
          setStatusMessage(isHindi ? 'AI ने नया प्रश्न पूछा है। उत्तर देने हेतु माइक दबाएं।' : 'AI asked a question. Tap mic to answer.');
        }

        if (data.nextSection === 'COMPLETE') {
          setIsCompleted(true);
        }
      }
    } catch (err) {
      console.warn('[Interview API Error]', err);
    } finally {
      setTranscript('');
      setCustomText('');
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

  return (
    <DashboardLayout>
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* Left Column: Voice Orb & Real-Time Interaction (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-between text-center space-y-6">
          
          {/* Active Question Banner */}
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-[#18A999]/15 text-[#18A999] text-xs font-bold rounded-full border border-[#18A999]/30 uppercase tracking-wide">
                {isHindi ? `अनुभाग: ${currentSection}` : `Section: ${currentSection}`}
              </span>
              {redFlags.length > 0 && (
                <span className="px-3 py-1 bg-rose-500/15 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  {isHindi ? 'रेड-फ्लैग ट्राइएज अलर्ट' : 'Red-Flag Triage Triggered'}
                </span>
              )}
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
                { label: isHindi ? '🤒 तेज बुखार (Fever)' : '🤒 High Fever', text: isHindi ? 'मुझे 3 दिन से तेज बुखार है और कपकपी लग रही है' : 'I have high fever with chills since 3 days' },
                { label: isHindi ? '🫀 सीने में दर्द (Chest Pain)' : '🫀 Chest Pain', text: isHindi ? 'मुझे सीने में तेज दर्द और सांस फूलने की तकलीफ है' : 'I have severe chest pain with shortness of breath' },
                { label: isHindi ? '🧠 तेज सिरदर्द (Headache)' : '🧠 Severe Headache', text: isHindi ? 'माथे पर बहुत तेज सिरदर्द और चक्कर आ रहे हैं' : 'I have severe frontal headache and dizziness' },
                { label: isHindi ? '🤢 पेट दर्द (Stomach Ache)' : '🤢 Stomach Ache', text: isHindi ? 'मेरे पेट में तेज दर्द, गैस और उल्टी हो रही है' : 'I have severe abdominal pain, gas, and nausea' },
                { label: isHindi ? '🫁 सांस फूलना (Breathlessness)' : '🫁 Breathlessness', text: isHindi ? 'चलने पर सांस बहुत ज्यादा फूलती है और खांसी है' : 'I have severe breathlessness and cough on exertion' },
                { label: isHindi ? '🦴 घुटनों में दर्द (Joint Pain)' : '🦴 Joint Pain', text: isHindi ? 'घुटनों और जोड़ों में दर्द व चलने में परेशानी है' : 'I have severe knee and joint pain while walking' }
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
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded-md">
                Active EMR
              </span>
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
              {redFlags.length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    {isHindi ? 'पहचाने गए रेड फ्लैग:' : 'Detected Red Flags:'}
                  </span>
                  {redFlags.map((rf, rIdx) => (
                    <p key={rIdx} className="text-[11px] pl-4 font-semibold">• {rf.name || rf.ruleId || rf}</p>
                  ))}
                </div>
              )}
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
    </DashboardLayout>
  );
}
