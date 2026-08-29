# MediSaarthi

## AI-Powered Multilingual Clinical Intake and Patient History Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-emerald?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Engine-teal?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![FHIR & ABDM](https://img.shields.io/badge/Interoperability-FHIR_%26_ABDM-indigo?style=for-the-badge)](https://abdm.gov.in/)

> **Core Philosophy**: *"AI collects and structures information. Doctors make clinical decisions."*

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Patient Journey](#patient-journey)
- [Doctor Workflow](#doctor-workflow)
- [AYUSH Workflow](#ayush-workflow)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [AI Architecture](#ai-architecture)
- [Voice Assistant](#voice-assistant)
- [Multilingual Support](#multilingual-support)
- [Medical Document Intelligence](#medical-document-intelligence)
- [Red-Flag Detection](#red-flag-detection)
- [Clinical Summary Generation](#clinical-summary-generation)
- [Medical Timeline](#medical-timeline)
- [Consent and Privacy](#consent-and-privacy)
- [Security](#security)
- [FHIR and ABDM Integration](#fhir-and-abdm-integration)
- [Accessibility](#accessibility)
- [Offline and Low-Connectivity Support](#offline-and-low-connectivity-support)
- [User Roles](#user-roles)
- [Database Design](#database-design)
- [API Architecture](#api-architecture)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Testing](#testing)
- [Future Roadmap](#future-roadmap)
- [Limitations](#limitations)
- [Responsible AI](#responsible-ai)
- [Project Impact](#project-impact)
- [Conclusion](#conclusion)
- [License](#license)

---

# Overview

MediSaarthi addresses the clinical history-taking and medical documentation bottleneck faced by high-volume healthcare institutions across India.

In many busy hospitals and Outpatient Departments (OPDs), doctors have limited consultation time per patient while simultaneously needing to collect patient history, perform physical examinations, review previous medical documents, formulate clinical assessments, and provide counselling.

MediSaarthi moves a significant portion of repetitive information collection to an intelligent pre-consultation digital workflow.

The patient interacts with an intuitive kiosk or web-based interface, providing information through voice or touch. Previous physical prescriptions, lab reports, and discharge summaries can be scanned or uploaded. The system structures the collected information and generates a concise, physician-ready clinical summary before the consultation begins.

> [!IMPORTANT]
> The attending physician remains 100% in control—reviewing, editing, verifying, and confirming the final clinical record before it is saved into the hospital's EMR.

---

# Problem Statement

High-volume Indian healthcare environments face severe operational and diagnostic bottlenecks:

- **Limited Doctor-Patient Consultation Time**: Overcrowded OPDs force rushed history-taking.
- **Repetitive Manual Documentation**: Doctors spend up to 40% of consultation time typing routine baseline history.
- **Incomplete & Fragmented Histories**: Patients struggle to recall past medication dates or previous diagnoses accurately.
- **Paper & Handwritten Records**: Critical diagnostic history is locked inside physical paper reports and handwritten prescriptions.
- **Language & Literacy Barriers**: Rural and elderly patients face difficulty navigating digital web forms or communicating in English/Hindi.
- **Unscalable Manual Triage Desks**: Triage counters lack automated red-flag screening mechanisms.
- **Complex AYUSH Assessment**: Traditional Ayurvedic history-taking (Dashavidha Pariksha, Ahara-Vihara) requires deep structured data collection often omitted in standard OPDs.

MediSaarthi bridges this first-mile gap through an accessible, AI-assisted pre-consultation intake workflow.

---

# Proposed Solution

MediSaarthi combines 14 core clinical and technical capabilities:

1. **Multilingual Conversational Voice AI** (Native Indian Accents).
2. **Dual Voice + Touch Interaction** for universal accessibility.
3. **Structured Adaptive Clinical History-Taking**.
4. **Medical Document Intelligence** (High-Accuracy Medical OCR).
5. **Interactive Medical Timeline Generation**.
6. **Algorithmic Red-Flag Triage Detection**.
7. **Physician-Ready Clinical Summary Generation**.
8. **Mandatory Doctor Verification & 1-Click Editing**.
9. **Native AYUSH & Integrative Medicine Workflows**.
10. **Consent-First Data Governance & Audit Logs**.
11. **Role-Based Access Control (RBAC)**.
12. **HL7 FHIR Interoperability**.
13. **ABDM (Ayushman Bharat Digital Mission) Ready**.
14. **Accessibility-Focused Kiosk Interaction**.

---

# Objectives

- **Reduce Physician Burnout**: Eliminate 70%+ of repetitive manual intake typing.
- **Improve Intake Quality**: Ensure consistent, standardized clinical history capturing HPI, Past History, Meds, Allergies, and Review of Systems.
- **Bridge Language Divides**: Enable patients to speak in native Indian dialects.
- **Digitize Physical Health Records**: Parse handwritten/printed lab sheets and prescriptions into structured EMR data.
- **Surface Critical Safety Alerts**: Instantly detect and flag emergency symptoms for hospital triage staff.
- **Preserve Human Oversight**: Keep doctors as the ultimate decision-makers in all clinical documentation.

---

# Key Features

## 1. AI Clinical History-Taking
Conducts a structured patient interview covering:
- Chief Complaint
- History of Present Illness (HPI)
- Past Medical & Surgical History
- Medication & Allergy History
- Family & Personal History
- Review of Systems (ROS)

## 2. Voice-First Interaction
Patients speak naturally. The pipeline processes:

```text
[Patient Speech] -> [Speech Recognition] -> [Text Processing] -> [Gemini AI Engine] -> [Structured Clinical Data] -> [Adaptive Question] -> [Text-to-Speech] -> [Patient]
```

## 3. Multilingual Support
Native support for **Hindi** and **English**, architected for seamless expansion into regional Indian languages including **Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada, Malayalam, and Punjabi**.

## 4. Adaptive Questioning
The interview dynamically branches based on patient responses:

```text
Chief Complaint: Chest Pain -> Onset -> Location -> Character -> Radiation -> Exertional Factors -> Associated Dyspnea -> Red-Flag Screening
```

## 5. Medical Document Intelligence
Scans and parses physical prescriptions, laboratory reports, and discharge summaries using optical character recognition and medical entity extraction.

## 6. Medical Timeline
Visual chronological reconstruction of past medical events, hospital admissions, diagnostic values, and surgical procedures.

---

# Patient Journey

```text
1. Identify & Register -> 2. Select Language -> 3. Digital Consent -> 4. Voice/Touch AI Interview -> 5. Red-Flag Screening -> 6. Upload Physical Reports -> 7. Document Extraction -> 8. Pre-Consultation Summary Ready
```

---

# Doctor Workflow

```text
[Doctor Login] -> [OPD Patient Queue] -> [Open Pre-Populated Case] -> [Review Summary & Timeline] -> [Verify / Edit Notes] -> [1-Click Confirm & Save to EMR]
```

---

# AYUSH Workflow

Supports traditional Ayurvedic clinical assessment parameters including **Dashavidha Pariksha**:

- **Prakriti** (Dosha Constitution)
- **Vikriti** (Current Imbalance)
- **Sara** (Tissue Excellence)
- **Samhanana** (Compactness)
- **Pramana** (Anthropometry)
- **Satmya** (Adaptability)
- **Sattva** (Mental Strength)
- **Ahara & Vyayama Shakti** (Digestive & Physical Capacity)
- **Vaya** (Age Assessment)
- **Ahara & Vihara** (Diet & Lifestyle Regimen)

---

# System Architecture

```text
                          MediSaarthi System
                                 |
         +-----------------------+-----------------------+
         |                                               |
         v                                               v
   Patient Kiosk / Web                             Doctor Portal
         |                                               |
         +-----------------------+-----------------------+
                                 |
                                 v
                        Next.js 16 Frontend
                                 |
                                 v
                     Node.js / Express Backend
                                 |
        +------------------------+------------------------+
        |                        |                        |
        v                        v                        v
  Google Gemini AI         OCR & Document AI          MongoDB Atlas
        |                        |                        |
        +------------------------+------------------------+
                                 |
                                 v
                   FHIR / ABDM Interoperability
```

---

# Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide React Icons |
| **Backend** | Node.js 20+, Express.js, Mongoose ORM, JWT, Multer |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **AI Engine** | Google Gemini 2.5 API (Natural Language Understanding, Entity Extraction, Summarization) |
| **Document Processing** | Multilingual OCR & Vision Parsing Pipeline |
| **Standards** | HL7 FHIR R4, ABDM Health Data Standards |

---

# Application Structure

```text
medisaarthi/
├── frontend/                     # Next.js 16 App Directory
│   ├── src/
│   │   ├── app/                 # Routes, Layouts, Page components
│   │   ├── components/          # Hero, TrustBar, VoiceShowcase, FeatureGrid, DoctorDashboard
│   │   ├── context/             # ThemeContext (Dark/Light Mode)
│   │   └── utils/               # Helper utilities & API clients
│   └── public/                  # Assets, Logos, SVGs
├── backend/                      # Node.js & Express REST API
│   ├── config/                  # DB Connection & Environment Config
│   ├── controllers/             # Patient, Doctor, Interview & Document Controllers
│   ├── models/                  # Mongoose Schemas (Patient, History, Document, Consent)
│   ├── routes/                  # REST Endpoint Routers
│   ├── services/                # Gemini AI, OCR, FHIR & ABDM Services
│   └── server.js                # Express App Entry Point
├── README.md
└── package.json
```

---

# AI Architecture

MediSaarthi uses specialized AI services rather than an unstructured open chatbot:

- **Clinical Intake Engine**: Enforces medical questioning guardrails.
- **Entity Extraction**: Normalizes symptoms, dosages, and temporal durations into structured JSON.
- **Red-Flag Classifier**: Evaluates acute symptom clusters for priority escalation.
- **Document Summarizer**: Maps unstructured lab text to standardized reference ranges.

---

# Voice Assistant

The voice pipeline supports natural acoustic speech input with automatic noise filtering, dialect detection, and real-time audio waveform visualizers.

---

# Multilingual Support

Modular localization architecture allowing dynamic switching between Hindi, English, and regional Indian languages without hardcoding UI strings.

---

# Medical Document Intelligence

Extracts:
- **Medications**: Name, Strength, Form, Frequency, Duration.
- **Lab Investigations**: Parameter Name, Observed Value, Unit, Reference Range.
- **Diagnoses & Procedures**: ICD-10 mapped diagnostic terms and surgery history.

---

# Red-Flag Detection

Algorithms screen responses in real time. Symptoms such as severe chest pain with radiation, acute dyspnea, or sudden neurological deficits trigger immediate triage alerts.

---

# Clinical Summary Generation

Generates standardized SOAP-aligned summaries:

```markdown
- Chief Complaint
- History of Present Illness (HPI)
- Past Medical / Surgical History
- Medication & Allergy Profile
- Review of Systems (ROS)
- Parsed Lab Findings
- Red Flag Indicators
```

---

# Medical Timeline

Organizes health records into an interactive, chronological timeline linking every entry back to its source patient statement or scanned report.

---

# Consent and Privacy

- Explicit patient consent before data collection.
- Granular data-sharing permissions.
- Full audit logging of consent status and access timestamps.

---

# Security

- **JWT Authentication** & Role-Based Access Control (RBAC).
- **TLS/HTTPS Encryption** in transit and AES-256 at rest.
- **Automatic Kiosk Session Purging** after patient completion.

---

# FHIR and ABDM Integration

Structures intake data using **HL7 FHIR R4 resources** (`Patient`, `Condition`, `Observation`, `MedicationStatement`) ready for Ayushman Bharat Digital Mission (ABDM) ABHA health record linking.

---

# Accessibility

Designed for universal accessibility in high-volume OPDs:
- High contrast themes (Pure OLED Black dark mode & crisp light mode).
- Large touch targets & readable typography (Google Newsreader + Inter).
- Zero emoji usage—100% clean Lucide React vector icons.
- Screen-reader friendly semantic HTML5 markup.

---

# Offline and Low-Connectivity Support

Supports local encrypted caching for registration and basic touch questionnaires during internet dropouts, syncing automatically when connectivity resumes.

---

# User Roles

1. **Patient**: Select language, give consent, answer intake questions, upload documents.
2. **Doctor**: Review pre-populated summaries, edit parameters, confirm and save to EMR.
3. **Nurse / Triage Staff**: Monitor patient queue and receive red-flag alerts.
4. **Administrator**: Manage kiosk devices, doctor assignments, and audit logs.

---

# Database Design

Primary MongoDB collections:
- `patients` (Demographics, ABHA ID, Consent)
- `clinicalHistories` (HPI, ROS, Past History, Red Flags)
- `documents` (File URLs, OCR Extracted JSON, Confidence Scores)
- `appointments` (Queue Tokens, Department, Doctor ID)
- `users` (Auth Credentials, Roles, Specialization)
- `auditLogs` (Security & Access Tracing)

---

# API Architecture

# Project Setup & Local Development

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Python**: 3.9+ (Optional for self-hosted Whisper speech-to-text)
- **FFmpeg**: (Optional for audio format normalization)
- **Tesseract OCR**: Pre-bundled via `tesseract.js` WASM engine (or system binary `tesseract-ocr`)
- **MongoDB**: Local instance (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 1. System Dependencies (Optional for Full Self-Hosted Inference)
```bash
# Ubuntu / Debian
sudo apt-get update
sudo apt-get install -y tesseract-ocr tesseract-ocr-hin tesseract-ocr-eng ffmpeg python3-pip
pip install faster-whisper

# macOS (Homebrew)
brew install tesseract tesseract-lang ffmpeg
pip3 install faster-whisper

# Windows (Chocolatey or Winget)
choco install tesseract ffmpeg
pip install faster-whisper
```

### 2. Repository Installation

```bash
# Clone the repository
git clone https://github.com/your-org/medisaarthi.git
cd medisaarthi

# Install Backend Dependencies
cd backend
npm install
pip install -r requirements.txt # Optional for local faster-whisper

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

# Environment Variables Configuration

Create `.env` inside `backend/`:

```env
NODE_ENV=development
PORT=5000
DEMO_MODE=true

MONGODB_URI=mongodb://localhost:27017/medisaarthi
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_refresh_jwt_key

# Google Gemini Clinical AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Storage Provider: 'cloudinary' | 'local'
STORAGE_PROVIDER=local
STORAGE_DIR=uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_FOLDER=medisaarthi_clinical_docs

# Self-Hosted OCR Provider: 'tesseract' | 'mock'
OCR_PROVIDER=tesseract
OCR_LANGUAGE=eng+hin
OCR_TIMEOUT_MS=60000

# Self-Hosted Speech Provider: 'whisper' | 'mock'
SPEECH_PROVIDER=whisper
WHISPER_MODEL=small
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8
WHISPER_PYTHON_PATH=python
WHISPER_CONCURRENCY_LIMIT=2

# ABDM Gateway Interoperability
ABDM_ENABLED=true
ABDM_MODE=sandbox
ABDM_BASE_URL=https://dev.abdm.gov.in/gateway/v0.5
ABDM_CLIENT_ID=your_abdm_sandbox_client_id
ABDM_CLIENT_SECRET=your_abdm_sandbox_client_secret

# FHIR Interoperability
FHIR_BASE_URL=http://localhost:5000/api/v1/fhir
```

Create `.env.local` inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# Running the Project

```bash
# Terminal 1: Run Backend Server
cd backend
npm run dev

# Seed Development Database
npm run seed

# Run Test Suite
npm test

# Terminal 2: Run Frontend Next.js App
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

# Production Deployment

### Docker Deployment (Recommended)

MediSaarthi backend includes a multi-stage production Docker container pre-packaged with Node.js 20, Python 3, Tesseract OCR (with English & Hindi packs), FFmpeg, and Faster-Whisper:

```bash
cd backend

# Build and start with Docker Compose
docker-compose up --build -d
```

### Production Resource Sizing Guidelines

| Component | Minimum Spec (Low Resource) | Recommended (Production OPD) |
|---|---|---|
| **CPU** | 2 vCPUs | 4 - 8 vCPUs |
| **RAM** | 2 GB (Whisper `tiny` / `base`) | 4 - 8 GB (Whisper `small` / `int8`) |
| **Storage** | 10 GB SSD | 50 GB SSD / Cloudinary CDN |
| **OCR Engine** | Tesseract (in-process / WASM) | Tesseract-OCR (`tesseract-ocr-hin`) |
| **Speech STT** | Faster-Whisper `tiny` / `base` (int8) | Faster-Whisper `small` (int8/float16) |

### Health Check Telemetry

Access `GET /api/v1/health` or `GET /api/health` to verify provider states:

```json
{
  "status": "ok",
  "storage": "cloudinary",
  "ocr": "tesseract",
  "speech": "whisper",
  "fhir": "configured",
  "abdm": "sandbox",
  "providers": {
    "storage": { "active": "cloudinary", "status": "ok" },
    "ocr": { "active": "tesseract", "status": "operational_self_hosted" },
    "speech": { "active": "whisper", "model": "small", "status": "operational_self_hosted" },
    "ai": { "geminiEngine": "Live Gemini 1.5" },
    "database": { "status": "connected", "mode": "Live MongoDB" },
    "abdm": { "mode": "sandbox", "enabled": true },
    "fhir": { "baseUrl": "https://your-api.com/api/v1/fhir", "standard": "HL7 FHIR R4" }
  }
}
```

---

# Testing

```bash
# Run Master Test Suite (Unit, Interoperability, OCR, Speech, Storage, Security)
cd backend
npm test

# Run Frontend Production Build Check
cd ../frontend
npm run build
```

---

# Future Roadmap

- [x] Multilingual Voice AI Engine (Hindi & English)
- [x] Pure Black OLED Dark Mode Design
- [x] Medical Document Intelligence & OCR Pipeline (Self-Hosted Tesseract)
- [x] Speech-to-Text Transcription Engine (Self-Hosted Faster-Whisper)
- [x] Cloudinary & Local Storage Provider Abstraction
- [x] Red-Flag Safety Triage Screening
- [x] Physician Verification & Summary Editing Interface
- [x] Native AYUSH & Dashavidha Pariksha Workflow
- [x] ABDM Milestone 1 Sandbox Gateway Client
- [ ] Regional Dialect Expansion (Bengali, Telugu, Tamil, Marathi)
- [ ] Offline On-Premises Edge AI Kiosk Hardware Kit

---

# Limitations

- AI-generated summaries are decision-support tools and require qualified physician review.
- Document OCR accuracy depends on scan clarity and handwriting legibility.
- Self-hosted Whisper inference latency depends on CPU cores and RAM allocation (recommended model: `small` with `int8` quantization).

---

# Responsible AI

- **No Autonomous Diagnosis**: The system collects and formats data; it does not diagnose.
- **No Autonomous Prescriptions**: Only doctors prescribe treatment.
- **Human-in-the-Loop**: Mandatory doctor signature before EMR persistence.

---

# Project Impact

- **For Patients**: Faster intake, native language expression, reduced waiting room frustration.
- **For Doctors**: 70% less repetitive typing, pre-structured histories, clear red-flag visibility.
- **For Hospitals**: Higher OPD throughput, standardized digital records, FHIR and ABDM compatibility.

---

# License

This project is licensed under the MIT License - see the LICENSE file for details.

