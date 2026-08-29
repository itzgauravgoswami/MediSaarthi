// MediSaarthi High-Speed Gemini Multimodal Audio Transcription Provider
// 0ms Server Load • Cloud-Scale Precision for Hindi, Indian English & Regional Dialects

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');
const logger = require('../../utils/logger');
const fs = require('fs');

class GeminiSpeechProvider {
  constructor() {
    this.name = 'gemini';
    this.genAI = config.ai.geminiApiKey ? new GoogleGenerativeAI(config.ai.geminiApiKey) : null;
    this.model = this.genAI ? this.genAI.getGenerativeModel({ model: config.ai.geminiModel || 'gemini-3.7-flash' }) : null;
  }

  async transcribe(audioPath, options = {}) {
    if (!this.model) {
      throw new Error('Gemini API key is not configured.');
    }

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found at: ${audioPath}`);
    }

    try {
      const audioBuffer = fs.readFileSync(audioPath);
      const base64Audio = audioBuffer.toString('base64');
      const mimeType = options.mimeType || (audioPath.endsWith('.wav') ? 'audio/wav' : 'audio/webm');
      const lang = options.language || 'hi-IN';

      const prompt = `Listen to this medical audio recording of a patient speaking in ${lang.startsWith('hi') ? 'Hindi' : 'English'}. Transcribe what the patient says word for word. Output ONLY the clean transcribed text, no extra markdown or explanations.`;

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Audio
                }
              },
              {
                text: prompt
              }
            ]
          }
        ]
      });

      const transcript = result.response.text().trim();

      return {
        text: transcript,
        transcript: transcript,
        detected_language: lang,
        provider: 'gemini'
      };
    } catch (err) {
      logger.error(`[Gemini Speech] Transcription error: ${err.message}`);
      throw err;
    }
  }

  async checkHealth() {
    return {
      available: !!this.model,
      provider: 'gemini'
    };
  }
}

module.exports = GeminiSpeechProvider;
