// Mock Speech Provider (Strictly for unit testing without fake user injection)
const SpeechAdapter = require('./speech.adapter');
const logger = require('../../utils/logger');

class MockSpeechProvider extends SpeechAdapter {
  async transcribeAudio(audioInput, language = 'hi-IN') {
    logger.info(`[MockSpeechProvider] Invoked for language=${language}`);
    return {
      transcript: '',
      text: '',
      confidence: 0.0,
      detectedLanguage: language,
      provider: 'mock'
    };
  }

  async synthesizeSpeech(text, language = 'hi-IN') {
    return {
      audioUrl: `/api/v1/speech/stream?lang=${language}`,
      durationSeconds: 3.0,
      provider: 'mock'
    };
  }

  async checkHealth() {
    return {
      available: true,
      provider: 'mock',
      status: 'operational_mock'
    };
  }
}

module.exports = MockSpeechProvider;
