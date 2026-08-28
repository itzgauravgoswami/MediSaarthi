// Centralized API Service with Sandbox & Demo Fallback Adapter

import { DEMO_PATIENTS, DEMO_RED_FLAGS, DEMO_KIOSKS, DEMO_AUDIT_LOGS, DEMO_ANALYTICS_STATS, DEMO_AYUSH_DATA } from './demoDataService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchWithFallback(endpoint, options = {}, demoDataGetter) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Fast fail fallback to demo mode
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Graceful fallback to demo data when server is unavailable
    console.log(`[MediSaarthi Sandbox Mode] Endpoint ${endpoint} using offline demo fallback.`);
  }

  return demoDataGetter();
}

export const patientApi = {
  getPatients: () => fetchWithFallback('/patients', {}, () => DEMO_PATIENTS),
  getPatientById: (id) => fetchWithFallback(`/patients/${id}`, {}, () => DEMO_PATIENTS.find(p => p.id === id) || DEMO_PATIENTS[0]),
  saveIntake: (intakeData) => fetchWithFallback('/patients/intake', { method: 'POST', body: JSON.stringify(intakeData) }, () => ({ success: true, token: "#106", message: "Intake recorded" })),
  verifySummary: (patientId, doctorName) => fetchWithFallback(`/patients/${patientId}/verify`, { method: 'POST', body: JSON.stringify({ doctorName }) }, () => {
    const patient = DEMO_PATIENTS.find(p => p.id === patientId);
    if (patient) {
      patient.isVerified = true;
      patient.verifiedBy = doctorName;
      patient.verifiedAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    }
    return { success: true, patient };
  })
};

export const triageApi = {
  getRedFlags: () => fetchWithFallback('/triage/red-flags', {}, () => DEMO_RED_FLAGS),
  acknowledgeAlert: (id) => fetchWithFallback(`/triage/red-flags/${id}/acknowledge`, { method: 'POST' }, () => ({ success: true }))
};

export const ayushApi = {
  getAyushAssessment: (patientId) => fetchWithFallback(`/ayush/${patientId}`, {}, () => DEMO_AYUSH_DATA[patientId] || DEMO_AYUSH_DATA['P102'])
};

export const adminApi = {
  getAnalytics: () => fetchWithFallback('/admin/analytics', {}, () => DEMO_ANALYTICS_STATS),
  getKiosks: () => fetchWithFallback('/admin/kiosks', {}, () => DEMO_KIOSKS),
  getAuditLogs: () => fetchWithFallback('/admin/audit-logs', {}, () => DEMO_AUDIT_LOGS)
};
