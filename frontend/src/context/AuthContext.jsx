"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultProfiles = {
  doctor: {
    name: 'Dr. Ananya Sharma',
    email: 'dr.sharma@medisaarthi.health',
    hospital: 'Max Super Speciality Hospital, New Delhi',
    department: 'Cardiology OPD',
    role: 'doctor'
  },
  patient: {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@gmail.com',
    hospital: 'OPD Desk A',
    token: '#102',
    abhaId: '91-4829-1039-4821',
    role: 'patient'
  },
  pharmacy: {
    name: 'Rajesh Verma',
    email: 'pharmacy@medisaarthi.health',
    hospital: 'Central Hospital Pharmacy Desk',
    role: 'pharmacy'
  },
  admin: {
    name: 'System Administrator',
    email: 'admin@medisaarthi.health',
    hospital: 'MediSaarthi Operational Fleet',
    role: 'admin'
  }
};

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  role: null, // 'doctor' | 'patient' | 'pharmacy' | 'admin'
  login: () => {},
  signup: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [role, setRole] = useState('doctor');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(defaultProfiles.doctor);

  const login = (selectedRole = 'doctor', credentials = {}) => {
    const activeRole = selectedRole.toLowerCase();
    const baseProfile = defaultProfiles[activeRole] || defaultProfiles.doctor;
    const profile = {
      ...baseProfile,
      name: credentials.name || baseProfile.name,
      email: credentials.email || baseProfile.email,
      role: activeRole
    };

    setRole(activeRole);
    setUser(profile);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medisaarthi_auth', JSON.stringify({ role: activeRole, user: profile, isAuthenticated: true }));
    }
  };

  const signup = (selectedRole, name, email) => {
    login(selectedRole, { name, email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medisaarthi_auth');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('medisaarthi_auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isAuthenticated && parsed.role) {
            setRole(parsed.role);
            setUser(parsed.user);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.warn("Failed to parse auth token", e);
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, setRole, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
