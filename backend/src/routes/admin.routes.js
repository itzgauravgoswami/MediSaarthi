// Admin & Kiosk Routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const analyticsController = require('../controllers/analytics.controller');

router.get('/analytics', (req, res, next) => analyticsController.getOverview(req, res, next));
router.get('/stats', (req, res, next) => adminController.getAdminStats(req, res, next));
router.get('/kiosks', (req, res, next) => adminController.getKiosks(req, res, next));
router.get('/audit-logs', (req, res, next) => adminController.getAuditLogs(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));

module.exports = router;

