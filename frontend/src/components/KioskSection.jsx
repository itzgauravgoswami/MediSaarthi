import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Globe, CheckCircle2, FileText, Activity, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function KioskSection() {
  const { t, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language === 'hi' ? "Hindi" : "English");
  const [isListening, setIsListening] = useState(true);
  const [selectedSymptom, setSelectedSymptom] = useState("Chest Discomfort");

  const symptomsList = language === 'hi'
    ? ["सीने में भारीपन", "बुखार × 3 दिन", "उच्च रक्तचाप", "पुराना पर्चा अपलोड"]
    : ["Chest Discomfort", "Fever × 3 Days", "Hypertension", "Previous Rx Upload"];

  return (
    <section id="kiosk-demo" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#18A999]/15 dark:bg-[#18A999]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 dark:bg-[#6366F1]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 92%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black border border-[#0F4C5C]/20 dark:border-[#27272a] text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#18A999]" />
            <span>INTERACTIVE CLINICAL KIOSK</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-newsreader">
            Experience the{" "}
            <span className="text-[#0F4C5C] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#18A999] dark:via-teal-300 dark:to-cyan-400">
              live pre-consultation intake
            </span>{" "}
            in action.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg font-normal">
            Patients interact through natural voice or touch on hospital kiosks. The AI transcribes speech, extracts clinical entities, and formats history in real-time.
          </p>
        </motion.div>

        {/* Prominent Wide Interactive Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          
          {/* Main Showcase Container Card */}
          <div className="relative bg-white dark:bg-black rounded-3xl shadow-2xl border border-slate-200 dark:border-[#27272a] p-6 sm:p-8 space-y-6 transition-colors duration-300">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#27272a]">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-700 dark:text-[#a1a1aa] tracking-wide uppercase font-sans flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#18A999]" />
                  MediSaarthi Interactive Clinical Kiosk
                </span>
              </div>
              
              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-black px-3 py-1.5 rounded-full border border-slate-200 dark:border-[#27272a]">
                <Globe className="w-3.5 h-3.5 text-[#0F4C5C] dark:text-[#18A999]" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Hindi" className="bg-white dark:bg-black text-slate-800 dark:text-white">Hindi (हिन्दी)</option>
                  <option value="English" className="bg-white dark:bg-black text-slate-800 dark:text-white">English</option>
                  <option value="Bengali" className="bg-white dark:bg-black text-slate-800 dark:text-white">Bengali (বাংলা)</option>
                  <option value="Marathi" className="bg-white dark:bg-black text-slate-800 dark:text-white">Marathi (मराठी)</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Side: Mic & Voice Interactive Module */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-black rounded-2xl border border-slate-200 dark:border-[#27272a] text-center relative overflow-hidden">
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18A999]/10 text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#18A999]" />
                  <span>Namaste</span>
                </div>

                <h3 className="text-lg font-extrabold text-[#0F4C5C] dark:text-white font-newsreader mb-1">
                  How can we help you today?
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#a1a1aa] mb-4">
                  {selectedLanguage === "Hindi"
                    ? '"नमस्ते! कृपया अपनी मुख्य परेशानी बताएं।"'
                    : '"Hello! Please describe your health concern."'}
                </p>

                {/* Waveform Animation Button */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full bg-[#18A999]/15 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full bg-[#6366F1]/20 animate-pulse" />
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 focus-accessible ${
                      isListening
                        ? "bg-gradient-to-tr from-[#0F4C5C] via-[#18A999] to-[#6366F1] text-white scale-105"
                        : "bg-slate-200 dark:bg-[#27272a] text-slate-600 dark:text-[#a1a1aa]"
                    }`}
                    aria-label="Toggle mic"
                  >
                    <Mic className={`w-7 h-7 ${isListening ? "animate-pulse" : ""}`} />
                  </button>
                </div>

                {/* Sound Wave Bars */}
                {isListening && (
                  <div className="flex items-center justify-center gap-1.5 h-7 my-1 overflow-hidden">
                    <div className="w-1.5 h-5 bg-[#0F4C5C] dark:bg-[#18A999] rounded-full animate-wave-1"></div>
                    <div className="w-1.5 h-5 bg-[#18A999] rounded-full animate-wave-2"></div>
                    <div className="w-1.5 h-5 bg-[#6366F1] rounded-full animate-wave-3"></div>
                    <div className="w-1.5 h-5 bg-[#18A999] rounded-full animate-wave-4"></div>
                    <div className="w-1.5 h-5 bg-[#0F4C5C] dark:bg-[#18A999] rounded-full animate-wave-5"></div>
                  </div>
                )}

                <p className="text-xs font-bold text-[#0F4C5C] dark:text-[#18A999] mt-1 flex items-center justify-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#18A999]" />
                  <span>Speak naturally or tap below</span>
                </p>
              </div>

              {/* Right Side: Speech & Symptom Tag Preview */}
              <div className="md:col-span-6 space-y-4">
                
                {/* Speech Bubble */}
                <div className="p-4 bg-[#0F4C5C]/5 dark:bg-black rounded-2xl border border-[#0F4C5C]/15 dark:border-[#27272a] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center shrink-0 text-xs font-bold font-sans">
                    AI
                  </div>
                  <div className="text-xs text-slate-700 dark:text-[#a1a1aa] space-y-1">
                    <p className="font-semibold text-[#0F4C5C] dark:text-white">Patient Voice Transcribed:</p>
                    <p className="italic text-slate-600 dark:text-slate-300">
                      {selectedLanguage === "Hindi"
                        ? '"मुझे 3 दिन से सीने में भारीपन और हल्का दर्द हो रहा है..."'
                        : '"I have been experiencing chest discomfort for 3 days..."'}
                    </p>
                  </div>
                </div>

                {/* Symptom Tag Quick Selector */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">
                    Extracted Clinical Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {symptomsList.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedSymptom(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedSymptom === tag
                            ? "bg-[#0F4C5C] text-white shadow-sm"
                            : "bg-slate-100 dark:bg-black text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#27272a]"
                        }`}
                      >
                        ✓ {tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Floating Badges */}
          <div className="hidden md:flex absolute -top-5 -left-8 items-center gap-2 px-4 py-2.5 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 dark:border-[#27272a] animate-float z-20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">History Captured</p>
              <p className="text-[10px] text-slate-500 dark:text-[#71717a]">Multilingual audio transcribed</p>
            </div>
          </div>

          <div className="hidden md:flex absolute -bottom-5 -right-8 items-center gap-2 px-4 py-2.5 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-xl border border-cyan-100 dark:border-[#27272a] animate-float z-20">
            <FileText className="w-4 h-4 text-[#18A999] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Previous Reports Digitized</p>
              <p className="text-[10px] text-slate-500 dark:text-[#71717a]">OCR & Lab parameters parsed</p>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
