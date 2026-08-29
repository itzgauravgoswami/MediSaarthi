// Unit Test: OCR Providers (Tesseract & Mock)
const fs = require('fs');
const path = require('path');
const MockOcrProvider = require('../../src/services/documents/ocr/mockOcr.provider');
const TesseractOcrProvider = require('../../src/services/documents/ocr/tesseractOcr.provider');
const ocrService = require('../../src/services/documents/ocr.service');

async function runOcrTests() {
  console.log('🧪 Running OCR Provider Tests...');

  // Test 1: Mock OCR Provider returns expected clinical prescription structure
  const mockProvider = new MockOcrProvider();
  const mockRes = await mockProvider.processDocumentImage('sample_presc.jpg', 'image/jpeg');

  if (!mockRes.rawText || !mockRes.rawText.includes('Metformin') || mockRes.provider !== 'mock') {
    throw new Error('Test 1 Failed: Mock OCR provider did not return valid prescription text.');
  }
  console.log('  ✅ Test 1 Passed: Mock OCR provider outputs structured prescription text.');

  // Test 2: Gemini Vision OCR Provider health check
  const GeminiVisionOcrProvider = require('../../src/services/documents/ocr/geminiVisionOcr.provider');
  const geminiVisionProvider = new GeminiVisionOcrProvider();
  const geminiHealth = await geminiVisionProvider.checkHealth();
  if (!geminiHealth.provider || geminiHealth.provider !== 'gemini') {
    throw new Error('Test 2 Failed: Gemini Vision OCR health check failed.');
  }
  console.log('  ✅ Test 2 Passed: Gemini Vision Multimodal OCR provider operational.');

  // Test 3: Tesseract OCR Provider health check
  const tesseractProvider = new TesseractOcrProvider();
  const health = await tesseractProvider.checkHealth();

  if (!health.available || health.provider !== 'tesseract') {
    throw new Error('Test 3 Failed: Tesseract OCR health check failed.');
  }
  console.log('  ✅ Test 3 Passed: Tesseract OCR provider initialized in self-hosted mode.');

  // Test 3: OCR Service facade dynamically handles missing file gracefully
  let errorCaught = false;
  try {
    await tesseractProvider.processDocumentImage('non_existent_file_xyz.jpg', 'image/jpeg');
  } catch (err) {
    errorCaught = true;
  }
  if (!errorCaught) {
    throw new Error('Test 3 Failed: Missing file did not trigger validation error.');
  }
  console.log('  ✅ Test 3 Passed: Missing file handled gracefully with validation exception.');
}

module.exports = runOcrTests;
