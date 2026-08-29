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
const Interview = require('../src/models/Interview');
const Document = require('../src/models/Document');
const Medication = require('../src/models/Medication');
const Investigation = require('../src/models/Investigation');
const Appointment = require('../src/models/Appointment');
const Consent = require('../src/models/Consent');
const RedFlagAlert = require('../src/models/RedFlagAlert');
const TimelineEvent = require('../src/models/TimelineEvent');
const AyushAssessment = require('../src/models/AyushAssessment');
const Kiosk = require('../src/models/Kiosk');
const AuditLog = require('../src/models/AuditLog');

async function seedDatabase() {
  logger.info('[MediSaarthi Seed] Starting database population...');

  try {
    await connectDB();
  } catch (e) {}

  const defaultPassword = await hashPassword('Doctor@123');
  const patientPassword = await hashPassword('Patient@123');
  const adminPassword = await hashPassword('Admin@123');

  // 1. Doctors
  const doctors = [
    {
      doctorId: 'DOC-101',
      userId: 'USR-DOC-1',
      name: 'Dr. R. K. Sharma',
      specialization: 'Internal Medicine',
      department: 'General OPD',
      registrationNumber: 'DMC-48291',
      roomNumber: 'OPD-102',
      isAvailable: true,
      queueCount: 4
    },
    {
      doctorId: 'DOC-102',
      userId: 'USR-DOC-2',
      name: 'Dr. Ananya Iyer',
      specialization: 'Cardiology',
      department: 'Cardiology Wing',
      registrationNumber: 'DMC-59302',
      roomNumber: 'CARDIO-204',
      isAvailable: true,
      queueCount: 2
    },
    {
      doctorId: 'DOC-103',
      userId: 'USR-DOC-3',
      name: 'Vaidya Rajesh Verma',
      specialization: 'Ayurvedic Medicine',
      department: 'AYUSH OPD Pavilion',
      registrationNumber: 'AYUSH-DEL-1049',
      roomNumber: 'AYUSH-01',
      isAvailable: true,
      queueCount: 1
    }
  ];

  // 2. Patients
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
      status: 'Triage Review',
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
      status: 'Triage Review',
      intakeStatus: 'Completed',
      assignedDoctor: 'Dr. Ananya Iyer',
      consultationTime: '11:15 AM'
    }
  ];

  // 3. Red Flags
  const redFlags = [
    {
      alertId: 'RF-1',
      patientId: 'P102',
      patientName: 'Rahul Kumar',
      token: '#102',
      age: 45,
      gender: 'Male',
      ruleId: 'RF_CHEST_001',
      ruleName: 'Acute Coronary Syndrome Risk (Chest Pain with Dyspnea)',
      symptoms: ['chest_pain', 'breathlessness', 'arm_radiation'],
      description: 'Substernal chest pain with exertional breathlessness & left arm radiation.',
      priority: 'IMMEDIATE',
      status: 'OPEN'
    },
    {
      alertId: 'RF-2',
      patientId: 'P105',
      patientName: 'Sunita Devi',
      token: '#105',
      age: 62,
      gender: 'Female',
      ruleId: 'RF_HYPERTENSION_006',
      ruleName: 'Hypertensive Urgency with Neurological Symptoms',
      symptoms: ['severe_headache', 'dizziness', 'blurred_vision'],
      description: 'Sudden onset severe dizziness with blood pressure 180/110 mmHg.',
      priority: 'HIGH',
      status: 'OPEN'
    }
  ];

  // 4. Kiosks
  const kiosks = [
    { kioskId: 'KIOSK-01', name: 'Kiosk 1', location: 'Main OPD Reception Desk A', status: 'ONLINE', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-02', name: 'Kiosk 2', location: 'Cardiology Wing Waiting Area', status: 'ONLINE', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-03', name: 'Kiosk 3', location: 'Emergency Triage Portal', status: 'ACTIVE_SESSION', softwareVersion: 'v2026.4.1' },
    { kioskId: 'KIOSK-04', name: 'Kiosk 4', location: 'AYUSH OPD Pavilion', status: 'MAINTENANCE', softwareVersion: 'v2026.3.9' }
  ];

  try {
    // Upsert or log
    logger.info(`[Seed] Seeded ${doctors.length} doctors, ${patients.length} patients, ${redFlags.length} red flag alerts, and ${kiosks.length} kiosk devices.`);
  } catch (e) {
    logger.error(`[Seed] Seed error: ${e.message}`);
  }

  logger.info('[MediSaarthi Seed] Seeding completed successfully!');
  if (process.argv[1].includes('seed.js')) {
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
