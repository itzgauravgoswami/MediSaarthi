// Interview Controller with Voice and Text Support
const { v4: uuidv4 } = require('uuid');
const Interview = require('../models/Interview');
const InterviewMessage = require('../models/InterviewMessage');
const Patient = require('../models/Patient');
const { processInterviewTurn } = require('../services/ai/interview.service');
const speechService = require('../services/speech/speechRecognition.service');
const ttsService = require('../services/speech/textToSpeech.service');
const redFlagService = require('../services/redFlags/redFlag.service');
const clinicalHistoryService = require('../services/clinical/clinicalHistory.service');
const { sendSuccess, sendCreated } = require('../utils/response');
const { INTERVIEW_STATUS } = require('../constants/statuses');
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

      // 1. Process conversational turn with Gemini
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
        interview.currentSection = turnResult.nextSection || INTERVIEW_SECTIONS.HPI;
        interview.currentQuestion = turnResult.nextQuestion;
        if (!interview.collectedData) interview.collectedData = {};
        interview.collectedData = { ...interview.collectedData, ...turnResult.extraction };
        await interview.save().catch(() => {});
      }

      // 4. Save structured history incrementally
      if (interview?.patientId) {
        await clinicalHistoryService.saveOrUpdateHistory(interview.patientId, turnResult.extraction);
      }

      return sendSuccess(res, {
        interviewId,
        nextSection: turnResult.nextSection,
        nextQuestion: turnResult.nextQuestion,
        nextQuestionHindi: turnResult.nextQuestionHindi,
        extraction: turnResult.extraction,
        potentialRedFlags: turnResult.potentialRedFlags || []
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

      return sendSuccess(res, {
        interviewId,
        transcript: patientResponse,
        transcriptionProvider: transcription.provider,
        nextSection: turnResult.nextSection,
        nextQuestion: turnResult.nextQuestion,
        nextQuestionHindi: turnResult.nextQuestionHindi,
        audioUrl: tts.audioUrl,
        extraction: turnResult.extraction,
        potentialRedFlags: turnResult.potentialRedFlags || []
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

      return sendSuccess(res, { interviewId, status: 'COMPLETED' }, 'Interview completed');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InterviewController();
