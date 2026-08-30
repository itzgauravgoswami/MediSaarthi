// Interview Controller with Voice and Text Support, Relevance Check & Auto-Slot Booking
const { v4: uuidv4 } = require('uuid');
const Interview = require('../models/Interview');
const InterviewMessage = require('../models/InterviewMessage');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { processInterviewTurn } = require('../services/ai/interview.service');
const speechService = require('../services/speech/speechRecognition.service');
const ttsService = require('../services/speech/textToSpeech.service');
const redFlagService = require('../services/redFlags/redFlag.service');
const clinicalHistoryService = require('../services/clinical/clinicalHistory.service');
const doctorMatchingService = require('../services/emergency/doctorMatching.service');
const { sendSuccess, sendCreated } = require('../utils/response');
const { INTERVIEW_STATUS, APPOINTMENT_STATUS } = require('../constants/statuses');
const { INTERVIEW_SECTIONS } = require('../constants/interviewSections');
const logger = require('../../src/utils/logger');
const { ValidationError } = require('../utils/errors');

class InterviewController {
  async startInterview(req, res, next) {
    try {
      const { patientId, language = 'hi-IN', mode = 'HYBRID', kioskId } = req.body;
      const interviewId = `INT-${uuidv4().substring(0, 8).toUpperCase()}`;

      const isHindi = language.startsWith('hi');
      const initialQuestionHindi = "नमस्ते, मैं मेडीसारथी हूँ। आज आपको क्या मुख्य तकलीफ या लक्षण महसूस हो रहे हैं?";
      const initialQuestionEnglish = "Hello, I am MediSaarthi. What main symptoms or health difficulties are you experiencing today?";
      const initialQuestion = isHindi ? initialQuestionHindi : initialQuestionEnglish;

      let interview;
      try {
        interview = await Interview.create({
          interviewId,
          patientId,
          kioskId,
          language,
          mode,
          currentSection: INTERVIEW_SECTIONS.CHIEF_COMPLAINT,
          currentQuestion: initialQuestion,
          status: INTERVIEW_STATUS.IN_PROGRESS
        });
      } catch (e) {
        interview = {
          interviewId,
          patientId,
          language,
          currentSection: INTERVIEW_SECTIONS.CHIEF_COMPLAINT,
          currentQuestion: initialQuestion,
          status: INTERVIEW_STATUS.IN_PROGRESS
        };
      }

      return sendCreated(res, {
        interview,
        nextQuestion: initialQuestion,
        nextQuestionHindi: initialQuestionHindi,
        nextQuestionEnglish: initialQuestionEnglish,
        section: INTERVIEW_SECTIONS.CHIEF_COMPLAINT
      }, 'Interview initialized');
    } catch (err) {
      next(err);
    }
  }

