const express = require('express');
const router = express.Router();

const mockPatients = [
  {
    id: "P102",
    token: "#102",
    name: "Rahul Kumar",
    age: 45,
    gender: "Male",
    phone: "+91 98765 43210",
    abhaId: "91-4829-1039-4821",
    language: "hi",
    chiefComplaint: "Chest Pain with Breathlessness",
    intakeStatus: "Completed",
    redFlag: "Attention Required",
    priority: "High",
    status: "Waiting",
    assignedDoctor: "Dr. Sharma",
    consultationTime: "10:30 AM",
    date: "28 Aug 2026",
    isVerified: false,
    historyOfPresentIllness: "Patient reports substernal chest pain for approximately three days. Pain reportedly increases during physical activity.",
    pastMedicalHistory: "Essential Hypertension, Type 2 Diabetes Mellitus.",
    medicationHistory: [
      { name: "Metformin", dosage: "500 mg", frequency: "BD", source: "OCR", confidence: 94 },
      { name: "Amlodipine", dosage: "5 mg", frequency: "OD", source: "OCR", confidence: 91 }
    ],
    timeline: [
      { id: "T1", date: "28 Aug 2026", type: "Consultation", title: "Current Intake", desc: "Substernal chest pain with exertional breathlessness.", badge: "Red Flag" }
    ],
    documents: []
  }
];

router.get('/', (req, res) => {
  res.json(mockPatients);
});

router.get('/:id', (req, res) => {
  const patient = mockPatients.find(p => p.id === req.params.id) || mockPatients[0];
  res.json(patient);
});

router.post('/:id/verify', (req, res) => {
  const patient = mockPatients.find(p => p.id === req.params.id) || mockPatients[0];
  patient.isVerified = true;
  patient.verifiedBy = req.body.doctorName || "Dr. Sharma";
  patient.verifiedAt = new Date().toISOString();
  res.json({ success: true, patient });
});

module.exports = router;
