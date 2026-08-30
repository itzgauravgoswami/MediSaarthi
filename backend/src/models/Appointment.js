// Patient Appointment Model
const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../constants/statuses');

const AppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  patientName: { type: String },
  doctorId: { type: String, ref: 'Doctor', index: true },
  doctorName: { type: String },
  specialization: { type: String },
  roomNumber: { type: String },
  appointmentDate: { type: Date, required: true, default: Date.now, index: true },
  slotTime: { type: String },
  status: { 
    type: String, 
    enum: Object.values(APPOINTMENT_STATUS), 
    default: APPOINTMENT_STATUS.WAITING,
    index: true 
  },
  tokenNumber: { type: String },
  department: { type: String },
  intakeCompleted: { type: Boolean, default: false },
  redFlagPresent: { type: Boolean, default: false },
  chiefComplaint: { type: String },
  duration: { type: String },
  triageSummary: { type: String }
}, {
  timestamps: true
});

// Compound indexes for common query patterns
AppointmentSchema.index({ patientId: 1, status: 1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1, appointmentDate: -1 });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
