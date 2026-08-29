// Timeline Routes
const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timeline.controller');

router.get('/:id', (req, res, next) => timelineController.getTimeline(req, res, next));
router.post('/events', (req, res, next) => timelineController.createEvent(req, res, next));

module.exports = router;
