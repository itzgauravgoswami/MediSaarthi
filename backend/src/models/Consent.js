// Informed Patient Consent Model
const mongoose = require('mongoose');
const { CONSENT_PURPOSES, CONSENT_STATUS, CONSENT_METHODS } = require('../constants/consentPurposes');

const ConsentSchema = new mongoose.Schema({
  consentId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  purpose: { 
    type: String, 
    enum: Object.values(CONSENT_PURPOSES), 
    required: true,
    index: true 
  },
  scope: [{ type: String }],
  status: { 
    type: String, 
    enum: Object.values(CONSENT_STATUS), 
    default: CONSENT_STATUS.GRANTED,
    index: true 
  },
  language: { type: String, default: 'hi-IN' },
  consentMethod: { 
    type: String, 
    enum: Object.values(CONSENT_METHODS), 
    default: CONSENT_METHODS.DIGITAL_TOUCH 
  },
  grantedAt: { type: Date, default: Date.now },
  revokedAt: { type: Date },
  version: { type: String, default: '2.0' },
  consentText: { type: String },
  consentTextHash: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Consent || mongoose.model('Consent', ConsentSchema);
