// Emergency & Voice Analysis Routes
const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');
const { uploadSingleAudio } = require('../middleware/upload.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

// Voice Analysis & Triage (Supports /voice/analyse, /analyse, /voice/sessions/analyse)
router.post('/voice/analyse', uploadLimiter, uploadSingleAudio, (req, res, next) => emergencyController.analyseVoice(req, res, next));
router.post('/analyse', uploadLimiter, uploadSingleAudio, (req, res, next) => emergencyController.analyseVoice(req, res, next));
router.post('/voice/sessions/analyse', uploadLimiter, uploadSingleAudio, (req, res, next) => emergencyController.analyseVoice(req, res, next));
router.post('/sessions/analyse', uploadLimiter, uploadSingleAudio, (req, res, next) => emergencyController.analyseVoice(req, res, next));

// Real-Time Server-Sent Events Alert Stream
router.get('/emergency-events/stream', (req, res, next) => emergencyController.streamAlerts(req, res, next));
router.get('/stream', (req, res, next) => emergencyController.streamAlerts(req, res, next));

// Emergency Event CRUD & Lifecycle (Supports both /emergency-events/... and root mounted /...)
router.post('/emergency-events', (req, res, next) => emergencyController.createManualEmergency(req, res, next));
router.get('/emergency-events', (req, res, next) => emergencyController.getEmergencyEvents(req, res, next));
router.get('/emergency-events/active', (req, res, next) => emergencyController.getActiveAlerts(req, res, next));
router.get('/emergency-events/:id', (req, res, next) => emergencyController.getEmergencyEventById(req, res, next));
router.post('/emergency-events/:id/acknowledge', (req, res, next) => emergencyController.acknowledgeEmergency(req, res, next));
router.post('/emergency-events/:id/escalate', (req, res, next) => emergencyController.escalateEmergency(req, res, next));
router.post('/emergency-events/:id/resolve', (req, res, next) => emergencyController.resolveEmergency(req, res, next));

// Direct resource aliases when mounted under /api/emergency-events or /api/emergency
router.post('/events', (req, res, next) => emergencyController.createManualEmergency(req, res, next));
router.get('/events', (req, res, next) => emergencyController.getEmergencyEvents(req, res, next));
router.get('/active', (req, res, next) => emergencyController.getActiveAlerts(req, res, next));
router.get('/:id', (req, res, next) => {
  if (['stream', 'active', 'events', 'voice', 'analyse'].includes(req.params.id)) return next();
  return emergencyController.getEmergencyEventById(req, res, next);
});
router.post('/:id/acknowledge', (req, res, next) => emergencyController.acknowledgeEmergency(req, res, next));
router.post('/:id/escalate', (req, res, next) => emergencyController.escalateEmergency(req, res, next));
router.post('/:id/resolve', (req, res, next) => emergencyController.resolveEmergency(req, res, next));

module.exports = router;
