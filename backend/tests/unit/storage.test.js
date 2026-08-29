// Unit Test: Storage Providers (Cloudinary & Local)
const fs = require('fs');
const path = require('path');
const LocalStorageProvider = require('../../src/services/storage/localStorage.provider');
const CloudinaryStorageProvider = require('../../src/services/storage/cloudinaryStorage.provider');
const storageService = require('../../src/services/storage/storage.service');

async function runStorageTests() {
  console.log('🧪 Running Storage Provider Tests...');

  // Test 1: Local Storage Provider
  const localProvider = new LocalStorageProvider();
  const dummyFile = {
    originalname: 'test_prescription.jpg',
    filename: 'test-presc-123.jpg',
    mimetype: 'image/jpeg',
    size: 2048,
    path: path.join(__dirname, 'dummy_test.jpg')
  };

  fs.writeFileSync(dummyFile.path, 'DUMMY_IMAGE_BINARY_DATA');

  try {
    const uploadRes = await localProvider.uploadFile(dummyFile);

    if (!uploadRes.url.includes('test-presc-123.jpg') || uploadRes.provider !== 'local') {
      throw new Error('Test 1 Failed: Local storage upload URL invalid.');
    }
    console.log('  ✅ Test 1 Passed: Local storage provider successfully saved file and returned URL.');

    // Test Delete
    await localProvider.deleteFile(uploadRes.storageKey);
  } finally {
    if (fs.existsSync(dummyFile.path)) {
      fs.unlinkSync(dummyFile.path);
    }
  }

  // Test 2: Cloudinary Unconfigured Graceful Fallback
  const cloudinaryProvider = new CloudinaryStorageProvider();
  const health = await cloudinaryProvider.checkHealth();

  if (health.available && !process.env.CLOUDINARY_API_KEY) {
    throw new Error('Test 2 Failed: Unconfigured Cloudinary reported available.');
  }
  console.log('  ✅ Test 2 Passed: Cloudinary handles missing credentials gracefully with fallback.');

  // Test 3: StorageService Facade Provider Selection
  const activeProvider = storageService.getProvider();
  if (!activeProvider) {
    throw new Error('Test 3 Failed: StorageService did not return an active provider.');
  }
  console.log(`  ✅ Test 3 Passed: StorageService resolved active provider (${storageService.activeProviderName}).`);
}

module.exports = runStorageTests;
