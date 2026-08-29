// Patient Data Validators
const { z } = require('zod');

const createPatientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.number().int().min(0).max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
  preferredLanguage: z.string().optional().default('hi-IN'),
  abhaId: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional()
  }).optional(),
  demographics: z.object({
    address: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    occupation: z.string().optional()
  }).optional()
});

const updatePatientSchema = createPatientSchema.partial();

module.exports = {
  createPatientSchema,
  updatePatientSchema
};
