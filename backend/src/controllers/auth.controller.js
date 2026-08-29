// Auth Controller
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { hashPassword, comparePassword } = require('../utils/hashing');
const { sendSuccess, sendCreated, sendError } = require('../utils/response');
const { sanitizeUser } = require('../utils/sanitize');
const { AuthenticationError, ConflictError, NotFoundError } = require('../utils/errors');
const config = require('../config/env');
const AuditLog = require('../models/AuditLog');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role, phone, age, gender, preferredLanguage } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ConflictError('An account with this email address already exists.');
      }

      const hashedPassword = await hashPassword(password);
      const userId = `USR-${uuidv4().substring(0, 8).toUpperCase()}`;

      let patientId = null;
      let doctorId = null;

      if (role === 'PATIENT') {
        patientId = `P-${uuidv4().substring(0, 6).toUpperCase()}`;
        try {
          await Patient.create({
            patientId,
            name,
            age: age || 35,
            gender: gender || 'Male',
            phone: phone || '+91 98765 00000',
            email,
            preferredLanguage: preferredLanguage || 'hi-IN'
          });
        } catch (e) {}
      } else if (role === 'DOCTOR') {
        doctorId = `DOC-${uuidv4().substring(0, 6).toUpperCase()}`;
        try {
          await Doctor.create({
            doctorId,
            userId,
            name,
            registrationNumber: `REG-${Math.floor(10000 + Math.random() * 90000)}`,
            department: 'General Medicine'
          });
        } catch (e) {}
      }

      const user = await User.create({
        userId,
        name,
        email,
        password: hashedPassword,
        role: role || 'PATIENT',
        phone,
        patientId,
        doctorId
      });

      const token = jwt.sign(
        { id: user.userId, role: user.role, email: user.email, name: user.name, patientId, doctorId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { id: user.userId },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      return sendCreated(res, {
        user: sanitizeUser(user),
        token,
        refreshToken
      }, 'Account registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid email or password');
      }

      user.lastLogin = new Date();
      await user.save().catch(() => {});

      const token = jwt.sign(
        { id: user.userId, role: user.role, email: user.email, name: user.name, patientId: user.patientId, doctorId: user.doctorId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { id: user.userId },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      // Audit Log
      try {
        await AuditLog.create({
          auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
          actorId: user.userId,
          actorRole: user.role,
          actorName: user.name,
          action: 'LOGIN',
          resourceType: 'User',
          resourceId: user.userId,
          ipAddress: req.ip
        });
      } catch (e) {}

      return sendSuccess(res, {
        user: sanitizeUser(user),
        token,
        refreshToken
      }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AuthenticationError('Refresh token is required');

      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findOne({ userId: decoded.id });
      if (!user) throw new NotFoundError('User account not found');

      const token = jwt.sign(
        { id: user.userId, role: user.role, email: user.email, name: user.name, patientId: user.patientId, doctorId: user.doctorId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      return sendSuccess(res, { token }, 'Session refreshed');
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const user = await User.findOne({ userId: req.user.id });
      if (!user) {
        return sendSuccess(res, { user: req.user });
      }
      return sendSuccess(res, { user: sanitizeUser(user) });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    return sendSuccess(res, null, 'Logged out successfully');
  }
}

module.exports = new AuthController();
