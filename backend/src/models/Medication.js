// Active & Historical Medication Model
const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  medicationId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  documentId: { type: String, ref: 'Document' },
  name: { type: String, required: true, index: true },
  dosage: { type: String, required: true },
  frequency: { type: String, default: 'OD' },
  duration: { type: String },
  instructions: { type: String },
  prescribedBy: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  source: { type: String, enum: ['PATIENT_VOICE', 'DOCUMENT_OCR', 'DOCTOR_ENTERED'], default: 'DOCUMENT_OCR' },
  confidence: { type: Number, default: 95 }
}, {
  timestamps: true
});

module.exports = mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);
