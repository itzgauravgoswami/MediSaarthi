// Automated Test Suite Runner
const runRedFlagTests = require('./unit/redFlag.test');
const runFhirTests = require('./unit/fhir.test');
const runSecurityTests = require('./security/auth.test');
const runOcrTests = require('./unit/ocr.test');
const runSpeechTests = require('./unit/speech.test');
const runStorageTests = require('./unit/storage.test');

async function runAllTests() {
  console.log('================================================================');
  console.log('🩺 MediSaarthi Self-Hosted Clinical Engine Automated Test Suite');
  console.log('================================================================');

  try {
    runRedFlagTests();
    console.log('');
    runFhirTests();
    console.log('');
    runSecurityTests();
    console.log('');
    await runOcrTests();
    console.log('');
    await runSpeechTests();
    console.log('');
    await runStorageTests();
    console.log('');
    console.log('================================================================');
    console.log('🎉 ALL TESTS (OCR, SPEECH, STORAGE, FHIR, SECURITY) PASSED 100%!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error(`❌ TEST SUITE FAILED: ${err.message}`);
    process.exit(1);
  }
}

runAllTests();
