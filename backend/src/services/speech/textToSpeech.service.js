// Text to Speech Service
const speechProvider = require('./speechProvider.adapter');

class TextToSpeechService {
  async speak(text, language) {
    return await speechProvider.synthesizeSpeech(text, language);
  }
}

module.exports = new TextToSpeechService();
