// Standardized API Response Formatter

function sendSuccess(res, data = {}, message = 'Operation completed successfully', statusCode = 200, meta = null) {
  const responsePayload = {
    success: true,
    message,
    data
  };

  if (meta) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
}

function sendCreated(res, data = {}, message = 'Resource created successfully') {
  return sendSuccess(res, data, message, 201);
}

function sendPaginated(res, data = [], pagination = {}, message = 'Data retrieved successfully') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || data.length,
      pages: pagination.pages || Math.ceil((pagination.total || data.length) / (pagination.limit || 20))
    }
  });
}

function sendError(res, error, statusCode = 500) {
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const details = error.details || undefined;

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendError
};
