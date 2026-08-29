// Speech Routes
const express = require('express');
const router = express.Router();
const speechController = require('../controllers/speech.controller');
const { uploadSingleAudio } = require('../middleware/upload.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

router.post('/transcribe', uploadLimiter, uploadSingleAudio, speechController.transcribe);
router.post('/synthesize', speechController.synthesize);
router.get('/tts-audio', speechController.ttsAudio);
router.post('/tts-audio', speechController.ttsAudio);

module.exports = router;