  async respondToQuestion(req, res, next) {
    try {
      const interviewId = req.params.id;
      const { patientResponse, inputMode = 'TEXT', language = 'hi-IN' } = req.body;

      let interview = await Interview.findOne({ interviewId });
      const currentSection = interview?.currentSection || INTERVIEW_SECTIONS.CHIEF_COMPLAINT;
      const collectedData = interview?.collectedData || {};

      // 1. Process conversational turn with relevance verification & high-yield extraction
      const turnResult = await processInterviewTurn({
        currentSection,
        language,
        patientResponse,
        collectedData
      });

      // 2. Evaluate red flags
      const extractedSymptoms = [
        ...(turnResult.extraction?.chiefComplaint || []),
        ...(turnResult.extraction?.associatedSymptoms || [])
      ];
      await redFlagService.evaluateAndCreateAlerts(
        interview?.patientId || 'P102',
        interviewId,
        extractedSymptoms,
        patientResponse
      );

      // 3. Update interview state
      if (interview) {
        interview.currentSection = turnResult.nextSection || INTERVIEW_SECTIONS.COMPLETE;
        interview.currentQuestion = turnResult.nextQuestion;
        if (!interview.collectedData) interview.collectedData = {};
        interview.collectedData = { ...interview.collectedData, ...turnResult.extraction };
        if (turnResult.nextSection === INTERVIEW_SECTIONS.COMPLETE) {
          interview.status = INTERVIEW_STATUS.COMPLETED;
          interview.completedAt = new Date();
        }
        await interview.save().catch(() => {});
      }

      // 4. Save structured history incrementally
      if (interview?.patientId) {
        await clinicalHistoryService.saveOrUpdateHistory(interview.patientId, turnResult.extraction);
      }

      // 5. If interview is COMPLETE, auto-book consultation slot for the matched disease doctor
      let bookingDetails = null;
      if (turnResult.nextSection === INTERVIEW_SECTIONS.COMPLETE) {
        bookingDetails = await this._autoBookDoctorSlot({
          patientId: interview?.patientId || 'P102',
          extraction: turnResult.extraction || collectedData
        });
      }

      return sendSuccess(res, {
        interviewId,
        isRelevant: turnResult.isRelevant !== false,
        nextSection: turnResult.nextSection,
        nextQuestion: turnResult.nextQuestion,
        nextQuestionHindi: turnResult.nextQuestionHindi,
        extraction: turnResult.extraction,
        potentialRedFlags: turnResult.potentialRedFlags || [],
        booking: bookingDetails
      });
    } catch (err) {
      next(err);
    }
  }

  async voiceTurn(req, res, next) {
    try {
      const interviewId = req.params.id;
      if (!req.file) {
        throw new ValidationError('Audio file is required for voice turn.');
      }

      let interview = await Interview.findOne({ interviewId });
      const language = req.body.language || interview?.language || 'hi-IN';

      // 1. Transcribe speech using self-hosted Whisper / Gemini
      const transcription = await speechService.transcribe(req.file.path, language);
      const patientResponse = transcription.transcript || transcription.text;

      const currentSection = interview?.currentSection || INTERVIEW_SECTIONS.CHIEF_COMPLAINT;
      const collectedData = interview?.collectedData || {};

      // 2. Process clinical turn with AI
      const turnResult = await processInterviewTurn({
        currentSection,
        language,
        patientResponse,
        collectedData
      });

      // 3. Evaluate red flags
      const extractedSymptoms = [
        ...(turnResult.extraction?.chiefComplaint || []),
        ...(turnResult.extraction?.associatedSymptoms || [])
      ];
      await redFlagService.evaluateAndCreateAlerts(
        interview?.patientId || 'P102',
        interviewId,
        extractedSymptoms,
        patientResponse
      );

      // 4. Generate TTS response for patient
      const tts = await ttsService.speak(turnResult.nextQuestion, language);

      let bookingDetails = null;
      if (turnResult.nextSection === INTERVIEW_SECTIONS.COMPLETE) {
        bookingDetails = await this._autoBookDoctorSlot({
          patientId: interview?.patientId || 'P102',
          extraction: turnResult.extraction || collectedData
        });
      }

      return sendSuccess(res, {
        interviewId,
        transcript: patientResponse,
        transcriptionProvider: transcription.provider,
        isRelevant: turnResult.isRelevant !== false,
        nextSection: turnResult.nextSection,
        nextQuestion: turnResult.nextQuestion,
        nextQuestionHindi: turnResult.nextQuestionHindi,
        audioUrl: tts.audioUrl,
        extraction: turnResult.extraction,
        potentialRedFlags: turnResult.potentialRedFlags || [],
        booking: bookingDetails
      });
    } catch (err) {
      next(err);
    }
  }

