// Hybrid Emergency Decision Engine
// Combines Deterministic Safety Rules, Negation & Entity Parsing, and Strict Gemini Schema Validation

const { z } = require('zod');
const { CLINICAL_EMERGENCY_RULES } = require('./emergencyRules');
const { normalizePositiveKeywords, detectSubjectContext } = require('./negationEntityParser');
const { generateStructuredJson } = require('../ai/gemini.client');
const { CLINICAL_URGENCY } = require('../../constants/statuses');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// Strict Zod schema for AI medical triage
const ClinicalRiskAnalysisSchema = z.object({
  urgency: z.enum(['NORMAL', 'MONITOR', 'URGENT', 'EMERGENCY']),
  confidence: z.number().min(0).max(1),
  symptoms: z.array(z.string()).default([]),
  riskIndicators: z.array(z.string()).default([]),
  clinicalCategories: z.array(z.string()).default([]),
  recommendedSpecialty: z.string().default('General Medicine'),
  requiresImmediateAttention: z.boolean().default(false),
  reason: z.string().min(1)
});

class EmergencyDecisionEngine {
  /**
   * Layer 1: Evaluates deterministic rules against positive, non-negated symptoms
   */
  evaluateDeterministicRules(symptoms = [], narrative = '') {
    const { isThirdParty, positiveKeywords } = normalizePositiveKeywords(symptoms, narrative);

    if (isThirdParty || positiveKeywords.length === 0) {
      return {
        matched: false,
        rules: [],
        positiveKeywords: []
      };
    }

    const matchedRules = [];

    for (const rule of CLINICAL_EMERGENCY_RULES) {
      if (rule.id === 'EMERG_CARDIAC_001') {
        const hasChestPain = positiveKeywords.includes('chest_pain');
        const matchedCoFactors = rule.coFactorKeywords.filter(k => positiveKeywords.includes(k));

        if (hasChestPain && matchedCoFactors.length >= rule.minCoFactors) {
          matchedRules.push(rule);
        }
      } else {
        const hasRequired = rule.requiredKeywords.some(k => positiveKeywords.includes(k));
        if (hasRequired) {
          matchedRules.push(rule);
        }
      }
    }

    return {
      matched: matchedRules.length > 0,
      rules: matchedRules,
      positiveKeywords
    };
  }

  /**
   * Layer 2: Calls Gemini with strict clinical triage prompt and validates schema
   */
  async evaluateGeminiRisk(transcript = '', patientContext = {}) {
    const prompt = `
You are an expert Clinical Triage AI assistant in an emergency department setting.
Analyze the following patient voice transcript for acute clinical risk, severity, and urgency.

STRICT MEDICAL GUIDELINES:
1. NEVER provide a definitive medical disease diagnosis (e.g., do NOT say "You definitely have a myocardial infarction" or "This is stroke").
2. Your purpose is TRIAGE, RISK CATEGORIZATION, and SPECIALIST ROUTING.
3. Classify clinical urgency strictly into one of:
   - "NORMAL": Routine or mild symptoms with no acute danger.
   - "MONITOR": Mild-to-moderate symptoms that may need outpatient care if persistent.
   - "URGENT": Potentially serious symptoms needing human doctor evaluation today.
   - "EMERGENCY": Potentially life-threatening acute symptoms needing immediate emergency intervention.
4. Carefully distinguish between the patient's symptoms and symptoms of other persons (e.g. "my father had chest pain" is not an emergency for the patient).
5. Respect negations (e.g. "I do NOT have chest pain" or "कोई दर्द नहीं है" is a negative finding).

PATIENT CONTEXT (if relevant):
Age: ${patientContext.age || 'Unknown'} | Gender: ${patientContext.gender || 'Unknown'} | Known Conditions: ${patientContext.conditions || 'None'}

PATIENT TRANSCRIPT:
"${transcript}"

OUTPUT SCHEMA (Must be valid JSON only, no markdown formatting):
{
  "urgency": "NORMAL" | "MONITOR" | "URGENT" | "EMERGENCY",
  "confidence": 0.95,
  "symptoms": ["reported symptoms"],
  "riskIndicators": ["sudden onset", "dyspnea", etc.],
  "clinicalCategories": ["cardiac" | "neurological" | "respiratory" | "general" | etc.],
  "recommendedSpecialty": "Cardiology" | "Neurology" | "Pulmonology" | "Emergency Medicine" | "General Medicine",
  "requiresImmediateAttention": true | false,
  "reason": "Clear, objective triage rationale without claiming definitive diagnosis"
}
`;

    const fallbackFn = () => this.generateHeuristicAssessment(transcript);

    try {
      const rawResult = await generateStructuredJson(prompt, fallbackFn);
      const parsed = ClinicalRiskAnalysisSchema.safeParse(rawResult);

      if (parsed.success) {
        return parsed.data;
      }

      logger.warn(`[EmergencyEngine] Gemini output failed schema validation: ${JSON.stringify(parsed.error.errors)}. Using validated heuristic fallback.`);
      return this.generateHeuristicAssessment(transcript);
    } catch (err) {
      logger.error(`[EmergencyEngine] Gemini analysis error: ${err.message}`);
      return this.generateHeuristicAssessment(transcript);
    }
  }

