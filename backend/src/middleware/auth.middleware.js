// JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // In demo mode for hackathon, allow kiosk/header bypass if X-Kiosk-Id or Demo Header is passed
    if (config.demoMode && (req.headers['x-kiosk-id'] || req.headers['x-demo-user'])) {
      req.user = {
        id: req.headers['x-demo-user'] || 'demo-user-1',
        role: req.headers['x-demo-role'] || 'DOCTOR',
        name: 'Demo Clinical User',
        email: 'doctor.demo@medisaarthi.in'
      };
      return next();
    }
    return next(new AuthenticationError('Authentication token missing or invalid'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Authentication session expired. Please log in again.'));
    }
    return next(new AuthenticationError('Invalid authentication token'));
  }
}

// Optional Auth (attaches req.user if token present, does not fail if absent)
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch (e) {
    // Ignore invalid optional tokens
  }
  next();
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
