// Doctor Routes
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

router.get('/', (req, res, next) => doctorController.getAllDoctors(req, res, next));
router.get('/:id', (req, res, next) => doctorController.getDoctorById(req, res, next));

module.exports = router;
