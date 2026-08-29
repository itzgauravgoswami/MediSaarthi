// Notification Routes
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.get('/', (req, res, next) => notificationController.getNotifications(req, res, next));
router.post('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

module.exports = router;
