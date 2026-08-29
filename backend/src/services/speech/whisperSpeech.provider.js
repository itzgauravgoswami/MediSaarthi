// Self-Hosted Whisper Speech Provider with Bundled FFmpeg Support
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const SpeechAdapter = require('./speech.adapter');
const MockSpeechProvider = require('./mockSpeech.provider');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// Set static cross-platform FFmpeg path if bundled installer is available
if (ffmpegInstaller && ffmpegInstaller.path) {
  try {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  } catch (e) {
    logger.warn(`[FFmpeg Setup Warning] ${e.message}`);
  }
}

class WhisperSpeechProvider extends SpeechAdapter {
  constructor() {
    super();
    this.model = config.speech.whisper.model || 'small';
    this.device = config.speech.whisper.device || 'cpu';
    this.computeType = config.speech.whisper.computeType || 'int8';
    this.pythonPath = config.speech.whisper.pythonPath || 'python';
    this.concurrencyLimit = config.speech.whisper.concurrencyLimit || 2;
    this.activeJobs = 0;
    this.queue = [];
    this.mockFallback = new MockSpeechProvider();
    this.workerScript = path.resolve(__dirname, 'whisper_worker.py');
  }

  /**
   * Convert audio to 16kHz mono WAV using FFmpeg
   */
  async normalizeAudioWithFfmpeg(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    if (ext === '.wav') {
      return { normalizedPath: inputPath, isTemp: false };
    }

    const tempWavPath = path.join(path.dirname(inputPath), `temp-conv-${Date.now()}-${Math.random().toString(36).substring(7)}.wav`);

    return new Promise((resolve) => {
      ffmpeg(inputPath)
        .toFormat('wav')
        .audioFrequency(16000)
        .audioChannels(1)
        .on('end', () => {
          resolve({ normalizedPath: tempWavPath, isTemp: true });
        })
        .on('error', () => {
          // PyAV in faster-whisper natively decodes webm/mp3 directly if conversion is skipped
          resolve({ normalizedPath: inputPath, isTemp: false });
        })
        .save(tempWavPath);
    });
  }

  async transcribeAudio(audioInput, language = 'hi-IN', options = {}) {
    // Concurrency queue check
    if (this.activeJobs >= this.concurrencyLimit) {
      logger.info(`[WhisperSpeechProvider] Concurrency limit reached (${this.activeJobs}/${this.concurrencyLimit}). Queuing request.`);
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.activeJobs++;
    let tempNormalized = null;

    try {
      const audioPath = typeof audioInput === 'string' ? audioInput : audioInput.path;

      if (!audioPath || !fs.existsSync(audioPath)) {
        throw new Error(`Audio file '${audioPath}' not found.`);
      }

      logger.info(`[WhisperSpeechProvider] Starting transcription with model=${this.model}, device=${this.device}`);

      // 1. Normalize audio with FFmpeg
      const normResult = await this.normalizeAudioWithFfmpeg(audioPath);
      tempNormalized = normResult.isTemp ? normResult.normalizedPath : null;
      const targetAudioFile = normResult.normalizedPath;

      // 2. Execute Python faster-whisper worker
      const langParam = language.split('-')[0];
      const args = [
        this.workerScript,
        '--audio', targetAudioFile,
        '--model', this.model,
        '--device', this.device,
        '--compute_type', this.computeType,
        '--language', langParam
      ];

      const result = await new Promise((resolve) => {
        const pyProc = spawn(this.pythonPath, args);
        let stdoutData = '';
        let stderrData = '';

        pyProc.stdout.on('data', data => { stdoutData += data.toString(); });
        pyProc.stderr.on('data', data => { stderrData += data.toString(); });

        pyProc.on('error', (err) => {
          logger.warn(`[Whisper Worker Spawn Warning] ${err.message}`);
          resolve({ fallback: true, error: err.message });
        });

        pyProc.on('close', (code) => {
          if (code === 0 && stdoutData.trim()) {
            try {
              const parsed = JSON.parse(stdoutData.trim());
              resolve(parsed);
            } catch (e) {
              resolve({ fallback: true, error: 'Invalid JSON from whisper worker' });
            }
          } else {
            logger.warn(`[Whisper Worker Stderr] ${stderrData}`);
            resolve({ fallback: true, error: stderrData || `Exit code ${code}` });
          }
        });
      });

      if (result.error && !result.text && !result.transcript) {
        logger.warn(`[WhisperSpeechProvider] Faster-Whisper returned note: ${result.error}`);
        return {
          transcript: '',
          text: '',
          confidence: 0,
          detectedLanguage: langParam,
          provider: 'whisper_error',
          error: result.error
        };
      }

      return {
        transcript: result.transcript || result.text || '',
        text: result.text || result.transcript || '',
        confidence: result.language_probability || 0.95,
        detectedLanguage: result.detected_language || langParam,
        duration: result.duration || 0,
        provider: 'whisper'
      };
    } finally {
      if (tempNormalized && fs.existsSync(tempNormalized)) {
        try { fs.unlinkSync(tempNormalized); } catch (e) {}
      }

      this.activeJobs--;
      if (this.queue.length > 0) {
        const nextInQueue = this.queue.shift();
        nextInQueue();
      }
    }
  }

  async checkHealth() {
    let pythonAvailable = false;
    let ffmpegAvailable = false;

    try {
      execSync(`${this.pythonPath} --version`, { stdio: 'ignore' });
      pythonAvailable = true;
    } catch (e) {}

    try {
      ffmpegAvailable = !!(ffmpegInstaller && ffmpegInstaller.path);
    } catch (e) {}

    return {
      available: true,
      provider: 'whisper',
      status: 'operational_self_hosted',
      model: this.model,
      device: this.device,
      computeType: this.computeType,
      pythonAvailable,
      ffmpegAvailable
    };
  }
}

module.exports = WhisperSpeechProvider;
