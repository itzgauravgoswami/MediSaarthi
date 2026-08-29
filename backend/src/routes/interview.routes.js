// Clinical Interview Routes
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { aiLimiter, uploadLimiter } = require('../middleware/rateLimit.middleware');
const { uploadSingleAudio } = require('../middleware/upload.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const { startInterviewSchema, interviewResponseSchema } = require('../validators/interview.validator');

router.post('/', aiLimiter, validateRequest(startInterviewSchema), interviewController.startInterview);
router.post('/:id/respond', aiLimiter, validateRequest(interviewResponseSchema), interviewController.respondToQuestion);
router.post('/:id/voice', uploadLimiter, uploadSingleAudio, interviewController.voiceTurn);
router.post('/:id/complete', interviewController.completeInterview);

module.exports = router;
