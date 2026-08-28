// Deterministic Red-Flag Safety Screening Engine

const redFlagRules = [
  {
    ruleId: "chest_pain_with_breathlessness",
    conditions: ["chest pain", "breathlessness", "shortness of breath", "sweating"],
    priority: "High",
    alertText: "Potential acute coronary syndrome or cardiopulmonary distress detected. Priority clinical review required."
  },
  {
    ruleId: "sudden_neurological_symptoms",
    conditions: ["weakness", "slurred speech", "facial droop", "paralysis"],
    priority: "High",
    alertText: "Sudden onset neurological deficit detected. Immediate triage escalation required."
  }
];

function evaluateRedFlags(symptomsArray) {
  const text = symptomsArray.join(" ").toLowerCase();
  const triggered = [];

  for (const rule of redFlagRules) {
    const matches = rule.conditions.filter(c => text.includes(c));
    if (matches.length >= 1) {
      triggered.push({
        ruleId: rule.ruleId,
        priority: rule.priority,
        alertText: rule.alertText,
        matchedConditions: matches
      });
    }
  }

  return triggered;
}

module.exports = {
  redFlagRules,
  evaluateRedFlags
};
