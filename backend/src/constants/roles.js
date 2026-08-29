// User Roles and Permissions

const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  TRIAGE_STAFF: 'TRIAGE_STAFF',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  AYUSH_PRACTITIONER: 'AYUSH_PRACTITIONER'
};

const ROLE_PERMISSIONS = {
  [ROLES.PATIENT]: [
    'profile:read:own',
    'profile:update:own',
    'interview:create:own',
    'interview:read:own',
    'document:upload:own',
    'document:read:own',
    'consent:manage:own'
  ],
  [ROLES.DOCTOR]: [
    'patient:read',
    'clinical:read',
    'clinical:edit',
    'clinical:verify',
    'interview:read',
    'document:read',
    'redflag:read',
    'redflag:resolve',
    'ayush:read',
    'ayush:verify',
    'appointment:manage'
  ],
  [ROLES.TRIAGE_STAFF]: [
    'patient:read:triage',
    'redflag:read',
    'redflag:acknowledge',
    'redflag:escalate',
    'appointment:read',
    'kiosk:monitor'
  ],
  [ROLES.ADMIN]: [
    'user:manage',
    'kiosk:manage',
    'audit:read',
    'analytics:read',
    'system:configure'
  ]
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS
};
