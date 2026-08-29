// Medical Timeline Controller
const timelineService = require('../services/timeline/timeline.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class TimelineController {
  async getTimeline(req, res, next) {
    try {
      const patientId = req.params.patientId || req.params.id;
      const events = await timelineService.getPatientTimeline(patientId);
      return sendSuccess(res, events);
    } catch (err) {
      next(err);
    }
  }

  async createEvent(req, res, next) {
    try {
      const event = await timelineService.recordEvent(req.body);
      return sendCreated(res, event, 'Timeline event recorded');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TimelineController();
