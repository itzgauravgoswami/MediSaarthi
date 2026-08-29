// Consent Enforcement Middleware
const { ConsentRequiredError } = require('../utils/errors');
const consentService = require('../services/consent/consent.service');

/**
 * Ensures patient has given active consent for a specific clinical purpose before proceeding
 * @param {string} requiredPurpose 
 */
function requireConsent(requiredPurpose) {
  return async (req, res, next) => {
    try {
      const patientId = req.params.patientId || req.params.id || req.body.patientId || req.user?.patientId;

      if (!patientId) {
        // Skip if not tied to a specific patient endpoint
        return next();
      }

      const hasConsent = await consentService.hasActiveConsent(patientId, requiredPurpose);
      if (!hasConsent) {
        return next(new ConsentRequiredError(`Active patient consent required for purpose: ${requiredPurpose}`));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireConsent
};
