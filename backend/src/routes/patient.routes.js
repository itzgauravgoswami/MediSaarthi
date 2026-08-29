// Patient Routes
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const timelineController = require('../controllers/timeline.controller');
const documentController = require('../controllers/document.controller');
const clinicalController = require('../controllers/clinical.controller');
const { optionalAuthMiddleware } = require('../middleware/auth.middleware');

router.get('/', optionalAuthMiddleware, patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.post('/intake', patientController.recordIntake);

router.get('/:id', optionalAuthMiddleware, patientController.getPatientById);
router.patch('/:id', optionalAuthMiddleware, patientController.updatePatient);
router.post('/:id/verify', optionalAuthMiddleware, patientController.verifyPatientSummary);

router.get('/:id/timeline', timelineController.getTimeline);
router.get('/:id/documents', documentController.getPatientDocuments);
router.get('/:id/history', clinicalController.getClinicalHistory);

module.exports = router;
