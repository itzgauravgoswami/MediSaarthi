// Voice Analysis & Emergency Escalation Pipeline Service
const crypto = require('crypto');
const VoiceSession = require('../../models/VoiceSession');
const RiskAssessment = require('../../models/RiskAssessment');
const EmergencyEvent = require('../../models/EmergencyEvent');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const AuditLog = require('../../models/AuditLog');
const TimelineEvent = require('../../models/TimelineEvent');
const speechAdapter = require('../speech/speechProvider.adapter');
const emergencyDecisionEngine = require('./emergencyDecisionEngine');
const doctorMatchingService = require('./doctorMatching.service');
const realtimeAlertService = require('./realtimeAlert.service');
const { CLINICAL_URGENCY, EMERGENCY_STATUS } = require('../../constants/statuses');
const logger = require('../../utils/logger');
const { ValidationError } = require('../../utils/errors');

class VoiceAnalysisService {
  /**
   * Complete end-to-end voice analysis and emergency escalation workflow
   */
  async processVoiceInput({
    audioFilePath = null,
    transcriptText = null,
    patientId = 'P102',
    language = 'hi-IN',
    idempotencyKey = null,
    audioDurationSeconds = 0,
    patientContext = {}
  }) {
    const sessionId = `VS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Resolve or Transcribe Speech
    let finalTranscript = (transcriptText || '').trim();
    let transcriptionConfidence = 1.0;
    let providerName = 'client_webspeech';

    if (audioFilePath) {
      try {
        const transcription = await speechAdapter.transcribeAudio(audioFilePath, language);
        finalTranscript = (transcription.transcript || transcription.text || '').trim();
        transcriptionConfidence = transcription.confidence || 0.95;
        providerName = transcription.provider || 'gemini';
      } catch (err) {
        logger.error(`[VoiceAnalysis] STT failure: ${err.message}`);
        // Log audit failure
        try {
          await AuditLog.create({
            auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
            actorId: patientId,
            actorRole: 'PATIENT',
            action: 'TRANSCRIPTION_COMPLETED',
            resourceType: 'VoiceSession',
            resourceId: sessionId,
            status: 'Failed',
            metadata: { error: err.message }
          });
        } catch (e) {}

        throw new ValidationError(`Speech recognition failed: ${err.message}. Please retry speaking clearly.`);
      }
    }

    if (!finalTranscript) {
      throw new ValidationError('No valid speech transcript received. Please try speaking again.');
    }

    // 2. Fetch authenticated patient record if available
    let patient = null;
    try {
      patient = await Patient.findOne({ patientId });
    } catch (e) {}

    const patientName = patient?.name || patientContext.name || 'Rahul Kumar';
    const patientToken = patient?.token || patientContext.token || '#102';
    const patientAge = patient?.age || patientContext.age || 45;
    const patientGender = patient?.gender || patientContext.gender || 'Male';

    // 3. Persist VoiceSession
    let voiceSession;
    try {
      voiceSession = await VoiceSession.create({
        voiceSessionId: sessionId,
        patientId,
        patientName,
        audioReference: audioFilePath || 'client_mic_stream',
        transcript: finalTranscript,
        transcriptionConfidence,
        language,
        provider: providerName,
        status: 'ANALYZING',
        durationSeconds: audioDurationSeconds
      });
    } catch (err) {
      logger.warn(`[VoiceAnalysis] VoiceSession persistence note: ${err.message}`);
    }

    // 4. Run Hybrid Emergency Decision Engine (Layers 1, 2, 3)
    const decision = await emergencyDecisionEngine.decideClinicalUrgency(finalTranscript, {
      age: patientAge,
      gender: patientGender,
      conditions: patient?.pastMedicalHistory || patientContext.conditions
    });

    // 5. Persist RiskAssessment
    const riskAssessmentId = `RA-${Date.now().toString(36).toUpperCase()}`;
    let riskAssessment;
    try {
      riskAssessment = await RiskAssessment.create({
        riskAssessmentId,
        voiceSessionId: sessionId,
        patientId,
        urgency: decision.urgency,
        confidence: decision.confidence,
        symptoms: decision.symptoms,
        riskIndicators: decision.riskIndicators,
        clinicalCategories: decision.clinicalCategories,
        recommendedSpecialty: decision.recommendedSpecialty,
        requiresImmediateAttention: decision.requiresImmediateAttention,
        reason: decision.reason,
        deterministicRulesMatched: decision.deterministicRulesMatched,
        model: 'gemini-hybrid-safety-engine'
      });
    } catch (err) {
      logger.warn(`[VoiceAnalysis] RiskAssessment persistence note: ${err.message}`);
    }

    // Update voice session status
    if (voiceSession) {
      voiceSession.status = 'COMPLETED';
      await voiceSession.save().catch(() => {});
    }

    // 6. Handle Emergency Escalation if Urgency is EMERGENCY
    let emergencyEvent = null;
    let matched = null;
    if (decision.urgency === CLINICAL_URGENCY.EMERGENCY) {
      const computedKey = idempotencyKey || crypto.createHash('sha256').update(`${patientId}_${finalTranscript.toLowerCase().replace(/\s+/g, '')}`).digest('hex');

      // Match doctor
      matched = await doctorMatchingService.matchDoctor({
        clinicalCategories: decision.clinicalCategories,
        recommendedSpecialty: decision.recommendedSpecialty
      });

      // Check for duplicate recent emergency event within 2 minutes to ensure idempotency
      const existing = await EmergencyEvent.findOne({
        idempotencyKey: computedKey,
        createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) }
      });

      if (existing) {
        logger.info(`[VoiceAnalysis] Idempotent emergency event already exists: ${existing.eventId}`);
        emergencyEvent = existing;
      } else {

        const eventId = `EMERG-${Date.now().toString(36).toUpperCase()}`;
        emergencyEvent = await EmergencyEvent.create({
          eventId,
          patientId,
          patientName,
          patientToken,
          patientAge,
          patientGender,
          voiceSessionId: sessionId,
          riskAssessmentId,
          idempotencyKey: computedKey,
          severity: CLINICAL_URGENCY.EMERGENCY,
          status: EMERGENCY_STATUS.ALERTING,
          symptoms: decision.symptoms,
          riskIndicators: decision.riskIndicators,
          clinicalCategories: decision.clinicalCategories,
          recommendedSpecialty: decision.recommendedSpecialty,
          assignedDoctorId: matched.assignedDoctorId,
          assignedDoctorName: matched.assignedDoctorName,
          backupDoctorIds: matched.backupDoctorIds,
          escalationLevel: 0,
          detectedAt: new Date(),
          auditTrail: [{
            action: 'EMERGENCY_DETECTED',
            timestamp: new Date(),
            actor: 'AI_CLINICAL_SAFETY_ENGINE',
            details: `Urgency: EMERGENCY. Matched specialty: ${decision.recommendedSpecialty}. Assigned Doctor: ${matched.assignedDoctorName}.`
          }]
        });

        // Broadcast real-time emergency alert via SSE
        await realtimeAlertService.broadcastEmergencyAlert(emergencyEvent);

        // Record Audit Log
        try {
          await AuditLog.create({
            auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
            actorId: patientId,
            actorRole: 'PATIENT',
            action: 'EMERGENCY_DETECTED',
            resourceType: 'EmergencyEvent',
            resourceId: eventId,
            metadata: {
              urgency: decision.urgency,
              recommendedSpecialty: decision.recommendedSpecialty,
              assignedDoctor: matched.assignedDoctorName
            }
          });
        } catch (e) {}

        // Add to Timeline Event
        try {
          await TimelineEvent.create({
            eventId: `TLE-${Date.now().toString(36).toUpperCase()}`,
            patientId,
            eventType: 'TRIAGE_ALERT',
            title: `🚨 Emergency Alert: ${decision.recommendedSpecialty}`,
            description: decision.reason,
            badge: 'Emergency Triage',
            priority: 'IMMEDIATE',
            timestamp: new Date()
          });
        } catch (e) {}

        // Automatically Register Emergency Consultation Appointment in MongoDB
        try {
          await Appointment.create({
            appointmentId: `APT-EMERG-${Date.now().toString(36).toUpperCase()}`,
            patientId,
            patientName: patientName || 'Patient',
            doctorId: matched?.assignedDoctorId || 'DOC-101',
            doctorName: matched?.assignedDoctorName || 'Dr. Vikramaditya Rao',
            specialization: decision.recommendedSpecialty || 'Emergency Medicine',
            roomNumber: matched?.doctorDetails?.roomNumber || 'Room 101, Emergency Department',
            appointmentDate: new Date(),
            slotTime: 'IMMEDIATE (EMERGENCY)',
            status: 'WAITING',
            tokenNumber: patientToken || '#EM-101',
            department: matched?.doctorDetails?.department || 'Emergency & Critical Care Wing',
            intakeCompleted: true,
            redFlagPresent: true,
            chiefComplaint: (decision.symptoms || []).join(', ') || 'Acute Emergency Symptoms',
            triageSummary: decision.reason
          });

          await Patient.findOneAndUpdate(
            { patientId },
            {
              intakeStatus: 'Completed',
              redFlag: 'Attention Required',
              status: 'Emergency Triage',
              chiefComplaint: (decision.symptoms || []).join(', ') || 'Acute Medical Emergency'
            }
          ).catch(() => {});
        } catch (e) {
          logger.warn(`[VoiceAnalysis] Auto appointment registration note: ${e.message}`);
        }
      }
    } else {
      // Non-emergency: Record standard risk analysis audit log
      try {
        await AuditLog.create({
          auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
          actorId: patientId,
          actorRole: 'PATIENT',
          action: 'RISK_ANALYSIS_COMPLETED',
          resourceType: 'VoiceSession',
          resourceId: sessionId,
          metadata: { urgency: decision.urgency, confidence: decision.confidence }
        });
      } catch (e) {}
    }

    return {
      sessionId,
      transcript: finalTranscript,
      transcriptionConfidence,
      assessment: {
        riskAssessmentId,
        urgency: decision.urgency,
        confidence: decision.confidence,
        symptoms: decision.symptoms,
        riskIndicators: decision.riskIndicators,
        clinicalCategories: decision.clinicalCategories,
        recommendedSpecialty: decision.recommendedSpecialty,
        requiresImmediateAttention: decision.requiresImmediateAttention,
        reason: decision.reason,
        deterministicRulesMatched: decision.deterministicRulesMatched
      },
      emergency: emergencyEvent ? {
        eventId: emergencyEvent.eventId,
        status: emergencyEvent.status,
        assignedDoctorId: emergencyEvent.assignedDoctorId,
        assignedDoctorName: emergencyEvent.assignedDoctorName,
        recommendedSpecialty: emergencyEvent.recommendedSpecialty,
        detectedAt: emergencyEvent.detectedAt,
        doctor: matched?.doctorDetails || {
          doctorId: emergencyEvent.assignedDoctorId || 'DOC-101',
          name: emergencyEvent.assignedDoctorName || 'Dr. Vikramaditya Rao',
          specialization: emergencyEvent.recommendedSpecialty || 'Emergency Medicine',
          department: 'Emergency & Critical Care Wing',
          roomNumber: 'Room 101, Emergency Department',
          isAvailable: true
        }
      } : null,
      patientGuidance: this.generatePatientGuidance(decision.urgency, emergencyEvent?.assignedDoctorName)
    };
  }

  /**
   * Generates empathetic, clinically responsible guidance for the patient without false reassurance
   */
  generatePatientGuidance(urgency, assignedDoctorName) {
    if (urgency === CLINICAL_URGENCY.EMERGENCY) {
      return {
        title: 'Potential Medical Emergency Detected',
        message: `Your symptoms indicate a potentially serious condition. An emergency notification has been dispatched to ${assignedDoctorName || 'an on-call physician'}. If you are in immediate life-threatening danger, please also contact your local emergency services (108 / 112) immediately.`,
        level: 'danger'
      };
    }

    if (urgency === CLINICAL_URGENCY.URGENT) {
      return {
        title: 'Medical Attention Recommended',
        message: 'Your reported symptoms may require prompt medical evaluation. We have added these notes to your clinical summary for your consulting doctor.',
        level: 'warning'
      };
    }

    if (urgency === CLINICAL_URGENCY.MONITOR) {
      return {
        title: 'Symptoms Recorded',
        message: 'Your symptoms have been logged. Please continue with your consultation or monitor if symptoms worsen.',
        level: 'info'
      };
    }

    return {
      title: 'Response Analysed',
      message: 'No immediate emergency indicators detected. Your information has been securely structured for your doctor.',
      level: 'success'
    };
  }
}

module.exports = new VoiceAnalysisService();
