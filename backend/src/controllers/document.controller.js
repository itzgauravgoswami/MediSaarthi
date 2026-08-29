// Medical Document Controller
const documentService = require('../services/documents/document.service');
const { sendSuccess, sendCreated } = require('../utils/response');
const { ValidationError, NotFoundError } = require('../utils/errors');

class DocumentController {
  async uploadAndProcess(req, res, next) {
    try {
      if (!req.file) {
        throw new ValidationError('Medical document file required in form-data.');
      }

      const patientId = req.body.patientId || req.user?.patientId || 'P102';
      const documentType = req.body.type || 'PRESCRIPTION';

      const document = await documentService.processUploadedDocument(req.file, patientId, documentType);

      return sendCreated(res, document, 'Document uploaded, scanned with OCR, and entities extracted successfully');
    } catch (err) {
      next(err);
    }
  }

  async getPatientDocuments(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const documents = await documentService.getPatientDocuments(patientId);
      return sendSuccess(res, documents);
    } catch (err) {
      next(err);
    }
  }

  async getDocumentById(req, res, next) {
    try {
      const document = await documentService.getDocumentById(req.params.id);
      if (!document) {
        throw new NotFoundError('Document not found');
      }
      return sendSuccess(res, document);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DocumentController();
