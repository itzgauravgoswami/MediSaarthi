// AYUSH Assessment Model (Dashavidha Pariksha, Ahara, Vihara)
const mongoose = require('mongoose');

const AyushAssessmentSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true, unique: true, index: true },
  patientId: { type: String, required: true, ref: 'Patient', index: true },
  assessmentType: { type: String, default: 'DASHAVIDHA' },

  dashavidhaPariksha: {
    prakriti: { type: String, default: 'Vata-Pitta' },
    vikriti: { type: String, default: 'Vata-Kaphaj Agni-mandya' },
    sara: { type: String, default: 'Madhyama Sara' },
    samhanana: { type: String, default: 'Madhyama' },
    pramana: { type: String, default: 'Normal BMI' },
    satmya: { type: String, default: 'Sarva-rasa Satmya' },
    sattva: { type: String, default: 'Madhyama Sattva' },
    aharaShakti: { type: String, default: 'Abhavarana (Manda Agni)' },
    vyayamaShakti: { type: String, default: 'Madhyama' },
    vaya: { type: String, default: 'Madhyama Vaya' }
  },

  ahara: {
    dietType: { type: String, default: 'Mixed' },
    mealTimings: { type: String, default: 'Irregular' },
    waterIntake: { type: String, default: '1.5 - 2 Liters' },
    tastePreference: [{ type: String }]
  },

  vihara: {
    sleepPattern: { type: String, default: 'Disturbed / Late' },
    physicalActivity: { type: String, default: 'Sedentary' },
    stressLevel: { type: String, default: 'Moderate' }
  },

  status: { type: String, enum: ['AI_DRAFT', 'PRACTITIONER_REVIEWED', 'VERIFIED'], default: 'AI_DRAFT' },
  reviewedBy: { type: String },
  reviewedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.models.AyushAssessment || mongoose.model('AyushAssessment', AyushAssessmentSchema);
