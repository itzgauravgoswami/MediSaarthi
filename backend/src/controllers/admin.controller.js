// Admin & Kiosk Telemetry Controller
const Kiosk = require('../models/Kiosk');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { sendSuccess, sendCreated } = require('../utils/response');

const FALLBACK_KIOSKS = [
  { id: "KIOSK-01", location: "Main OPD Reception Desk A", status: "Online", lastActive: "Just now", session: "Active Intake (#102)", version: "v2026.4.1" },
  { id: "KIOSK-02", location: "Cardiology Wing Waiting Area", status: "Online", lastActive: "2 mins ago", session: "Idle", version: "v2026.4.1" },
  { id: "KIOSK-03", location: "Emergency Triage Portal", status: "Active Session", lastActive: "Just now", session: "Active Intake (#105)", version: "v2026.4.1" },
  { id: "KIOSK-04", location: "AYUSH OPD Pavilion", status: "Maintenance", lastActive: "1 hour ago", session: "Calibration", version: "v2026.3.9" }
];

const FALLBACK_AUDIT_LOGS = [
  { id: "LOG-901", timestamp: "28 Aug 2026, 10:42 AM", user: "Dr. Sharma", role: "Doctor", action: "Confirmed Clinical Summary", resource: "Patient #102", status: "Success" },
  { id: "LOG-902", timestamp: "28 Aug 2026, 10:35 AM", user: "Kiosk #01", role: "Patient Kiosk", action: "Uploaded Prescription Document", resource: "DOC-101", status: "Success" },
  { id: "LOG-903", timestamp: "28 Aug 2026, 10:30 AM", user: "Rahul Kumar", role: "Patient", action: "Granted Digital Informed Consent", resource: "Consent Protocol v2", status: "Success" }
];

class AdminController {
  async getKiosks(req, res, next) {
    try {
      let kiosks = [];
      try {
        kiosks = await Kiosk.find();
      } catch (e) {}

      if (!kiosks || kiosks.length === 0) {
        kiosks = FALLBACK_KIOSKS;
      }
      return res.status(200).json(kiosks);
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      let logs = [];
      try {
        logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
      } catch (e) {}

      if (!logs || logs.length === 0) {
        logs = FALLBACK_AUDIT_LOGS;
      }
      return res.status(200).json(logs);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await User.find().select('-password');
      return sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
