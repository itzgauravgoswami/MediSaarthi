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
          // Check if file name hints at non-medical document
          const lowerName = fileName.toLowerCase();
          const isNonMedicalHint = /marksheet|mark\s*sheet|roll\s*no|grade|semester|university|college|school|cbse|icse|invoice|bill|receipt|salary|tax|gstin|resume|cv|biodata|aadhaar|pan|voter|license|passport|ticket|boarding/i.test(lowerName);
          const isMedicalHint = /prescription|rx|medical|hospital|clinic|doctor|lab|blood|cbc|ecg|xray|scan|discharge|pathology|urine|radiology|test_report|health/i.test(lowerName);

          const stats = fs.statSync(filePath);
          const sizeKb = Math.round(stats.size / 1024);

          if (isNonMedicalHint && !isMedicalHint) {
            rawText = `[OCR Text Scanned from ${fileName}]\nDocument Title: ${cleanName}\nCategory: General Administrative / Academic Record\nFile Name: ${fileName}\nFile Size: ${sizeKb} KB\nDescription: Non-medical file record containing general documentation data.\nScan Date: ${new Date().toLocaleDateString()}`;
          } else if (isMedicalHint) {
            rawText = `[OCR Text Scanned from ${fileName}]\nClinical Record: ${cleanName}\nDoctor: Attending Physician\nDiagnosis: Clinical Review Assessment\nRx: Tab Metformin 500mg BD x 30 days\nCBC: Hb 13.2 g/dL, WBC 7800 /uL\nScan Date: ${new Date().toLocaleDateString()}`;
          } else {
            rawText = `[OCR Text Scanned from ${fileName}]\nDocument Title: ${cleanName}\nFile Name: ${fileName}\nFile Size: ${sizeKb} KB\nMIME Type: ${mimeType || 'image/jpeg'}\nScan Timestamp: ${new Date().toLocaleString()}`;
          }
        }
      } else {
        rawText = `[OCR Text Scanned from ${fileName}]`;
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
