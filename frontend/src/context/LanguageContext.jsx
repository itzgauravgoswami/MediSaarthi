"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const translations = {
  en: {
    // Nav & Common
    home: "Home",
    howItWorks: "How It Works",
    features: "Features",
    voiceAi: "Voice AI",
    documentAi: "Document AI",
    ayush: "AYUSH",
    safety: "Safety",
    faqs: "FAQs",
    signIn: "Sign In",
    getStarted: "Get Started",
    language: "Language",
    english: "English",
    hindi: "हिन्दी",

    // Hero Section
    heroBadge: "AI-POWERED CLINICAL INTAKE PLATFORM",
    heroTitleText1: "Helping doctors focus on",
    heroTitleSpan: "patients",
    heroTitleText2: ", not paperwork.",
    heroSubtitle: "MediSaarthi uses multilingual voice AI, intelligent document processing, and structured clinical history-taking to prepare a complete patient case before the consultation begins.",
    tryKioskDemo: "Try Live Kiosk Demo",
    seeHowItWorks: "See How It Works",
    builtForHospitals: "Built for hospitals, OPDs, clinics & AYUSH institutions across India.",

    // TrustBar
    trustTitle: "Trusted by Healthcare Institutions & Medical Leaders Across India",

    // HowItWorks
    howItWorksBadge: "5-STEP CLINICAL WORKFLOW",
    howItWorksTitle: "How MediSaarthi Transforms OPD Intake",
    step1Title: "Patient Check-In at Kiosk",
    step1Desc: "Patient arrives at hospital kiosk or opens mobile web link.",
    step2Title: "Multilingual Voice AI Intake",
    step2Desc: "Patient speaks naturally in Hindi, English, or 10+ regional languages.",
    step3Title: "Intelligent Document OCR",
    step3Desc: "Scans past prescriptions, lab reports, and discharge summaries.",
    step4Title: "Clinical Summary Generation",
    step4Desc: "AI structures history into standardized EMR format (OPQRST/SNOMED).",
    step5Title: "Physician Review & Consultation",
    step5Desc: "Doctor reviews structured summary in 30 seconds before patient enters.",

    // FeatureGrid
    featuresBadge: "COMPREHENSIVE CAPABILITIES",
    featuresTitle: "Engineered for Modern Clinical Excellence",

    // VoiceShowcase
    voiceBadge: "MULTILINGUAL VOICE AI ENGINE",
    voiceTitle: "Healthcare Should Speak Your Language",
    voiceSubtitle: "Patients can describe symptoms naturally in Hindi, English, Bengali, Tamil, Telugu, Marathi, and 10+ regional Indian accents.",

    // DocumentShowcase
    docBadge: "MEDICAL OCR INTELLIGENCE",
    docTitle: "Turn Paper Prescriptions into Structured Data",
    docSubtitle: "Instant extraction of handwritten doctor notes, medicine dosages, lab values, and diagnostic findings.",

    // AyushSection
    ayushBadge: "TRADITIONAL & INTEGRATIVE MEDICINE",
    ayushTitle: "Native AYUSH History & Prakriti Logging",
    ayushSubtitle: "Built-in support for Ayurveda (Prakriti/Vata-Pitta-Kapha), Siddha, Unani, and Homeopathy clinical history parameters.",

    // SafetySection
    safetyBadge: "CLINICAL SAFETY & PRIVACY",
    safetyTitle: "Responsible AI with 100% Doctor Control",
    safetySubtitle: "MediSaarthi assists doctors by organizing information. It never independently diagnoses or prescribes treatments.",

    // FAQSection
    faqBadge: "FREQUENTLY ASKED QUESTIONS",
    faqTitle: "Got Questions? We Have Answers.",

    // FinalCTA
    ctaTitle: "Ready to Revolutionize Your Clinical Intake?",
    ctaSubtitle: "Join leading OPDs, AYUSH centers, and hospitals simplifying pre-consultation patient intake.",

    // Footer
    footerDesc: "MediSaarthi empowers healthcare institutions across India to collect, structure, and summarize patient history before consultation.",
    rightsReserved: "© 2026 MediSaarthi. All rights reserved.",
    builtWithLove: "Built for Indian Healthcare Institutions.",

    // Dashboard & Roles
    doctorWorkspace: "Doctor Clinical Workspace",
    pharmacyDesk: "Pharmacy Fulfillment Desk",
    patientPortal: "Patient Intake Portal",
    adminConsole: "System Operations Console",
    searchPlaceholder: "Search in workspace...",
    systemAlerts: "System Alerts",
    activeRole: "Portal Role",
    
    // Actions & Buttons
    dispenseMeds: "Dispense Meds",
    addStock: "Add Stock Batch",
    exportLogs: "Export Audit CSV",
    viewReceipt: "Receipt",
    verify: "Verify & Confirm",
    cancel: "Cancel",
    save: "Save",
    
    // Status
    pending: "Pending",
    dispensed: "Dispensed",
    urgent: "Urgent",
    inStock: "In Stock",
    lowStock: "Low Stock",
    critical: "Critical",
    completed: "Completed"
  },
  hi: {
    // Nav & Common
    home: "होम",
    howItWorks: "यह कैसे काम करता है",
    features: "विशेषताएं",
    voiceAi: "वॉइस एआई",
    documentAi: "दस्तावेज़ एआई",
    ayush: "आयुष",
    safety: "सुरक्षा",
    faqs: "प्रश्न उत्तर",
    signIn: "साइन इन",
    getStarted: "शुरू करें",
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",

    // Hero Section
    heroBadge: "एआई-संचालित परामर्श-पूर्व नैदानिक ​​इंटेक",
    heroTitleText1: "डॉक्टरों की मदद,",
    heroTitleSpan: "रोगियों",
    heroTitleText2: "पर ध्यान केंद्रित करने के लिए, कागजी कार्रवाई पर नहीं।",
    heroSubtitle: "मेडीसारथी 10+ भारतीय भाषाओं में परामर्श-पूर्व आवाज इतिहास, बुद्धिमान पर्चे ओसीआर, और डॉक्टरों के लिए संरचित ईएमआर सारांश का उपयोग करता है।",
    tryKioskDemo: "लाइव कियोस्क डेमो आज़माएं",
    seeHowItWorks: "देखें यह कैसे काम करता है",
    builtForHospitals: "भारत भर के अस्पतालों, ओपीडी, क्लीनिकों और आयुष संस्थानों के लिए निर्मित।",

    // TrustBar
    trustTitle: "भारत भर के स्वास्थ्य देखभाल संस्थानों और चिकित्सा नेताओं द्वारा विश्वसनीय",

    // HowItWorks
    howItWorksBadge: "5-चरणीय नैदानिक कार्यप्रवाह",
    howItWorksTitle: "मेडीसारथी ओपीडी इंटेक को कैसे बदलता है",
    step1Title: "कियोस्क पर मरीज चेक-इन",
    step1Desc: "मरीज अस्पताल के कियोस्क पर पहुंचता है या मोबाइल वेब लिंक खोलता है।",
    step2Title: "बहुभाषी वॉयस एआई इंटेक",
    step2Desc: "मरीज हिंदी, अंग्रेजी या 10+ क्षेत्रीय भाषाओं में स्वाभाविक रूप से बोलता है।",
    step3Title: "बुद्धिमान दस्तावेज़ ओसीआर",
    step3Desc: "पुराने पर्चे, लैब रिपोर्ट और डिस्चार्ज सारांश को स्कैन करता है।",
    step4Title: "नैदानिक सारांश निर्माण",
    step4Desc: "एआई इतिहास को मानकीकृत ईएमआर प्रारूप (OPQRST/SNOMED) में संरचित करता है।",
    step5Title: "चिकित्सक समीक्षा एवं परामर्श",
    step5Desc: "डॉक्टर मरीज के प्रवेश से पहले 30 सेकंड में संरचित सारांश की समीक्षा करता है।",

    // FeatureGrid
    featuresBadge: "व्यापक क्षमताएं",
    featuresTitle: "आधुनिक नैदानिक उत्कृष्टता के लिए इंजीनियर",

    // VoiceShowcase
    voiceBadge: "बहुभाषी वॉयस एआई इंजन",
    voiceTitle: "स्वास्थ्य सेवा को आपकी भाषा बोलनी चाहिए",
    voiceSubtitle: "मरीज हिंदी, अंग्रेजी, बंगाली, तमिल, तेलुगु, मराठी और 10+ क्षेत्रीय भारतीय लहजों में लक्षणों का वर्णन कर सकते हैं।",

    // DocumentShowcase
    docBadge: "मेडिकल ओसीआर इंटेलिजेंस",
    docTitle: "कागजी पर्चे को संरचित डेटा में बदलें",
    docSubtitle: "हस्तलिखित डॉक्टर नोट्स, दवा की मात्रा, लैब मूल्यों और नैदानिक निष्कर्षों का त्वरित निष्कर्षण।",

    // AyushSection
    ayushBadge: "पारंपरिक और एकीकृत चिकित्सा",
    ayushTitle: "देशी आयुष इतिहास और प्रकृति लॉगिंग",
    ayushSubtitle: "आयुर्वेद (प्रकृति/वात-पित्त-कफ), सिद्ध, यूनानी और होम्योपैथी नैदानिक इतिहास मानकों के लिए अंतर्निहित समर्थन।",

    // SafetySection
    safetyBadge: "नैदानिक ​​सुरक्षा और गोपनीयता",
    safetyTitle: "100% डॉक्टर नियंत्रण के साथ जिम्मेदार एआई",
    safetySubtitle: "मेडीसारथी जानकारी व्यवस्थित करके डॉक्टरों की सहायता करता है। यह कभी भी स्वतंत्र रूप से निदान या उपचार नहीं लिखता है।",

    // FAQSection
    faqBadge: "बार-बार पूछे जाने वाले प्रश्न",
    faqTitle: "सवाल हैं? हमारे पास जवाब हैं।",

    // FinalCTA
    ctaTitle: "क्या आप अपने नैदानिक ​​इंटेक में क्रांति लाने के लिए तैयार हैं?",
    ctaSubtitle: "प्रमुख ओपीडी, आयुष केंद्रों और अस्पतालों से जुड़ें जो परामर्श-पूर्व रोगी इंटेक को सरल बना रहे हैं।",

    // Footer
    footerDesc: "मेडीसारथी भारत भर के अस्पतालों को परामर्श से पहले रोगी के इतिहास को एकत्र, संरचित और सारांशित करने में सक्षम बनाता है।",
    rightsReserved: "© 2026 मेडीसारथी। सर्वाधिकार सुरक्षित।",
    builtWithLove: "भारतीय स्वास्थ्य देखभाल संस्थानों के लिए निर्मित।",

    // Dashboard & Roles
    doctorWorkspace: "डॉक्टर क्लिनिकल वर्कस्पेस",
    pharmacyDesk: "फार्मेसी पूर्ति डेस्क",
    patientPortal: "रोगी इंटेक पोर्टल",
    adminConsole: "सिस्टम संचालन कंसोल",
    searchPlaceholder: "वर्कस्पेस में खोजें...",
    systemAlerts: "सिस्टम अलर्ट",
    activeRole: "पोर्टल भूमिका",

    // Actions & Buttons
    dispenseMeds: "दवाएं वितरित करें",
    addStock: "नया स्टॉक बैच जोड़ें",
    exportLogs: "ऑडिट सीएसवी निर्यात करें",
    viewReceipt: "रसीद",
    verify: "सत्यापित और पुष्टि करें",
    cancel: "रद्द करें",
    save: "सहेजें",

    // Status
    pending: "लंबित",
    dispensed: "वितरित",
    urgent: "अत्यावश्यक",
    inStock: "स्टॉक में",
    lowStock: "कम स्टॉक",
    critical: "गंभीर कम",
    completed: "पूर्ण"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("medisaarthi_lang");
      if (savedLang === "hi" || savedLang === "en") {
        setLanguageState(savedLang);
      } else {
        // First time on device -> default to English ('en')
        localStorage.setItem("medisaarthi_lang", "en");
        setLanguageState("en");
      }
    } catch (e) {
      setLanguageState("en");
    }
  }, []);

  const setLanguage = (lang) => {
    const validLang = lang === "hi" ? "hi" : "en";
    setLanguageState(validLang);
    try {
      localStorage.setItem("medisaarthi_lang", validLang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
  };

  const t = (key, fallback) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