  async completeInterview(req, res, next) {
    try {
      const interviewId = req.params.id;
      let interview = await Interview.findOne({ interviewId });
      if (interview) {
        interview.status = INTERVIEW_STATUS.COMPLETED;
        interview.completedAt = new Date();
        await interview.save();
      }

      const bookingDetails = await this._autoBookDoctorSlot({
        patientId: interview?.patientId || 'P102',
        extraction: interview?.collectedData || {}
      });

      return sendSuccess(res, { interviewId, status: 'COMPLETED', booking: bookingDetails }, 'Interview completed and doctor slot confirmed');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Automatically book appointment slot with the matched specialist doctor
   */
  async _autoBookDoctorSlot({ patientId, extraction }) {
    try {
      const complaints = extraction.chiefComplaint || [];
      const complaintText = complaints.join(' ').toLowerCase();

      // Determine specialty based on disease/complaint
      let recommendedSpecialty = 'Internal Medicine';
      let clinicalCategory = 'general';

      if (/skin|rash|itching|त्वचा|खुजली|दाने/i.test(complaintText)) {
        recommendedSpecialty = 'Dermatology';
        clinicalCategory = 'dermatological';
      } else if (/chest|heart|angina|सीने|दिल/i.test(complaintText)) {
        recommendedSpecialty = 'Cardiology';
        clinicalCategory = 'cardiac';
      } else if (/cough|breath|asthma|lungs|खांसी|सांस|दमा/i.test(complaintText)) {
        recommendedSpecialty = 'Pulmonology';
        clinicalCategory = 'respiratory';
      } else if (/headache|migraine|dizziness|सिरदर्द|चक्कर/i.test(complaintText)) {
        recommendedSpecialty = 'Neurology';
        clinicalCategory = 'neurological';
      } else if (/joint|knee|bone|back|कमर|घुटने|जोड़ों/i.test(complaintText)) {
        recommendedSpecialty = 'Orthopedics';
        clinicalCategory = 'trauma';
      } else if (/stomach|abdomen|vomit|acidity|gas|पेट|उल्टी|गैस/i.test(complaintText)) {
        recommendedSpecialty = 'Internal Medicine';
        clinicalCategory = 'general';
      } else if (/ayush|ayurveda|वात|पित्त|कफ/i.test(complaintText)) {
        recommendedSpecialty = 'AYUSH Medicine';
        clinicalCategory = 'general';
      }

      // Match Doctor
      const matched = await doctorMatchingService.matchDoctor({
        clinicalCategories: [clinicalCategory],
        recommendedSpecialty
      });

      const appointmentId = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;
      const tokenNumber = `#102`;
      const slotTime = '11:15 AM';

      let appointment;
      try {
        appointment = await Appointment.create({
          appointmentId,
          patientId,
          doctorId: matched.assignedDoctorId,
          doctorName: matched.assignedDoctorName,
          appointmentDate: new Date(),
          slotTime,
          status: APPOINTMENT_STATUS.WAITING,
          tokenNumber,
          department: matched.doctorDetails?.department || `${recommendedSpecialty} OPD`,
          intakeCompleted: true,
          chiefComplaint: complaints.join(', ') || 'General OPD Consultation'
        });
      } catch (e) {
        logger.warn(`[AutoBook] Appointment create note: ${e.message}`);
      }

      // Update Patient status
      try {
        await Patient.findOneAndUpdate(
          { patientId },
          { 
            intakeStatus: 'Completed',
            chiefComplaint: complaints.join(', ') || 'General Consultation',
            status: 'Waiting'
          }
        );
      } catch (e) {}

      return {
        appointmentId,
        slotTime,
        tokenNumber,
        scheduledDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        department: matched.doctorDetails?.department || `${recommendedSpecialty} OPD`,
        doctor: matched.doctorDetails || {
          doctorId: matched.assignedDoctorId,
          name: matched.assignedDoctorName,
          specialization: matched.assignedSpecialization || recommendedSpecialty,
          department: `${recommendedSpecialty} OPD`,
          roomNumber: 'OPD-102',
          isAvailable: true
        }
      };
    } catch (err) {
      logger.error(`[AutoBook] Error booking slot: ${err.message}`);
      return null;
    }
  }
}

module.exports = new InterviewController();
