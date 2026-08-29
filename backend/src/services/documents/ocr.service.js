// Medical Document OCR Service Facade
const MockOcrProvider = require('./ocr/mockOcr.provider');
const TesseractOcrProvider = require('./ocr/tesseractOcr.provider');
const GeminiVisionOcrProvider = require('./ocr/geminiVisionOcr.provider');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class OcrService {
  constructor() {
    this.mockProvider = new MockOcrProvider();
    this.tesseractProvider = new TesseractOcrProvider();
    this.geminiVisionProvider = new GeminiVisionOcrProvider();
    this.activeProviderName = config.ocr.provider; // 'gemini' | 'tesseract' | 'mock'
  }

  getProvider() {
    if (this.activeProviderName === 'gemini' || (config.ai.geminiApiKey && this.activeProviderName !== 'mock' && this.activeProviderName !== 'tesseract')) {
      return this.geminiVisionProvider;
    }
    if (this.activeProviderName === 'tesseract') {
      return this.tesseractProvider;
    }
    return this.mockProvider;
  }

  async processDocumentImage(filePath, mimeType) {
    const provider = this.getProvider();
    try {
      return await provider.processDocumentImage(filePath, mimeType);
    } catch (err) {
      logger.warn(`[OcrService] Primary OCR provider failed (${err.message}). Attempting fallback OCR.`);
      
      // Secondary fallback to Tesseract if primary was Gemini
      if (provider === this.geminiVisionProvider) {
        try {
          return await this.tesseractProvider.processDocumentImage(filePath, mimeType);
        } catch (tessErr) {
          logger.warn(`[OcrService] Tesseract fallback failed (${tessErr.message}). Invoking rule-based OCR.`);
        }
      }

      // Tertiary fallback
      if (provider !== this.mockProvider) {
        return await this.mockProvider.processDocumentImage(filePath, mimeType);
      }
      throw err;
    }
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

module.exports = new OcrService();
