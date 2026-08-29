// Centralized Error Handling Middleware
const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

function errorHandler(err, req, res, next) {
  // Log structured error without leaking clinical PII or passwords
  logger.error({
    requestId: req.id,
    route: req.originalUrl,
    method: req.method,
    errorCode: err.code || 'INTERNAL_ERROR',
    errorMessage: err.message,
    statusCode: err.statusCode || 500
  }, `[Error] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const errorResponse = {
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An internal clinical system error occurred.',
    ...(err.details ? { details: err.details } : {})
  };

  // Stack trace only exposed in local development if debug is needed, never to client in production
  if (!isProduction && statusCode === 500 && err.stack) {
    errorResponse.stack = err.stack.split('\n').slice(0, 3);
  }

  return sendError(res, errorResponse, statusCode);
}

// 404 Route Not Found handler
function notFoundHandler(req, res, next) {
  return sendError(res, {
    code: 'ROUTE_NOT_FOUND',
    message: `API endpoint '${req.method} ${req.originalUrl}' does not exist.`
  }, 404);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
