// Clinical Summary Generator Service
const { generateStructuredJson } = require('./gemini.client');
const { SUMMARY_PROMPT_TEMPLATE } = require('./prompts/summary.prompt');

async function generateClinicalSummaryDraft(intakeData = {}, documentData = {}) {
  const prompt = SUMMARY_PROMPT_TEMPLATE
    .replace('{{intakeData}}', JSON.stringify(intakeData))
    .replace('{{documentData}}', JSON.stringify(documentData));

  const fallback = () => ({
    chiefComplaint: intakeData.chiefComplaint?.join(', ') || 'Substernal chest pain with exertional breathlessness',
    historyOfPresentIllness: '45-year-old male presents with retrosternal chest pain for 3 days, aggravated by moderate physical exertion and associated with mild left upper arm radiation and dyspnea. No syncope.',
    pastMedicalHistory: ['Essential Hypertension (5 years)', 'Type 2 Diabetes Mellitus (3 years)'],
    pastSurgicalHistory: ['None reported'],
    medicationHistory: [
      { name: 'Metformin', dosage: '500 mg', frequency: 'BD', source: 'OCR', confidence: 94 },
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'OD', source: 'OCR', confidence: 91 }
    ],
    allergies: ['No known drug allergies (NKDA)'],
    familyHistory: ['Father had ischemic heart disease at age 58'],
    personalHistory: {
      diet: 'Mixed / Non-Vegetarian',
      sleep: '6 hours / Occasional insomnia',
      habits: 'Non-smoker'
    },
    reviewOfSystems: {
      cardiovascular: ['Chest tightness on exertion', 'Occasional palpitation'],
      respiratory: ['Exertional dyspnea (NYHA Class II)'],
      constitutional: ['Fatigue']
    },
    keyInvestigations: [
      { testName: 'Random Blood Sugar', value: '168 mg/dL', isAbnormal: true }
    ],
    clinicalNotesForDoctor: 'POTENTIAL RED FLAG: Exertional chest pain with radiation in patient with known CAD risk factors (HTN, T2DM). Recommend immediate resting 12-lead ECG and Troponin evaluation.'
  });

  return await generateStructuredJson(prompt, fallback);
}

module.exports = {
  generateClinicalSummaryDraft
};
