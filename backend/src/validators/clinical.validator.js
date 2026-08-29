// Document & Clinical Data Validators
const { z } = require('zod');
const { DOCUMENT_TYPES } = require('../constants/documentTypes');
const { CONSENT_PURPOSES, CONSENT_METHODS } = require('../constants/consentPurposes');

const uploadDocumentSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  type: z.enum(Object.values(DOCUMENT_TYPES)).optional().default(DOCUMENT_TYPES.PRESCRIPTION)
});

const verifyClinicalSummarySchema = z.object({
  doctorName: z.string().min(2, 'Doctor name is required'),
  changes: z.record(z.any()).optional(),
  changeReason: z.string().optional()
});

const createConsentSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  purpose: z.enum(Object.values(CONSENT_PURPOSES)),
  scope: z.array(z.string()).optional().default(['BASIC_INTAKE']),
  language: z.string().optional().default('hi-IN'),
  consentMethod: z.enum(Object.values(CONSENT_METHODS)).optional().default(CONSENT_METHODS.DIGITAL_TOUCH),
  consentText: z.string().min(10, 'Consent text is required')
});

module.exports = {
  uploadDocumentSchema,
  verifyClinicalSummarySchema,
  createConsentSchema
};
