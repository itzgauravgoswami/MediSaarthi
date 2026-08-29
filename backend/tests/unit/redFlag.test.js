// Unit Test: Red Flag Clinical Rule Engine
const { evaluateRedFlags, normalizeSymptomKeywords } = require('../../src/services/redFlags/redFlagEvaluator');

function runRedFlagTests() {
  console.log('🧪 Running Red Flag Clinical Rule Tests...');

  // Test 1: Combined Chest Pain + Breathlessness triggers Alert
  const res1 = evaluateRedFlags(['chest_pain'], 'Patient has shortness of breath and chest tightness.');
  if (!res1.hasRedFlags || res1.alerts[0].ruleId !== 'RF_CHEST_001') {
    throw new Error('Test 1 Failed: Chest pain + breathlessness must trigger RF_CHEST_001');
  }
  console.log('  ✅ Test 1 Passed: Chest pain + breathlessness correctly triggers RF_CHEST_001');

  // Test 2: Isolated mild headache should NOT trigger cardiac red flag
  const res2 = evaluateRedFlags([], 'Patient reports mild headache for 1 day.');
  if (res2.hasRedFlags) {
    throw new Error('Test 2 Failed: Mild headache should not trigger emergency alert');
  }
  console.log('  ✅ Test 2 Passed: Isolated non-critical symptoms do not trigger emergency alert');

  // Test 3: Stroke FAST signs trigger immediate priority
  const res3 = evaluateRedFlags([], 'Patient has sudden slurred speech and facial weakness.');
  if (!res3.hasRedFlags || res3.alerts[0].ruleId !== 'RF_STROKE_002') {
    throw new Error('Test 3 Failed: Slurred speech must trigger stroke alert');
  }
  console.log('  ✅ Test 3 Passed: Acute neurological signs trigger stroke protocol');
}

module.exports = runRedFlagTests;