  /**
   * Validated heuristic fallback when LLM is unavailable or unparseable
   */
  generateHeuristicAssessment(transcript = '') {
    const { isThirdParty, positiveKeywords } = normalizePositiveKeywords([], transcript);
    const { matched, rules } = this.evaluateDeterministicRules([], transcript);

    if (isThirdParty) {
      return {
        urgency: CLINICAL_URGENCY.NORMAL,
        confidence: 0.95,
        symptoms: [],
        riskIndicators: ['Subject is third party'],
        clinicalCategories: ['general'],
        recommendedSpecialty: 'General Medicine',
        requiresImmediateAttention: false,
        reason: 'Transcript discusses health history of another individual, not the active patient.'
      };
    }

    if (matched && rules.length > 0) {
      const rule = rules[0];
      return {
        urgency: CLINICAL_URGENCY.EMERGENCY,
        confidence: 0.95,
        symptoms: positiveKeywords,
        riskIndicators: [rule.name],
        clinicalCategories: [rule.specialty.toLowerCase()],
        recommendedSpecialty: rule.specialty,
        requiresImmediateAttention: true,
        reason: `Deterministic safety rule triggered: ${rule.description}`
      };
    }

    const lower = transcript.toLowerCase();
    if (lower.includes('pain') || lower.includes('dard') || lower.includes('fever') || lower.includes('bukhar') || lower.includes('vomit') || lower.includes('ulti')) {
      return {
        urgency: CLINICAL_URGENCY.MONITOR,
        confidence: 0.85,
        symptoms: ['reported discomfort'],
        riskIndicators: ['mild to moderate symptoms'],
        clinicalCategories: ['general'],
        recommendedSpecialty: 'General Medicine',
        requiresImmediateAttention: false,
        reason: 'Non-emergency clinical symptoms reported.'
      };
    }

    return {
      urgency: CLINICAL_URGENCY.NORMAL,
      confidence: 0.90,
      symptoms: [],
      riskIndicators: [],
      clinicalCategories: ['general'],
      recommendedSpecialty: 'General Medicine',
      requiresImmediateAttention: false,
      reason: 'No acute clinical emergency indicators detected in transcript.'
    };
  }

  /**
   * Layer 3: Decision Engine Synthesis
   * Combines Layer 1 deterministic safety rules and Layer 2 Gemini risk assessment
   */
  async decideClinicalUrgency(transcript = '', patientContext = {}) {
    const threshold = config.emergency?.confidenceThreshold || 0.80;

    // 1. Evaluate Deterministic Safety Rules
    const deterministic = this.evaluateDeterministicRules([], transcript);

    // 2. Evaluate AI Risk Assessment
    const aiAssessment = await this.evaluateGeminiRisk(transcript, patientContext);

    // 3. Synthesis
    let finalUrgency = aiAssessment.urgency;
    let finalConfidence = aiAssessment.confidence;
    let requiresImmediateAttention = aiAssessment.requiresImmediateAttention;
    let recommendedSpecialty = aiAssessment.recommendedSpecialty;
    let clinicalCategories = aiAssessment.clinicalCategories || [];
    let symptoms = Array.from(new Set([...(aiAssessment.symptoms || []), ...deterministic.positiveKeywords]));
    let riskIndicators = [...(aiAssessment.riskIndicators || [])];
    let reason = aiAssessment.reason;

    // Rule 1: Deterministic emergency rule ALWAYS takes priority
    if (deterministic.matched && deterministic.rules.length > 0) {
      finalUrgency = CLINICAL_URGENCY.EMERGENCY;
      finalConfidence = Math.max(finalConfidence, 0.95);
      requiresImmediateAttention = true;
      recommendedSpecialty = deterministic.rules[0].specialty;
      clinicalCategories = Array.from(new Set([...clinicalCategories, deterministic.rules[0].specialty.toLowerCase()]));
      riskIndicators.push(...deterministic.rules.map(r => r.name));
      reason = `Clinical Safety Rule Triggered: ${deterministic.rules[0].description}`;
    } 
    // Rule 2: If AI says EMERGENCY but confidence is below threshold and no deterministic rule matched, downgrade to URGENT
    else if (finalUrgency === CLINICAL_URGENCY.EMERGENCY && finalConfidence < threshold) {
      finalUrgency = CLINICAL_URGENCY.URGENT;
      requiresImmediateAttention = false;
      reason = `${reason} (Triage confidence below emergency threshold ${threshold}; routed for priority human doctor review).`;
    }
    // Rule 3: Low confidence with no emergency features defaults to MONITOR or NORMAL
    else if (finalConfidence < 0.60 && finalUrgency !== CLINICAL_URGENCY.NORMAL) {
      finalUrgency = CLINICAL_URGENCY.MONITOR;
      requiresImmediateAttention = false;
    }

    return {
      urgency: finalUrgency,
      confidence: finalConfidence,
      symptoms,
      riskIndicators,
      clinicalCategories,
      recommendedSpecialty,
      requiresImmediateAttention,
      reason,
      deterministicRulesMatched: deterministic.rules.map(r => ({
        ruleId: r.id,
        ruleName: r.name,
        priority: r.priority,
        description: r.description
      }))
    };
  }
}

module.exports = new EmergencyDecisionEngine();
