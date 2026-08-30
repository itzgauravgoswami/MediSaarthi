// Analytics Controller
const analyticsService = require('../services/analytics/analytics.service');
const { sendSuccess } = require('../utils/response');

class AnalyticsController {
  async getOverview(req, res, next) {
    try {
      const data = await analyticsService.getOverviewMetrics();
      return res.status(200).json(data); // Direct compatibility with frontend adminApi.getAnalytics
    } catch (err) {
      next(err);
    }
  }

  async getDoctorAnalytics(req, res, next) {
    try {
      const doctorId = req.query.doctorId || req.user?.doctorId || null;
      const data = await analyticsService.getDoctorAnalytics(doctorId);
      return sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
