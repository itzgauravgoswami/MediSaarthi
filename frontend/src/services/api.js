// MediSaarthi Centralized Production API Client
// Connected directly to MongoDB Backend & AI Emergency Escalation Services

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get stored JWT token from localStorage
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('medisaarthi_token');
    return stored || null;
  } catch {
    return null;
  }
}

/**
 * Standard fetch helper that parses JSON, handles HTTP errors, and injects auth headers
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const token = getAuthToken();

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        data?.message ||
        data?.error?.message ||
        (typeof data?.error === 'string' ? data.error : null) ||
        `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

// =========================================================================
// 1. EMERGENCY & REAL-TIME VOICE ANALYSIS API
// =========================================================================
export const emergencyApi = {
  // Analyze Voice Audio or Transcript with AI & Emergency Decision Engine
  analyseVoice: async ({ audioBlob, transcript, patientId, language, idempotencyKey, patientName, patientAge, patientGender }) => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'patient_voice.webm');
      if (transcript) formData.append('transcript', transcript);
      if (patientId) formData.append('patientId', patientId);
      if (language) formData.append('language', language);
      if (idempotencyKey) formData.append('idempotencyKey', idempotencyKey);
      if (patientName) formData.append('patientName', patientName);
      if (patientAge) formData.append('patientAge', patientAge);
      if (patientGender) formData.append('patientGender', patientGender);

      const res = await request('/v1/voice/analyse', {
        method: 'POST',
        body: formData
      });
      return res?.data || res;
    }

    const res = await request('/v1/voice/analyse', {
      method: 'POST',
      body: JSON.stringify({
        transcript,
        patientId,
        language,
        idempotencyKey,
        patientName,
        patientAge,
        patientGender
      })
    });
    return res?.data || res;
  },

  // Manual Emergency Override Trigger
  triggerManualEmergency: async ({ patientId, symptoms, notes }) => {
    const res = await request('/v1/emergency-events', {
      method: 'POST',
      body: JSON.stringify({ patientId, symptoms, notes })
    });
    return res?.data || res;
  },

  // Fetch Active Emergency Alerts for Doctor Dashboard
  getActiveAlerts: async (doctorId) => {
    const query = doctorId ? `?doctorId=${encodeURIComponent(doctorId)}` : '';
    const res = await request(`/v1/emergency-events/active${query}`);
    return res?.data || [];
  },

  // List all emergency events
  getEmergencyEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await request(`/v1/emergency-events${params ? `?${params}` : ''}`);
    return res?.data || [];
  },

  // Doctor Acknowledges Emergency Alert
  acknowledgeEmergency: async (eventId, doctorName, doctorId) => {
    const res = await request(`/v1/emergency-events/${eventId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ doctorName, doctorId })
    });
    return res?.data || res;
  },

  // Doctor / System Escalates Emergency Alert
  escalateEmergency: async (eventId, reason, targetDoctorId) => {
    const res = await request(`/v1/emergency-events/${eventId}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ reason, targetDoctorId })
    });
    return res?.data || res;
  },

  // Doctor Resolves Emergency Alert
  resolveEmergency: async (eventId, resolutionNotes, doctorName, doctorId) => {
    const res = await request(`/v1/emergency-events/${eventId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolutionNotes, doctorName, doctorId })
    });
    return res?.data || res;
  },

  // Connect to Real-time SSE Stream
  subscribeToAlertStream: ({ role = 'DOCTOR', userId = null, patientId = null, onAlert, onStatusUpdate, onPatientUpdate, onError }) => {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams({ role });
    if (userId) params.append('userId', userId);
    if (patientId) params.append('patientId', patientId);
    const token = getAuthToken();
    if (token) params.append('token', token);

    const sseUrl = `${API_BASE_URL}/v1/emergency-events/stream?${params.toString()}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('emergency_alert', (e) => {
      try {
        const data = JSON.parse(e.data);
        onAlert?.(data);
      } catch (err) {
        console.error('[SSE] Error parsing alert:', err);
      }
    });

    eventSource.addEventListener('emergency_status_update', (e) => {
      try {
        const data = JSON.parse(e.data);
        onStatusUpdate?.(data);
      } catch (err) {
        console.error('[SSE] Error parsing status update:', err);
      }
    });

    eventSource.addEventListener('patient_emergency_update', (e) => {
      try {
        const data = JSON.parse(e.data);
        onPatientUpdate?.(data);
      } catch (err) {
        console.error('[SSE] Error parsing patient update:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn('[SSE Alert Stream] Connection interrupted. Reconnecting automatically.');
      onError?.(err);
    };

    return eventSource;
  }
};

// =========================================================================
// 2. AUTH API
// =========================================================================
export const authApi = {
  login: async (email, password, role = null, name = null) => {
    const res = await request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, name })
    });
    return res?.data || res;
  },

  register: async ({ name, email, password, role, phone, age, gender, preferredLanguage }) => {
    const res = await request('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phone, age, gender, preferredLanguage })
    });
    return res?.data || res;
  },

  me: async () => {
    const res = await request('/v1/auth/me');
    return res?.data?.user || res?.user || null;
  },

  refresh: async (refreshToken) => {
    const res = await request('/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    return res?.data || res;
  },

  logout: async () => {
    try {
      await request('/v1/auth/logout', { method: 'POST' });
    } catch (e) {}
  }
};

// =========================================================================
// 3. PATIENT API
// =========================================================================
export const patientApi = {
  getPatients: async () => {
    const res = await request('/patients');
    return Array.isArray(res) ? res : (res?.data || []);
  },
  getAttendedPatients: async () => {
    const res = await request('/v1/appointments?status=COMPLETED');
    return res?.data || [];
  },
  getDoctorAnalytics: async () => {
    const res = await request('/v1/analytics/doctor');
    return res?.data || {
      totalAttendedToday: 0,
      consultationThroughput: [],
      diseaseCategories: [],
      redFlagsIntercepted: 0
    };
  },
  getPatientById: async (id) => {
    const res = await request(`/patients/${id}`);
    return res?.data || res;
  },
  saveIntake: async (intakeData) => {
    const res = await request('/patients/intake', {
      method: 'POST',
      body: JSON.stringify(intakeData)
    });
    return res?.data || res;
  },
  verifySummary: async (patientId, doctorName, changes) => {
    const res = await request(`/patients/${patientId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ doctorName, changes })
    });
    return res?.data || res;
  }
};

// =========================================================================
// 4. DOCTOR API
// =========================================================================
export const doctorApi = {
  getDoctors: async (params = {}) => {
    const search = new URLSearchParams(params).toString();
    const res = await request(`/v1/doctors${search ? `?${search}` : ''}`);
    return res?.data || [];
  },
  getDoctorById: async (id) => {
    const res = await request(`/v1/doctors/${id}`);
    return res?.data || res;
  }
};

// =========================================================================
// 5. TRIAGE & RED FLAGS API
// =========================================================================
export const triageApi = {
  getRedFlags: async () => {
    const res = await request('/triage/red-flags');
    return res?.data || [];
  },
  acknowledgeAlert: async (id, staffName) => {
    const res = await request(`/triage/red-flags/${id}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ staffName })
    });
    return res?.data || res;
  }
};

// =========================================================================
// 6. AYUSH API
// =========================================================================
export const ayushApi = {
  getAyushAssessment: async (patientId) => {
    const res = await request(`/ayush/${patientId}`);
    return res?.data || res;
  }
};

// =========================================================================
// 7. ADMIN API
// =========================================================================
export const adminApi = {
  getAnalytics: async () => {
    const res = await request('/admin/analytics');
    return res?.data || {};
  },
  getStats: async () => {
    const res = await request('/admin/stats');
    return res?.data || {
      totalPatients: 0,
      totalKiosks: 0,
      totalDocuments: 0,
      verificationRate: '0%'
    };
  },
  getKiosks: async () => {
    const res = await request('/admin/kiosks');
    return res?.data || [];
  },
  getAuditLogs: async (page = 1, limit = 100) => {
    const res = await request(`/admin/audit-logs?page=${page}&limit=${limit}`);
    return res?.data || [];
  }
};

// =========================================================================
// 8. APPOINTMENT API
// =========================================================================
export const appointmentApi = {
  getAppointments: async (params = {}) => {
    const search = new URLSearchParams(params).toString();
    const res = await request(`/v1/appointments${search ? `?${search}` : ''}`);
    return Array.isArray(res) ? res : (res?.data || []);
  },
  getPatientAppointments: async (patientId) => {
    if (!patientId) return [];
    const res = await request(`/v1/appointments/patient/${patientId}`);
    return Array.isArray(res) ? res : (res?.data || []);
  },
  createAppointment: async (data) => {
    const res = await request('/v1/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res?.data || res;
  },
  updateStatus: async (id, status) => {
    const res = await request(`/v1/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res?.data || res;
  }
};

const api = {
  authApi,
  emergencyApi,
  patientApi,
  doctorApi,
  triageApi,
  ayushApi,
  adminApi,
  appointmentApi
};

export default api;
