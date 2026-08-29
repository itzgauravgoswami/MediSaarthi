// AYUSH Routes
const express = require('express');
const router = express.Router();
const ayushController = require('../controllers/ayush.controller');

router.get('/:id', ayushController.getAssessment);
router.post('/:id', ayushController.saveAssessment);
router.post('/:id/verify', ayushController.verifyAssessment);

module.exports = router;
