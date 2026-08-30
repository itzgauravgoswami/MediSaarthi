// Emergency & Voice Analysis Controller
const voiceAnalysisService = require('../services/emergency/voiceAnalysis.service');
const doctorMatchingService = require('../services/emergency/doctorMatching.service');
const realtimeAlertService = require('../services/emergency/realtimeAlert.service');
const EmergencyEvent = require('../models/EmergencyEvent');
const AuditLog = require('../models/AuditLog');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { EMERGENCY_STATUS, CLINICAL_URGENCY, APPOINTMENT_STATUS } = require('../constants/statuses');
const { sendSuccess, sendCreated } = require('../utils/response');
const { ValidationError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

class EmergencyController {
  /**
   * POST /api/v1/voice/sessions/analyse (or /api/v1/voice/analyse)
   * Real-time Voice & Transcript Clinical Analysis
   */
  async analyseVoice(req, res, next) {
    try {
      const audioFilePath = req.file ? req.file.path : null;
      const {
        transcript,
        patientId = 'P102',
        language = 'hi-IN',
        idempotencyKey,
        audioDurationSeconds = 0,
        patientName,
        patientAge,
        patientGender
      } = req.body;

      if (!audioFilePath && (!transcript || !transcript.trim())) {
        throw new ValidationError('Either audio recording file or transcript text is required.');
      }

      const result = await voiceAnalysisService.processVoiceInput({
        audioFilePath,
        transcriptText: transcript,
        patientId: req.user?.id || patientId,
        language,
        idempotencyKey,
        audioDurationSeconds: parseFloat(audioDurationSeconds) || 0,
        patientContext: {
          name: req.user?.name || patientName,
          age: patientAge,
          gender: patientGender
        }
      });

      return sendSuccess(res, result, 'Voice analysis and clinical triage completed');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/emergency-events
   * Manual Emergency Override Triggered by Patient
   */
  async createManualEmergency(req, res, next) {
    try {
      const {
        patientId = 'P102',
        symptoms = ['Manual Emergency Help Request'],
        category = 'Emergency Medicine',
        notes = 'Patient triggered manual emergency help request'
      } = req.body;

      let patient = null;
      try {
        patient = await Patient.findOne({ patientId });
      } catch (e) {}

      const matched = await doctorMatchingService.matchDoctor({
        clinicalCategories: ['emergency'],
        recommendedSpecialty: 'Emergency Medicine'
      });

      const eventId = `EMERG-MANUAL-${Date.now().toString(36).toUpperCase()}`;
      const emergencyEvent = await EmergencyEvent.create({
        eventId,
        patientId,
        patientName: patient?.name || req.user?.name || 'Rahul Kumar',
        patientToken: patient?.token || '#102',
        patientAge: patient?.age || 45,
        patientGender: patient?.gender || 'Male',
        severity: CLINICAL_URGENCY.EMERGENCY,
        status: EMERGENCY_STATUS.ALERTING,
        symptoms,
        riskIndicators: ['Manual Emergency Button Pressed'],
        clinicalCategories: ['emergency'],
        recommendedSpecialty: 'Emergency Medicine',
        assignedDoctorId: matched.assignedDoctorId,
        assignedDoctorName: matched.assignedDoctorName,
        backupDoctorIds: matched.backupDoctorIds,
        detectedAt: new Date(),
        auditTrail: [{
          action: 'MANUAL_EMERGENCY_TRIGGERED',
          timestamp: new Date(),
          actor: patientId,
          details: notes
        }]
      });

      // Broadcast real-time alert
      await realtimeAlertService.broadcastEmergencyAlert(emergencyEvent);

      // Register Emergency Appointment in MongoDB
      try {
        await Appointment.create({
          appointmentId: `APT-EMERG-${Date.now().toString(36).toUpperCase()}`,
          patientId,
          patientName: patient?.name || req.user?.name || 'Rahul Kumar',
          doctorId: matched.assignedDoctorId,
          doctorName: matched.assignedDoctorName,
          specialization: 'Emergency Medicine',
          roomNumber: matched.doctorDetails?.roomNumber || 'Room 101, Emergency Department',
          appointmentDate: new Date(),
          slotTime: 'IMMEDIATE (EMERGENCY)',
          status: APPOINTMENT_STATUS.WAITING,
          tokenNumber: patient?.token || '#EM-101',
          department: matched.doctorDetails?.department || 'Emergency & Critical Care Wing',
          intakeCompleted: true,
          redFlagPresent: true,
          chiefComplaint: symptoms.join(', ') || 'Manual Emergency Button Pressed'
        });

        await Patient.findOneAndUpdate(
          { patientId },
          {
            intakeStatus: 'Completed',
            redFlag: 'Attention Required',
            status: 'Emergency Triage',
            chiefComplaint: symptoms.join(', ') || 'Manual Emergency'
          }
        ).catch(() => {});
      } catch (e) {
        logger.warn(`[ManualEmergency] Appointment registration note: ${e.message}`);
      }

      const responsePayload = {
        ...emergencyEvent.toObject ? emergencyEvent.toObject() : emergencyEvent,
        doctor: matched.doctorDetails || {
          doctorId: matched.assignedDoctorId,
          name: matched.assignedDoctorName,
          specialization: 'Emergency Medicine',
          department: 'Emergency & Critical Care Wing',
          roomNumber: 'Room 101, Emergency Department',
          isAvailable: true
        }
      };

      return sendCreated(res, responsePayload, 'Manual emergency notification dispatched');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/emergency-events
   * Query emergency events with role filtering
   */
  async getEmergencyEvents(req, res, next) {
    try {
      const { status, patientId, doctorId, limit = 50 } = req.query;
      const query = {};

      if (status) query.status = status;
      if (patientId) query.patientId = patientId;
      if (doctorId) query.assignedDoctorId = doctorId;

      const events = await EmergencyEvent.find(query).sort({ detectedAt: -1 }).limit(parseInt(limit, 10));
      return sendSuccess(res, events);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/emergency-events/active
   * Active emergency alerts for Doctor Dashboard Queue
   */
  async getActiveAlerts(req, res, next) {
    try {
      const doctorId = req.query.doctorId || req.user?.doctorId;
      const query = {
        status: { $in: [EMERGENCY_STATUS.DETECTED, EMERGENCY_STATUS.ALERTING, EMERGENCY_STATUS.NOTIFIED, EMERGENCY_STATUS.ACKNOWLEDGED, EMERGENCY_STATUS.IN_PROGRESS] }
      };

      if (doctorId) {
        query.$or = [{ assignedDoctorId: doctorId }, { backupDoctorIds: doctorId }];
      }

      const activeAlerts = await EmergencyEvent.find(query).sort({ detectedAt: -1 }).limit(20);
      return sendSuccess(res, activeAlerts);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/emergency-events/:id
   */
  async getEmergencyEventById(req, res, next) {
    try {
      const eventId = req.params.id;
      const event = await EmergencyEvent.findOne({ $or: [{ eventId }, { _id: eventId.match(/^[0-9a-fA-F]{24}$/) ? eventId : null }] });

      if (!event) {
        throw new NotFoundError('Emergency event not found.');
      }

      return sendSuccess(res, event);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/emergency-events/:id/acknowledge
   * Doctor acknowledges receiving the emergency alert
   */
  async acknowledgeEmergency(req, res, next) {
    try {
      const eventId = req.params.id;
      const doctorName = req.body.doctorName || req.user?.name || 'Dr. Sharma';
      const doctorId = req.body.doctorId || req.user?.id || 'DOC-101';

      const event = await EmergencyEvent.findOne({ $or: [{ eventId }, { _id: eventId.match(/^[0-9a-fA-F]{24}$/) ? eventId : null }] });
      if (!event) {
        throw new NotFoundError('Emergency event not found.');
      }

      event.status = EMERGENCY_STATUS.ACKNOWLEDGED;
      event.acknowledgedAt = new Date();
      event.acknowledgedBy = doctorName;
      event.auditTrail.push({
        action: 'DOCTOR_ACKNOWLEDGED',
        timestamp: new Date(),
        actor: doctorName,
        details: `Alert acknowledged by ${doctorName}.`
      });

      await event.save();

      // Clear escalation timeout
      realtimeAlertService.clearEscalationTimer(event.eventId);

      // Broadcast update to doctor & patient UI
      realtimeAlertService.broadcastStatusUpdate(event);

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
          actorId: doctorId,
          actorRole: 'DOCTOR',
          actorName: doctorName,
          action: 'DOCTOR_ACKNOWLEDGED',
          resourceType: 'EmergencyEvent',
          resourceId: event.eventId
        });
      } catch (e) {}

      return sendSuccess(res, event, 'Emergency alert acknowledged');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/emergency-events/:id/escalate
   * Doctor or System manually escalates emergency to backup clinician
   */
  async escalateEmergency(req, res, next) {
    try {
      const eventId = req.params.id;
      const { reason = 'Clinician requested immediate specialist escalation', targetDoctorId } = req.body;
      const actorName = req.user?.name || req.body.actorName || 'Doctor';

      const event = await EmergencyEvent.findOne({ $or: [{ eventId }, { _id: eventId.match(/^[0-9a-fA-F]{24}$/) ? eventId : null }] });
      if (!event) {
        throw new NotFoundError('Emergency event not found.');
      }

      const nextDoc = targetDoctorId
        ? await require('../models/Doctor').findOne({ doctorId: targetDoctorId })
        : await doctorMatchingService.getNextEscalationDoctor(event.assignedDoctorId, event.backupDoctorIds);

      if (nextDoc) {
        event.assignedDoctorId = nextDoc.doctorId;
        event.assignedDoctorName = nextDoc.name;
      }

      event.escalationLevel = (event.escalationLevel || 0) + 1;
      event.status = EMERGENCY_STATUS.ALERTING;
      event.auditTrail.push({
        action: 'MANUAL_ESCALATION',
        timestamp: new Date(),
        actor: actorName,
        details: `${actorName} escalated event (Level ${event.escalationLevel}): ${reason}`
      });

      await event.save();

      // Reset auto-escalation timer
      realtimeAlertService.scheduleEscalation(event.eventId);

      // Broadcast updated alert
      await realtimeAlertService.broadcastEmergencyAlert(event);
      realtimeAlertService.broadcastStatusUpdate(event);

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
          actorId: req.user?.id || 'DOC',
          actorRole: 'DOCTOR',
          action: 'EMERGENCY_ESCALATED',
          resourceType: 'EmergencyEvent',
          resourceId: event.eventId,
          metadata: { reason, escalationLevel: event.escalationLevel }
        });
      } catch (e) {}

      return sendSuccess(res, event, 'Emergency escalated successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/emergency-events/:id/resolve
   * Doctor marks emergency as resolved with clinical notes
   */
  async resolveEmergency(req, res, next) {
    try {
      const eventId = req.params.id;
      const { resolutionNotes = 'Patient stabilized and evaluated by physician.' } = req.body;
      const doctorName = req.body.doctorName || req.user?.name || 'Dr. Sharma';
      const doctorId = req.body.doctorId || req.user?.id || 'DOC-101';

      const event = await EmergencyEvent.findOne({ $or: [{ eventId }, { _id: eventId.match(/^[0-9a-fA-F]{24}$/) ? eventId : null }] });
      if (!event) {
        throw new NotFoundError('Emergency event not found.');
      }

      event.status = EMERGENCY_STATUS.RESOLVED;
      event.resolvedAt = new Date();
      event.resolvedBy = doctorName;
      event.resolutionNotes = resolutionNotes;
      event.auditTrail.push({
        action: 'EMERGENCY_RESOLVED',
        timestamp: new Date(),
        actor: doctorName,
        details: resolutionNotes
      });

      await event.save();

      // Clear escalation timer
      realtimeAlertService.clearEscalationTimer(event.eventId);

      // Broadcast status update
      realtimeAlertService.broadcastStatusUpdate(event);

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
          actorId: doctorId,
          actorRole: 'DOCTOR',
          actorName: doctorName,
          action: 'EMERGENCY_RESOLVED',
          resourceType: 'EmergencyEvent',
          resourceId: event.eventId,
          metadata: { resolutionNotes }
        });
      } catch (e) {}

      return sendSuccess(res, event, 'Emergency event marked as resolved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/emergency-events/stream (Server-Sent Events)
   * Real-time live alert stream for Doctor and Patient Dashboards
   */
  streamAlerts(req, res, next) {
    try {
      const clientId = `client_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const role = req.query.role || req.user?.role || 'DOCTOR';
      const userId = req.query.userId || req.user?.id;
      const patientId = req.query.patientId;

      realtimeAlertService.registerClient(clientId, res, { role, userId, patientId });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EmergencyController();
