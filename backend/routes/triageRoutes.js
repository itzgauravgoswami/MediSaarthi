const express = require('express');
const router = express.Router();

const mockRedFlags = [
  {
    id: "RF-1",
    patientId: "P102",
    patientName: "Rahul Kumar",
    token: "#102",
    age: 45,
    gender: "Male",
    detectedInfo: "Chest pain with exertional breathlessness & left arm radiation.",
    priority: "Immediate Review",
    time: "10 mins ago",
    status: "Pending Action",
    ruleTriggered: "chest_pain_with_breathlessness"
  }
];

router.get('/red-flags', (req, res) => {
  res.json(mockRedFlags);
});

router.post('/red-flags/:id/acknowledge', (req, res) => {
  res.json({ success: true, message: "Alert acknowledged" });
});

module.exports = router;
