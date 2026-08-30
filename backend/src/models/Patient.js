// Patient Model
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true, index: true },
  token: { type: String },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date },
  phone: { type: String, required: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true },
  preferredLanguage: { type: String, default: 'hi-IN' },
  abhaId: { type: String, trim: true, index: true },
  abhaReference: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  },
  demographics: {
    address: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
    occupation: { type: String }
  },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  status: { type: String, enum: ['Waiting', 'In Consultation', 'Completed', 'Triage Review'], default: 'Waiting' },
  intakeStatus: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedDoctor: { type: String },
  consultationTime: { type: String },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: String },
  verifiedAt: { type: Date }
}, {
  timestamps: true
});

// Compound indexes for common query patterns
PatientSchema.index({ status: 1, createdAt: -1 });
PatientSchema.index({ intakeStatus: 1, status: 1 });
PatientSchema.index({ assignedDoctor: 1, status: 1 });
PatientSchema.index({ isVerified: 1 });

module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

