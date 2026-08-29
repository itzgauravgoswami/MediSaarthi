// Red Flag Evaluation Engine
const { RED_FLAG_RULES } = require('./redFlagRules');

/**
 * Normalizes patient and extracted symptoms to standardized rule codes
 */
function normalizeSymptomKeywords(symptoms = [], narrative = '') {
  const normalized = new Set();
  const text = `${symptoms.join(' ')} ${narrative}`.toLowerCase();

  if (text.includes('chest pain') || text.includes('सीने में दर्द') || text.includes('chest tightness')) {
    normalized.add('chest_pain');
  }
  if (text.includes('breath') || text.includes('dyspnea') || text.includes('सांस लेने में') || text.includes('shortness of breath')) {
    normalized.add('breathlessness');
  }
  if (text.includes('arm') || text.includes('बांह') || text.includes('left arm')) {
    normalized.add('arm_radiation');
  }
  if (text.includes('jaw') || text.includes('jabde') || text.includes('जबड़ा')) {
    normalized.add('jaw_radiation');
  }
  if (text.includes('sweat') || text.includes('पसीना') || text.includes('diaphoresis')) {
    normalized.add('diaphoresis');
  }
  if (text.includes('slur') || text.includes('bolne me') || text.includes('speech')) {
    normalized.add('slurred_speech');
  }
  if (text.includes('weakness') || text.includes('kamzori') || text.includes('droop')) {
    normalized.add('arm_weakness');
  }

  return Array.from(normalized);
}

/**
 * Evaluates extracted symptoms against deterministic rule set
 */
function evaluateRedFlags(symptoms = [], narrative = '') {
  const activeSymptoms = normalizeSymptomKeywords(symptoms, narrative);
  const matchedAlerts = [];

  for (const rule of RED_FLAG_RULES) {
    if (rule.id === 'RF_CHEST_001') {
      const hasChestPain = activeSymptoms.includes('chest_pain');
      const matchedCoFactors = rule.coFactors.filter(c => activeSymptoms.includes(c));

      if (hasChestPain && matchedCoFactors.length >= rule.minCoFactors) {
        matchedAlerts.push({
          ruleId: rule.id,
          ruleName: rule.name,
          symptoms: activeSymptoms,
          priority: rule.priority,
          description: rule.description,
          action: rule.action
        });
      }
    } else {
      const hasAnyRequired = rule.requiredSymptoms.some(s => activeSymptoms.includes(s));
      if (hasAnyRequired) {
        matchedAlerts.push({
          ruleId: rule.id,
          ruleName: rule.name,
          symptoms: activeSymptoms,
          priority: rule.priority,
          description: rule.description,
          action: rule.action
        });
      }
    }
  }

  return {
    hasRedFlags: matchedAlerts.length > 0,
    alerts: matchedAlerts
  };
}

module.exports = {
  normalizeSymptomKeywords,
  evaluateRedFlags
};
