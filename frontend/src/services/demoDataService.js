// Realistic Demo Data Service for MediSaarthi AI Platform

export const DEMO_PATIENTS = [
  {
    id: "P102",
    token: "#102",
    name: "Rahul Kumar",
    age: 45,
    gender: "Male",
    phone: "+91 98765 43210",
    abhaId: "91-4829-1039-4821",
    language: "hi",
    chiefComplaint: "Chest Pain with Breathlessness",
    intakeStatus: "Completed",
    redFlag: "Attention Required",
    redFlagDetails: "Reported substernal chest pain radiating to left arm with exertional shortness of breath for 3 days.",
    priority: "High",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "10:30 AM",
    date: "28 Aug 2026",
    isVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    historyOfPresentIllness: "Patient reports substernal chest pain for approximately three days. Pain reportedly increases during physical activity and is accompanied by mild shortness of breath and diaphoresis. Pain intensity rated 7/10.",
    pastMedicalHistory: "Essential Hypertension (diagnosed 2021), Type 2 Diabetes Mellitus (diagnosed 2023).",
    pastSurgicalHistory: "Appendectomy (2018).",
    medicationHistory: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily", source: "Prescription OCR", confidence: 94 },
      { name: "Amlodipine", dosage: "5 mg", frequency: "Once daily in morning", source: "Prescription OCR", confidence: 91 },
      { name: "Atorvastatin", dosage: "10 mg", frequency: "At bedtime", source: "Patient Voice Interview", confidence: 88 }
    ],
    drugAllergies: ["Penicillin (Rash)"],
    familyHistory: "Father had premature Coronary Artery Disease (CAD) at age 52.",
    personalHistory: "Non-smoker, occasional alcohol intake, sedentary desk job.",
    reviewOfSystems: "Cardiovascular: Positive for exertional chest pain. Respiratory: Mild dyspnea on exertion. GI: Negative for acid reflux. Neuro: No dizziness.",
    previousInvestigations: [
      { test: "HbA1c", result: "7.8 %", date: "20 Aug 2026", status: "Elevated" },
      { test: "ECG", result: "Sinus rhythm with ST depression in V4-V6", date: "28 Aug 2026", status: "Abnormal" },
      { test: "Serum Creatinine", result: "0.9 mg/dL", date: "20 Aug 2026", status: "Normal" }
    ],
    timeline: [
      { id: "T1", date: "28 Aug 2026", type: "Consultation", title: "Current Intake", desc: "Substernal chest pain with exertional breathlessness reported via Kiosk Voice Intake.", badge: "Red Flag" },
      { id: "T2", date: "20 Aug 2026", type: "Investigation", title: "Laboratory Investigation", desc: "HbA1c: 7.8% (Elevated), Lipid Profile: Total Cholesterol 220 mg/dL.", badge: "Lab Report" },
      { id: "T3", date: "14 Nov 2025", type: "Prescription", title: "Outpatient Consultation", desc: "Metformin 500mg, Amlodipine 5mg prescribed by Dr. Mehta.", badge: "Prescription" },
      { id: "T4", date: "02 Jun 2024", type: "Hospitalization", title: "Inpatient Admission", desc: "Admitted for acute gastroenteritis, discharged after 48h observation.", badge: "Discharge Summary" }
    ],
    documents: [
      {
        id: "DOC-101",
        title: "Max Hospital OPD Prescription.pdf",
        type: "Prescription",
        date: "14 Nov 2025",
        status: "Parsed",
        confidence: 94,
        rawText: "Max Healthcare OPD\nPatient: Rahul Kumar Age: 44\nRx:\n1. Tab Metformin 500mg BD\n2. Tab Amlodipine 5mg OD\nAdvised: Low salt diet, regular walking.",
        extractedData: {
          diagnoses: ["Hypertension", "Type 2 Diabetes"],
          medications: [
            { name: "Metformin", dose: "500 mg", freq: "BD", duration: "Continuous" },
            { name: "Amlodipine", dose: "5 mg", freq: "OD", duration: "Continuous" }
          ],
          investigations: ["Fasting Blood Sugar", "HbA1c"],
          date: "14 Nov 2025"
        }
      },
      {
        id: "DOC-102",
        title: "Thyrocare Lipid & Diabetic Panel.pdf",
        type: "Lab Report",
        date: "20 Aug 2026",
        status: "Parsed",
        confidence: 96,
        rawText: "Thyrocare Labs\nPatient: Rahul Kumar\nHbA1c: 7.8% (High)\nFasting Glucose: 142 mg/dL\nSerum Creatinine: 0.9 mg/dL",
        extractedData: {
          diagnoses: ["Uncontrolled Glycemia"],
          medications: [],
          investigations: [
            { testName: "HbA1c", val: "7.8%", ref: "< 5.7%" },
            { testName: "Fasting Glucose", val: "142 mg/dL", ref: "70-99 mg/dL" }
          ],
          date: "20 Aug 2026"
        }
      }
    ]
  },
  {
    id: "P103",
    token: "#103",
    name: "Priya Sundaram",
    age: 32,
    gender: "Female",
    phone: "+91 98111 22334",
    abhaId: "91-1122-3344-5566",
    language: "en",
    chiefComplaint: "High Fever with Chills & Bodyache",
    intakeStatus: "Completed",
    redFlag: "Normal",
    redFlagDetails: "No acute distress. Fever 101.4°F for 2 days.",
    priority: "Medium",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "10:45 AM",
    date: "28 Aug 2026",
    isVerified: true,
    verifiedBy: "Dr. Sharma",
    verifiedAt: "28 Aug 2026, 09:30 AM",
    historyOfPresentIllness: "Patient reports acute onset high-grade fever (up to 101.4°F) accompanied by severe rigors, myalgia, and retro-orbital headache for 48 hours.",
    pastMedicalHistory: "No chronic illness.",
    pastSurgicalHistory: "None.",
    medicationHistory: [{ name: "Paracetamol", dosage: "650 mg", frequency: "SOS", source: "Patient Voice", confidence: 95 }],
    drugAllergies: ["None known"],
    familyHistory: "Unremarkable.",
    personalHistory: "Dengue endemic neighborhood.",
    reviewOfSystems: "General: High fever, malaise. Musculoskeletal: Severe generalized bodyache.",
    previousInvestigations: [{ test: "CBC", result: "Platelets 160,000/mcL", date: "27 Aug 2026", status: "Normal" }],
    timeline: [
      { id: "T10", date: "28 Aug 2026", type: "Consultation", title: "Intake Completed", desc: "Fever 101.4 F, chills, myalgia.", badge: "In Progress" }
    ],
    documents: []
  },
  {
    id: "P104",
    token: "#104",
    name: "Sunita Verma",
    age: 58,
    gender: "Female",
    phone: "+91 97123 45678",
    abhaId: "91-3344-5566-7788",
    language: "hi",
    chiefComplaint: "Chronic Knee Joint Pain & Stiffness",
    intakeStatus: "Completed",
    redFlag: "Normal",
    redFlagDetails: "Bilateral knee osteoarthritis flares.",
    priority: "Low",
    status: "In Progress",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "11:00 AM",
    date: "28 Aug 2026",
    isVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    historyOfPresentIllness: "Gradual onset bilateral knee pain for 2 years, exacerbated by stair climbing and standing. Morning stiffness lasts 15 minutes.",
    pastMedicalHistory: "Osteoarthritis, Hypothyroidism.",
    pastSurgicalHistory: "None.",
    medicationHistory: [
      { name: "Thyronorm", dosage: "50 mcg", frequency: "Once daily fasting", source: "OCR", confidence: 92 }
    ],
    drugAllergies: ["Sulfa drugs"],
    familyHistory: "Mother had rheumatoid arthritis.",
    personalHistory: "Sedentary lifestyle.",
    reviewOfSystems: "Joint pain bilateral knees.",
    previousInvestigations: [{ test: "X-Ray Both Knees", result: "Grade II Osteoarthritis", date: "10 Jan 2026", status: "Abnormal" }],
    timeline: [
      { id: "T20", date: "28 Aug 2026", type: "Consultation", title: "Rheumatology Follow-up", desc: "Knee joint stiffness intake.", badge: "Completed" }
    ],
    documents: []
  },
  {
    id: "P105",
    token: "#105",
    name: "Amitabh Sen",
    age: 67,
    gender: "Male",
    phone: "+91 99887 76655",
    abhaId: "91-5566-7788-9900",
    language: "bn",
    chiefComplaint: "Sudden Weakness & Slurred Speech",
    intakeStatus: "Awaiting Review",
    redFlag: "Attention Required",
    redFlagDetails: "Sudden neurological weakness in right upper limb noticed 40 mins ago.",
    priority: "Immediate",
    status: "Priority",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "Immediate",
    date: "28 Aug 2026",
    isVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    historyOfPresentIllness: "Attendant reports patient developed right arm heaviness and transient facial drooping 45 minutes prior to arrival.",
    pastMedicalHistory: "Atrial Fibrillation, Hypertension.",
    pastSurgicalHistory: "Coronary Stent (2020).",
    medicationHistory: [{ name: "Ecosprin", dosage: "75 mg", frequency: "OD", source: "Attendant", confidence: 90 }],
    drugAllergies: ["None"],
    familyHistory: "Stroke in elder brother.",
    personalHistory: "Ex-smoker.",
    reviewOfSystems: "Neuro: Right hemiparesis, dysarthria.",
    previousInvestigations: [],
    timeline: [
      { id: "T30", date: "28 Aug 2026", type: "Consultation", title: "Triage Alert", desc: "Acute neurological deficit intake.", badge: "Red Flag" }
    ],
    documents: []
  }
];

