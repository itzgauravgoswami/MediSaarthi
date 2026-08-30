// MediSaarthi High-Speed Gemini Multimodal Audio Transcription Provider
// 0ms Server Load • Cloud-Scale Precision for Hindi, Indian English & Regional Dialects

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');
const logger = require('../../utils/logger');
const fs = require('fs');

const SPEECH_MODEL_CANDIDATES = [
  config.ai.geminiModel || 'gemini-3.6-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash'
];

class GeminiSpeechProvider {
  constructor() {
    this.name = 'gemini';
    this.genAI = config.ai.geminiApiKey ? new GoogleGenerativeAI(config.ai.geminiApiKey) : null;
  }

  async transcribe(audioPath, options = {}) {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured.');
    }

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found at: ${audioPath}`);
    }

    const audioBuffer = fs.readFileSync(audioPath);
    const base64Audio = audioBuffer.toString('base64');
    const mimeType = options.mimeType || (audioPath.endsWith('.wav') ? 'audio/wav' : 'audio/webm');
    const lang = options.language || 'hi-IN';

    const prompt = `Listen to this medical audio recording of a patient speaking in ${lang.startsWith('hi') ? 'Hindi' : 'English'}. Transcribe what the patient says word for word. Output ONLY the clean transcribed text, no extra markdown or explanations.`;

    let lastError = null;

    for (const modelName of SPEECH_MODEL_CANDIDATES) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
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
          provider: 'gemini',
          modelUsed: modelName
        };
      } catch (err) {
        lastError = err;
        const isQuota = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Resource has been exhausted');
        if (isQuota) {
          logger.warn(`[Gemini Speech] Model '${modelName}' hit free-tier rate limit (429). Cascading to next candidate...`);
          continue;
        }
        logger.warn(`[Gemini Speech] Transcription error with model '${modelName}' (${err.message}). Trying next candidate...`);
      }
    }

    logger.error(`[Gemini Speech] All model candidates exhausted: ${lastError?.message}`);
    throw lastError || new Error('All Gemini Speech model candidates exhausted.');
  }

  async checkHealth() {
    return {
      available: !!this.genAI,
      provider: 'gemini'
    };
  }
}

module.exports = GeminiSpeechProvider;
