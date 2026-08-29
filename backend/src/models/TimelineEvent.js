// Medical Timeline Event Model
const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  type: { 
    type: String, 
    enum: ['Consultation', 'Document', 'Investigation', 'Medication', 'Surgery', 'Hospitalization', 'Diagnosis', 'Allergy', 'Other'],
    default: 'Consultation',
    index: true
  },
  eventDate: { type: Date, default: Date.now, index: true },
  dateString: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  badge: { type: String },
  sourceType: { type: String, default: 'SYSTEM' },
  sourceId: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

module.exports = mongoose.models.TimelineEvent || mongoose.model('TimelineEvent', TimelineEventSchema);
