// Negation and Entity Context Parser for Clinical Safety Triage
// Handles Hindi, Indian English, and standard medical phrases

/**
 * Checks if the statement refers to another individual (e.g. father, mother, friend, relative)
 * rather than the current authenticated patient.
 */
function detectSubjectContext(text = '') {
  const lower = text.toLowerCase();
  
  const thirdPartyPatterns = [
    /\b(my\s+(father|dad|mother|mom|brother|sister|uncle|aunt|friend|neighbor|relative|grandfather|grandmother|son|daughter|husband|wife|cousin))\b/i,
    /\b(his|her|their|someone\s+else)\b/i,
    /(मेरे\s+(पिताजी|माताजी|भाई|बहन|चाचाजी|दोस्त|पति|पत्नी|दादाजी|दादीजी|बच्चे))/i,
    /(मेरी\s+(माताजी|बहन|चाचीजी|पत्नी|दादीजी|बेटी))/i,
    /(उनको|उन्हें|पिताजी\s+को|माताजी\s+को)/i
  ];

  const firstPersonPatterns = [
    /\b(i\s+have|i\s+feel|i\s+am|i'm|my\s+(chest|head|stomach|throat|arm|leg|body|face))\b/i,
    /(मुझे|मेरे\s+(सीने|सिर|पेट|गले|हाथ|पैर|शरीर|चेहरे)|मैं)/i
  ];

  for (const pattern of thirdPartyPatterns) {
    if (pattern.test(lower)) {
      // If there are explicit first person statements mixed, evaluate carefully
      const hasFirstPerson = firstPersonPatterns.some(fp => fp.test(lower));
      if (!hasFirstPerson) {
        return { isThirdParty: true, subject: 'THIRD_PARTY_INDIVIDUAL' };
      }
    }
  }

  return { isThirdParty: false, subject: 'PATIENT' };
}

/**
 * Segments sentences and identifies negated clinical clauses in English and Hindi.
 */
function extractPositiveClauses(text = '') {
  if (!text) return [];

  // Split text into clauses / sentences by punctuation or conjunctions
  const rawClauses = text.split(/[,.;:!\n\r]+|\b(and|but|aur|lekin|par|tatha)\b/i)
    .map(c => c ? c.trim() : '')
    .filter(Boolean);

  const positiveClauses = [];

  for (const clause of rawClauses) {
    const lower = clause.toLowerCase();
    
    // Negation patterns in English and Hindi
    const isNegated = 
      /\b(no|not|do\s+not|don't|does\s+not|doesn't|did\s+not|didn't|without|never|denies|ruled\s+out)\b/i.test(lower) ||
      /(नहीं|ना|कोई\s+नहीं|बिल्कुल\s+नहीं|दर्द\s+नहीं|तकलीफ\s+नहीं)/i.test(lower);

    if (!isNegated) {
      positiveClauses.push(clause);
    }
  }

  return positiveClauses;
}

/**
 * Normalizes symptoms from positive clauses only into standardized keywords
 */
function normalizePositiveKeywords(symptoms = [], narrative = '') {
  const { isThirdParty } = detectSubjectContext(narrative);
  
  // If the entire narrative is about a third party, patient has 0 active emergency symptoms
  if (isThirdParty) {
    return {
      isThirdParty: true,
      positiveKeywords: []
    };
  }

  const positiveClauses = extractPositiveClauses(narrative);
  const positiveText = `${symptoms.join(' ')} ${positiveClauses.join(' ')}`.toLowerCase();
  
  const keywords = new Set();

  // Explicit Emergency / SOS / Assistance Request
  if (
    positiveText.includes('emergency') || 
    positiveText.includes('आपातकाल') || 
    positiveText.includes('आपातकालीन') || 
    positiveText.includes('help me') || 
    positiveText.includes('save me') || 
    positiveText.includes('मदद') || 
    positiveText.includes('madad') || 
    positiveText.includes('108') || 
    positiveText.includes('ambulance') || 
    positiveText.includes('sos') || 
    positiveText.includes('urgent help') || 
    positiveText.includes('immediate assistance') || 
    positiveText.includes('emergency doctor') || 
    positiveText.includes('तत्काल सहायता')
  ) {
    keywords.add('emergency_help_request');
    keywords.add('explicit_emergency');
  }

  // Cardiac & Chest & Heart Attack
  if (positiveText.includes('heart attack') || positiveText.includes('हार्ट अटैक') || positiveText.includes('दिल का दौरा') || positiveText.includes('cardiac arrest') || positiveText.includes('severe chest pain') || positiveText.includes('सीने में बहुत तेज दर्द') || positiveText.includes('सीने में तीव्र दर्द')) {
    keywords.add('heart_attack');
    keywords.add('chest_pain');
    keywords.add('severe_chest_pain');
  }
  if (positiveText.includes('chest pain') || positiveText.includes('सीने में दर्द') || positiveText.includes('chest tightness') || positiveText.includes('छाती में दर्द') || positiveText.includes('precordial pain') || positiveText.includes('chest discomfort')) {
    keywords.add('chest_pain');
  }
  if (positiveText.includes('breath') || positiveText.includes('dyspnea') || positiveText.includes('सांस फूल') || positiveText.includes('सांस लेने में') || positiveText.includes('shortness of breath') || positiveText.includes('breathing difficulty')) {
    keywords.add('breathlessness');
  }
  if (positiveText.includes('severe breathlessness') || positiveText.includes('cannot breathe') || positiveText.includes('सांस नहीं आ रही') || positiveText.includes('दम घुट') || positiveText.includes('दम घुट रहा')) {
    keywords.add('severe_breathlessness');
    keywords.add('breathlessness');
  }
  if (positiveText.includes('left arm') || positiveText.includes('बाएं हाथ') || positiveText.includes('बांह में दर्द') || (positiveText.includes('arm') && positiveText.includes('radiation'))) {
    keywords.add('arm_radiation');
  }
  if (positiveText.includes('jaw') || positiveText.includes('जबड़े में दर्द') || positiveText.includes('jabde')) {
    keywords.add('jaw_radiation');
  }
  if (positiveText.includes('sweat') || positiveText.includes('पसीना') || positiveText.includes('diaphoresis') || positiveText.includes('chills and sweat')) {
    keywords.add('diaphoresis');
  }
  if (positiveText.includes('pressure') || positiveText.includes('दबाव') || positiveText.includes('heaviness') || positiveText.includes('भारीपन')) {
    keywords.add('severe_pressure');
  }

  // Stroke / FAST Neurological
  if (positiveText.includes('stroke') || positiveText.includes('स्ट्रोक') || positiveText.includes('लकवा')) {
    keywords.add('slurred_speech');
    keywords.add('sudden_paralysis');
  }
  if (positiveText.includes('slur') || positiveText.includes('bolne me') || positiveText.includes('बोलने में लड़खड़ाहट') || positiveText.includes('speech difficulty')) {
    keywords.add('slurred_speech');
  }
  if (positiveText.includes('facial droop') || positiveText.includes('face numb') || positiveText.includes('चेहरा सुन्न') || positiveText.includes('चेहरा टेढ़ा')) {
    keywords.add('facial_droop');
  }
  if (positiveText.includes('arm weakness') || positiveText.includes('kamzori') || positiveText.includes('हाथ में कमजोरी') || positiveText.includes('one side weakness') || positiveText.includes('लकवा')) {
    keywords.add('arm_weakness');
    keywords.add('sudden_paralysis');
  }
  if (positiveText.includes('vision loss') || positiveText.includes('अचानक दिखना बंद') || positiveText.includes('blindness')) {
    keywords.add('sudden_vision_loss');
  }

  // Unconscious & Collapse
  if (positiveText.includes('unconscious') || positiveText.includes('बेहोश') || positiveText.includes('unresponsive') || positiveText.includes('होश नहीं') || positiveText.includes('fainted') || positiveText.includes('collapsed') || positiveText.includes('गिर पड़े') || positiveText.includes('चक्कर खाकर गिर')) {
    keywords.add('unconscious');
    keywords.add('unresponsive');
    keywords.add('collapsed');
  }

  // Anaphylaxis
  if (positiveText.includes('throat closing') || positiveText.includes('गला बंद') || positiveText.includes('throat swelling') || positiveText.includes('गले में सूजन')) {
    keywords.add('throat_swelling');
    keywords.add('anaphylaxis');
  }
  if (positiveText.includes('tongue swelling') || positiveText.includes('जीभ में सूजन')) {
    keywords.add('tongue_swelling');
  }

  // Hemorrhage
  if (positiveText.includes('severe bleeding') || positiveText.includes('खून बह रहा') || positiveText.includes('uncontrolled bleeding')) {
    keywords.add('uncontrolled_bleeding');
  }
  if (positiveText.includes('vomiting blood') || positiveText.includes('खून की उल्टी')) {
    keywords.add('vomiting_blood_large');
  }
  if (positiveText.includes('coughing blood') || positiveText.includes('खांसी में खून')) {
    keywords.add('coughing_blood_large');
  }

  // Poison / Overdose
  if (positiveText.includes('poison') || positiveText.includes('ज़हर') || positiveText.includes('consumed chemical') || positiveText.includes('overdose')) {
    keywords.add('poison_ingestion');
    keywords.add('overdose_substance');
  }

  // Crisis / Self-Harm
  if (positiveText.includes('suicide') || positiveText.includes('kill myself') || positiveText.includes('खुदकुशी') || positiveText.includes('जान देना')) {
    keywords.add('immediate_self_harm');
    keywords.add('suicide_intent');
  }

  // Severe Trauma
  if (positiveText.includes('car accident') || positiveText.includes('severe crash') || positiveText.includes('भीषण दुर्घटना') || (positiveText.includes('accident') && positiveText.includes('severe'))) {
    keywords.add('severe_accident_trauma');
  }

  return {
    isThirdParty: false,
    positiveKeywords: Array.from(keywords)
  };
}

module.exports = {
  detectSubjectContext,
  extractPositiveClauses,
  normalizePositiveKeywords
};
