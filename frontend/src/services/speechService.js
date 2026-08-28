// Modular Speech Service for MediSaarthi AI Voice Assistant

export class SpeechManager {
  constructor(lang = 'en-IN') {
    this.lang = lang;
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.initRecognition();
  }

  setLanguage(langCode) {
    this.lang = langCode === 'hi' ? 'hi-IN' : 'en-IN';
    if (this.recognition) {
      this.recognition.lang = this.lang;
    }
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.lang;
      }
    }
  }

  startListening(onTranscript, onStateChange) {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onStateChange?.('error');
      onTranscript?.("Speech recognition is not supported in this browser. You can type or tap options.");
      return;
    }

    try {
      this.isListening = true;
      onStateChange?.('listening');

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onTranscript?.(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        onStateChange?.('idle');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStateChange?.('processing');
      };

      this.recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition", e);
      onStateChange?.('idle');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, onEnd) {
    if (!this.synthesis) return;

    this.synthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      onEnd?.();
    };

    this.synthesis.speak(utterance);
  }
}
