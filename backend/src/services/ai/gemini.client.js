// Google Gemini AI Client with Multi-Tier Model Cascade & Latency Protection
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');
const logger = require('../../utils/logger');

let genAI = null;

if (config.ai.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
    logger.info(`[Gemini AI] Initialized client with primary model: ${config.ai.geminiModel}`);
  } catch (err) {
    logger.warn(`[Gemini AI] Initialization note: ${err.message}.`);
  }
}

// Model fallback cascade pool with active Gemini models
const MODEL_CANDIDATES = [
  config.ai.geminiModel || 'gemini-3.6-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash'
];

/**
 * Execute Gemini prompt with automatic model cascade on 429 quota errors
 */
async function generateStructuredJson(promptText, mockFallbackFn) {
  if (genAI && !config.demoMode) {
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const liveCall = model.generateContent({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        });

        // 6s latency guard for comprehensive medical structuring
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Gemini API timeout (${modelName})`)), 6000);
        });

        const result = await Promise.race([liveCall, timeoutPromise]);
        const responseText = result.response.text();
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (error) {
        const isQuota = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('Resource has been exhausted');
        if (isQuota) {
          logger.warn(`[Gemini AI] Model ${modelName} hit free-tier quota (429). Cascading to next available model...`);
          continue; // Try next model in candidate list
        }
        logger.warn(`[Gemini AI] Live API note on ${modelName} (${error.message}). Trying next candidate...`);
      }
    }
  }

  if (mockFallbackFn) {
    return mockFallbackFn();
  }

  return {};
}

module.exports = {
  generateStructuredJson,
  isLiveAvailable: !!genAI
};