export const DEMO_RED_FLAGS = [
  {
    id: "RF-1",
    patientId: "P102",
    patientName: "Rahul Kumar",
    token: "#102",
    age: 45,
    gender: "Male",
    detectedInfo: "Chest pain with exertional breathlessness & left arm radiation.",
    priority: "Immediate Review",
    time: "10 mins ago",
    status: "Pending Action",
    ruleTriggered: "chest_pain_with_breathlessness"
  },
  {
    id: "RF-2",
    patientId: "P105",
    patientName: "Amitabh Sen",
    token: "#105",
    age: 67,
    gender: "Male",
    detectedInfo: "Acute onset right limb weakness & transient dysarthria (< 1 hour window).",
    priority: "Immediate Review",
    time: "3 mins ago",
    status: "Triage Escalated",
    ruleTriggered: "sudden_neurological_symptoms"
  }
];

export const DEMO_AYUSH_DATA = {
  P102: {
    patientName: "Rahul Kumar",
    mode: "AYUSH",
    dashavidhaPariksha: {
      prakriti: "Pittaj-Kaphaj",
      vikriti: "Vata-Kaphaj Agni-mandya with Hridaya Shoola",
      sara: "Madhyama Sara (Medium Tissue Excellence)",
      samhanana: "Madhyama (Compact Built)",
      pramana: "Normal Height 172cm, Weight 78kg",
      satmya: "Sarva-rasa Satmya (Accustomed to all tastes)",
      sattva: "Madhyama Sattva (Moderate Psychological Resilience)",
      aharaShakti: "Abhavarana (Impaired Digestive Fire - Manda Agni)",
      vyayamaShakti: "Alpa (Reduced Exercise Capacity due to chest discomfort)",
      vaya: "Madhyama Vaya (Middle Age - 45 yrs)",
      ahara: "Excessive Katu & Snigdha Ahara intake",
      vihara: "Diwaswapna (Daytime sleeping), Ratrijagrana"
    }
  }
};

