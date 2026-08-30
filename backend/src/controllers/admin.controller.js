// Admin & Kiosk Telemetry Controller
const Kiosk = require('../models/Kiosk');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Document = require('../models/Document');
const { sendSuccess } = require('../utils/response');

class AdminController {
  async getKiosks(req, res, next) {
    try {
      const kiosks = await Kiosk.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: kiosks || [] });
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        AuditLog.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        data: logs || [],
        meta: { total, page, limit, pages: Math.ceil(total / limit) }
      });
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

  async getAdminStats(req, res, next) {
    try {
      const [
        totalPatients,
        totalKiosks,
        totalDocuments,
        verifiedPatients
      ] = await Promise.all([
        Patient.countDocuments(),
        Kiosk.countDocuments(),
        Document.countDocuments(),
        Patient.countDocuments({ isVerified: true })
      ]);

      const verificationRate = totalPatients > 0
        ? Math.round((verifiedPatients / totalPatients) * 100 * 10) / 10
        : 0;

      return res.status(200).json({
        success: true,
        data: {
          totalPatients,
          totalKiosks,
          totalDocuments,
          verifiedPatients,
          verificationRate: `${verificationRate}%`
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
