// Patient Appointment Model
const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../constants/statuses');

const AppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  doctorId: { type: String, ref: 'Doctor', index: true },
  doctorName: { type: String, default: 'Dr. Sharma' },
  appointmentDate: { type: Date, required: true, index: true },
  slotTime: { type: String, default: '10:30 AM' },
  status: { 
    type: String, 
    enum: Object.values(APPOINTMENT_STATUS), 
    default: APPOINTMENT_STATUS.WAITING,
    index: true 
  },
  tokenNumber: { type: String, required: true },
  department: { type: String, default: 'General OPD' },
  intakeCompleted: { type: Boolean, default: false },
  redFlagPresent: { type: Boolean, default: false },
  chiefComplaint: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
