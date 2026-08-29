// Health & System Diagnostic Route
const express = require('express');
const router = express.Router();
const { getDatabaseStatus } = require('../config/database');
const { isLiveAvailable } = require('../services/ai/gemini.client');
const ocrService = require('../services/documents/ocr.service');
const speechAdapter = require('../services/speech/speechProvider.adapter');
const storageService = require('../services/storage/storage.service');
const abdmService = require('../services/abdm/abdm.service');
const config = require('../config/env');

router.get('/', async (req, res) => {
  const dbStatus = getDatabaseStatus();
  const storageHealth = await storageService.getHealthStatus();
  const ocrHealth = await ocrService.getHealthStatus();
  const speechHealth = await speechAdapter.getHealthStatus();
  const abdmHealth = await abdmService.getHealthStatus();

  res.status(200).json({
    status: 'ok',
    service: 'MediSaarthi AI Clinical Intake & Triage Engine',
    version: '2026.1.0',
    timestamp: new Date().toISOString(),
    storage: config.storage.provider,
    ocr: config.ocr.provider,
    speech: config.speech.provider,
    fhir: 'configured',
    abdm: config.abdm.mode,
    providers: {
      storage: {
        active: storageHealth.activeProvider,
        usingFallback: storageHealth.usingFallback,
        status: storageHealth.health?.status
      },
      ocr: {
        active: ocrHealth.activeProvider,
        status: ocrHealth.health?.status
      },
      speech: {
        active: speechHealth.activeProvider,
        model: speechHealth.health?.model || 'small',
        status: speechHealth.health?.status
      },
      ai: {
        geminiEngine: isLiveAvailable ? 'Live Gemini 1.5' : 'Deterministic Clinical AI Sandbox'
      },
      database: {
        status: dbStatus.connected ? 'connected' : 'offline',
        mode: dbStatus.mode
      },
      abdm: {
        mode: abdmHealth.mode,
        enabled: abdmHealth.enabled,
        credentialsConfigured: abdmHealth.credentialsConfigured
      },
      fhir: {
        baseUrl: config.fhir.baseUrl,
        standard: 'HL7 FHIR R4'
      }
    }
  });
});

module.exports = router;
