// Clinical Interview AI Engine with Relevance Verification & Concise Questioning
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

  // If AI did not set isRelevant or failed to structure properly, run deterministic relevance check
  const verifiedResult = verifyResponseRelevance(currentSection, patientResponse, aiResult, language, nextSectionCandidate);
  return verifiedResult;
}

/**
 * Deterministic Relevance Verification Guard
 */
function verifyResponseRelevance(currentSection, response, aiResult, language, nextSectionCandidate) {
  const isHindi = (language || '').startsWith('hi');
  const text = (response || '').trim();
  const lower = text.toLowerCase();

  // 1. Check CHIEF_COMPLAINT relevance
  if (currentSection === INTERVIEW_SECTIONS.CHIEF_COMPLAINT) {
    const isPurelyAge = /^(i am |i'm |my age is )?\d{1,3}(\s*years?(\s*old)?)?$/i.test(text) || /^(\d{1,3}\s*(साल|वर्ष|उम्र))$/i.test(text);
    const hasGreetingOnly = /^(hi|hello|hey|namaste|नमस्ते|प्रणाम)$/i.test(text);
    const hasSymptoms = (aiResult.extraction?.chiefComplaint && aiResult.extraction.chiefComplaint.length > 0) ||
      /fever|pain|cough|cold|headache|stomach|chest|vomit|rash|itching|बुखार|दर्द|खांसी|जुकाम|सिरदर्द|पेट|सीने|उल्टी|खुजली/i.test(lower);

    if ((isPurelyAge || hasGreetingOnly || !hasSymptoms) && (!aiResult.extraction?.chiefComplaint?.length)) {
      return {
        ...aiResult,
        isRelevant: false,
        nextSection: INTERVIEW_SECTIONS.CHIEF_COMPLAINT,
        nextQuestion: isHindi 
          ? "धन्यवाद। क्या आप कृपया बता सकते हैं कि आज आपको क्या मुख्य शारीरिक तकलीफ या लक्षण (जैसे बुखार, दर्द, खांसी आदि) महसूस हो रहे हैं?"
          : "Thank you. Could you please specify what main symptoms or health difficulties (such as fever, pain, cough, etc.) you are experiencing today?",
        nextQuestionHindi: "धन्यवाद। क्या आप कृपया बता सकते हैं कि आज आपको क्या मुख्य शारीरिक तकलीफ या लक्षण महसूस हो रहे हैं?"
      };
    }
  }

  // 2. Check DURATION_SEVERITY relevance
  if (currentSection === INTERVIEW_SECTIONS.DURATION_SEVERITY) {
    const hasDurationOrTime = aiResult.extraction?.duration || aiResult.extraction?.onset ||
      /(\d+|एक|दो|तीन|चार|पांच|छह|सात|आठ|दस|one|two|three|four|five|six|seven|ten)\s*(दिन|दिनों|days?|घंटे|hours?|हफ्ते|weeks?|महीने|months?)/i.test(lower) ||
      /आज|today|सुबह|morning|कल|yesterday|अचानक|sudden|severe|mild|तेज|हल्का|दिन|days/i.test(lower);

    if (!hasDurationOrTime && aiResult.isRelevant === false) {
      return {
        ...aiResult,
        isRelevant: false,
        nextSection: INTERVIEW_SECTIONS.DURATION_SEVERITY,
        nextQuestion: isHindi
          ? "कृपया स्पष्ट करें कि यह तकलीफ आपको कितने दिनों या समय से हो रही है (उदाहरण के लिए: 2 दिन, 1 हफ्ता या आज सुबह से)?"
          : "Could you please specify how long you have been experiencing this issue (for example: 2 days, 1 week, or since morning)?",
        nextQuestionHindi: "कृपया स्पष्ट करें कि यह तकलीफ आपको कितने दिनों या समय से हो रही है (जैसे 2 दिन या 1 हफ्ता)?"
      };
    }
  }

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
    medications: [...(collectedData?.medications || [])]
  };

  const potentialRedFlags = [];

  const addComplaint = (c) => { if (!extraction.chiefComplaint.includes(c)) extraction.chiefComplaint.push(c); };
  const addAssociated = (s) => { if (!extraction.associatedSymptoms.includes(s)) extraction.associatedSymptoms.push(s); };
  const addHistory = (h) => { if (!extraction.pastMedicalHistory.includes(h)) extraction.pastMedicalHistory.push(h); };
  const addMed = (m) => { if (!extraction.medications.includes(m)) extraction.medications.push(m); };

  // 1. Duration / Onset Parsing
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

  // 2. Symptom & Condition Classification
  if (lower.includes('बुखार') || lower.includes('fever') || lower.includes('ताप') || lower.includes('temperature')) {
    addComplaint('Fever / Pyrexia');
  }
  if (lower.includes('सीने') || lower.includes('chest') || lower.includes('छाती') || lower.includes('दिल')) {
    addComplaint('Chest Pain / Precordial Discomfort');
  }
  if (lower.includes('सांस') || lower.includes('breath') || lower.includes('dyspnea')) {
    addAssociated('Shortness of Breath');
    if (extraction.chiefComplaint.length === 0) addComplaint('Breathlessness');
  }
  if (lower.includes('खांसी') || lower.includes('cough') || lower.includes('जुकाम') || lower.includes('cold')) {
    addComplaint('Cough & Upper Respiratory Symptoms');
  }
  if (lower.includes('सिर') || lower.includes('headache') || lower.includes('माथा')) {
    addComplaint('Headache');
  }
  if (lower.includes('पेट') || lower.includes('stomach') || lower.includes('abdomen') || lower.includes('गैस') || lower.includes('acidity')) {
    addComplaint('Abdominal Discomfort / Acidity');
  }
  if (lower.includes('घुटने') || lower.includes('knee') || lower.includes('जोड़ों') || lower.includes('joint') || lower.includes('कमर') || lower.includes('back')) {
    addComplaint('Musculoskeletal / Joint Pain');
  }
  if (lower.includes('त्वचा') || lower.includes('skin') || lower.includes('खुजली') || lower.includes('itching') || lower.includes('rash') || lower.includes('दाने')) {
    addComplaint('Dermatological Condition / Rash');
  }

  // 3. Past Medical History & Medications
  if (lower.includes('बीपी') || lower.includes('bp') || lower.includes('hypertension') || lower.includes('रक्तचाप')) {
    addHistory('Hypertension');
  }
  if (lower.includes('शुगर') || lower.includes('sugar') || lower.includes('diabetes') || lower.includes('मधुमेह')) {
    addHistory('Diabetes Mellitus');
  }
  if (lower.includes('थायराइड') || lower.includes('thyroid')) {
    addHistory('Thyroid Disorder');
  }
  if (lower.includes('पैरासिटामोल') || lower.includes('paracetamol') || lower.includes('dolo') || lower.includes('tablet')) {
    addMed('Regular Medications Recorded');
  }

  // 4. Concise Questions Sequence
  let nextQHindi = '';
  let nextQEnglish = '';

  if (currentSection === INTERVIEW_SECTIONS.CHIEF_COMPLAINT) {
    const complaint = extraction.chiefComplaint[0] || 'लक्षण';
    nextQHindi = `यह समस्या आपको कितने दिनों या समय से हो रही है, और क्या इसके साथ कोई अन्य लक्षण (जैसे बुखार, कमजोरी) भी महसूस हो रहे हैं?`;
    nextQEnglish = `How long have you been experiencing this, and do you have any associated symptoms?`;
  } else if (currentSection === INTERVIEW_SECTIONS.DURATION_SEVERITY) {
    nextQHindi = `क्या आपको पहले से कोई पुरानी बीमारी (जैसे BP, शुगर, थायराइड) है या आप कोई नियमित दवा ले रहे हैं?`;
    nextQEnglish = `Do you have any past medical conditions (such as BP, diabetes, thyroid) or daily medications?`;
  } else {
    nextQHindi = `धन्यवाद। आपके लक्षणों का विवरण पूरा हो गया है। हम आपके लिए उपयुक्त विशेषज्ञ डॉक्टर के पास अपॉइंटमेंट स्लॉट बुक कर रहे हैं।`;
    nextQEnglish = `Thank you. Your clinical details are recorded. We are now booking your consultation slot with the specialist doctor.`;
  }

  const selectedQuestion = isHindi ? nextQHindi : nextQEnglish;

  return {
    isRelevant: true,
    extraction,
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
