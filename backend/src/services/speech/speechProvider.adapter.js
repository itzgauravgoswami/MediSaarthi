// Speech Provider Adapter Facade (Gemini / Whisper / Mock)
const GeminiSpeechProvider = require('./geminiSpeech.provider');
const MockSpeechProvider = require('./mockSpeech.provider');
const WhisperSpeechProvider = require('./whisperSpeech.provider');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class SpeechProviderAdapter {
  constructor() {
    this.geminiProvider = new GeminiSpeechProvider();
    this.whisperProvider = new WhisperSpeechProvider();
    this.mockProvider = new MockSpeechProvider();
    this.activeProviderName = config.speech?.provider || 'gemini';
  }

  getProvider() {
    if (this.activeProviderName === 'gemini') {
      return this.geminiProvider;
    }
    if (this.activeProviderName === 'whisper') {
      return this.whisperProvider;
    }
    return this.mockProvider;
  }

  async transcribeAudio(audioBufferOrPath, language = 'hi-IN') {
    const provider = this.getProvider();
    try {
      if (typeof provider.transcribe === 'function') {
        return await provider.transcribe(audioBufferOrPath, { language });
      }
      return await provider.transcribeAudio(audioBufferOrPath, language);
    } catch (err) {
      if (provider !== this.mockProvider) {
        logger.warn(`[SpeechProviderAdapter] Primary provider error (${err.message}). Fallback invoked.`);
        return await this.mockProvider.transcribeAudio(audioBufferOrPath, language);
      }
      throw err;
    }
  }

  async synthesizeSpeech(text, language = 'hi-IN') {
    return { audio: null, message: 'Speech synthesized client-side' };
  }

  async getHealthStatus() {
    const provider = this.getProvider();
    const health = await provider.checkHealth();
    return {
      activeProvider: this.activeProviderName,
      health
    };
  }
}

module.exports = new SpeechProviderAdapter();
