// Role-Based Access Control (RBAC) Middleware
const { AuthorizationError } = require('../utils/errors');
const { ROLES } = require('../constants/roles');

/**
 * Restricts route access to specified allowed roles
 * @param  {...string} allowedRoles 
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AuthorizationError('User role not identified. Authorization failed.'));
    }

    if (req.user.role === ROLES.SUPER_ADMIN || req.user.role === ROLES.ADMIN) {
      return next(); // Admins have elevated operational rights
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(`Access denied. Role '${req.user.role}' is not authorized for this operation.`));
    }

    next();
  };
}

/**
 * Resource ownership validator: prevents Patient A from viewing/editing Patient B's data
 */
function requirePatientOwnershipOrStaff(paramKey = 'id') {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('Authentication required'));
    }

    const requestedId = req.params[paramKey] || req.body.patientId;
    const isStaff = [ROLES.DOCTOR, ROLES.TRIAGE_STAFF, ROLES.ADMIN, ROLES.AYUSH_PRACTITIONER].includes(req.user.role);

    if (isStaff) {
      return next(); // Clinicians/Staff can access with proper clinical context
    }

    if (req.user.role === ROLES.PATIENT && (req.user.patientId === requestedId || req.user.id === requestedId)) {
      return next(); // Patient accessing their own record
    }

    return next(new AuthorizationError('Access Denied: You are not authorized to view or modify another patient\'s clinical record.'));
  };
}

module.exports = {
  authorizeRoles,
  requirePatientOwnershipOrStaff
};
