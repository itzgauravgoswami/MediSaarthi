// Speech Recognition Service
const speechProvider = require('./speechProvider.adapter');

class SpeechRecognitionService {
  async transcribe(audioBuffer, language) {
    return await speechProvider.transcribeAudio(audioBuffer, language);
  }
}

module.exports = new SpeechRecognitionService();
