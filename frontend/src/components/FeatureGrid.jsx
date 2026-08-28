import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Mic,
  Languages,
  MousePointerClick,
  Brain,
  FileSearch,
  ClipboardList,
  Siren,
  History,
  Sprout,
  UserCheck,
  ShieldCheck,
  Share2
} from "lucide-react";

export default function FeatureGrid() {
  const { t, language } = useLanguage();

  const features = [
    {
      title: language === 'hi' ? "वॉयस-फर्स्ट एआई" : "Voice-First AI",
      desc: language === 'hi' ? "मरीज जटिल डिजिटल फॉर्म भरने के बजाय अपनी मातृभाषा में स्वाभाविक रूप से बोल सकते हैं।" : "Patients can speak naturally in their native language instead of struggling to type on complex digital forms.",
      icon: Mic,
      tag: "Accessibility",
      color: "text-[#18A999] bg-[#18A999]/10 border-[#18A999]/20",
    },
    {
      title: language === 'hi' ? "बहुभाषी इंजन" : "Multilingual Engine",
      desc: language === 'hi' ? "हिंदी और अंग्रेजी के लिए समर्थन, क्षेत्रीय भारतीय बोलियों के लिए डिज़ाइन किया गया।" : "Native support for Hindi & English, architected for regional Indian dialects and acoustic variations.",
      icon: Languages,
      tag: "Inclusion",
      color: "text-[#0F4C5C] dark:text-[#18A999] bg-[#0F4C5C]/10 border-[#0F4C5C]/20",
    },
    {
      title: language === 'hi' ? "वॉयस + टच नियंत्रण" : "Voice + Touch Controls",
      desc: language === 'hi' ? "दोहरा मोड जो मरीजों को विजुअल आइकॉन टैप करने या बोलकर उत्तर देने की सुविधा देता है।" : "Dual interaction mode allowing patients to tap visual icons, sliders, or speak answers naturally.",
      icon: MousePointerClick,
      tag: "Kiosk Ready",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40",
    },
    {
      title: language === 'hi' ? "अनुकूलनीय पूछताछ" : "Adaptive Questioning",
      desc: language === 'hi' ? "बुद्धिमान नैदानिक शाखाएं जो मुख्य समस्या के आधार पर प्रश्नों को वास्तविक समय में समायोजित करती हैं।" : "Intelligent clinical branching that adapts questions in real-time based on chief complaint and previous responses.",
      icon: Brain,
      tag: "Clinical AI",
      color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20",
    },
    {
      title: language === 'hi' ? "मेडिकल दस्तावेज़ इंटेलिजेंस" : "Medical Document Intelligence",
      desc: language === 'hi' ? "उच्च-सटीक ओसीआर भौतिक पर्चे और लैब शीट से खुराक और निदान निकालता है।" : "High-accuracy OCR extracts dosages, lab parameters, and diagnoses from physical prescriptions and lab sheets.",
      icon: FileSearch,
      tag: "OCR Engine",
      color: "text-[#18A999] bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/40",
    },
    {
      title: language === 'hi' ? "संरचित क्लिनिकल इतिहास" : "Structured Clinical History",
      desc: language === 'hi' ? "एचपीआई, पिछला चिकित्सा इतिहास, दवाएं, एलर्जी और पारिवारिक समीक्षा को कवर करने वाले नोट बनाता है।" : "Generates standardized notes covering HPI, Past Medical, Surgical, Medications, Allergies, Family & Systemic Review.",
      icon: ClipboardList,
      tag: "EHR Ready",
      color: "text-[#0F4C5C] dark:text-white bg-slate-100 dark:bg-[#18181b] border-slate-200 dark:border-[#27272a]",
    },
    {
      title: language === 'hi' ? "रेड-फ्लैग पहचान" : "Red-Flag Detection",
      desc: language === 'hi' ? "एल्गोरिदमिक स्क्रीनिंग ट्राइएज स्टाफ के लिए महत्वपूर्ण आपातकालीन अलर्ट (सीने का दर्द, सांस की तकलीफ) दिखाती है।" : "Algorithmic screening surfaces critical alerts (chest pain, severe dyspnea, acute neuro symptoms) to triage staff.",
      icon: Siren,
      tag: "Safety Triage",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40",
    },
    {
      title: language === 'hi' ? "मेडिकल टाइमलाइन" : "Medical Timeline",
      desc: language === 'hi' ? "स्वास्थ्य इतिहास को एक दृश्यमान, खोज योग्य कालानुक्रमिक समयरेखा में पुनर्गठित करता है।" : "Automatically reconstructs longitudinal health history into a visual, searchable chronological timeline.",
      icon: History,
      tag: "Continuity",
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40",
    },
    {
      title: language === 'hi' ? "आयुष मोड" : "AYUSH Mode",
      desc: language === 'hi' ? "दशविध परीक्षा, प्रकृति और आहार-विहार मूल्यांकन सहित आयुर्वेदिक कार्यप्रवाह का समर्थन करता है।" : "Supports Ayurvedic clinical history workflows including Dashavidha Pariksha, Prakriti, and Ahara-Vihara assessment.",
      icon: Sprout,
      tag: "AYUSH Integration",
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    },
    {
      title: language === 'hi' ? "चिकित्सक नियंत्रण" : "Physician Control",
      desc: language === 'hi' ? "डॉक्टरों के पास 100% नियंत्रण रहता है—सहेजने से पहले 1-क्लिक संपादन, अनुमोदन या अस्वीकार करने की क्षमता के साथ।" : "Doctors maintain 100% oversight—with 1-click edit, approve, reject, or append capabilities before saving.",
      icon: UserCheck,
      tag: "Human Oversight",
      color: "text-[#0F4C5C] dark:text-[#18A999] bg-[#0F4C5C]/10 border-[#0F4C5C]/20",
    },
    {
      title: language === 'hi' ? "सहमति और गोपनीयता" : "Consent & Privacy",
      desc: language === 'hi' ? "मरीज सहमति प्रवाह, सत्र अलगाव, भूमिका आधारित पहुंच और एन्क्रिप्टेड प्रोटोकॉल।" : "Explicit patient consent flows, session isolation, role-based access, and encrypted transport protocols.",
      icon: ShieldCheck,
      tag: "Data Security",
      color: "text-indigo-700 dark:text-[#C5A059] bg-indigo-50 dark:bg-[#C5A059]/10 border-indigo-200 dark:border-[#C5A059]/30",
    },
    {
      title: language === 'hi' ? "इंटरऑपरेबिलिटी (FHIR/ABDM)" : "Interoperability (FHIR/ABDM)",
      desc: language === 'hi' ? "अस्पताल प्रबंधन प्रणालियों और ABDM के साथ एकीकरण के लिए HL7 FHIR मानकों पर निर्मित।" : "Built on HL7 FHIR standards for seamless integration with existing hospital management systems and ABDM.",
      icon: Share2,
      tag: "Open Standards",
      color: "text-[#18A999] bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/40",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp Gridlines Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
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
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-black text-[#0F4C5C] dark:text-[#18A999] text-xs font-bold uppercase tracking-wider border border-[#0F4C5C]/20 dark:border-[#27272a]">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight font-newsreader">
            One platform. The complete pre-consultation workflow.
          </h2>
          <p className="text-slate-600 dark:text-[#a1a1aa] text-base sm:text-lg">
            Purpose-built technology combining Indian language voice AI, clinical intelligence, and doctor-approved verification.
          </p>
        </motion.div>

        {/* 12 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="p-7 rounded-3xl bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#111111] border border-slate-200/80 dark:border-[#27272a] hover:border-slate-300 dark:hover:border-[#3f3f46] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color} shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-slate-600 dark:text-[#a1a1aa]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#0F4C5C] dark:group-hover:text-[#18A999] transition-colors font-newsreader">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#27272a] flex items-center gap-1 text-xs font-bold text-[#18A999] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <span>Learn workflow integration</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
