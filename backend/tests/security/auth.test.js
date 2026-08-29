// Security Test: Auth, Consent Hash, and Sanitization
const { computeHash } = require('../../src/utils/encryption');
const { sanitizeObject } = require('../../src/utils/sanitize');

function runSecurityTests() {
  console.log('🧪 Running Security & Cryptographic Integrity Tests...');

  // Test 1: Consent Text SHA-256 integrity
  const text1 = "Informed consent for digital triage";
  const hash1 = computeHash(text1);
  const hash2 = computeHash(text1);
  const hashTampered = computeHash(text1 + " (tampered)");

  if (hash1 !== hash2 || hash1 === hashTampered) {
    throw new Error('Test 1 Failed: SHA-256 consent hash verification failed.');
  }
  console.log('  ✅ Test 1 Passed: Consent SHA-256 tamper-evident integrity verified.');

  // Test 2: NoSQL Injection operator sanitization
  const maliciousInput = {
    email: 'patient@example.com',
    $where: 'this.password.length > 0',
    'nested.key': 'val',
    safeField: 'valid'
  };

  const sanitized = sanitizeObject(maliciousInput);
  if (sanitized.$where || sanitized['nested.key']) {
    throw new Error('Test 2 Failed: NoSQL query operators were not stripped.');
  }
  console.log('  ✅ Test 2 Passed: Prohibited MongoDB query operators sanitized successfully.');
}

module.exports = runSecurityTests;