export const DEMO_KIOSKS = [
  { id: "KIOSK-01", location: "Main OPD Reception Desk A", status: "Online", lastActive: "Just now", session: "Active Intake (#102)", version: "v2026.4.1" },
  { id: "KIOSK-02", location: "Cardiology Wing Waiting Area", status: "Online", lastActive: "2 mins ago", session: "Idle", version: "v2026.4.1" },
  { id: "KIOSK-03", location: "Emergency Triage Portal", status: "Active Session", lastActive: "Just now", session: "Active Intake (#105)", version: "v2026.4.1" },
  { id: "KIOSK-04", location: "AYUSH OPD Pavilion", status: "Maintenance", lastActive: "1 hour ago", session: "Calibration", version: "v2026.3.9" }
];

export const DEMO_AUDIT_LOGS = [
  { id: "LOG-901", timestamp: "28 Aug 2026, 10:42 AM", user: "Dr. Sharma", role: "Doctor", action: "Confirmed Clinical Summary", resource: "Patient #102", status: "Success" },
  { id: "LOG-902", timestamp: "28 Aug 2026, 10:35 AM", user: "Kiosk #01", role: "Patient Kiosk", action: "Uploaded Prescription Document", resource: "DOC-101", status: "Success" },
  { id: "LOG-903", timestamp: "28 Aug 2026, 10:30 AM", user: "Rahul Kumar", role: "Patient", action: "Granted Digital Informed Consent", resource: "Consent Protocol v2", status: "Success" },
  { id: "LOG-904", timestamp: "28 Aug 2026, 10:28 AM", user: "System Safety Engine", role: "Automated Rule", action: "Triggered Chest Pain Red-Flag Alert", resource: "Patient #102", status: "Escalated" },
  { id: "LOG-905", timestamp: "28 Aug 2026, 10:15 AM", user: "Triage Nurse Patel", role: "Triage", action: "Acknowledged Priority Red Flag Alert", resource: "Patient #105", status: "Acknowledged" }
];

export const DEMO_ANALYTICS_STATS = {
  patientsProcessedToday: 24,
  aiIntakesCompleted: 19,
  avgIntakeDuration: "3.4 mins",
  docProcessingCount: 38,
  redFlagCount: 2,
  languageDistribution: [
    { name: "Hindi (हिन्दी)", count: 14, percent: 58 },
    { name: "English", count: 7, percent: 29 },
    { name: "Bengali (বাংলা)", count: 2, percent: 8 },
    { name: "Marathi (मराठी)", count: 1, percent: 5 }
  ],
  dailyThroughput: [
    { time: "08:00 AM", count: 3 },
    { time: "09:00 AM", count: 7 },
    { time: "10:00 AM", count: 9 },
    { time: "11:00 AM", count: 5 }
  ]
};
