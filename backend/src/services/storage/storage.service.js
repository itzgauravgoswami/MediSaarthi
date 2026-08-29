// Unified Storage Service Facade
const LocalStorageProvider = require('./localStorage.provider');
const CloudinaryStorageProvider = require('./cloudinaryStorage.provider');
const config = require('../../config/env');
const logger = require('../../utils/logger');

class StorageService {
  constructor() {
    this.localProvider = new LocalStorageProvider();
    this.cloudinaryProvider = new CloudinaryStorageProvider();
    this.activeProviderName = config.storage.provider;
  }

  getProvider() {
    if (this.activeProviderName === 'cloudinary') {
      if (this.cloudinaryProvider.configured) {
        return this.cloudinaryProvider;
      }
      logger.warn('[StorageService] Cloudinary requested but not fully configured. Using LocalStorage fallback.');
      return this.localProvider;
    }
    return this.localProvider;
  }

  async uploadFile(file, options = {}) {
    const provider = this.getProvider();
    try {
      return await provider.uploadFile(file, options);
    } catch (err) {
      if (provider !== this.localProvider) {
        logger.warn(`[StorageService] Primary upload failed (${err.message}). Falling back to local disk storage.`);
        return await this.localProvider.uploadFile(file, options);
      }
      throw err;
    }
  }

  async deleteFile(storageKey, providerName = null) {
    if (providerName === 'cloudinary' || (!providerName && this.activeProviderName === 'cloudinary')) {
      return await this.cloudinaryProvider.deleteFile(storageKey);
    }
    return await this.localProvider.deleteFile(storageKey);
  }

  getFileUrl(storageKey, providerName = null) {
    if (providerName === 'cloudinary' || (!providerName && this.activeProviderName === 'cloudinary')) {
      return this.cloudinaryProvider.getFileUrl(storageKey);
    }
    return this.localProvider.getFileUrl(storageKey);
  }

  async getHealthStatus() {
    const current = this.getProvider();
    const health = await current.checkHealth();
    return {
      activeProvider: this.activeProviderName,
      usingFallback: current === this.localProvider && this.activeProviderName === 'cloudinary',
      health
    };
  }
}

module.exports = new StorageService();
