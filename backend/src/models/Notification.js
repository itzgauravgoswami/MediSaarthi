// Notification Model
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true, index: true },
  recipientRole: { type: String, enum: ['DOCTOR', 'TRIAGE_STAFF', 'ADMIN', 'PATIENT'], default: 'DOCTOR', index: true },
  recipientId: { type: String, index: true },
  type: { 
    type: String, 
    enum: ['PATIENT_READY', 'AI_INTAKE_COMPLETED', 'DOCUMENT_PROCESSED', 'RED_FLAG_DETECTED', 'DOCTOR_REVIEW_REQUIRED', 'SYSTEM_ALERT', 'KIOSK_OFFLINE'],
    required: true,
    index: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  resourceType: { type: String },
  resourceId: { type: String },
  readAt: { type: Date },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
