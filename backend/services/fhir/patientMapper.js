// FHIR R4 Mapper for Interoperability

function toFHIRPatient(patient) {
  return {
    resourceType: "Patient",
    id: patient.id,
    identifier: [
      {
        system: "https://abdm.gov.in/abha",
        value: patient.abhaId
      }
    ],
    name: [
      {
        use: "official",
        text: patient.name
      }
    ],
    gender: patient.gender.toLowerCase(),
    telecom: [
      {
        system: "phone",
        value: patient.phone
      }
    ]
  };
}

function toFHIRObservation(patient, testName, value, unit) {
  return {
    resourceType: "Observation",
    status: "final",
    subject: {
      reference: `Patient/${patient.id}`
    },
    code: {
      text: testName
    },
    valueQuantity: {
      value: parseFloat(value),
      unit: unit
    }
  };
}

module.exports = {
  toFHIRPatient,
  toFHIRObservation
};
