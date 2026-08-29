// Doctor Model
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, default: 'General Medicine' },
  department: { type: String, default: 'OPD' },
  registrationNumber: { type: String, required: true },
  roomNumber: { type: String, default: 'OPD-102' },
  isAvailable: { type: Boolean, default: true },
  queueCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
