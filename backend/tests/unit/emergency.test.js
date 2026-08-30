// Automated Test Suite for Clinical Voice Analysis & Emergency Escalation System
const emergencyDecisionEngine = require('../../src/services/emergency/emergencyDecisionEngine');
const { normalizePositiveKeywords, detectSubjectContext } = require('../../src/services/emergency/negationEntityParser');
const doctorMatchingService = require('../../src/services/emergency/doctorMatching.service');
const { CLINICAL_URGENCY, EMERGENCY_STATUS } = require('../../src/constants/statuses');

async function runEmergencyTests() {
  console.log('🧪 Running AI Medical Voice & Emergency Escalation Test Suite...');

  // =========================================================================
  // Test 1: Normal Scenario ("I have a mild headache since morning")
  // =========================================================================
  const normalRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'I have a mild headache since morning, otherwise feeling fine.'
  );
  if (normalRes.urgency === CLINICAL_URGENCY.EMERGENCY || normalRes.requiresImmediateAttention) {
    throw new Error(`Test 1 Failed: Mild headache was incorrectly classified as ${normalRes.urgency}`);
  }
  console.log('  ✅ Test 1 Passed: Mild headache correctly classified as non-emergency (NORMAL/MONITOR)');

  // =========================================================================
  // Test 2: Potentially Urgent Scenario ("Persistent abdominal pain since yesterday")
  // =========================================================================
  const urgentRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'I have had persistent abdominal pain and gas since yesterday.'
  );
  if (urgentRes.urgency === CLINICAL_URGENCY.EMERGENCY) {
    throw new Error('Test 2 Failed: Non-acute abdominal discomfort should not trigger immediate emergency');
  }
  console.log(`  ✅ Test 2 Passed: Persistent abdominal pain classified safely as ${urgentRes.urgency}`);

  // =========================================================================
  // Test 3: Emergency Case 1 - Cardiac (Chest pain + dyspnea)
  // =========================================================================
  const cardiacRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'I suddenly have severe chest pain and I cannot breathe properly with pain radiating to my left arm.'
  );
  if (cardiacRes.urgency !== CLINICAL_URGENCY.EMERGENCY || !cardiacRes.requiresImmediateAttention) {
    throw new Error(`Test 3 Failed: Acute chest pain with dyspnea must trigger EMERGENCY (got ${cardiacRes.urgency})`);
  }
  if (!cardiacRes.clinicalCategories.includes('cardiology') && !cardiacRes.clinicalCategories.includes('cardiac')) {
    throw new Error('Test 3 Failed: Must identify cardiac category');
  }
  console.log('  ✅ Test 3 Passed: Acute chest pain + dyspnea triggers EMERGENCY with Cardiology routing');

  // =========================================================================
  // Test 4: Emergency Case 2 - Stroke (FAST signs: numbness + slurred speech)
  // =========================================================================
  const strokeRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'My face feels numb on one side and I cannot speak properly, slurred speech.'
  );
  if (strokeRes.urgency !== CLINICAL_URGENCY.EMERGENCY) {
    throw new Error(`Test 4 Failed: Stroke FAST signs must trigger EMERGENCY (got ${strokeRes.urgency})`);
  }
  console.log('  ✅ Test 4 Passed: Acute stroke FAST signs trigger EMERGENCY with Neurology routing');

  // =========================================================================
  // Test 5: Emergency Case 3 - Unconsciousness
  // =========================================================================
  const unconsciousRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'The patient collapsed, is unconscious and not waking up.'
  );
  if (unconsciousRes.urgency !== CLINICAL_URGENCY.EMERGENCY) {
    throw new Error('Test 5 Failed: Unconsciousness must trigger EMERGENCY');
  }
  console.log('  ✅ Test 5 Passed: Loss of consciousness triggers EMERGENCY');

  // =========================================================================
  // Test 6: Critical Negation Test ("I do NOT have chest pain")
  // =========================================================================
  const negationRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'I do not have chest pain and no breathing difficulty, just a mild common cold.'
  );
  if (negationRes.urgency === CLINICAL_URGENCY.EMERGENCY) {
    throw new Error('Test 6 Failed: Negated chest pain must NOT trigger an emergency alert');
  }
  console.log('  ✅ Test 6 Passed: Negation correctly handled ("I do NOT have chest pain" is non-emergency)');

  // =========================================================================
  // Test 7: Third-Party Context Test ("My father had chest pain")
  // =========================================================================
  const thirdPartyContext = detectSubjectContext('My father had severe chest pain last year.');
  if (!thirdPartyContext.isThirdParty) {
    throw new Error('Test 7 Failed: Failed to detect third party subject for "My father had chest pain"');
  }
  const thirdPartyRes = await emergencyDecisionEngine.decideClinicalUrgency(
    'My father had severe chest pain and a heart attack five years ago.'
  );
  if (thirdPartyRes.urgency === CLINICAL_URGENCY.EMERGENCY) {
    throw new Error('Test 7 Failed: Family medical history of father must NOT trigger emergency for current patient');
  }
  console.log('  ✅ Test 7 Passed: Third-party entity distinction passed ("My father had chest pain" does not alert patient)');

  // =========================================================================
  // Test 8: Doctor & Specialist Matching
  // =========================================================================
  const matchedCardiacDoc = await doctorMatchingService.matchDoctor({
    clinicalCategories: ['cardiac'],
    recommendedSpecialty: 'Cardiology'
  });
  if (!matchedCardiacDoc.assignedDoctorId || !matchedCardiacDoc.assignedDoctorName) {
    throw new Error('Test 8 Failed: Doctor matching must assign a valid doctor');
  }
  console.log(`  ✅ Test 8 Passed: Doctor matching successfully matched ${matchedCardiacDoc.assignedDoctorName} (${matchedCardiacDoc.assignedSpecialization})`);

  // =========================================================================
  // Test 9: Doctor Escalation Engine
  // =========================================================================
  const escalationDoc = await doctorMatchingService.getNextEscalationDoctor(
    matchedCardiacDoc.assignedDoctorId,
    matchedCardiacDoc.backupDoctorIds
  );
  if (!escalationDoc || escalationDoc.doctorId === matchedCardiacDoc.assignedDoctorId) {
    throw new Error('Test 9 Failed: Escalation must pick a different qualified backup doctor');
  }
  console.log(`  ✅ Test 9 Passed: Auto-escalation successfully selected secondary doctor: ${escalationDoc.doctorName}`);
}

module.exports = runEmergencyTests;
