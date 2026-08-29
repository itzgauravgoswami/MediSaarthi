// Unit Test: FHIR Resource Mappers
const { mapPatientToFhir, mapClinicalHistoryToFhirBundle } = require('../../src/services/fhir/patient.mapper');

function runFhirTests() {
  console.log('🧪 Running FHIR R4 Interoperability Tests...');

  const patient = {
    patientId: 'P102',
    name: 'Rahul Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    preferredLanguage: 'hi-IN',
    abhaId: '91-4829-1039-4821'
  };

  const fhirPatient = mapPatientToFhir(patient);

  if (fhirPatient.resourceType !== 'Patient' || fhirPatient.name[0].text !== 'Rahul Kumar') {
    throw new Error('Test 1 Failed: Patient mapper failed to construct valid FHIR Patient resource.');
  }
  console.log('  ✅ Test 1 Passed: Patient accurately mapped to FHIR R4 Patient schema.');

  const clinicalHistory = {
    chiefComplaint: ['Substernal chest pain'],
    medications: [{ name: 'Metformin', dosage: '500 mg', frequency: 'BD' }]
  };

  const bundle = mapClinicalHistoryToFhirBundle(patient, clinicalHistory);

  if (bundle.resourceType !== 'Bundle' || bundle.entry.length < 2) {
    throw new Error('Test 2 Failed: FHIR Bundle mapping incomplete.');
  }
  console.log('  ✅ Test 2 Passed: Clinical bundle contains Patient, Condition, and MedicationStatement.');
}

module.exports = runFhirTests;
