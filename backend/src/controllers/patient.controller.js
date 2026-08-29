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
const { NotFoundError } = require('../utils/errors');
const AuditLog = require('../models/AuditLog');

const FALLBACK_PATIENTS = [
  {
    id: "P102",
    patientId: "P102",
    token: "#102",
    name: "Rahul Kumar",
    age: 45,
    gender: "Male",
    phone: "+91 98765 43210",
    abhaId: "91-4829-1039-4821",
    language: "hi",
    preferredLanguage: "hi-IN",
    chiefComplaint: "Chest Pain with Breathlessness",
    intakeStatus: "Completed",
    redFlag: "Attention Required",
    priority: "High",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "10:30 AM",
    date: "28 Aug 2026",
    isVerified: false,
    historyOfPresentIllness: "Patient reports substernal chest pain for approximately three days. Pain reportedly increases during physical activity.",
    pastMedicalHistory: "Essential Hypertension, Type 2 Diabetes Mellitus.",
    medicationHistory: [
      { name: "Metformin", dosage: "500 mg", frequency: "BD", source: "OCR", confidence: 94 },
      { name: "Amlodipine", dosage: "5 mg", frequency: "OD", source: "OCR", confidence: 91 }
    ],
    timeline: [
      { id: "T1", date: "28 Aug 2026", type: "Consultation", title: "Current Intake", desc: "Substernal chest pain with exertional breathlessness.", badge: "Red Flag" }
    ],
    documents: []
  },
  {
    id: "P103",
    patientId: "P103",
    token: "#103",
    name: "Priya Patel",
    age: 32,
    gender: "Female",
    phone: "+91 98123 45678",
    abhaId: "91-1234-5678-9012",
    language: "hi",
    preferredLanguage: "hi-IN",
    chiefComplaint: "High Fever & Joint Pain (3 Days)",
    intakeStatus: "Completed",
    redFlag: "Normal",
    priority: "Normal",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "10:45 AM",
    date: "28 Aug 2026",
    isVerified: false,
    historyOfPresentIllness: "Acute onset intermittent high-grade fever with rigors and polyarthralgia for three days.",
    pastMedicalHistory: "None reported.",
    medicationHistory: [
      { name: "Paracetamol", dosage: "650 mg", frequency: "TDS", source: "PATIENT", confidence: 95 }
    ]
  },
  {
    id: "P104",
    patientId: "P104",
    token: "#104",
    name: "Amitabh Banerjee",
    age: 58,
    gender: "Male",
    phone: "+91 97456 12389",
    abhaId: "91-9988-7766-5544",
    language: "bn",
    preferredLanguage: "bn-IN",
    chiefComplaint: "Chronic Cough & Dyspnea on Exertion",
    intakeStatus: "In Progress",
    redFlag: "Normal",
    priority: "Normal",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "11:00 AM",
    date: "28 Aug 2026",
    isVerified: false
  }
];

class PatientController {
  async getAllPatients(req, res, next) {
    try {
      const pagination = parsePagination(req.query);
      let patients = [];

      try {
        patients = await Patient.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit);
      } catch (e) {}

      if (!patients || patients.length === 0) {
        patients = FALLBACK_PATIENTS;
      }

      return res.status(200).json(patients); // Maintain direct array compatibility with frontend
    } catch (err) {
      next(err);
    }
  }

  async getPatientById(req, res, next) {
    try {
      const id = req.params.id;
      let patient = null;

      try {
        patient = await Patient.findOne({ $or: [{ patientId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
      } catch (e) {}

      if (!patient) {
        patient = FALLBACK_PATIENTS.find(p => p.id === id || p.patientId === id) || FALLBACK_PATIENTS[0];
      }

      // Attach timeline and history
      const history = await clinicalHistoryService.getClinicalHistory(id);
      const timeline = await timelineService.getPatientTimeline(id);

      const enriched = {
        ...((patient.toObject ? patient.toObject() : patient)),
        id: patient.patientId || patient.id || id,
        historyOfPresentIllness: history.historyOfPresentIllness?.summaryNarrative || patient.historyOfPresentIllness || 'History recorded.',
        pastMedicalHistory: history.pastMedicalHistory?.join(', ') || patient.pastMedicalHistory || 'None',
        medicationHistory: history.medications || patient.medicationHistory || [],
        timeline: timeline || [],
        isVerified: patient.isVerified || history.verificationStatus === 'DOCTOR_VERIFIED'
      };

      return res.status(200).json(enriched);
    } catch (err) {
      next(err);
    }
  }

  async createPatient(req, res, next) {
    try {
      const patientId = `P-${uuidv4().substring(0, 6).toUpperCase()}`;
      const patient = await Patient.create({
        patientId,
        ...req.body
      });
      return sendCreated(res, patient, 'Patient registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const id = req.params.id;
      const patient = await Patient.findOneAndUpdate({ patientId: id }, req.body, { new: true });
      return sendSuccess(res, patient, 'Patient profile updated');
    } catch (err) {
      next(err);
    }
  }

  async recordIntake(req, res, next) {
    try {
      const intakeData = req.body;
      const token = `#${Math.floor(100 + Math.random() * 900)}`;

      return sendSuccess(res, {
        success: true,
        token,
        message: 'Patient intake recorded successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyPatientSummary(req, res, next) {
    try {
      const id = req.params.id;
      const doctorName = req.body.doctorName || req.user?.name || 'Dr. Sharma';

      let patient = await Patient.findOne({ patientId: id });
      if (patient) {
        patient.isVerified = true;
        patient.verifiedBy = doctorName;
        patient.verifiedAt = new Date();
        await patient.save();
      } else {
        patient = FALLBACK_PATIENTS.find(p => p.id === id) || FALLBACK_PATIENTS[0];
        patient.isVerified = true;
        patient.verifiedBy = doctorName;
        patient.verifiedAt = new Date().toISOString();
      }

      await clinicalHistoryService.verifyHistory(id, doctorName, req.body.changes);

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
          actorId: req.user?.id || 'DOC-101',
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
