// Clinical Interview AI Engine with Comprehensive Multilingual Medical NLP
const { generateStructuredJson } = require('./gemini.client');
const { INTERVIEW_PROMPT_TEMPLATE } = require('./prompts/interview.prompt');
const { INTERVIEW_SECTIONS, SECTION_SEQUENCE } = require('../../constants/interviewSections');
const logger = require('../../utils/logger');

/**
 * Progress interview state machine with Gemini analysis & dynamic clinical fallback
 */
async function processInterviewTurn({ currentSection, language, patientResponse, collectedData }) {
  const currentIndex = SECTION_SEQUENCE.indexOf(currentSection);
  const nextSectionCandidate = (currentIndex >= 0 && currentIndex < SECTION_SEQUENCE.length - 1)
    ? SECTION_SEQUENCE[currentIndex + 1]
    : INTERVIEW_SECTIONS.COMPLETE;

  const prompt = INTERVIEW_PROMPT_TEMPLATE
    .replace('{{currentSection}}', currentSection)
    .replace('{{language}}', language || 'hi-IN')
    .replace('{{priorData}}', JSON.stringify(collectedData || {}))
    .replace('{{patientResponse}}', patientResponse || '')
    .replace('{{nextSectionCandidate}}', nextSectionCandidate);

  const fallback = () => generateIntelligentTurnFallback(currentSection, patientResponse, nextSectionCandidate, language, collectedData);

  const aiResult = await generateStructuredJson(prompt, fallback);
  return aiResult;
}

/**
 * Professional Multilingual Clinical State Engine & NLP Classifier
 */
