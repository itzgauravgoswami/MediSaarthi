// Emergency Event Model
const mongoose = require('mongoose');
const { EMERGENCY_STATUS, CLINICAL_URGENCY, NOTIFICATION_DELIVERY_STATUS } = require('../constants/statuses');

const EmergencyEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, ref: 'Patient', required: true, index: true },
  patientName: { type: String, default: 'Patient' },
  patientToken: { type: String, default: '#101' },
  patientAge: { type: Number },
  patientGender: { type: String },
  
  voiceSessionId: { type: String, ref: 'VoiceSession' },
  riskAssessmentId: { type: String, ref: 'RiskAssessment' },
  idempotencyKey: { type: String, unique: true, sparse: true, index: true },
  
  severity: {
    type: String,
    enum: Object.values(CLINICAL_URGENCY),
    default: CLINICAL_URGENCY.EMERGENCY,
    index: true
  },
  
  status: {
    type: String,
    enum: Object.values(EMERGENCY_STATUS),
    default: EMERGENCY_STATUS.DETECTED,
    index: true
  },
  
  symptoms: [{ type: String }],
  riskIndicators: [{ type: String }],
  clinicalCategories: [{ type: String }],
  recommendedSpecialty: { type: String, default: 'Emergency Medicine' },
  
  // Matching & Clinician Assignment
  assignedDoctorId: { type: String, ref: 'Doctor', index: true },
  assignedDoctorName: { type: String },
  backupDoctorIds: [{ type: String }],
  escalationLevel: { type: Number, default: 0 },
  
  notificationStatus: {
    type: String,
    enum: Object.values(NOTIFICATION_DELIVERY_STATUS),
    default: NOTIFICATION_DELIVERY_STATUS.PENDING,
    index: true
  },
  
  detectedAt: { type: Date, default: Date.now, index: true },
  acknowledgedAt: { type: Date },
  acknowledgedBy: { type: String },
  
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
  resolutionNotes: { type: String },
  
  auditTrail: [{
    action: { type: String },
    timestamp: { type: Date, default: Date.now },
    actor: { type: String },
    details: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.EmergencyEvent || mongoose.model('EmergencyEvent', EmergencyEventSchema);
