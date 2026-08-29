// Kiosk Device Identity & Session Model
const mongoose = require('mongoose');
const { KIOSK_STATUS } = require('../constants/statuses');

const KioskSchema = new mongoose.Schema({
  kioskId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  hospitalId: { type: String, default: 'AIIMS_DELHI_MAIN' },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(KIOSK_STATUS), 
    default: KIOSK_STATUS.ONLINE,
    index: true 
  },
  currentSession: {
    sessionId: { type: String },
    patientId: { type: String },
    tokenNumber: { type: String },
    startedAt: { type: Date }
  },
  lastHeartbeat: { type: Date, default: Date.now },
  softwareVersion: { type: String, default: 'v2026.4.1' },
  ipAddress: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Kiosk || mongoose.model('Kiosk', KioskSchema);
