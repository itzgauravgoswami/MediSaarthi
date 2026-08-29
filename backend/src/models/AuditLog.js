// Security and Clinical Audit Log Model
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true, index: true },
  actorId: { type: String, required: true, index: true },
  actorRole: { type: String, required: true, index: true },
  actorName: { type: String },
  action: { 
    type: String, 
    enum: [
      'LOGIN', 'LOGOUT', 'PATIENT_CREATED', 'PATIENT_VIEWED', 'INTERVIEW_STARTED',
      'CONSENT_GRANTED', 'CONSENT_REVOKED', 'DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED',
      'OCR_COMPLETED', 'SUMMARY_GENERATED', 'SUMMARY_EDITED', 'SUMMARY_VERIFIED',
      'RED_FLAG_CREATED', 'RED_FLAG_ACKNOWLEDGED', 'RECORD_SHARED', 'KIOSK_HEARTBEAT'
    ],
    required: true,
    index: true 
  },
  resourceType: { type: String, required: true, index: true },
  resourceId: { type: String, required: true, index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  status: { type: String, default: 'Success' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
