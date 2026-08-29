// Consent Controller
const consentService = require('../services/consent/consent.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class ConsentController {
  async recordConsent(req, res, next) {
    try {
      const consent = await consentService.recordConsent({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      return sendCreated(res, consent, 'Informed consent recorded successfully');
    } catch (err) {
      next(err);
    }
  }

  async getPatientConsents(req, res, next) {
    try {
      const patientId = req.params.patientId || req.query.patientId;
      const consents = await consentService.getPatientConsents(patientId);
      return sendSuccess(res, consents);
    } catch (err) {
      next(err);
    }
  }

  async revokeConsent(req, res, next) {
    try {
      const consentId = req.params.id;
      const patientId = req.body.patientId || req.user?.patientId;
      const revoked = await consentService.revokeConsent(consentId, patientId);
      return sendSuccess(res, revoked, 'Consent revoked');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConsentController();
