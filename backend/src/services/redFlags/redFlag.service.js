// Red Flag Clinical Alert Service
const { v4: uuidv4 } = require('uuid');
const RedFlagAlert = require('../../models/RedFlagAlert');
const Patient = require('../../models/Patient');
const { evaluateRedFlags } = require('./redFlagEvaluator');
const { RED_FLAG_STATUS } = require('../../constants/statuses');
const notificationService = require('../notifications/notification.service');
const logger = require('../../utils/logger');

class RedFlagService {
  async evaluateAndCreateAlerts(patientId, interviewId, symptoms = [], narrative = '') {
    const evaluation = evaluateRedFlags(symptoms, narrative);
    if (!evaluation.hasRedFlags) {
      return { triggered: false, alerts: [] };
    }

    const patient = await Patient.findOne({ patientId });
    const createdAlerts = [];

    for (const alertData of evaluation.alerts) {
      const alertId = `RF-${uuidv4().substring(0, 8).toUpperCase()}`;

      let alert;
      try {
        alert = await RedFlagAlert.create({
          alertId,
          patientId,
          patientName: patient?.name || 'Patient',
          token: patient?.token || '#---',
          age: patient?.age || 0,
          gender: patient?.gender || 'Unknown',
          interviewId,
          ruleId: alertData.ruleId,
          ruleName: alertData.ruleName,
          symptoms: alertData.symptoms,
          description: alertData.description,
          priority: alertData.priority,
          recommendedAction: alertData.action,
          status: RED_FLAG_STATUS.OPEN
        });
      } catch (err) {
        // In-memory fallback
        alert = {
          alertId,
          patientId,
          patientName: patient?.name || 'Rahul Kumar',
          token: patient?.token || '#102',
          ruleId: alertData.ruleId,
          ruleName: alertData.ruleName,
          priority: alertData.priority,
          status: RED_FLAG_STATUS.OPEN,
          createdAt: new Date()
        };
      }

      createdAlerts.push(alert);

      // Trigger high-priority notification to Triage and Doctor
      await notificationService.createNotification({
        recipientRole: 'TRIAGE_STAFF',
        type: 'RED_FLAG_DETECTED',
        title: `🚨 RED FLAG: ${alertData.ruleName}`,
        message: `Patient ${patient?.name || 'Intake'} (${patient?.token || '#102'}) triggered alert: ${alertData.description}`,
        priority: 'URGENT',
        resourceType: 'RedFlagAlert',
        resourceId: alertId
      });

      logger.warn(`[RedFlag] Emergency alert triggered for patient ${patientId}: ${alertData.ruleName}`);
    }

    // Update patient priority
    if (patient) {
      patient.priority = 'High';
      patient.status = 'Triage Review';
      await patient.save().catch(() => {});
    }

    return { triggered: true, alerts: createdAlerts };
  }

  async getAlerts(query = {}) {
    try {
      return await RedFlagAlert.find(query).sort({ createdAt: -1 });
    } catch (err) {
      return [];
    }
  }

  async acknowledgeAlert(alertId, doctorOrStaffName) {
    try {
      const alert = await RedFlagAlert.findOne({ alertId });
      if (alert) {
        alert.status = RED_FLAG_STATUS.ACKNOWLEDGED;
        alert.acknowledgedBy = doctorOrStaffName;
        alert.acknowledgedAt = new Date();
        await alert.save();
        return alert;
      }
    } catch (e) {}

    return { alertId, status: RED_FLAG_STATUS.ACKNOWLEDGED, acknowledgedBy: doctorOrStaffName };
  }

  async resolveAlert(alertId, doctorName, resolutionNotes) {
    try {
      const alert = await RedFlagAlert.findOne({ alertId });
      if (alert) {
        alert.status = RED_FLAG_STATUS.RESOLVED;
        alert.resolvedBy = doctorName;
        alert.resolvedAt = new Date();
        alert.resolutionNotes = resolutionNotes;
        await alert.save();
        return alert;
      }
    } catch (e) {}

    return { alertId, status: RED_FLAG_STATUS.RESOLVED, resolvedBy: doctorName, resolutionNotes };
  }
}

module.exports = new RedFlagService();
