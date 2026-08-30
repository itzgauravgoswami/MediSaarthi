// Deterministic Clinical Safety Rules
const { RED_FLAG_PRIORITY, CLINICAL_URGENCY } = require('../../constants/statuses');

const CLINICAL_EMERGENCY_RULES = [
  {
    id: 'EMERG_CARDIAC_001',
    name: 'Acute Coronary Syndrome Risk (Severe Chest Pain with Dyspnea / Radiation)',
    specialty: 'Cardiology',
    backupSpecialties: ['Emergency Medicine', 'Internal Medicine'],
    requiredKeywords: ['chest_pain'],
    coFactorKeywords: ['breathlessness', 'arm_radiation', 'jaw_radiation', 'diaphoresis', 'severe_pressure'],
    minCoFactors: 1,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Patient reports acute chest discomfort associated with dyspnea, radiation to left arm/jaw, severe pressure, or diaphoresis.',
    recommendedAction: 'IMMEDIATE_CARDIAC_TRIAGE'
  },
  {
    id: 'EMERG_STROKE_002',
    name: 'Acute Neurological Deficit (FAST Stroke Warning)',
    specialty: 'Neurology',
    backupSpecialties: ['Emergency Medicine', 'General Medicine'],
    requiredKeywords: ['facial_droop', 'arm_weakness', 'slurred_speech', 'sudden_paralysis', 'sudden_vision_loss'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Acute onset of neurological deficit (facial droop, unilateral arm/leg weakness, slurred speech, or acute loss of vision).',
    recommendedAction: 'IMMEDIATE_STROKE_PROTOCOL'
  },
  {
    id: 'EMERG_RESP_003',
    name: 'Severe Acute Respiratory Compromise',
    specialty: 'Pulmonology',
    backupSpecialties: ['Emergency Medicine', 'Internal Medicine'],
    requiredKeywords: ['severe_breathlessness', 'unable_to_breathe', 'stridor', 'cyanosis', 'choking'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Acute airway obstruction, inability to breathe, stridor, or severe respiratory distress.',
    recommendedAction: 'IMMEDIATE_AIRWAY_EVALUATION'
  },
  {
    id: 'EMERG_UNCONSCIOUS_004',
    name: 'Loss of Consciousness / Unresponsiveness',
    specialty: 'Emergency Medicine',
    backupSpecialties: ['Neurology', 'Internal Medicine'],
    requiredKeywords: ['unconscious', 'unresponsive', 'collapsed', 'fainted_unresponsive', 'coma'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Patient is unconscious, collapsed, or unresponsive.',
    recommendedAction: 'EMERGENCY_RESUSCITATION_REVIEW'
  },
  {
    id: 'EMERG_ANAPHYLAXIS_005',
    name: 'Acute Anaphylaxis / Severe Allergic Reaction',
    specialty: 'Emergency Medicine',
    backupSpecialties: ['General Medicine', 'Pulmonology'],
    requiredKeywords: ['throat_swelling', 'anaphylaxis', 'tongue_swelling', 'severe_allergy_breathless'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Rapid onset allergic reaction with airway compromise, throat/tongue swelling, or acute breathing difficulty.',
    recommendedAction: 'IMMEDIATE_ANAPHYLAXIS_TREATMENT'
  },
  {
    id: 'EMERG_HEMORRHAGE_006',
    name: 'Severe Uncontrolled Bleeding / Massive Hemorrhage',
    specialty: 'Emergency Medicine',
    backupSpecialties: ['General Surgery', 'Internal Medicine'],
    requiredKeywords: ['uncontrolled_bleeding', 'massive_hemorrhage', 'vomiting_blood_large', 'coughing_blood_large'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Acute heavy or uncontrolled bleeding, large volume hematemesis, or hemoptysis.',
    recommendedAction: 'IMMEDIATE_HEMOSTASIS_AND_TRIAGE'
  },
  {
    id: 'EMERG_POISON_007',
    name: 'Acute Toxic Ingestion / Poisoning / Overdose',
    specialty: 'Emergency Medicine',
    backupSpecialties: ['Internal Medicine'],
    requiredKeywords: ['poison_ingestion', 'overdose_substance', 'chemical_swallowed', 'toxic_ingestion'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Suspected poisoning, accidental chemical ingestion, or acute substance overdose.',
    recommendedAction: 'TOXICOLOGY_EMERGENCY_MANAGEMENT'
  },
  {
    id: 'EMERG_CRISIS_008',
    name: 'Immediate Mental Health Crisis / Acute Self-Harm Risk',
    specialty: 'Psychiatry',
    backupSpecialties: ['Emergency Medicine'],
    requiredKeywords: ['immediate_self_harm', 'suicide_intent', 'killing_myself'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'Explicit statement of active crisis or immediate self-harm intent.',
    recommendedAction: 'IMMEDIATE_PSYCHIATRIC_CRISIS_RESPONSE'
  },
  {
    id: 'EMERG_TRAUMA_009',
    name: 'Major Acute Physical Trauma',
    specialty: 'Orthopedics',
    backupSpecialties: ['Emergency Medicine', 'General Surgery'],
    requiredKeywords: ['severe_accident_trauma', 'head_injury_unconscious', 'open_fracture_bone'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.HIGH,
    urgency: CLINICAL_URGENCY.EMERGENCY,
    description: 'High-impact physical trauma, severe accident, or head injury with neurological impairment.',
    recommendedAction: 'TRAUMA_CARE_EVALUATION'
  }
];

module.exports = {
  CLINICAL_EMERGENCY_RULES
};
