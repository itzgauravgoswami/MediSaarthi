// Consent Routes
const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consent.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { createConsentSchema } = require('../validators/clinical.validator');

router.post('/', validateRequest(createConsentSchema), (req, res, next) => consentController.recordConsent(req, res, next));
router.get('/', (req, res, next) => consentController.getPatientConsents(req, res, next));
router.post('/:id/revoke', (req, res, next) => consentController.revokeConsent(req, res, next));

module.exports = router;
