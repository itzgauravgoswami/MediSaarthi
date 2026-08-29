// Document Timeline Sync Service
const timelineService = require('../timeline/timeline.service');
const logger = require('../../utils/logger');

class DocumentTimelineService {
  async syncDocumentToTimeline(document) {
    if (!document || !document.patientId) return;

    try {
      await timelineService.recordEvent({
        patientId: document.patientId,
        type: 'Document',
        title: `Uploaded ${document.type || 'Prescription'}`,
        description: `OCR processed with ${document.extractedData?.medications?.length || 0} medications extracted.`,
        sourceType: 'DOCUMENT_OCR',
        sourceId: document.documentId,
        badge: 'OCR Verified'
      });
    } catch (e) {
      logger.warn(`[Timeline Sync] Document timeline synchronization warning: ${e.message}`);
    }
  }
}

module.exports = new DocumentTimelineService();
