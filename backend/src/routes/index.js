// Master Router - MediSaarthi API v1
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const interviewRoutes = require('./interview.routes');
const documentRoutes = require('./document.routes');
const speechRoutes = require('./speech.routes');
const clinicalRoutes = require('./clinical.routes');
const timelineRoutes = require('./timeline.routes');
const redFlagRoutes = require('./redFlag.routes');
const ayushRoutes = require('./ayush.routes');
const consentRoutes = require('./consent.routes');
const appointmentRoutes = require('./appointment.routes');
const notificationRoutes = require('./notification.routes');
const analyticsRoutes = require('./analytics.routes');
const adminRoutes = require('./admin.routes');
const fhirRoutes = require('./fhir.routes');
const healthRoutes = require('./health.routes');
const emergencyRoutes = require('./emergency.routes');
const doctorRoutes = require('./doctor.routes');

// Mount domain routes on /api/v1
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/interviews', interviewRoutes);
router.use('/documents', documentRoutes);
router.use('/speech', speechRoutes);
router.use('/clinical', clinicalRoutes);
router.use('/timeline', timelineRoutes);
router.use('/red-flags', redFlagRoutes);
router.use('/triage', redFlagRoutes);
router.use('/ayush', ayushRoutes);
router.use('/consents', consentRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/fhir', fhirRoutes);
router.use('/health', healthRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/voice', emergencyRoutes);
router.use('/', emergencyRoutes); // Mounts /emergency-events at /api/v1/emergency-events

module.exports = router;