function generateIntelligentTurnFallback(currentSection, response, nextSectionCandidate, language, collectedData = {}) {
  const isHindi = (language || '').startsWith('hi');
  const text = (response || '').trim();
  const lower = text.toLowerCase();

  const extraction = {
    chiefComplaint: [...(collectedData?.chiefComplaint || [])],
    onset: collectedData?.onset || null,
    duration: collectedData?.duration || null,
    location: collectedData?.location || null,
    character: collectedData?.character || null,
    severity: collectedData?.severity || null,
    radiation: collectedData?.radiation || null,
    associatedSymptoms: [...(collectedData?.associatedSymptoms || [])],
    pastMedicalHistory: [...(collectedData?.pastMedicalHistory || [])],
    medications: [...(collectedData?.medications || [])],
    allergies: [...(collectedData?.allergies || [])]
  };

  const potentialRedFlags = [];

  // Helper to add unique items
  const addComplaint = (c) => { if (!extraction.chiefComplaint.includes(c)) extraction.chiefComplaint.push(c); };
  const addAssociated = (s) => { if (!extraction.associatedSymptoms.includes(s)) extraction.associatedSymptoms.push(s); };
  const addHistory = (h) => { if (!extraction.pastMedicalHistory.includes(h)) extraction.pastMedicalHistory.push(h); };
  const addMed = (m) => { if (!extraction.medications.includes(m)) extraction.medications.push(m); };

  // =========================================================================
  // 1. DURATION & ONSET PARSING
  // =========================================================================
  const durationMatch = text.match(/(\d+|एक|दो|तीन|चार|पांच|छह|सात|आठ|दस|one|two|three|four|five|six|seven|ten)\s*(दिन|दिनों|days?|घंटे|hours?|हफ्ते|weeks?|महीने|months?)/i);
  if (durationMatch) {
    extraction.duration = durationMatch[0];
    extraction.onset = `Onset ${durationMatch[0]} ago`;
  } else if (lower.includes('आज') || lower.includes('today') || lower.includes('सुबह') || lower.includes('morning')) {
    extraction.duration = 'Acute (< 24 hours)';
    extraction.onset = 'Today / Morning';
  } else if (lower.includes('अचानक') || lower.includes('sudden')) {
    extraction.onset = 'Sudden Acute Onset';
  }

  // =========================================================================
  // 2. CLINICAL CONDITION & SYMPTOM CLASSIFICATION
  // =========================================================================

  // FEVER / PYREXIA
  if (lower.includes('बुखार') || lower.includes('fever') || lower.includes('ताप') || lower.includes('temperature') || lower.includes('तप')) {
    addComplaint('Fever / Pyrexia');
    if (lower.includes('102') || lower.includes('103') || lower.includes('104') || lower.includes('101') || lower.includes('100')) {
      const tempMatch = text.match(/10[0-5](\.[0-9])?/);
      extraction.severity = tempMatch ? `${tempMatch[0]}°F (High Grade)` : 'High Grade Fever';
    }
  }

  // CHILLS & RIGORS
  if (lower.includes('ठंड') || lower.includes('कपकपी') || lower.includes('chills') || lower.includes('shivering') || lower.includes('शीत')) {
    addAssociated('Rigors & Chills (कपकपी)');
  }

  // CHEST PAIN / CARDIOVASCULAR
  if (lower.includes('सीने') || lower.includes('chest') || lower.includes('छाती') || lower.includes('angina') || lower.includes('दिल')) {
    addComplaint('Chest Discomfort / Precordial Pain');
    extraction.location = 'Retrosternal / Precordial Chest';
  }
  if (lower.includes('भारीपन') || lower.includes('heaviness') || lower.includes('दबाव') || lower.includes('pressure') || lower.includes('tightness')) {
    extraction.character = 'Compressive Heaviness / Pressure';
  }
  if (lower.includes('बाएं') || lower.includes('बांह') || lower.includes('arm') || lower.includes('कंधे') || lower.includes('shoulder') || lower.includes('jaw') || lower.includes('जबड़े') || lower.includes('पीठ') || lower.includes('back')) {
    extraction.radiation = 'Radiating to Left Arm / Shoulder / Jaw';
  }

  // RESPIRATORY / BREATHLESSNESS
  if (lower.includes('सांस') || lower.includes('breath') || lower.includes('dyspnea') || lower.includes('दम')) {
    addAssociated('Dyspnea / Shortness of Breath');
    if (extraction.chiefComplaint.length === 0) addComplaint('Breathlessness');
  }
  if (lower.includes('खांसी') || lower.includes('cough') || lower.includes('बलगम') || lower.includes('phlegm') || lower.includes('sputum')) {
    addAssociated(lower.includes('बलगम') || lower.includes('phlegm') ? 'Productive Cough with Phlegm' : 'Dry Cough');
  }
  if (lower.includes('सीटी') || lower.includes('wheezing') || lower.includes('जकड़न')) {
    addAssociated('Bronchial Wheezing / Airway Tightness');
  }

  // HEADACHE / NEUROLOGICAL
  if (lower.includes('सिर') || lower.includes('headache') || lower.includes('माथा') || lower.includes('migraine')) {
    addComplaint('Headache (Cephalea)');
    extraction.location = lower.includes('आधे') || lower.includes('one side') ? 'Unilateral / Migrainous' : 'Frontal / Generalized';
  }
  if (lower.includes('चक्कर') || lower.includes('dizziness') || lower.includes('vertigo') || lower.includes('धुंधला') || lower.includes('blur')) {
    addAssociated('Dizziness / Visual Alteration');
  }

  // GASTROINTESTINAL / ABDOMINAL
  if (lower.includes('पेट') || lower.includes('stomach') || lower.includes('abdomen') || lower.includes('belly') || lower.includes('acidity') || lower.includes('गैस')) {
    addComplaint('Abdominal Discomfort / Pain');
    extraction.location = 'Abdominal Region';
  }
  if (lower.includes('उल्टी') || lower.includes('vomit') || lower.includes('nausea') || lower.includes('मतली')) {
    addAssociated('Nausea / Vomiting');
  }
  if (lower.includes('दस्त') || lower.includes('loose motion') || lower.includes('diarrhea') || lower.includes('कब्ज') || lower.includes('constipation')) {
    addAssociated('Altered Bowel Habits (Diarrhea / Constipation)');
  }

  // MUSCULOSKELETAL / JOINTS
  if (lower.includes('घुटने') || lower.includes('knee') || lower.includes('जोड़ों') || lower.includes('joint') || lower.includes('कमर') || lower.includes('back pain') || lower.includes('गर्दन')) {
    addComplaint('Musculoskeletal / Joint Pain');
    extraction.location = lower.includes('घुटने') ? 'Knee Joints' : (lower.includes('कमर') ? 'Lumbar Spine' : 'Multiple Joints');
  }

  // CHRONIC MEDICAL HISTORY
  if (lower.includes('बीपी') || lower.includes('bp') || lower.includes('blood pressure') || lower.includes('hypertension') || lower.includes('उच्च रक्तचाप')) {
    addHistory('Essential Hypertension');
  }
  if (lower.includes('शुगर') || lower.includes('sugar') || lower.includes('diabetes') || lower.includes('मधुमेह')) {
    addHistory('Type 2 Diabetes Mellitus');
  }
  if (lower.includes('थायराइड') || lower.includes('thyroid')) {
    addHistory('Hypothyroidism');
  }
  if (lower.includes('अस्थमा') || lower.includes('asthma') || lower.includes('दमा')) {
    addHistory('Bronchial Asthma');
  }

  // MEDICATIONS
  if (lower.includes('मेटफॉर्मिन') || lower.includes('metformin') || lower.includes('glycomet')) addMed('Tab Metformin (Anti-diabetic)');
  if (lower.includes('एम्लोडिपिन') || lower.includes('amlodipine') || lower.includes('telma') || lower.includes('telmisartan')) addMed('Antihypertensive Medication');
  if (lower.includes('पैरासिटामोल') || lower.includes('paracetamol') || lower.includes('dolo') || lower.includes('calpol')) addMed('Tab Paracetamol (Antipyretic/Analgesic)');

  // =========================================================================
  // 3. RED FLAG SAFETY EVALUATION
  // =========================================================================
  if (extraction.chiefComplaint.some(c => c.includes('Chest')) && (extraction.radiation || extraction.associatedSymptoms.some(s => s.includes('Dyspnea')))) {
    potentialRedFlags.push({
      ruleId: 'RF_CHEST_001',
      name: isHindi ? 'सीने में तेज दर्द व सांस में रुकावट (तीव्र हृदय जोखिम)' : 'Acute Coronary Syndrome Suspected (RF_CHEST_001)',
      priority: 'HIGH'
    });
  }

  if (extraction.chiefComplaint.some(c => c.includes('Fever')) && lower.includes('104')) {
    potentialRedFlags.push({
      ruleId: 'RF_FEVER_002',
      name: isHindi ? 'अति तीव्र ज्वर (Hyperpyrexia Alert)' : 'Hyperpyrexia Emergency (>104°F)',
      priority: 'HIGH'
    });
  }

  // =========================================================================
  // 4. CONTEXT-AWARE DYNAMIC QUESTION GENERATION
  // =========================================================================
  let nextQHindi = '';
  let nextQEnglish = '';

  const primaryComplaint = extraction.chiefComplaint[0] || '';

  // Tailor question based on the actual detected disease / complaint
  if (currentSection === INTERVIEW_SECTIONS.CHIEF_COMPLAINT) {
    if (primaryComplaint.includes('Fever')) {
      nextQHindi = 'बुखार कितने दिनों से है, क्या ठंड या कपकपी लग रही है, और क्या खांसी या पेशाब में जलन जैसी कोई अन्य तकलीफ है?';
      nextQEnglish = 'How many days have you had fever, are you having chills or shivering, and do you have cough or burning urination?';
    } else if (primaryComplaint.includes('Chest')) {
      nextQHindi = 'सीने का दर्द कब शुरू हुआ, क्या यह बाएं हाथ, जबड़े या कंधे में फैल रहा है, और क्या सांस फूलने या पसीना आने की तकलीफ है?';
      nextQEnglish = 'When did the chest pain start, does it radiate to your left arm or jaw, and are you having shortness of breath or cold sweats?';
    } else if (primaryComplaint.includes('Headache')) {
      nextQHindi = 'सिरदर्द सिर के किस हिस्से में है (माथे पर या एक तरफ), क्या उल्टी या आंखों के आगे धुंधलापन महसूस हो रहा है?';
      nextQEnglish = 'Which part of the head is aching (forehead or one-sided), and are you experiencing nausea or blurry vision?';
    } else if (primaryComplaint.includes('Abdominal')) {
      nextQHindi = 'पेट में दर्द किस जगह है (ऊपर, नाभि के पास या नीचे), और क्या उल्टी, दस्त या गैस की समस्या हो रही है?';
      nextQEnglish = 'Where exactly is the abdominal pain located, and do you have vomiting, diarrhea, or severe acidity?';
    } else if (primaryComplaint.includes('Breathlessness')) {
      nextQHindi = 'सांस लेने में तकलीफ कब से हो रही है, क्या लेटने पर सांस ज्यादा फूलती है, या सीटी जैसी आवाज (Wheezing) आ रही है?';
      nextQEnglish = 'When did the breathlessness start, is it worse when lying flat, and do you have wheezing sounds?';
    } else if (primaryComplaint.includes('Joint')) {
      nextQHindi = 'दर्द किस जोड़ या हिस्से में है, क्या सुबह उठने पर जकड़न या सूजन रहती है, और क्या चलने-फिरने में परेशानी होती है?';
      nextQEnglish = 'Which joint or body part is painful, is there morning stiffness or swelling, and does it hinder walking?';
    } else {
      nextQHindi = 'आपकी यह तकलीफ कब से शुरू हुई है और इसके साथ शरीर में कोई अन्य लक्षण महसूस हो रहे हैं?';
      nextQEnglish = 'How long have you been experiencing this, and are there any other associated bodily symptoms?';
    }
  } else if (currentSection === INTERVIEW_SECTIONS.HPI) {
    nextQHindi = 'क्या आपको पहले से कोई पुरानी बीमारी है जैसे हाई ब्लड प्रेशर (BP), शुगर (Diabetes), थायराइड, अस्थमा या दिल की बीमारी?';
    nextQEnglish = 'Do you have any known past medical conditions such as high blood pressure, diabetes, thyroid, asthma, or heart disease?';
  } else if (currentSection === INTERVIEW_SECTIONS.PAST_HISTORY || currentSection === INTERVIEW_SECTIONS.MEDICATION_HISTORY) {
    nextQHindi = 'क्या आप रोजाना कोई नियमित दवाइयां ले रहे हैं, और क्या आपको किसी दवा (जैसे पेनिसिलिन, सल्फा) या भोजन से कोई एलर्जी है?';
    nextQEnglish = 'Are you taking any daily prescription medications, and do you have any known drug or food allergies?';
  } else if (currentSection === INTERVIEW_SECTIONS.ALLERGY_HISTORY) {
    nextQHindi = 'धन्यवाद। आपके लक्षणों व स्वास्थ्य इतिहास का संपूर्ण विवरण डॉक्टर परामर्श हेतु तैयार कर लिया गया है।';
    nextQEnglish = 'Thank you. Your complete clinical history intake has been structured for the physician consult.';
  } else {
    nextQHindi = 'धन्यवाद। आपका स्वास्थ्य विवरण सुरक्षित रूप से दर्ज हो गया है।';
    nextQEnglish = 'Thank you. Your clinical intake is successfully recorded.';
  }

  const selectedQuestion = isHindi ? nextQHindi : nextQEnglish;

  logger.info(`[Clinical AI Engine] Processed response: "${text.substring(0, 40)}..." -> Complaints: [${extraction.chiefComplaint.join(', ')}], NextQ: "${selectedQuestion.substring(0, 40)}..."`);

  return {
    extraction,
    missingFields: [],
    isSectionComplete: true,
    nextSection: nextSectionCandidate,
    nextQuestion: selectedQuestion,
    nextQuestionHindi: nextQHindi,
    potentialRedFlags
  };
}

module.exports = {
  processInterviewTurn
};
