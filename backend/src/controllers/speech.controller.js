// Speech & Transcription Controller
const speechService = require('../services/speech/speechRecognition.service');
const ttsService = require('../services/speech/textToSpeech.service');
const { sendSuccess } = require('../utils/response');
const { ValidationError } = require('../utils/errors');

class SpeechController {
  async transcribe(req, res, next) {
    try {
      if (!req.file) {
        throw new ValidationError('Audio file required in form-data.');
      }

      const language = req.body.language || req.query.language || 'hi-IN';
      const result = await speechService.transcribe(req.file.path, language);

      return sendSuccess(res, {
        transcript: result.transcript || result.text,
        text: result.text || result.transcript,
        confidence: result.confidence,
        detectedLanguage: result.detectedLanguage,
        provider: result.provider
      }, 'Audio transcribed successfully');
    } catch (err) {
      next(err);
    }
  }

  async synthesize(req, res, next) {
    try {
      const { text, language = 'hi-IN' } = req.body;
      if (!text) {
        throw new ValidationError('Text parameter is required for speech synthesis.');
      }

      const result = await ttsService.speak(text, language);
      return sendSuccess(res, result, 'Speech synthesized');
    } catch (err) {
      next(err);
    }
  }

  async ttsAudio(req, res, next) {
    try {
      const text = req.query.text || req.body?.text;
      const language = req.query.language || req.body?.language || 'hi-IN';

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text parameter required' });
      }

      const https = require('https');
      const langCode = (language || '').startsWith('hi') ? 'hi' : 'en';
      const cleanText = text.replace(/[\n\r]+/g, ' ').substring(0, 300);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${langCode}&client=tw-ob`;

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const request = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (googleRes) => {
        if (googleRes.statusCode === 200) {
          googleRes.pipe(res);
        } else {
          res.status(googleRes.statusCode).end();
        }
      });

      request.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SpeechController();
