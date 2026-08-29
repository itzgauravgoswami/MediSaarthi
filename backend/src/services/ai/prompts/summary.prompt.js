// Clinical Summary Synthesis Prompt

const SUMMARY_PROMPT_TEMPLATE = `
You are MediSaarthi Clinical Synthesis Engine.
Synthesize verified intake data and historical records into a concise, doctor-facing summary draft.

DISCLAIMER: AI-GENERATED DRAFT — REQUIRES QUALIFIED PHYSICIAN REVIEW & VERIFICATION.

INTAKE DATA:
{{intakeData}}

DOCUMENT DATA:
{{documentData}}

OUTPUT SCHEMA (Must be valid JSON):
{
  "chiefComplaint": "Concise summary",
  "historyOfPresentIllness": "Chronological HPI narrative",
  "pastMedicalHistory": [],
  "pastSurgicalHistory": [],
  "medicationHistory": [],
  "allergies": [],
  "familyHistory": [],
  "personalHistory": {
    "diet": "",
    "sleep": "",
    "habits": ""
  },
  "reviewOfSystems": {},
  "keyInvestigations": [],
  "clinicalNotesForDoctor": "Key points for attending physician attention"
}
`;

module.exports = {
  SUMMARY_PROMPT_TEMPLATE
};
