// Clinical Data Validation Safeguard Service
const { ValidationError } = require('../../utils/errors');

class ClinicalValidationService {
  validateSafetyBoundaries(clinicalData) {
    if (!clinicalData) {
      throw new ValidationError('Clinical data payload is empty.');
    }

    // Ensure pain severity score is constrained to 1-10
    if (clinicalData.historyOfPresentIllness?.severity) {
      const sev = Number(clinicalData.historyOfPresentIllness.severity);
      if (isNaN(sev) || sev < 1 || sev > 10) {
        clinicalData.historyOfPresentIllness.severity = 5;
      }
    }

    return true;
  }
}

module.exports = new ClinicalValidationService();
