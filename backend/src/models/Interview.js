// Clinical Interview Session Model
const mongoose = require('mongoose');
const { INTERVIEW_STATUS } = require('../constants/statuses');
const { INTERVIEW_SECTIONS } = require('../constants/interviewSections');

const InterviewSchema = new mongoose.Schema({
  interviewId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  kioskId: { type: String, ref: 'Kiosk' },
  language: { type: String, default: 'hi-IN' },
  mode: { type: String, enum: ['VOICE', 'TOUCH', 'HYBRID'], default: 'HYBRID' },
  
  currentSection: { 
    type: String, 
    enum: Object.values(INTERVIEW_SECTIONS), 
    default: INTERVIEW_SECTIONS.START,
    index: true 
  },
  currentQuestion: { type: String },
  currentQuestionLocale: { type: String },
  
  status: { 
    type: String, 
    enum: Object.values(INTERVIEW_STATUS), 
    default: INTERVIEW_STATUS.CREATED,
    index: true 
  },

  collectedData: {
    chiefComplaint: [{ type: String }],
    hpi: { type: mongoose.Schema.Types.Mixed, default: {} },
    pastMedicalHistory: [{ type: String }],
    surgicalHistory: [{ type: String }],
    medications: [{ type: mongoose.Schema.Types.Mixed }],
    allergies: [{ type: mongoose.Schema.Types.Mixed }],
    familyHistory: [{ type: mongoose.Schema.Types.Mixed }],
    personalHistory: { type: mongoose.Schema.Types.Mixed, default: {} },
    reviewOfSystems: { type: mongoose.Schema.Types.Mixed, default: {} }
  },

  completedSections: [{ type: String }],
  redFlagsDetected: [{ type: mongoose.Schema.Types.Mixed }],

  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
