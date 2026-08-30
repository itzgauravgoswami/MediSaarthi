// Patient Controller
const { v4: uuidv4 } = require('uuid');
const Patient = require('../models/Patient');
const ClinicalHistory = require('../models/ClinicalHistory');
const Document = require('../models/Document');
const TimelineEvent = require('../models/TimelineEvent');
const clinicalHistoryService = require('../services/clinical/clinicalHistory.service');
const timelineService = require('../services/timeline/timeline.service');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const { NotFoundError, ValidationError } = require('../utils/errors');
const AuditLog = require('../models/AuditLog');

class PatientController {
  async getAllPatients(req, res, next) {
    try {
      const pagination = parsePagination(req.query);
      const patients = await Patient.find()
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit);

      return res.status(200).json(patients || []);
    } catch (err) {
      next(err);
    }
  }

  async getPatientById(req, res, next) {
    try {
      const id = req.params.id;
      const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId
        ? { $or: [{ patientId: id }, { _id: id }] }
        : { patientId: id };

      const patient = await Patient.findOne(query);

      if (!patient) {
        throw new NotFoundError(`Patient with ID '${id}' not found.`);
      }

      // Attach timeline and clinical history
      const [history, timeline] = await Promise.all([
        clinicalHistoryService.getClinicalHistory(id).catch(() => null),
        timelineService.getPatientTimeline(id).catch(() => [])
      ]);

      const enriched = {
        ...(patient.toObject ? patient.toObject() : patient),
        id: patient.patientId || patient.id || id,
        historyOfPresentIllness: history?.historyOfPresentIllness?.summaryNarrative || null,
        pastMedicalHistory: history?.pastMedicalHistory?.join(', ') || null,
        medicationHistory: history?.medications || [],
        timeline: timeline || [],
        isVerified: patient.isVerified || history?.verificationStatus === 'DOCTOR_VERIFIED'
      };

      return res.status(200).json(enriched);
    } catch (err) {
      next(err);
    }
  }

  async createPatient(req, res, next) {
    try {
      const { name, phone, age, gender } = req.body;
      if (!name || !phone || !age || !gender) {
        return res.status(400).json({
          success: false,
          message: 'name, phone, age, and gender are required fields'
        });
      }

      const patientId = `P-${uuidv4().substring(0, 6).toUpperCase()}`;
      const patient = await Patient.create({
        patientId,
        ...req.body
      });

      // Audit log
      try {
        await AuditLog.create({
          auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
          actorId: req.user?.id || 'SYSTEM',
          actorRole: req.user?.role || 'SYSTEM',
          actorName: req.user?.name || 'System',
          action: 'PATIENT_CREATED',
          resourceType: 'Patient',
          resourceId: patientId,
          ipAddress: req.ip
        });
      } catch (e) {}

      return sendCreated(res, patient, 'Patient registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const id = req.params.id;
      const patient = await Patient.findOneAndUpdate(
        { patientId: id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );

      if (!patient) {
        throw new NotFoundError(`Patient with ID '${id}' not found.`);
      }

      return sendSuccess(res, patient, 'Patient profile updated');
    } catch (err) {
      next(err);
    }
  }

  async recordIntake(req, res, next) {
    try {
      const intakeData = req.body;
      if (!intakeData || !intakeData.patientId) {
        return res.status(400).json({ success: false, message: 'patientId is required for intake' });
      }

      // Find the patient to get their real token
      const patient = await Patient.findOne({ patientId: intakeData.patientId });
      const token = patient?.token || intakeData.patientId;

      return sendSuccess(res, {
        success: true,
        token,
        patientId: intakeData.patientId,
        message: 'Patient intake recorded successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyPatientSummary(req, res, next) {
    try {
      const id = req.params.id;
      const doctorName = req.user?.name || req.body.doctorName;

      if (!doctorName) {
        return res.status(400).json({ success: false, message: 'doctorName is required' });
      }

      const patient = await Patient.findOne({ patientId: id });
      if (!patient) {
        throw new NotFoundError(`Patient with ID '${id}' not found.`);
      }

      patient.isVerified = true;
      patient.verifiedBy = doctorName;
      patient.verifiedAt = new Date();
      await patient.save();

      await clinicalHistoryService.verifyHistory(id, doctorName, req.body.changes).catch(() => {});

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
          actorId: req.user?.id || 'DOCTOR',
          actorRole: 'DOCTOR',
          actorName: doctorName,
          action: 'SUMMARY_VERIFIED',
          resourceType: 'Patient',
          resourceId: id,
          ipAddress: req.ip
        });
      } catch (e) {}

      return res.status(200).json({ success: true, patient });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PatientController();
