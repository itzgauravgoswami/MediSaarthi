// Zod Schema Validation Middleware
const { ValidationError } = require('../utils/errors');
const { sanitizeObject } = require('../utils/sanitize');

/**
 * Validates req.body, req.query, or req.params against a Zod schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body'|'query'|'params'} source 
 */
function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = sanitizeObject(req[source]);
      const parsedData = schema.parse(dataToValidate);
      req[source] = parsedData; // Replace with sanitized & typed data
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return next(new ValidationError('Request validation failed', formattedErrors));
      }
      next(new ValidationError(err.message));
    }
  };
}

module.exports = {
  validateRequest
};
