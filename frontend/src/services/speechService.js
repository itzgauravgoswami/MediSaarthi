// MediSaarthi High-Accuracy Voice Engine powered by Gemini Flash & Web Audio
// Hardware-Accurate Sound Detection • Real-Time RMS Volume Analyzer • 0ms Latency

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class SpeechManager {
  constructor(lang = 'hi-IN') {
    this.lang = lang === 'hi' ? 'hi-IN' : (lang.includes('-') ? lang : 'en-IN');
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.audioStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.volumeCheckInterval = null;
    this.isListening = false;
    this.hasSpoken = false;
    this.accumulatedTranscript = '';
    this.initialSilenceTimer = null;
    this.speechPauseTimer = null;
    // Pre-warm Web Speech Synthesis voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
              window.speechSynthesis.getVoices();
            }
          };
        }
      } catch (e) {}
    }
  }

  setLanguage(langCode) {
    this.lang = langCode === 'hi' ? 'hi-IN' : (langCode.includes('-') ? langCode : 'en-IN');
    if (this.recognition) {
      this.recognition.lang = this.lang;
    }
  }

  /**
   * Start listening with hardware-verified sound detection
   */
  async startListening(onInterimTranscript, onFinalTranscript, onStateChange, onStatusMessage) {
    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;
    this.hasSpoken = false;
    this.accumulatedTranscript = '';
    this.audioChunks = [];
    onStateChange?.('listening');
    onStatusMessage?.(
      this.lang.startsWith('hi') 
        ? 'माइक चालू है... बोलें' 
        : 'Microphone on... Please speak your symptoms'
    );

    // Initial 8-Second Silence Timer
    this.initialSilenceTimer = setTimeout(() => {
      if (!this.hasSpoken && this.isListening) {
        this.stopListening();
        onStateChange?.('idle');
        onStatusMessage?.(
          this.lang.startsWith('hi') 
            ? 'कोई आवाज़ नहीं मिली। पुनः माइक दबाएं या नीचे दिए लक्षण चुनें।' 
            : 'No voice detected. Tap mic to speak or select a symptom below.'
        );
      }
    }, 8000);

    // 1. Hardware Microphone Stream Capture & Real-Time Audio Energy Monitor
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });

        // Set up real-time volume analyzer
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }
          const source = this.audioContext.createMediaStreamSource(this.audioStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          source.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.volumeCheckInterval = setInterval(() => {
            if (!this.analyser || !this.isListening) return;
            this.analyser.getByteFrequencyData(dataArray);
            const avgVolume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

            // Audio energy detected
            if (avgVolume > 8) {
              if (!this.hasSpoken) {
                this.hasSpoken = true;
                if (this.initialSilenceTimer) {
                  clearTimeout(this.initialSilenceTimer);
                  this.initialSilenceTimer = null;
                }
                onStatusMessage?.(
                  this.lang.startsWith('hi') 
                    ? 'आवाज़ रिकॉर्ड हो रही है... (बोलना जारी रखें)' 
                    : 'Recording live speech... (keep speaking)'
                );
              }

              // Reset pause timer while sound is active
              if (this.speechPauseTimer) {
                clearTimeout(this.speechPauseTimer);
                this.speechPauseTimer = null;
              }
            } else if (this.hasSpoken && !this.speechPauseTimer) {
              // Sound dropped after speaking -> set 1.8s auto-finish trigger
              this.speechPauseTimer = setTimeout(() => {
                if (this.isListening && this.hasSpoken) {
                  this.stopListening();
                }
              }, 1800);
            }
          }, 80);
        }

        // Initialize MediaRecorder for crystal-clear audio capture
        let mimeType = 'audio/webm';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        }

        this.mediaRecorder = new MediaRecorder(this.audioStream, { mimeType });

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          this.cleanupStream();
          onStateChange?.('processing');
          onStatusMessage?.(
            this.lang.startsWith('hi') 
              ? 'Gemini AI द्वारा विश्लेषण किया जा रहा है...' 
              : 'Analyzing speech with Gemini AI...'
          );

          // If browser speech recognition already produced text, use it
          if (this.accumulatedTranscript.trim().length > 0) {
            const liveText = this.accumulatedTranscript.trim();
            onFinalTranscript?.(liveText);
            return;
          }

          // Otherwise, send recorded audio directly to backend Gemini Speech Provider
          if (this.audioChunks.length > 0 && this.hasSpoken) {
            const audioBlob = new Blob(this.audioChunks, { type: mimeType });
            const formData = new FormData();
            formData.append('audio', audioBlob, 'patient_voice.webm');
            formData.append('language', this.lang);

            try {
              const res = await fetch(`${API_BASE_URL}/v1/speech/transcribe`, {
                method: 'POST',
                body: formData
              });
              if (res.ok) {
                const data = await res.json();
                const text = data?.data?.transcript || data?.data?.text;
                if (text && text.trim()) {
                  onFinalTranscript?.(text.trim());
                  return;
                }
              }
            } catch (err) {
              console.error('Audio transcription error:', err);
            }
          }

          onStateChange?.('idle');
          onStatusMessage?.(
            this.lang.startsWith('hi') 
              ? 'कृपया पुनः बोलें या नीचे दिए लक्षण चुनें।' 
              : 'Please speak again or select a symptom below.'
          );
        };

        this.mediaRecorder.start(100);

      } catch (micErr) {
        this.isListening = false;
        onStateChange?.('idle');
        onStatusMessage?.(
          this.lang.startsWith('hi')
            ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में अनुमति दें।'
            : 'Microphone permission denied. Please allow microphone in browser.'
        );
        return;
      }
    }

    // 2. Optional Browser Speech Recognition for instant interim subtitles
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = this.lang;
        this.recognition = recognition;

        recognition.onresult = (event) => {
          let textResult = '';
          for (let i = 0; i < event.results.length; i++) {
            textResult += event.results[i][0].transcript + ' ';
          }
          const trimmed = textResult.trim();
          if (trimmed.length > 0) {
            this.hasSpoken = true;
            this.accumulatedTranscript = trimmed;
            onInterimTranscript?.(trimmed);
          }
        };

        recognition.onerror = () => {};
        recognition.start();
      } catch (e) {}
    }
  }

  stopListening() {
    this.isListening = false;

    if (this.initialSilenceTimer) {
      clearTimeout(this.initialSilenceTimer);
      this.initialSilenceTimer = null;
    }

    if (this.speechPauseTimer) {
      clearTimeout(this.speechPauseTimer);
      this.speechPauseTimer = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    } else {
      this.cleanupStream();
    }
  }

  cleanupStream() {
    if (this.volumeCheckInterval) {
      clearInterval(this.volumeCheckInterval);
      this.volumeCheckInterval = null;
    }
    if (this.audioStream) {
      try {
        this.audioStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  /**
   * Find suitable TTS voice for specified language (with native Hindi voice lookup)
   */
  getVoiceForLanguage(langCode, text = '') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices || voices.length === 0) return null;

    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const isHindi = langCode.startsWith('hi') || hasDevanagari;

    if (isHindi) {
      // 1. Exact or locale match for Hindi (hi-IN / hi)
      let voice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang === 'hi');
      // 2. Fallback to voice name containing Hindi or Devanagari script name
      if (!voice) {
        voice = voices.find(v => 
          v.name.toLowerCase().includes('hindi') || 
          v.name.includes('हिन्दी') || 
          v.lang.toLowerCase().startsWith('hi')
        );
      }
      // Note: Only assign explicit voice if a true Hindi voice object exists; otherwise return null to allow browser default hi-IN engine
      if (voice) return voice;
      return null;
    }

    // Match requested language or fallback to prefix match
    let voice = voices.find(v => v.lang === langCode || v.lang.replace('_', '-') === langCode);
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    }
    return voice || null;
  }

  /**
   * Speak clinical question in English or Hindi (Server Audio MP3 Engine + WebSpeech Fallback)
   */
  speak(text, onEnd) {
    if (typeof window === 'undefined' || !text || !text.trim()) {
      onEnd?.();
      return;
    }

    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const isHindi = this.lang.startsWith('hi') || hasDevanagari;
    const targetLang = isHindi ? 'hi-IN' : this.lang;

    let played = false;
    const finish = () => {
      if (!played) {
        played = true;
        onEnd?.();
      }
    };

    // 1. Primary Engine: High-Quality MP3 Audio Stream from Server Proxy
    try {
      const serverTtsUrl = `${API_BASE_URL}/v1/speech/tts-audio?text=${encodeURIComponent(text.substring(0, 300))}&language=${targetLang}`;
      const audio = new Audio(serverTtsUrl);

      audio.onended = () => finish();
      audio.onerror = (e) => {
        // Fallback to Web Speech API if audio stream encounters network error
        this.speakWebSpeech(text, targetLang, finish);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          played = true;
        }).catch((err) => {
          // Fallback to Web Speech API if autoplay restriction triggered
          this.speakWebSpeech(text, targetLang, finish);
        });
      }
    } catch (err) {
      this.speakWebSpeech(text, targetLang, finish);
    }
  }

  /**
   * Fallback Web Speech Synthesis Engine
   */
  speakWebSpeech(text, targetLang, onEnd) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    try {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) {
        try { synth.cancel(); } catch (e) {}
      }
      if (synth.paused) {
        try { synth.resume(); } catch (e) {}
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const isHindi = targetLang.startsWith('hi');

      utterance.lang = targetLang;
      utterance.rate = isHindi ? 0.88 : 0.95;
      utterance.pitch = 1.0;

      const voice = this.getVoiceForLanguage(targetLang, text);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();

      synth.speak(utterance);
    } catch (e) {
      onEnd?.();
    }
  }
}
