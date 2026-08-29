// Storage Provider Base Interface
class StorageAdapter {
  /**
   * Upload a file
   * @param {Object} file - Multer file object or file path
   * @param {Object} options - Upload options (folder, custom name, tags)
   * @returns {Promise<{ storageKey: string, url: string, provider: string, size: number, mimeType: string }>}
   */
  async uploadFile(file, options = {}) {
    throw new Error('uploadFile method must be implemented by concrete StorageProvider');
  }

  /**
   * Delete a file
   * @param {string} storageKey
   * @returns {Promise<boolean>}
   */
  async deleteFile(storageKey) {
    throw new Error('deleteFile method must be implemented by concrete StorageProvider');
  }

  /**
   * Get accessible URL
   * @param {string} storageKey
   * @returns {string}
   */
  getFileUrl(storageKey) {
    throw new Error('getFileUrl method must be implemented by concrete StorageProvider');
  }

  /**
   * Health/Availability check
   * @returns {Promise<{ available: boolean, status: string, error?: string }>}
   */
  async checkHealth() {
    return { available: true, status: 'operational' };
  }
}

module.exports = StorageAdapter;
