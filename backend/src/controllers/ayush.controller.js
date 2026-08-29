// AYUSH Controller
const ayushService = require('../services/ayush/ayush.service');
const { sendSuccess } = require('../utils/response');

class AyushController {
  async getAssessment(req, res, next) {
    try {
      const patientId = req.params.id || req.params.patientId || 'P102';
      const assessment = await ayushService.getAssessment(patientId);
      return res.status(200).json(assessment); // Direct compatibility with frontend ayushApi
    } catch (err) {
      next(err);
    }
  }

  async saveAssessment(req, res, next) {
    try {
      const patientId = req.params.id || req.body.patientId;
      const saved = await ayushService.saveAssessment(patientId, req.body);
      return sendSuccess(res, saved, 'AYUSH assessment recorded');
    } catch (err) {
      next(err);
    }
  }

  async verifyAssessment(req, res, next) {
    try {
      const patientId = req.params.id;
      const practitioner = req.user?.name || req.body.practitionerName || 'Vaidya Sharma';
      const verified = await ayushService.verifyAssessment(patientId, practitioner);
      return sendSuccess(res, verified, 'AYUSH assessment verified');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AyushController();
