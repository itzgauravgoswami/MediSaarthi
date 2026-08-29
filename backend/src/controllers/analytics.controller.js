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
}

module.exports = new AnalyticsController();
