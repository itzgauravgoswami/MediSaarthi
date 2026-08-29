// Custom Error Classes for MediSaarthi

class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', details = null) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden for this role or resource', details = null) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found', details = null) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists or conflict occurred', details = null) {
    super(message, 409, 'CONFLICT', details);
  }
}

class ExternalServiceError extends AppError {
  constructor(message = 'External integration service failure', details = null) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

class AIProcessingError extends AppError {
  constructor(message = 'AI inference or extraction failed safe validation', details = null) {
    super(message, 500, 'AI_PROCESSING_ERROR', details);
  }
}

class DocumentProcessingError extends AppError {
  constructor(message = 'Medical document processing failed', details = null) {
    super(message, 422, 'DOCUMENT_PROCESSING_ERROR', details);
  }
}

class ConsentRequiredError extends AppError {
  constructor(message = 'Active patient consent required for this clinical operation', details = null) {
    super(message, 403, 'CONSENT_REQUIRED', details);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ExternalServiceError,
  AIProcessingError,
  DocumentProcessingError,
  ConsentRequiredError
};
