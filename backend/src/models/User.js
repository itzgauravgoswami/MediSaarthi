// User Model
const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    enum: Object.values(ROLES), 
    default: ROLES.PATIENT, 
    index: true 
  },
  phone: { type: String, trim: true },
  patientId: { type: String, ref: 'Patient', index: true },
  doctorId: { type: String, ref: 'Doctor', index: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
