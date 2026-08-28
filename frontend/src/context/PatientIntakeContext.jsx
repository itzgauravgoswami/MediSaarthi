"use client";

import React, { createContext, useContext, useState } from 'react';

const initialIntakeState = {
  language: 'hi',
  consentGiven: false,
  chiefComplaint: '',
  activeSection: 'chief_complaint',
  answers: {
    onset: '',
    location: '',
    duration: '',
    severity: 5,
    radiation: '',
    aggravating: '',
    relieving: '',
    associated: ''
  },
  documents: [],
  redFlagsDetected: [],
  completedSections: []
};

const PatientIntakeContext = createContext({
  intakeState: initialIntakeState,
  setLanguage: () => {},
  setConsent: () => {},
  setChiefComplaint: () => {},
  updateAnswer: () => {},
  addDocument: () => {},
  resetIntake: () => {}
});

export function PatientIntakeProvider({ children }) {
  const [intakeState, setIntakeState] = useState(initialIntakeState);

  const setLanguage = (lang) => {
    setIntakeState(prev => ({ ...prev, language: lang }));
  };

  const setConsent = (granted) => {
    setIntakeState(prev => ({ ...prev, consentGiven: granted }));
  };

  const setChiefComplaint = (complaint) => {
    const isRedFlag = complaint.toLowerCase().includes('chest pain') || complaint.toLowerCase().includes('breathlessness');
    const redFlags = isRedFlag ? ['chest_pain_with_breathlessness'] : [];

    setIntakeState(prev => ({
      ...prev,
      chiefComplaint: complaint,
      redFlagsDetected: redFlags,
      activeSection: 'hpi'
    }));
  };

  const updateAnswer = (key, val) => {
    setIntakeState(prev => ({
      ...prev,
      answers: { ...prev.answers, [key]: val }
    }));
  };

  const addDocument = (doc) => {
    setIntakeState(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  const resetIntake = () => {
    setIntakeState(initialIntakeState);
  };

  return (
    <PatientIntakeContext.Provider value={{
      intakeState,
      setLanguage,
      setConsent,
      setChiefComplaint,
      updateAnswer,
      addDocument,
      resetIntake
    }}>
      {children}
    </PatientIntakeContext.Provider>
  );
}

export const usePatientIntake = () => useContext(PatientIntakeContext) || {
  intakeState: initialIntakeState,
  setLanguage: () => {},
  setConsent: () => {},
  setChiefComplaint: () => {},
  updateAnswer: () => {},
  addDocument: () => {},
  resetIntake: () => {}
};
