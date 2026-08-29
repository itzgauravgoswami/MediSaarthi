// Cloudinary Storage Provider
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const StorageAdapter = require('./storage.adapter');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class CloudinaryStorageProvider extends StorageAdapter {
  constructor() {
    super();
    this.configured = false;

    if (
      config.storage.cloudinary.cloudName &&
      config.storage.cloudinary.apiKey &&
      config.storage.cloudinary.apiSecret
    ) {
      cloudinary.config({
        cloud_name: config.storage.cloudinary.cloudName,
        api_key: config.storage.cloudinary.apiKey,
        api_secret: config.storage.cloudinary.apiSecret,
        secure: true
      });
      this.configured = true;
      logger.info('[CloudinaryStorageProvider] Initialized successfully with cloud_name=' + config.storage.cloudinary.cloudName);
    } else {
      logger.warn('[CloudinaryStorageProvider] Missing Cloudinary credentials. Will fallback to local storage or offline mock.');
    }
  }

  async uploadFile(file, options = {}) {
    if (!this.configured) {
      throw new Error('Cloudinary credentials not configured on server.');
    }

    try {
      const filePath = file.path;
      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error(`File path '${filePath}' does not exist on server for Cloudinary upload.`);
      }

      const folder = options.folder || config.storage.cloudinary.folder;
      const resourceType = file.mimetype?.startsWith('audio/') 
        ? 'video' // Cloudinary stores audio under resource_type 'video'
        : (file.mimetype === 'application/pdf' ? 'raw' : 'image');

      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      });

      return {
        storageKey: result.public_id,
        url: result.secure_url,
        provider: 'cloudinary',
        size: result.bytes || file.size,
        mimeType: file.mimetype,
        format: result.format
      };
    } catch (err) {
      logger.error(`[CloudinaryStorageProvider] Upload failed: ${err.message}`);
      throw err;
    }
  }

  async deleteFile(storageKey) {
    if (!this.configured) return false;
    try {
      const result = await cloudinary.uploader.destroy(storageKey);
      return result.result === 'ok';
    } catch (err) {
      logger.warn(`[CloudinaryStorageProvider] Delete error: ${err.message}`);
      return false;
    }
  }

  getFileUrl(storageKey) {
    if (!this.configured) return storageKey;
    return cloudinary.url(storageKey, { secure: true });
  }

  async checkHealth() {
    if (!this.configured) {
      return { available: false, status: 'unconfigured', error: 'Missing Cloudinary API keys' };
    }
    try {
      const ping = await cloudinary.api.ping();
      return { available: ping.status === 'ok', status: ping.status };
    } catch (err) {
      return { available: false, status: 'api_unreachable', error: err.message };
    }
  }
}

module.exports = CloudinaryStorageProvider;
