// Environment Configuration Loader
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  demoMode: process.env.DEMO_MODE === 'true',

  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/medisaarthi'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'medisaarthi_default_jwt_secret_dev_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'medisaarthi_default_refresh_secret_dev_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:3000'
  },

  storage: {
    provider: (process.env.STORAGE_PROVIDER || 'local').toLowerCase(), // 'cloudinary' | 'local'
    dir: path.resolve(__dirname, '../../', process.env.STORAGE_DIR || 'uploads'),
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
      folder: process.env.CLOUDINARY_FOLDER || 'medisaarthi_clinical_docs'
    }
  },

  ocr: {
    provider: (process.env.OCR_PROVIDER || 'gemini').toLowerCase(), // 'gemini' | 'tesseract' | 'mock'
    language: process.env.OCR_LANGUAGE || 'eng+hin',
    timeoutMs: parseInt(process.env.OCR_TIMEOUT_MS, 10) || 60000
  },

  speech: {
    provider: (process.env.SPEECH_PROVIDER || 'whisper').toLowerCase(), // 'whisper' | 'mock'
    whisper: {
      model: process.env.WHISPER_MODEL || 'base', // 'tiny' | 'base' | 'small' | 'medium' | 'large-v3'
      device: process.env.WHISPER_DEVICE || 'cpu', // 'cpu' | 'cuda'
      computeType: process.env.WHISPER_COMPUTE_TYPE || 'int8', // 'int8' | 'float16' | 'float32'
      pythonPath: process.env.WHISPER_PYTHON_PATH || 'python',
      concurrencyLimit: parseInt(process.env.WHISPER_CONCURRENCY_LIMIT, 10) || 2
    }
  },

  abdm: {
    enabled: process.env.ABDM_ENABLED !== 'false',
    mode: (process.env.ABDM_MODE || 'sandbox').toLowerCase(), // 'sandbox' | 'mock' | 'production'
    baseUrl: process.env.ABDM_BASE_URL || 'https://dev.abdm.gov.in/gateway/v0.5',
    clientId: process.env.ABDM_CLIENT_ID || '',
    clientSecret: process.env.ABDM_CLIENT_SECRET || ''
  },

  fhir: {
    baseUrl: process.env.FHIR_BASE_URL || (process.env.NODE_ENV === 'production' 
      ? 'https://medisaarthi-api.onrender.com/api/v1/fhir' 
      : 'http://localhost:5000/api/v1/fhir')
  },

  emergency: {
    enabled: process.env.EMERGENCY_ALERT_ENABLED !== 'false',
    confidenceThreshold: parseFloat(process.env.EMERGENCY_CONFIDENCE_THRESHOLD) || 0.80,
    ackTimeoutSeconds: parseInt(process.env.EMERGENCY_ACK_TIMEOUT_SECONDS, 10) || 60,
    realtimeSseEnabled: process.env.REALTIME_SSE_ENABLED !== 'false'
  },

  keepAlive: {
    enabled: process.env.KEEP_ALIVE_ENABLED !== 'false',
    url: process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || process.env.KEEP_ALIVE_URL || '',
    intervalMs: parseInt(process.env.KEEP_ALIVE_INTERVAL_MS, 10) || 12 * 60 * 1000
  }
};

module.exports = config;
