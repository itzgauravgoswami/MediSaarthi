// Red Flag Alert Model
const mongoose = require('mongoose');
const { RED_FLAG_STATUS, RED_FLAG_PRIORITY } = require('../constants/statuses');

const RedFlagAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  patientName: { type: String },
  token: { type: String },
  age: { type: Number },
  gender: { type: String },
  interviewId: { type: String, ref: 'Interview' },
  
  ruleId: { type: String, required: true, index: true },
  ruleName: { type: String, required: true },
  symptoms: [{ type: String }],
  description: { type: String, required: true },
  
  priority: { 
    type: String, 
    enum: Object.values(RED_FLAG_PRIORITY), 
    default: RED_FLAG_PRIORITY.HIGH,
    index: true 
  },
  recommendedAction: { type: String, default: 'IMMEDIATE_CLINICAL_REVIEW' },
  status: { 
    type: String, 
    enum: Object.values(RED_FLAG_STATUS), 
    default: RED_FLAG_STATUS.OPEN,
    index: true 
  },

  acknowledgedBy: { type: String },
  acknowledgedAt: { type: Date },
  resolvedBy: { type: String },
  resolvedAt: { type: Date },
  resolutionNotes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.RedFlagAlert || mongoose.model('RedFlagAlert', RedFlagAlertSchema);
