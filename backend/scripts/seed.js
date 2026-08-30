// Database Seed Script for MediSaarthi Platform
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { connectDB } = require('../src/config/database');
const { hashPassword } = require('../src/utils/hashing');
const logger = require('../src/utils/logger');

// Models
const User = require('../src/models/User');
const Patient = require('../src/models/Patient');
const Doctor = require('../src/models/Doctor');
const ClinicalHistory = require('../src/models/ClinicalHistory');
const RedFlagAlert = require('../src/models/RedFlagAlert');
const Kiosk = require('../src/models/Kiosk');

async function seedDatabase() {
  logger.info('[MediSaarthi Seed] Starting database population...');

  try {
    await connectDB();
  } catch (e) {
    logger.warn(`[Seed] DB connection error: ${e.message}`);
  }

  const defaultPassword = await hashPassword('Doctor@123');
  const patientPassword = await hashPassword('Patient@123');
  const adminPassword = await hashPassword('Admin@123');

  // 1. Doctors across key clinical specialties
  const doctors = [
    {
      doctorId: 'DOC-101',
      userId: 'USR-DOC-1',
      name: 'Dr. R. K. Sharma',
      specialization: 'Internal Medicine',
      department: 'General Medicine OPD',
      registrationNumber: 'DMC-48291',
      roomNumber: 'OPD-102',
      isAvailable: true,
      queueCount: 2
    },
    {
      doctorId: 'DOC-102',
      userId: 'USR-DOC-2',
      name: 'Dr. Ananya Iyer',
      specialization: 'Cardiology',
      department: 'Cardiology & Cardiac Triage',
      registrationNumber: 'DMC-59302',
      roomNumber: 'CARDIO-204',
      isAvailable: true,
      queueCount: 1
    },
    {
      doctorId: 'DOC-103',
      userId: 'USR-DOC-3',
      name: 'Dr. Vikramaditya Rao',
      specialization: 'Emergency Medicine',
      department: 'Emergency & Trauma Care',
      registrationNumber: 'DMC-61029',
      roomNumber: 'EMERG-01',
      isAvailable: true,
      queueCount: 0
    },
    {
      doctorId: 'DOC-104',
      userId: 'USR-DOC-4',
      name: 'Dr. Sunita Deshmukh',
      specialization: 'Neurology',
      department: 'Neurosciences & Stroke Unit',
      registrationNumber: 'DMC-73821',
      roomNumber: 'NEURO-301',
      isAvailable: true,
      queueCount: 1
    },
    {
      doctorId: 'DOC-105',
      userId: 'USR-DOC-5',
      name: 'Dr. Arjun Mehta',
      specialization: 'Pulmonology',
      department: 'Respiratory Medicine',
      registrationNumber: 'DMC-81920',
      roomNumber: 'PULMO-108',
      isAvailable: true,
      queueCount: 1
    },
    {
      doctorId: 'DOC-106',
      userId: 'USR-DOC-6',
      name: 'Vaidya Rajesh Verma',
      specialization: 'Ayurvedic Medicine',
      department: 'AYUSH OPD Pavilion',
      registrationNumber: 'AYUSH-DEL-1049',
      roomNumber: 'AYUSH-01',
      isAvailable: true,
      queueCount: 1
    }
  ];

  // 2. Initial Patients
  const patients = [
    {
      patientId: 'P102',
      token: '#102',
      name: 'Rahul Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rahul.kumar@example.com',
      preferredLanguage: 'hi-IN',
      abhaId: '91-4829-1039-4821',
      priority: 'High',
      status: 'Waiting',
      intakeStatus: 'Completed',
      assignedDoctor: 'Dr. R. K. Sharma',
      consultationTime: '10:30 AM',
      isVerified: false
    },
    {
      patientId: 'P103',
      token: '#103',
      name: 'Priya Patel',
      age: 32,
      gender: 'Female',
      phone: '+91 98123 45678',
      email: 'priya.patel@example.com',
      preferredLanguage: 'hi-IN',
      abhaId: '91-1234-5678-9012',
      priority: 'Normal',
      status: 'Waiting',
      intakeStatus: 'Completed',
      assignedDoctor: 'Dr. R. K. Sharma',
      consultationTime: '10:45 AM',
      isVerified: false
    },
    {
      patientId: 'P104',
      token: '#104',
      name: 'Amitabh Banerjee',
      age: 58,
      gender: 'Male',
      phone: '+91 97456 12389',
      preferredLanguage: 'bn-IN',
      abhaId: '91-9988-7766-5544',
      priority: 'Normal',
      status: 'Waiting',
      intakeStatus: 'In Progress',
      assignedDoctor: 'Dr. R. K. Sharma',
      consultationTime: '11:00 AM'
    },
    {
      patientId: 'P105',
      token: '#105',
      name: 'Sunita Devi',
      age: 62,
      gender: 'Female',
      phone: '+91 98321 65498',
      preferredLanguage: 'hi-IN',
      priority: 'High',
      status: 'Waiting',
      intakeStatus: 'Completed',
      assignedDoctor: 'Dr. Ananya Iyer',
      consultationTime: '11:15 AM'
    }
  ];

  // 3. Initial Clinical History
  const histories = [
    {
      patientId: 'P102',
      historyOfPresentIllness: {
        chiefComplaint: ['Substernal chest pain', 'Dyspnea on exertion'],
        onset: '3 days ago',
        duration: '3 days',
        severity: 7,
        location: 'Substernal Precordial',
        summaryNarrative: 'Patient reports substernal chest discomfort increasing on moderate exertion, accompanied by mild breathlessness.'
      },
      pastMedicalHistory: ['Essential Hypertension', 'Type 2 Diabetes Mellitus'],
      medications: [
        { name: 'Metformin', dosage: '500 mg', frequency: 'BD', source: 'OCR' },
        { name: 'Amlodipine', dosage: '5 mg', frequency: 'OD', source: 'OCR' }
      ],
      allergies: [{ allergen: 'Penicillin', reaction: 'Skin rash', severity: 'Mild' }]
    }
  ];

  // 4. Kiosks
  const kiosks = [
    { kioskId: 'KIOSK-01', name: 'Kiosk 1', location: 'Main OPD Reception Desk A', status: 'ONLINE', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-02', name: 'Kiosk 2', location: 'Cardiology Wing Waiting Area', status: 'ONLINE', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-03', name: 'Kiosk 3', location: 'Emergency Triage Portal', status: 'ONLINE', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-04', name: 'Kiosk 4', location: 'AYUSH OPD Pavilion', status: 'ONLINE', softwareVersion: 'v2026.4.1' }
  ];

  try {
    for (const doc of doctors) {
      await Doctor.findOneAndUpdate({ doctorId: doc.doctorId }, doc, { upsert: true, new: true });
    }
    for (const pat of patients) {
      await Patient.findOneAndUpdate({ patientId: pat.patientId }, pat, { upsert: true, new: true });
    }
    for (const hist of histories) {
      await ClinicalHistory.findOneAndUpdate({ patientId: hist.patientId }, hist, { upsert: true, new: true });
    }
    for (const ksk of kiosks) {
      await Kiosk.findOneAndUpdate({ kioskId: ksk.kioskId }, ksk, { upsert: true, new: true });
    }
    logger.info(`[Seed] Successfully seeded ${doctors.length} doctors, ${patients.length} patients, and ${kiosks.length} kiosks.`);
  } catch (e) {
    logger.error(`[Seed] Seed database error: ${e.message}`);
  }

  logger.info('[MediSaarthi Seed] Seeding completed successfully!');
  if (process.argv[1] && process.argv[1].includes('seed.js')) {
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
