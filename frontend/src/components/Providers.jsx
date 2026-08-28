"use client";

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { PatientIntakeProvider } from '@/context/PatientIntakeContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PatientIntakeProvider>
            {children}
          </PatientIntakeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
