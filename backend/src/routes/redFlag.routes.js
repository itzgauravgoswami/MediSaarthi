// Red Flag & Triage Routes
const express = require('express');
const router = express.Router();
const redFlagController = require('../controllers/redFlag.controller');

router.get('/', redFlagController.getAlerts);
router.get('/red-flags', redFlagController.getAlerts); // Frontend compatibility
router.post('/:id/acknowledge', redFlagController.acknowledgeAlert);
router.post('/red-flags/:id/acknowledge', redFlagController.acknowledgeAlert); // Frontend compatibility
router.post('/:id/resolve', redFlagController.resolveAlert);

module.exports = router;
