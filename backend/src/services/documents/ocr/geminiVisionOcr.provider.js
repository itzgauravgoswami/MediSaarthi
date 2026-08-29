// Gemini Vision Multimodal OCR Provider with Automatic Model Cascade
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../../config/env');
const logger = require('../../../utils/logger');
const OcrAdapter = require('./ocr.adapter');

const VISION_MODEL_CANDIDATES = [
  config.ai.geminiModel || 'gemini-3.5-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash'
];

class GeminiVisionOcrProvider extends OcrAdapter {
  constructor() {
    super();
    this.apiKey = config.ai.geminiApiKey;
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (err) {
        logger.warn(`[GeminiVisionOcrProvider] Initialization error: ${err.message}`);
        this.genAI = null;
      }
    }
  }

  async processDocumentImage(filePath, mimeType) {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`File '${filePath}' does not exist for Gemini Vision OCR.`);
    }

    if (!this.genAI) {
      throw new Error('Gemini API Key is not configured for Gemini Vision OCR.');
    }

    const fileName = path.basename(filePath);
    logger.info(`[GeminiVisionOcrProvider] Analyzing document image via Gemini Vision Multimodal API (${fileName})`);

    const ext = path.extname(filePath).toLowerCase();

    // Direct plain text handler
    if (['.txt', '.csv', '.json', '.md', '.log', '.html'].includes(ext)) {
      const text = fs.readFileSync(filePath, 'utf-8').trim();
      return {
        rawText: text,
        confidence: 1.0,
        provider: 'gemini',
        extractedPages: 1
      };
    }

    let determinedMime = mimeType || 'image/jpeg';
    if (ext === '.png') determinedMime = 'image/png';
    else if (ext === '.webp') determinedMime = 'image/webp';
    else if (ext === '.jpg' || ext === '.jpeg') determinedMime = 'image/jpeg';
    else if (ext === '.pdf') determinedMime = 'application/pdf';

    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const prompt = `You are a specialized clinical OCR and medical document intelligence engine.
Please transcribe ALL printed and handwritten text from this medical prescription, diagnostic lab report, or clinical document verbatim with 100% accuracy.
Include hospital/clinic headers, doctor notes, patient demographic details, diagnoses, medication names with dosages/frequencies/durations, and lab investigation test values.
Output only the transcribed clinical text.`;

    let lastError = null;

    for (const modelName of VISION_MODEL_CANDIDATES) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: determinedMime,
              data: base64Data
            }
          },
          { text: prompt }
        ]);

        const rawText = result.response.text().trim();
        logger.info(`[GeminiVisionOcrProvider] Successfully transcribed ${rawText.length} characters from ${fileName} using model '${modelName}'.`);

        return {
          rawText: rawText || `[Document Scanned from ${fileName}]`,
          confidence: 0.98,
          provider: 'gemini',
          modelUsed: modelName,
          extractedPages: 1
        };
      } catch (err) {
        lastError = err;
        const isQuota = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Resource has been exhausted');
        if (isQuota) {
          logger.warn(`[GeminiVisionOcrProvider] Model '${modelName}' hit free-tier rate limit (429). Cascading to next model...`);
          continue;
        }
        logger.warn(`[GeminiVisionOcrProvider] Error on model '${modelName}' (${err.message}). Trying fallback model...`);
      }
    }

    throw lastError || new Error('All Gemini Vision model candidates exhausted.');
  }

  async checkHealth() {
    return {
      available: !!this.genAI,
      provider: 'gemini',
      status: this.genAI ? 'operational_live' : 'missing_api_key'
    };
  }
}

module.exports = GeminiVisionOcrProvider;
