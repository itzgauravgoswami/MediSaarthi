// Deterministic Clinical Red Flag Rules
const { RED_FLAG_PRIORITY } = require('../../constants/statuses');

const RED_FLAG_RULES = [
  {
    id: 'RF_CHEST_001',
    name: 'Acute Coronary Syndrome Risk (Chest Pain with Dyspnea / Radiation)',
    requiredSymptoms: ['chest_pain'],
    coFactors: ['breathlessness', 'arm_radiation', 'jaw_radiation', 'diaphoresis'],
    minCoFactors: 1,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    description: 'Patient reports chest pain associated with dyspnea, left arm/jaw radiation, or sweating. Immediate 12-lead ECG and physician evaluation required.',
    action: 'IMMEDIATE_CLINICAL_REVIEW'
  },
  {
    id: 'RF_STROKE_002',
    name: 'Acute Neurological Deficit (FAST Signs)',
    requiredSymptoms: ['facial_droop', 'arm_weakness', 'slurred_speech', 'sudden_vision_loss'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    description: 'Sudden onset neurological deficit or speech difficulty. Immediate stroke triage protocol activation required.',
    action: 'EMERGENCY_TRIAGE_ESCALATION'
  },
  {
    id: 'RF_RESP_003',
    name: 'Severe Respiratory Distress',
    requiredSymptoms: ['stridor', 'severe_dyspnea', 'unable_to_speak_full_sentences', 'cyanosis'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    description: 'Acute airway or ventilatory compromise detected.',
    action: 'OXYGEN_AND_TRIAGE_ASSESSMENT'
  },
  {
    id: 'RF_ANAPHYLAXIS_004',
    name: 'Acute Anaphylaxis Risk',
    requiredSymptoms: ['acute_hives', 'throat_swelling', 'wheezing_post_exposure'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.IMMEDIATE,
    description: 'Rapid onset allergic reaction with airway or respiratory involvement.',
    action: 'IMMEDIATE_EMERGENCY_REVIEW'
  },
  {
    id: 'RF_SEPSIS_005',
    name: 'High-Grade Sepsis Warning',
    requiredSymptoms: ['high_fever', 'altered_mental_status', 'extreme_shivering'],
    minCoFactors: 0,
    priority: RED_FLAG_PRIORITY.HIGH,
    description: 'Fever with confusion or hemodynamic instability signs.',
    action: 'URGENT_DOCTOR_EVALUATION'
  }
];

module.exports = {
  RED_FLAG_RULES
};
