// Clinical Interview & Response Validators
const { z } = require('zod');

const startInterviewSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  language: z.string().optional().default('hi-IN'),
  mode: z.enum(['VOICE', 'TOUCH', 'HYBRID']).optional().default('HYBRID'),
  kioskId: z.string().optional()
});

const interviewResponseSchema = z.object({
  patientResponse: z.string().min(1, 'Response text is required'),
  inputMode: z.enum(['VOICE', 'TOUCH', 'TEXT']).optional().default('TEXT'),
  language: z.string().optional().default('hi-IN')
});

module.exports = {
  startInterviewSchema,
  interviewResponseSchema
};
