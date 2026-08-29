// Document Routes
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { uploadSingleDocument } = require('../middleware/upload.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

router.post('/', uploadLimiter, uploadSingleDocument, documentController.uploadAndProcess);
router.get('/:id', documentController.getDocumentById);

module.exports = router;
