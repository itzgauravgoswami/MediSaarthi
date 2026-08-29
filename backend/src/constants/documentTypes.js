// Medical Document Types

const DOCUMENT_TYPES = {
  PRESCRIPTION: 'PRESCRIPTION',
  LAB_REPORT: 'LAB_REPORT',
  DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
  IMAGING_REPORT: 'IMAGING_REPORT',
  VACCINATION_RECORD: 'VACCINATION_RECORD',
  AYUSH_RECORD: 'AYUSH_RECORD',
  OTHER: 'OTHER'
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json'
];

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

module.exports = {
  DOCUMENT_TYPES,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES
};
