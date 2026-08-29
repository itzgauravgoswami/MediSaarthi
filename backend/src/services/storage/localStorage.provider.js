// Local Disk Storage Provider
const fs = require('fs');
const path = require('path');
const StorageAdapter = require('./storage.adapter');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class LocalStorageProvider extends StorageAdapter {
  constructor() {
    super();
    this.uploadDir = config.storage.dir;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file, options = {}) {
    try {
      const filename = file.filename || path.basename(file.path);
      const destinationPath = path.join(this.uploadDir, filename);

      // If file was uploaded to temp dir, ensure it's in uploadDir
      if (file.path && file.path !== destinationPath && fs.existsSync(file.path)) {
        fs.copyFileSync(file.path, destinationPath);
      }

      const relativeUrl = `/uploads/${filename}`;

      return {
        storageKey: filename,
        url: relativeUrl,
        provider: 'local',
        size: file.size || (fs.existsSync(destinationPath) ? fs.statSync(destinationPath).size : 0),
        mimeType: file.mimetype || 'application/octet-stream'
      };
    } catch (err) {
      logger.error(`[LocalStorageProvider] Upload error: ${err.message}`);
      throw err;
    }
  }

  async deleteFile(storageKey) {
    try {
      const filePath = path.join(this.uploadDir, path.basename(storageKey));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (err) {
      logger.warn(`[LocalStorageProvider] Delete warning: ${err.message}`);
      return false;
    }
  }

  getFileUrl(storageKey) {
    return `/uploads/${path.basename(storageKey)}`;
  }

  async checkHealth() {
    try {
      const isWritable = fs.existsSync(this.uploadDir);
      return {
        available: isWritable,
        status: isWritable ? 'operational' : 'directory_missing',
        dir: this.uploadDir
      };
    } catch (err) {
      return { available: false, status: 'error', error: err.message };
    }
  }
}

module.exports = LocalStorageProvider;
