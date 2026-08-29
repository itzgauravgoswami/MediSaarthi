// Clinical History & Summary Controller
const clinicalHistoryService = require('../services/clinical/clinicalHistory.service');
const clinicalSummaryService = require('../services/clinical/clinicalSummary.service');
const { sendSuccess } = require('../utils/response');

class ClinicalController {
  async getClinicalHistory(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const history = await clinicalHistoryService.getClinicalHistory(patientId);
      return sendSuccess(res, history);
    } catch (err) {
      next(err);
    }
  }

  async updateClinicalHistory(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const updated = await clinicalHistoryService.saveOrUpdateHistory(patientId, req.body);
      return sendSuccess(res, updated, 'Clinical history updated');
    } catch (err) {
      next(err);
    }
  }

  async verifyClinicalHistory(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const doctorName = req.body.doctorName || req.user?.name || 'Dr. Sharma';
      const verified = await clinicalHistoryService.verifyHistory(patientId, doctorName, req.body.changes);
      return sendSuccess(res, verified, 'Clinical record verified by clinician');
    } catch (err) {
      next(err);
    }
  }

  async generateSummary(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const summary = await clinicalSummaryService.compileSummaryForPatient(patientId);
      return sendSuccess(res, summary, 'Clinical summary synthesized');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ClinicalController();
