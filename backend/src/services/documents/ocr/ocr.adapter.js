// OCR Provider Base Interface
class OcrAdapter {
  /**
   * Process an image/document and extract text
   * @param {string} filePath - Absolute or relative path to file on disk
   * @param {string} mimeType - File MIME type
   * @returns {Promise<{ rawText: string, confidence: number | null, provider: string, extractedPages: number }>}
   */
  async processDocumentImage(filePath, mimeType) {
    throw new Error('processDocumentImage method must be implemented by concrete OCR provider');
  }

  /**
   * Health/Availability check
   * @returns {Promise<{ available: boolean, provider: string, status: string, error?: string }>}
   */
  async checkHealth() {
    return { available: true, provider: 'base', status: 'operational' };
  }
}

module.exports = OcrAdapter;
