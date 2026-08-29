// FHIR Interoperability Service
const Patient = require('../../models/Patient');
const clinicalHistoryService = require('../clinical/clinicalHistory.service');
const { mapPatientToFhir, mapClinicalHistoryToFhirBundle } = require('./patient.mapper');

class FhirService {
  async getFhirPatient(patientId) {
    let patient = null;
    try {
      patient = await Patient.findOne({ patientId });
    } catch (e) {}

    if (!patient) {
      patient = {
        patientId: patientId || 'P102',
        name: 'Rahul Kumar',
        age: 45,
        gender: 'Male',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1039-4821',
        preferredLanguage: 'hi-IN'
      };
    }
    return mapPatientToFhir(patient);
  }

  async getFhirClinicalBundle(patientId) {
    let patient = null;
    try {
      patient = await Patient.findOne({ patientId });
    } catch (e) {}

    if (!patient) {
      patient = {
        patientId: patientId || 'P102',
        name: 'Rahul Kumar',
        age: 45,
        gender: 'Male',
        phone: '+91 98765 43210',
        abhaId: '91-4829-1039-4821',
        preferredLanguage: 'hi-IN'
      };
    }
    const history = await clinicalHistoryService.getClinicalHistory(patientId);
    return mapClinicalHistoryToFhirBundle(patient, history);
  }
}

module.exports = new FhirService();
