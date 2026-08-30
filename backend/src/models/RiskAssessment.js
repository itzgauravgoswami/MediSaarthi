// Risk Assessment Model (AI-Assisted Triage)
const mongoose = require('mongoose');
const { CLINICAL_URGENCY } = require('../constants/statuses');

const RiskAssessmentSchema = new mongoose.Schema({
  riskAssessmentId: { type: String, required: true, unique: true, index: true },
  voiceSessionId: { type: String, ref: 'VoiceSession', index: true },
  patientId: { type: String, ref: 'Patient', index: true },
  
  urgency: {
    type: String,
    enum: Object.values(CLINICAL_URGENCY),
    default: CLINICAL_URGENCY.NORMAL,
    index: true
  },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  
  symptoms: [{ type: String }],
  riskIndicators: [{ type: String }],
  clinicalCategories: [{ type: String }], // e.g. 'cardiac', 'respiratory', 'neurological'
  recommendedSpecialty: { type: String, default: 'General Medicine' },
  requiresImmediateAttention: { type: Boolean, default: false, index: true },
  reason: { type: String, required: true },
  
  deterministicRulesMatched: [{
    ruleId: { type: String },
    ruleName: { type: String },
    priority: { type: String },
    description: { type: String }
  }],
  
  model: { type: String, default: 'gemini-clinical-risk-engine' },
  rawAnalysis: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

module.exports = mongoose.models.RiskAssessment || mongoose.model('RiskAssessment', RiskAssessmentSchema);
