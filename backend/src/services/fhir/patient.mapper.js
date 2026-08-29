// FHIR R4 Resource Mappers

function mapPatientToFhir(patient) {
  return {
    resourceType: 'Patient',
    id: patient.patientId || patient.id || 'P102',
    identifier: [
      {
        system: 'https://healthid.ndhm.gov.in',
        value: patient.abhaId || '91-4829-1039-4821',
        type: { text: 'ABHA ID' }
      },
      {
        system: 'https://medisaarthi.in/patient-token',
        value: patient.token || '#102'
      }
    ],
    name: [
      {
        use: 'official',
        text: patient.name || 'Rahul Kumar'
      }
    ],
    telecom: [
      {
        system: 'phone',
        value: patient.phone || '+91 98765 43210',
        use: 'mobile'
      }
    ],
    gender: (patient.gender || 'male').toLowerCase(),
    birthDate: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '1981-01-01',
    communication: [
      {
        language: {
          coding: [
            {
              system: 'urn:ietf:bcp:47',
              code: patient.preferredLanguage || 'hi-IN',
              display: 'Hindi'
            }
          ]
        },
        preferred: true
      }
    ]
  };
}

function mapClinicalHistoryToFhirBundle(patient, clinicalHistory = {}) {
  const fhirPatient = mapPatientToFhir(patient);
  const bundleEntries = [
    { resource: fhirPatient }
  ];

  // Map Condition / Chief Complaint
  if (clinicalHistory.chiefComplaint && clinicalHistory.chiefComplaint.length > 0) {
    bundleEntries.push({
      resource: {
        resourceType: 'Condition',
        id: `cond-${patient.patientId || 'P102'}`,
        subject: { reference: `Patient/${fhirPatient.id}` },
        code: {
          text: clinicalHistory.chiefComplaint.join(', ')
        },
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
        },
        onsetDateTime: new Date().toISOString()
      }
    });
  }

  // Map Medication Statements
  if (clinicalHistory.medications && clinicalHistory.medications.length > 0) {
    clinicalHistory.medications.forEach((med, idx) => {
      bundleEntries.push({
        resource: {
          resourceType: 'MedicationStatement',
          id: `med-${idx + 1}`,
          subject: { reference: `Patient/${fhirPatient.id}` },
          status: 'active',
          medicationCodeableConcept: {
            text: `${med.name} ${med.dosage || ''}`.trim()
          },
          dosage: [
            { text: med.frequency || 'Daily' }
          ]
        }
      });
    });
  }

  return {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: bundleEntries
  };
}

module.exports = {
  mapPatientToFhir,
  mapClinicalHistoryToFhirBundle
};
