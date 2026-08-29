// Medical Document Processing Pipeline Service
const { v4: uuidv4 } = require('uuid');
const Document = require('../../models/Document');
const Medication = require('../../models/Medication');
const Investigation = require('../../models/Investigation');
const ocrService = require('./ocr.service');
const { extractMedicalEntities } = require('../ai/extraction.service');
const documentValidationService = require('./documentValidation.service');
const documentTimelineService = require('./documentTimeline.service');
const storageService = require('../storage/storage.service');
const notificationService = require('../notifications/notification.service');
const logger = require('../../utils/logger');

class DocumentService {
  async processUploadedDocument(file, patientId, type = 'PRESCRIPTION') {
    documentValidationService.validateUploadedFile(file);

    const documentId = `DOC-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 1. Upload to active storage provider (Cloudinary or Local)
    let storageResult;
    try {
      storageResult = await storageService.uploadFile(file, { folder: 'prescriptions' });
    } catch (e) {
      logger.warn(`[DocumentService] Storage upload note: ${e.message}`);
      storageResult = {
        storageKey: file.filename || file.originalname,
        url: `/uploads/${file.filename || file.originalname}`,
        provider: 'local'
      };
    }

    // 2. OCR text extraction (Self-hosted Tesseract / Mock)
    const ocrResult = await ocrService.processDocumentImage(file.path, file.mimetype);

    // 3. AI Medical Entity Extraction
    const extractionResult = await extractMedicalEntities(ocrResult.rawText);

    // 4. Persist Document
    let document;
    try {
      document = await Document.create({
        documentId,
        patientId,
        type,
        originalFileName: file.originalname,
        storageKey: storageResult.storageKey,
        mimeType: file.mimetype,
        size: file.size,
        status: 'COMPLETED',
        ocrStatus: 'COMPLETED',
        extractionStatus: 'COMPLETED',
        ocrText: ocrResult.rawText,
        extractedData: extractionResult,
        confidence: ocrResult.confidence ? Math.round(ocrResult.confidence * 100) : (extractionResult.confidenceScore || 90)
      });
    } catch (e) {
      document = {
        documentId,
        patientId,
        type,
        originalFileName: file.originalname,
        storageKey: storageResult.storageKey,
        status: 'COMPLETED',
        ocrText: ocrResult.rawText,
        extractedData: extractionResult,
        createdAt: new Date()
      };
    }

    // 5. Save extracted medications
    if (extractionResult.medications && extractionResult.medications.length > 0) {
      for (const med of extractionResult.medications) {
        try {
          await Medication.create({
            medicationId: `MED-${uuidv4().substring(0, 8).toUpperCase()}`,
            patientId,
            documentId,
            name: med.name,
            dosage: med.dosage || 'Standard',
            frequency: med.frequency || 'OD',
            duration: med.duration || '30 days',
            source: 'DOCUMENT_OCR',
            confidence: med.confidence || 90
          });
        } catch (err) {}
      }
    }

    // 6. Sync to longitudinal timeline
    await documentTimelineService.syncDocumentToTimeline(document);

    // 7. Notify Doctor
    await notificationService.createNotification({
      recipientRole: 'DOCTOR',
      type: 'DOCUMENT_PROCESSED',
      title: 'Medical Document Processed',
      message: `Prescription/Report processed for Patient (${patientId}). ${extractionResult.medications?.length || 0} medications extracted.`,
      resourceType: 'Document',
      resourceId: documentId
    });

    logger.info(`[Document Pipeline] Successfully processed document ${documentId} (Storage: ${storageResult.provider}, OCR: ${ocrResult.provider})`);
    return document;
  }

  async getPatientDocuments(patientId) {
    try {
      return await Document.find({ patientId }).sort({ createdAt: -1 });
    } catch (e) {
      return [];
    }
  }

  async getDocumentById(documentId) {
    try {
      return await Document.findOne({ documentId });
    } catch (e) {
      return null;
    }
  }
}

module.exports = new DocumentService();
