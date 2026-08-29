// Speech Provider Base Interface
class SpeechAdapter {
  /**
   * Transcribe an audio file/buffer to text
   * @param {string|Buffer} audioInput - Audio file path or buffer
   * @param {string} language - Expected or target language (e.g. 'hi-IN', 'en-IN')
   * @param {Object} options - Additional options
   * @returns {Promise<{ transcript: string, confidence: number, detectedLanguage: string, provider: string }>}
   */
  async transcribeAudio(audioInput, language = 'hi-IN', options = {}) {
    throw new Error('transcribeAudio method must be implemented by concrete SpeechProvider');
  }

  /**
   * Synthesize text to speech
   * @param {string} text
   * @param {string} language
   * @returns {Promise<{ audioUrl: string, durationSeconds: number, provider: string }>}
   */
  async synthesizeSpeech(text, language = 'hi-IN') {
    return {
      audioUrl: `/api/v1/speech/stream?lang=${language}`,
      durationSeconds: 3.0,
      provider: 'default'
    };
  }

  /**
   * Health/Availability check
   * @returns {Promise<{ available: boolean, provider: string, status: string, error?: string }>}
   */
  async checkHealth() {
    return { available: true, provider: 'base', status: 'operational' };
  }
}

module.exports = SpeechAdapter;
