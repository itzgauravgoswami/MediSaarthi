// Auth Zod Validators
const { z } = require('zod');
const { ROLES } = require('../constants/roles');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(Object.values(ROLES)).optional().default(ROLES.PATIENT),
  phone: z.string().optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  preferredLanguage: z.string().optional().default('hi-IN')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required')
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema
};
