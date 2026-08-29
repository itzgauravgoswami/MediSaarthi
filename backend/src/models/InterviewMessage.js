// Conversational Turn / Transcript Message Model
const mongoose = require('mongoose');

const InterviewMessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true, index: true },
  interviewId: { type: String, required: true, ref: 'Interview', index: true },
  sender: { type: String, enum: ['AI', 'PATIENT', 'SYSTEM'], required: true },
  section: { type: String, required: true },
  text: { type: String, required: true },
  language: { type: String, default: 'hi-IN' },
  translatedText: { type: String },
  audioUrl: { type: String },
  inputMode: { type: String, enum: ['VOICE', 'TOUCH', 'TEXT'], default: 'TEXT' },
  extractedEntities: { type: mongoose.Schema.Types.Mixed },
  confidenceScore: { type: Number, default: 1.0 },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.InterviewMessage || mongoose.model('InterviewMessage', InterviewMessageSchema);
