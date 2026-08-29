// Structured Clinical History Model with Versioning and Source Tracking
const mongoose = require('mongoose');
const { VERIFICATION_STATUS } = require('../constants/statuses');

const SourceMetadataSchema = new mongoose.Schema({
  field: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  source: { 
    type: String, 
    enum: ['PATIENT_VOICE', 'PATIENT_TOUCH', 'DOCUMENT_OCR', 'DOCTOR_ENTERED', 'SYSTEM'],
    default: 'PATIENT_TOUCH'
  },
  sourceId: { type: String },
  confidence: { type: Number, default: 1.0 },
  extractedAt: { type: Date, default: Date.now }
}, { _id: false });

const VersionHistorySchema = new mongoose.Schema({
  version: { type: Number, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  changeReason: { type: String },
  dataSnapshot: { type: mongoose.Schema.Types.Mixed },
  verificationStatus: { type: String, enum: Object.values(VERIFICATION_STATUS) }
}, { _id: false });

const ClinicalHistorySchema = new mongoose.Schema({
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  interviewId: { type: String, ref: 'Interview', index: true },

  chiefComplaint: [{ type: String }],
  
  historyOfPresentIllness: {
    onset: { type: String },
    duration: { type: String },
    location: { type: String },
    character: { type: String },
    severity: { type: Number, min: 1, max: 10 },
    radiation: { type: String },
    aggravatingFactors: [{ type: String }],
    relievingFactors: [{ type: String }],
    associatedSymptoms: [{ type: String }],
    summaryNarrative: { type: String }
  },

  pastMedicalHistory: [{ type: String }],
  pastSurgicalHistory: [{ type: String }],

  medications: [{
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
    source: { type: String, default: 'PATIENT' },
    confidence: { type: Number, default: 100 }
  }],

  allergies: [{
    allergen: { type: String, required: true },
    reaction: { type: String },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] }
  }],

  familyHistory: [{
    relationship: { type: String },
    condition: { type: String }
  }],

  personalHistory: {
    diet: { type: String },
    sleep: { type: String },
    bowel: { type: String },
    bladder: { type: String },
    substanceUse: [{ type: String }],
    occupation: { type: String }
  },

  reviewOfSystems: {
    constitutional: [{ type: String }],
    cardiovascular: [{ type: String }],
    respiratory: [{ type: String }],
    gastrointestinal: [{ type: String }],
    musculoskeletal: [{ type: String }],
    neurological: [{ type: String }]
  },

  sourceMetadata: [SourceMetadataSchema],

  verificationStatus: {
    type: String,
    enum: Object.values(VERIFICATION_STATUS),
    default: VERIFICATION_STATUS.AI_GENERATED,
    index: true
  },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },

  currentVersion: { type: Number, default: 1 },
  versionHistory: [VersionHistorySchema]
}, {
  timestamps: true
});

module.exports = mongoose.models.ClinicalHistory || mongoose.model('ClinicalHistory', ClinicalHistorySchema);
