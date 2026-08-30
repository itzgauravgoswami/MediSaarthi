// Appointment & Queue Routes
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.get('/', (req, res, next) => appointmentController.getAppointments(req, res, next));
router.get('/patient/:patientId', (req, res, next) => appointmentController.getPatientAppointments(req, res, next));
router.post('/', (req, res, next) => appointmentController.createAppointment(req, res, next));
router.patch('/:id', (req, res, next) => appointmentController.updateStatus(req, res, next));

module.exports = router;
