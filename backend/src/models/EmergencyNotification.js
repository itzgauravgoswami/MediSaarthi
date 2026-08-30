// Emergency Notification Model
const mongoose = require('mongoose');
const { NOTIFICATION_DELIVERY_STATUS } = require('../constants/statuses');

const EmergencyNotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true, index: true },
  emergencyEventId: { type: String, ref: 'EmergencyEvent', required: true, index: true },
  doctorId: { type: String, ref: 'Doctor', required: true, index: true },
  doctorName: { type: String },
  channel: {
    type: String,
    enum: ['SSE', 'WEBSOCKET', 'IN_APP', 'SMS', 'PUSH'],
    default: 'SSE'
  },
  status: {
    type: String,
    enum: Object.values(NOTIFICATION_DELIVERY_STATUS),
    default: NOTIFICATION_DELIVERY_STATUS.PENDING,
    index: true
  },
  sentAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  acknowledgedAt: { type: Date },
  failureReason: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.EmergencyNotification || mongoose.model('EmergencyNotification', EmergencyNotificationSchema);
