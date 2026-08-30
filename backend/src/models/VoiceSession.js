// Voice Session Model
const mongoose = require('mongoose');

const VoiceSessionSchema = new mongoose.Schema({
  voiceSessionId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, ref: 'Patient', index: true },
  patientName: { type: String },
  audioReference: { type: String }, // Path or Cloudinary URL
  transcript: { type: String, default: '' },
  transcriptionConfidence: { type: Number, default: 1.0 },
  language: { type: String, default: 'hi-IN' },
  provider: { type: String, default: 'gemini' },
  status: {
    type: String,
    enum: ['RECORDING', 'TRANSCRIBED', 'ANALYZING', 'COMPLETED', 'FAILED'],
    default: 'RECORDING',
    index: true
  },
  durationSeconds: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

module.exports = mongoose.models.VoiceSession || mongoose.model('VoiceSession', VoiceSessionSchema);
