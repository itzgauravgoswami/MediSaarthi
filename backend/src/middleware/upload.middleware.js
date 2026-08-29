// Multer Document & Voice Upload Middleware
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');
const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } = require('../constants/documentTypes');
const { ValidationError } = require('../utils/errors');

// Ensure upload directory exists
const uploadDir = config.storage.dir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

// File filter for safety
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Unsupported file format '${file.mimetype}'. Allowed: PDF, JPG, PNG, WEBP, Audio.`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter
});

module.exports = {
  uploadSingleDocument: upload.single('document'),
  uploadSingleAudio: upload.single('audio'),
  uploadMultipleDocuments: upload.array('documents', 5)
};
