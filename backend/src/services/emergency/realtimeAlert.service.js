// Real-Time Server-Sent Events (SSE) Alert & Auto-Escalation Service
const EventEmitter = require('events');
const EmergencyEvent = require('../../models/EmergencyEvent');
const EmergencyNotification = require('../../models/EmergencyNotification');
const Doctor = require('../../models/Doctor');
const AuditLog = require('../../models/AuditLog');
const doctorMatchingService = require('./doctorMatching.service');
const { EMERGENCY_STATUS, NOTIFICATION_DELIVERY_STATUS } = require('../../constants/statuses');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class RealtimeAlertService extends EventEmitter {
  constructor() {
    super();
    // Map of active SSE client connections: clientId -> { res, role, userId, lastPing }
    this.clients = new Map();
    // Map of active escalation timeouts: eventId -> NodeJS.Timeout
    this.escalationTimers = new Map();
    
    // Heartbeat ping interval to keep HTTP SSE streams alive
    setInterval(() => this.sendHeartbeat(), 15000);
  }

  /**
   * Registers a new SSE HTTP response stream for real-time doctor and patient updates
   */
  registerClient(clientId, res, { role = 'DOCTOR', userId = null, patientId = null }) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    const clientInfo = {
      clientId,
      res,
      role: role.toUpperCase(),
      userId,
      patientId,
      connectedAt: new Date()
    };

    this.clients.set(clientId, clientInfo);
    logger.info(`[SSE Alert Stream] Client connected: ${clientId} (${role} - ${userId || patientId || 'anon'}). Total active: ${this.clients.size}`);

    // Send initial connection greeting
    this.sendEventToClient(res, 'connected', {
      clientId,
      message: 'Real-time Clinical Emergency Alert Stream Connected',
      timestamp: new Date().toISOString()
    });

    res.on('close', () => {
      this.clients.delete(clientId);
      logger.info(`[SSE Alert Stream] Client disconnected: ${clientId}. Total remaining: ${this.clients.size}`);
    });
  }

  sendEventToClient(res, eventName, data) {
    try {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      logger.warn(`[SSE Alert Stream] Write failed: ${err.message}`);
    }
  }

  sendHeartbeat() {
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.res.write(`: heartbeat ${Date.now()}\n\n`);
      } catch (e) {
        this.clients.delete(clientId);
      }
    }
  }

  /**
   * Dispatches emergency alert to doctor dashboard and schedules escalation timer
   */
  async broadcastEmergencyAlert(emergencyEvent) {
    if (!emergencyEvent) return;

    const payload = {
      eventId: emergencyEvent.eventId,
      patientId: emergencyEvent.patientId,
      patientName: emergencyEvent.patientName,
      patientToken: emergencyEvent.patientToken,
      patientAge: emergencyEvent.patientAge,
      patientGender: emergencyEvent.patientGender,
      severity: emergencyEvent.severity,
      status: emergencyEvent.status,
      symptoms: emergencyEvent.symptoms,
      riskIndicators: emergencyEvent.riskIndicators,
      recommendedSpecialty: emergencyEvent.recommendedSpecialty,
      assignedDoctorId: emergencyEvent.assignedDoctorId,
      assignedDoctorName: emergencyEvent.assignedDoctorName,
      detectedAt: emergencyEvent.detectedAt,
      type: 'EMERGENCY_ALERT'
    };

    let deliveredCount = 0;

    // Send to connected doctor dashboards (all doctors or matching assigned doctor)
    for (const [_, client] of this.clients.entries()) {
      if (client.role === 'DOCTOR' || client.role === 'ADMIN') {
        this.sendEventToClient(client.res, 'emergency_alert', payload);
        deliveredCount++;
      }
    }

    // Record notification in DB
    try {
      if (emergencyEvent.assignedDoctorId) {
        await EmergencyNotification.create({
          notificationId: `NOTIF-${Date.now().toString(36).toUpperCase()}`,
          emergencyEventId: emergencyEvent.eventId,
          doctorId: emergencyEvent.assignedDoctorId,
          doctorName: emergencyEvent.assignedDoctorName,
          channel: 'SSE',
          status: deliveredCount > 0 ? NOTIFICATION_DELIVERY_STATUS.DELIVERED : NOTIFICATION_DELIVERY_STATUS.PENDING,
          deliveredAt: deliveredCount > 0 ? new Date() : null
        });
      }
    } catch (err) {
      logger.warn(`[SSE Alert] Could not save notification record: ${err.message}`);
    }

    // Schedule automated escalation timeout
    this.scheduleEscalation(emergencyEvent.eventId);
  }

  /**
   * Broadcasts status updates (e.g. Acknowledged, In Progress, Resolved) to doctors and patients
   */
  broadcastStatusUpdate(emergencyEvent) {
    if (!emergencyEvent) return;

    const payload = {
      eventId: emergencyEvent.eventId,
      patientId: emergencyEvent.patientId,
      patientName: emergencyEvent.patientName,
      patientToken: emergencyEvent.patientToken,
      severity: emergencyEvent.severity,
      status: emergencyEvent.status,
      assignedDoctorId: emergencyEvent.assignedDoctorId,
      assignedDoctorName: emergencyEvent.assignedDoctorName,
      acknowledgedBy: emergencyEvent.acknowledgedBy,
      acknowledgedAt: emergencyEvent.acknowledgedAt,
      resolvedAt: emergencyEvent.resolvedAt,
      type: 'EMERGENCY_STATUS_UPDATE'
    };

    for (const [_, client] of this.clients.entries()) {
      // Send to doctors
      if (client.role === 'DOCTOR' || client.role === 'ADMIN') {
        this.sendEventToClient(client.res, 'emergency_status_update', payload);
      }
      // Send to the specific patient
      if (client.role === 'PATIENT' && (client.patientId === emergencyEvent.patientId || !client.patientId)) {
        this.sendEventToClient(client.res, 'patient_emergency_update', {
          eventId: emergencyEvent.eventId,
          status: emergencyEvent.status,
          assignedDoctorName: emergencyEvent.assignedDoctorName,
          acknowledgedBy: emergencyEvent.acknowledgedBy,
          message: emergencyEvent.status === EMERGENCY_STATUS.ACKNOWLEDGED
            ? `Your alert has been acknowledged by ${emergencyEvent.acknowledgedBy || 'a medical professional'}.`
            : emergencyEvent.status === EMERGENCY_STATUS.RESOLVED
            ? 'Emergency consultation resolved.'
            : 'Emergency assistance request active.'
        });
      }
    }
  }

  /**
   * Starts a timer to auto-escalate if doctor does not acknowledge within timeout seconds
   */
  scheduleEscalation(eventId) {
    this.clearEscalationTimer(eventId);

    const timeoutSec = config.emergency?.ackTimeoutSeconds || 60;
    const timeoutMs = timeoutSec * 1000;

    const timer = setTimeout(async () => {
      await this.handleEscalationTimeout(eventId);
    }, timeoutMs);

    this.escalationTimers.set(eventId, timer);
  }

  clearEscalationTimer(eventId) {
    if (this.escalationTimers.has(eventId)) {
      clearTimeout(this.escalationTimers.get(eventId));
      this.escalationTimers.delete(eventId);
    }
  }

  /**
   * Triggers automated escalation to secondary doctor
   */
  async handleEscalationTimeout(eventId) {
    this.escalationTimers.delete(eventId);

    try {
      const event = await EmergencyEvent.findOne({ eventId });
      if (!event) return;

      // Only escalate if not yet acknowledged or resolved
      const eligibleStatuses = [EMERGENCY_STATUS.DETECTED, EMERGENCY_STATUS.ALERTING, EMERGENCY_STATUS.NOTIFIED];
      if (!eligibleStatuses.includes(event.status)) {
        return;
      }

      logger.warn(`[AutoEscalation] Emergency ${eventId} was not acknowledged within timeout. Escalating...`);

      const nextDoc = await doctorMatchingService.getNextEscalationDoctor(
        event.assignedDoctorId,
        event.backupDoctorIds
      );

      const priorDoctorName = event.assignedDoctorName;
      if (nextDoc) {
        event.assignedDoctorId = nextDoc.doctorId;
        event.assignedDoctorName = nextDoc.doctorName;
        event.escalationLevel = (event.escalationLevel || 0) + 1;
        event.status = EMERGENCY_STATUS.ALERTING;
        event.auditTrail.push({
          action: 'EMERGENCY_AUTO_ESCALATED',
          timestamp: new Date(),
          actor: 'SYSTEM_ESCALATION_TIMER',
          details: `Unacknowledged by ${priorDoctorName}. Reassigned to ${nextDoc.doctorName} (Level ${event.escalationLevel}).`
        });
      } else {
        event.escalationLevel = (event.escalationLevel || 0) + 1;
        event.auditTrail.push({
          action: 'EMERGENCY_AUTO_ESCALATED',
          timestamp: new Date(),
          actor: 'SYSTEM_ESCALATION_TIMER',
          details: `Unacknowledged by ${priorDoctorName}. Broadcasted to entire on-call pool.`
        });
      }

      await event.save();

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
          actorId: 'SYSTEM',
          actorRole: 'SYSTEM',
          action: 'EMERGENCY_ESCALATED',
          resourceType: 'EmergencyEvent',
          resourceId: eventId,
          metadata: { escalationLevel: event.escalationLevel, newDoctor: event.assignedDoctorName }
        });
      } catch (e) {}

      // Re-broadcast alert with updated doctor
      await this.broadcastEmergencyAlert(event);
      this.broadcastStatusUpdate(event);
    } catch (err) {
      logger.error(`[AutoEscalation] Error during escalation for ${eventId}: ${err.message}`);
    }
  }
}

module.exports = new RealtimeAlertService();
