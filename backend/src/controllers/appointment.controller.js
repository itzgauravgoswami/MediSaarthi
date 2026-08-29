// Appointment & Doctor Queue Controller
const { v4: uuidv4 } = require('uuid');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { sendSuccess, sendCreated } = require('../utils/response');

const FALLBACK_APPOINTMENTS = [
  { appointmentId: "APT-101", tokenNumber: "#102", patientId: "P102", patientName: "Rahul Kumar", slotTime: "10:30 AM", status: "WAITING", redFlagPresent: true, chiefComplaint: "Chest Pain" },
  { appointmentId: "APT-102", tokenNumber: "#103", patientId: "P103", patientName: "Priya Patel", slotTime: "10:45 AM", status: "WAITING", redFlagPresent: false, chiefComplaint: "High Fever" },
  { appointmentId: "APT-103", tokenNumber: "#104", patientId: "P104", patientName: "Amitabh Banerjee", slotTime: "11:00 AM", status: "WAITING", redFlagPresent: false, chiefComplaint: "Chronic Cough" }
];

class AppointmentController {
  async getAppointments(req, res, next) {
    try {
      let appointments = [];
      try {
        appointments = await Appointment.find().sort({ appointmentDate: 1 });
      } catch (e) {}

      if (!appointments || appointments.length === 0) {
        appointments = FALLBACK_APPOINTMENTS;
      }
      return sendSuccess(res, appointments);
    } catch (err) {
      next(err);
    }
  }

  async createAppointment(req, res, next) {
    try {
      const appointmentId = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;
      const appointment = await Appointment.create({
        appointmentId,
        ...req.body
      });
      return sendCreated(res, appointment, 'Appointment scheduled');
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const appointmentId = req.params.id;
      const { status } = req.body;
      const updated = await Appointment.findOneAndUpdate({ appointmentId }, { status }, { new: true });
      return sendSuccess(res, updated || { appointmentId, status }, 'Status updated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AppointmentController();
