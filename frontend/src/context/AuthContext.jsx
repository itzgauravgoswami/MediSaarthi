"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api';

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  role: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const role = user?.role || null;

  // Persist token to localStorage
  const persistToken = (token, refreshToken) => {
    if (typeof window === 'undefined') return;
    try {
      if (token) localStorage.setItem('medisaarthi_token', token);
      if (refreshToken) localStorage.setItem('medisaarthi_refresh_token', refreshToken);
    } catch (e) {}
  };

  const clearTokens = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('medisaarthi_token');
      localStorage.removeItem('medisaarthi_refresh_token');
    } catch (e) {}
  };

  // Hydrate user from stored JWT on app load
  useEffect(() => {
    async function hydrateUser() {
      setIsLoading(true);
      try {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('medisaarthi_token');
        if (!token) return;

        // Verify token is still valid by calling /me
        const me = await authApi.me();
        if (me) {
          setUser(me);
          setIsAuthenticated(true);
        } else {
          clearTokens();
        }
      } catch (e) {
        // Token expired or invalid — clear it
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    hydrateUser();
  }, []);

  /**
   * Login against the real MongoDB backend.
   * Supports:
   * - login(email, password)
   * - login(role, { email, password, name })
   * - login({ email, password, role, name })
   * Returns { success, error }
   */
  const login = useCallback(async (arg1, arg2) => {
    try {
      let email = null;
      let password = null;
      let role = null;
      let name = null;

      if (typeof arg1 === 'string' && arg1.includes('@')) {
        email = arg1;
        password = arg2;
      } else if (typeof arg1 === 'string') {
        role = arg1;
        email = arg2?.email;
        password = arg2?.password;
        name = arg2?.name;
      } else if (typeof arg1 === 'object' && arg1 !== null) {
        email = arg1.email;
        password = arg1.password;
        role = arg1.role;
        name = arg1.name;
      }

      const defaultRoleEmails = {
        doctor: 'dr.sharma@medisaarthi.health',
        patient: 'patient@medisaarthi.health',
        pharmacy: 'pharmacy@medisaarthi.health',
        admin: 'admin@medisaarthi.health'
      };

      const finalRole = (role || 'patient').toLowerCase();
      const finalEmail = email || defaultRoleEmails[finalRole] || `${finalRole}@medisaarthi.health`;
      const finalPassword = password || 'password123';
      const finalName = name || (finalRole === 'doctor' ? 'Dr. Sharma' : undefined);

      const data = await authApi.login(finalEmail, finalPassword, finalRole.toUpperCase(), finalName);
      if (!data?.token || !data?.user) {
        return { success: false, error: 'Login failed. Invalid response from server.' };
      }

      persistToken(data.token, data.refreshToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('[Auth Error]', err.message);
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    }
  }, []);

  /**
   * Register a new user account.
   * Returns { success, error }
   */
  const signup = useCallback(async ({ name, email, password, role, phone, age, gender, preferredLanguage }) => {
    try {
      const data = await authApi.register({ name, email, password, role, phone, age, gender, preferredLanguage });
      if (!data?.token || !data?.user) {
        return { success: false, error: 'Registration failed. Invalid response from server.' };
      }

      persistToken(data.token, data.refreshToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }
  }, []);

  /**
   * Logout — clear tokens and reset state
   */
  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
