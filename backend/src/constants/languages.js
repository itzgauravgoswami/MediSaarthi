// Supported Languages Configuration

const LANGUAGES = {
  HI_IN: {
    code: 'hi-IN',
    iso: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'hi'
  },
  EN_IN: {
    code: 'en-IN',
    iso: 'en',
    name: 'English (India)',
    nativeName: 'English',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'en'
  },
  BN_IN: {
    code: 'bn-IN',
    iso: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'bn'
  },
  TE_IN: {
    code: 'te-IN',
    iso: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'te'
  },
  TA_IN: {
    code: 'ta-IN',
    iso: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'ta'
  },
  MR_IN: {
    code: 'mr-IN',
    iso: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    enabled: true,
    speechRecognition: true,
    textToSpeech: true,
    promptLocale: 'mr'
  }
};

const DEFAULT_LANGUAGE = 'hi-IN';

module.exports = {
  LANGUAGES,
  DEFAULT_LANGUAGE
};
