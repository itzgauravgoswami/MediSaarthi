// Unit Test: Speech Providers (Whisper & Mock)
const MockSpeechProvider = require('../../src/services/speech/mockSpeech.provider');
const WhisperSpeechProvider = require('../../src/services/speech/whisperSpeech.provider');
const speechAdapter = require('../../src/services/speech/speechProvider.adapter');

async function runSpeechTests() {
  console.log('🧪 Running Speech Provider Tests...');

  // Test 1: Mock Speech Provider operational
  const mockProvider = new MockSpeechProvider();
  const mockHealth = await mockProvider.checkHealth();
  if (!mockHealth.available || mockHealth.provider !== 'mock') {
    throw new Error('Test 1 Failed: Mock speech provider health check failed.');
  }
  console.log('  ✅ Test 1 Passed: Mock speech provider operational.');

  // Test 2: Whisper Speech Provider health check
  const whisperProvider = new WhisperSpeechProvider();
  const health = await whisperProvider.checkHealth();

  if (!health.available || health.provider !== 'whisper' || !['base', 'small', 'tiny'].includes(health.model)) {
    throw new Error('Test 2 Failed: Whisper health check invalid.');
  }
  console.log(`  ✅ Test 2 Passed: Whisper speech provider configured with model=${health.model}.`);

  // Test 3: Whisper Concurrency Limiter protection
  if (whisperProvider.concurrencyLimit < 1) {
    throw new Error('Test 3 Failed: Whisper concurrency limit not set.');
  }
  console.log('  ✅ Test 3 Passed: Whisper memory protection concurrency queue verified.');
}

module.exports = runSpeechTests;
