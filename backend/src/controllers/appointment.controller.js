// Appointment & Doctor Queue Controller
const { v4: uuidv4 } = require('uuid');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const { sendSuccess, sendCreated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

class AppointmentController {
  async getAppointments(req, res, next) {
    try {
      const { patientId, doctorId, status } = req.query;
      const query = {};
      if (patientId) query.patientId = patientId;
      if (doctorId) query.doctorId = doctorId;
      if (status) query.status = status;

      const appointments = await Appointment.find(query)
        .sort({ createdAt: -1, appointmentDate: 1 });

      return sendSuccess(res, appointments || []);
    } catch (err) {
      next(err);
    }
  }

  async getPatientAppointments(req, res, next) {
    try {
      const patientId = req.params.patientId || req.query.patientId;
      if (!patientId) {
        return res.status(400).json({ success: false, message: 'patientId is required' });
      }

      const appointments = await Appointment.find({ patientId })
        .sort({ createdAt: -1 });

      return sendSuccess(res, appointments || []);
    } catch (err) {
      next(err);
    }
  }

  async createAppointment(req, res, next) {
    try {
      const appointmentId = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;
      const appointment = await Appointment.create({
        appointmentId,
        appointmentDate: req.body.appointmentDate || new Date(),
        ...req.body
      });

      // Update Patient status to waiting
      if (req.body.patientId) {
        try {
          await Patient.findOneAndUpdate(
            { patientId: req.body.patientId },
            {
              status: 'Waiting',
              intakeStatus: 'Completed',
              chiefComplaint: req.body.chiefComplaint || 'Consultation Booked'
            }
          );
        } catch (e) {}
      }

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
          actorId: req.user?.id || req.body.patientId || 'SYSTEM',
          actorRole: req.user?.role || 'PATIENT',
          actorName: req.user?.name || req.body.patientName || 'Unknown',
          action: 'APPOINTMENT_CREATED',
          resourceType: 'Appointment',
          resourceId: appointmentId,
          ipAddress: req.ip
        });
      } catch (e) {}

      return sendCreated(res, appointment, 'Appointment scheduled');
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const appointmentId = req.params.id;
      const { status } = req.body;

      const VALID_STATUSES = ['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'];
      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` });
      }

      const updated = await Appointment.findOneAndUpdate(
        { appointmentId },
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      return sendSuccess(res, updated, 'Status updated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AppointmentController();
