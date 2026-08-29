const fs = require('fs');
const path = require('path');
const OcrAdapter = require('./ocr.adapter');
const logger = require('../../../utils/logger');

class MockOcrProvider extends OcrAdapter {
  async processDocumentImage(filePath, mimeType) {
    logger.info(`[MockOcrProvider] Extracting clinical text for: ${filePath}`);

    let rawText = '';
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const cleanName = path.basename(filePath, ext).replace(/[-_]/g, ' ');

    try {
      if (fs.existsSync(filePath)) {
        if (['.txt', '.csv', '.json', '.md', '.log', '.html'].includes(ext)) {
          rawText = fs.readFileSync(filePath, 'utf-8').trim();
        } else {
          // Read binary or image buffer metadata
          const stats = fs.statSync(filePath);
          const sizeKb = Math.round(stats.size / 1024);
          rawText = `[OCR Text Scanned from ${fileName}]\nDocument Title: ${cleanName}\nFile Name: ${fileName}\nFile Size: ${sizeKb} KB\nMIME Type: ${mimeType || 'image/jpeg'}\nScan Timestamp: ${new Date().toLocaleString()}\nStatus: Verified Clinical Record.`;
        }
      } else {
        // Fallback for mock test runner sample file
        rawText = `[OCR Text Scanned from ${fileName}]\nDiagnosis: Essential Hypertension\nRx: Tab Metformin 500mg BD x 30 days\nStatus: Verified Clinical Record.`;
      }
    } catch (e) {
      rawText = `[OCR Text Scanned from ${fileName}]`;
    }

    return {
      rawText: rawText || `[OCR Scanned Text from ${fileName}]`,
      confidence: 0.94,
      provider: 'mock',
      extractedPages: 1
    };
  }

  async checkHealth() {
    return {
      available: true,
      provider: 'mock',
      status: 'operational_mock'
    };
  }
}

module.exports = MockOcrProvider;
