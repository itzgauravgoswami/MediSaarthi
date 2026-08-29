// FHIR & ABDM Interoperability Routes
const express = require('express');
const router = express.Router();
const fhirController = require('../controllers/fhir.controller');

router.get('/Patient/:id', (req, res, next) => fhirController.getFhirPatient(req, res, next));
router.get('/Bundle/:id', (req, res, next) => fhirController.getFhirBundle(req, res, next));
router.post('/abdm/verify-abha', (req, res, next) => fhirController.verifyAbdmAbha(req, res, next));

module.exports = router;
