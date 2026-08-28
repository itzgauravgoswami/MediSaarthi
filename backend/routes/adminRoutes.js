const express = require('express');
const router = express.Router();

router.get('/analytics', (req, res) => {
  res.json({
    patientsProcessedToday: 24,
    aiIntakesCompleted: 19,
    avgIntakeDuration: "3.4 mins",
    docProcessingCount: 38,
    redFlagCount: 2,
    languageDistribution: [
      { name: "Hindi (हिन्दी)", count: 14, percent: 58 },
      { name: "English", count: 7, percent: 29 },
      { name: "Bengali (বাংলা)", count: 2, percent: 8 }
    ],
    dailyThroughput: [
      { time: "08:00 AM", count: 3 },
      { time: "09:00 AM", count: 7 },
      { time: "10:00 AM", count: 9 },
      { time: "11:00 AM", count: 5 }
    ]
  });
});

router.get('/kiosks', (req, res) => {
  res.json([
    { id: "KIOSK-01", location: "Main OPD Reception Desk A", status: "Online", lastActive: "Just now", session: "Active Intake (#102)", version: "v2026.4.1" },
    { id: "KIOSK-02", location: "Cardiology Wing Waiting Area", status: "Online", lastActive: "2 mins ago", session: "Idle", version: "v2026.4.1" },
    { id: "KIOSK-03", location: "Emergency Triage Portal", status: "Active Session", lastActive: "Just now", session: "Active Intake (#105)", version: "v2026.4.1" },
    { id: "KIOSK-04", location: "AYUSH OPD Pavilion", status: "Maintenance", lastActive: "1 hour ago", session: "Calibration", version: "v2026.3.9" }
  ]);
});

router.get('/audit-logs', (req, res) => {
  res.json([
    { id: "LOG-901", timestamp: "28 Aug 2026, 10:42 AM", user: "Dr. Sharma", role: "Doctor", action: "Confirmed Clinical Summary", resource: "Patient #102", status: "Success" },
    { id: "LOG-902", timestamp: "28 Aug 2026, 10:35 AM", user: "Kiosk #01", role: "Patient Kiosk", action: "Uploaded Prescription Document", resource: "DOC-101", status: "Success" },
    { id: "LOG-903", timestamp: "28 Aug 2026, 10:30 AM", user: "Rahul Kumar", role: "Patient", action: "Granted Digital Informed Consent", resource: "Consent Protocol v2", status: "Success" }
  ]);
});

module.exports = router;
