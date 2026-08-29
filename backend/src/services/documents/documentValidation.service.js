// Document Security and MIME Validator
const path = require('path');
const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } = require('../../constants/documentTypes');
const { ValidationError } = require('../../utils/errors');

class DocumentValidationService {
  validateUploadedFile(file) {
    if (!file) {
      throw new ValidationError('No document file uploaded.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(`File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new ValidationError(`Disallowed file MIME type: ${file.mimetype}. Permitted types: PDF, JPEG, PNG, WEBP.`);
    }

    const safeExtension = path.extname(file.originalname).toLowerCase();
    const disallowedExtensions = ['.exe', '.sh', '.bat', '.js', '.vbs', '.php'];
    if (disallowedExtensions.includes(safeExtension)) {
      throw new ValidationError('Executable files are strictly prohibited.');
    }

    return true;
  }
}

module.exports = new DocumentValidationService();
