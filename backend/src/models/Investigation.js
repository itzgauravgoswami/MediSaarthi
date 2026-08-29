// Lab & Diagnostic Investigation Model
const mongoose = require('mongoose');

const InvestigationSchema = new mongoose.Schema({
  investigationId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  documentId: { type: String, ref: 'Document' },
  testName: { type: String, required: true, index: true },
  category: { type: String, enum: ['Hematology', 'Biochemistry', 'Radiology', 'Pathology', 'Cardiology', 'Other'], default: 'Biochemistry' },
  resultValue: { type: String, required: true },
  unit: { type: String },
  referenceRange: { type: String },
  isAbnormal: { type: Boolean, default: false },
  reportDate: { type: Date, default: Date.now },
  source: { type: String, default: 'DOCUMENT_OCR' },
  verifiedBy: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Investigation || mongoose.model('Investigation', InvestigationSchema);
