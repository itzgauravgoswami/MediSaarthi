// Medical Document Model
const mongoose = require('mongoose');
const { DOCUMENT_TYPES, DOCUMENT_STATUS } = require('../constants/documentTypes');

const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  type: { 
    type: String, 
    enum: Object.values(DOCUMENT_TYPES), 
    default: DOCUMENT_TYPES.PRESCRIPTION,
    index: true 
  },
  originalFileName: { type: String, required: true },
  storageKey: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING',
    index: true 
  },
  ocrStatus: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  extractionStatus: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },

  ocrText: { type: String },

  extractedData: {
    isMedicalDocument: { type: Boolean, default: true },
    relevanceMessage: { type: String },
    relevanceMessageHindi: { type: String },
    reportSummary: { type: String },
    reportSummaryHindi: { type: String },
    confidenceScore: { type: Number },
    diagnoses: [{ type: String }],
    medications: [{
      name: { type: String },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String },
      confidence: { type: Number }
    }],
    investigations: [{
      testName: { type: String },
      value: { type: String },
      unit: { type: String },
      referenceRange: { type: String },
      isAbnormal: { type: Boolean }
    }],
    procedures: [{ type: String }],
    documentDate: { type: Date }
  },

  isMedical: { type: Boolean, default: true },
  confidence: { type: Number, default: 0.9 },
  uploadedBy: { type: String, default: 'PATIENT' },
  verifiedBy: { type: String },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
