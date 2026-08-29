// Clinical History Routes
const express = require('express');
const router = express.Router();
const clinicalController = require('../controllers/clinical.controller');
const { optionalAuthMiddleware } = require('../middleware/auth.middleware');

router.get('/:id', optionalAuthMiddleware, clinicalController.getClinicalHistory);
router.patch('/:id', optionalAuthMiddleware, clinicalController.updateClinicalHistory);
router.post('/:id/verify', optionalAuthMiddleware, clinicalController.verifyClinicalHistory);
router.post('/:id/summary', optionalAuthMiddleware, clinicalController.generateSummary);

module.exports = router;
