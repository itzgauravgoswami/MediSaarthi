// Red Flag Triage Controller
const redFlagService = require('../services/redFlags/redFlag.service');
const { sendSuccess } = require('../utils/response');

class RedFlagController {
  async getAlerts(req, res, next) {
    try {
      const rawAlerts = await redFlagService.getAlerts();

      if (!rawAlerts || rawAlerts.length === 0) {
        return res.status(200).json([]);
      }

      const alerts = rawAlerts.map(a => {
        const doc = a.toObject ? a.toObject() : a;
        return {
          ...doc,
          id: doc._id || doc.alertId || doc.id,
          alertId: doc.alertId || doc.id,
          patientId: doc.patientId,
          patientName: doc.patientName || 'Unknown Patient',
          token: doc.token || '—',
          age: doc.age || null,
          gender: doc.gender || 'Unknown',
          detectedInfo: doc.detectedInfo || doc.description || doc.ruleName || 'Alert triggered',
          ruleTriggered: doc.ruleTriggered || doc.ruleId || doc.ruleName || 'rule_unknown',
          time: doc.time || (doc.createdAt
            ? new Date(doc.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : null),
          priority: doc.priority || 'High Priority',
          status: doc.status || 'OPEN'
        };
      });

      return res.status(200).json(alerts);
    } catch (err) {
      next(err);
    }
  }

  async acknowledgeAlert(req, res, next) {
    try {
      const alertId = req.params.id;
      const user = req.user?.name || req.body.staffName;
      if (!user) {
        return res.status(400).json({ success: false, message: 'staffName is required' });
      }
      const acknowledged = await redFlagService.acknowledgeAlert(alertId, user);
      return res.status(200).json({ success: true, message: 'Alert acknowledged', alert: acknowledged });
    } catch (err) {
      next(err);
    }
  }

  async resolveAlert(req, res, next) {
    try {
      const alertId = req.params.id;
      const user = req.user?.name || req.body.doctorName;
      if (!user) {
        return res.status(400).json({ success: false, message: 'doctorName is required' });
      }
      const resolved = await redFlagService.resolveAlert(alertId, user, req.body.notes);
      return sendSuccess(res, resolved, 'Alert resolved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RedFlagController();
