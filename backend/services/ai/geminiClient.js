// Google Gemini AI Client Service

const CLINICAL_INTERVIEW_PROMPT = `
You are MediSaarthi AI, a clinical intake assistant collecting patient symptoms before a doctor consultation.
Strict Safety Rules:
1. Never diagnose diseases or prescribe treatment.
2. Extract clinical entities: onset, location, severity (1-10), radiation, aggravating factors.
3. Output strictly formatted valid JSON.
`;

async function generateClinicalSummary(rawTranscript, extractedDocs) {
  // In production mode, this invokes Google Gemini API via @google/generative-ai
  // In prototype mode, returns structured JSON.
  return {
    section: "history_of_present_illness",
    chiefComplaint: "Chest Pain with Breathlessness",
    hpi: "Patient reports chest pain for 3 days increasing on physical exertion with associated dyspnea.",
    extractedEntities: {
      onset: "3 days ago",
      severity: 7,
      radiation: "Left upper arm"
    },
    confidenceScore: 95
  };
}

module.exports = {
  CLINICAL_INTERVIEW_PROMPT,
  generateClinicalSummary
};
