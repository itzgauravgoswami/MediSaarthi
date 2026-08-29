// Clinical History Normalizer Service

class HistoryNormalizerService {
  normalizeClinicalData(rawIntake = {}) {
    const chiefComplaint = Array.isArray(rawIntake.chiefComplaint) 
      ? rawIntake.chiefComplaint 
      : (rawIntake.chiefComplaint ? [rawIntake.chiefComplaint] : []);

    const hpi = {
      onset: rawIntake.hpi?.onset || rawIntake.onset || null,
      duration: rawIntake.hpi?.duration || rawIntake.duration || null,
      location: rawIntake.hpi?.location || rawIntake.location || null,
      character: rawIntake.hpi?.character || rawIntake.character || null,
      severity: typeof rawIntake.hpi?.severity === 'number' ? rawIntake.hpi.severity : (parseInt(rawIntake.severity, 10) || 5),
      radiation: rawIntake.hpi?.radiation || rawIntake.radiation || null,
      aggravatingFactors: rawIntake.hpi?.aggravatingFactors || [],
      relievingFactors: rawIntake.hpi?.relievingFactors || [],
      associatedSymptoms: rawIntake.hpi?.associatedSymptoms || [],
      summaryNarrative: rawIntake.hpi?.summaryNarrative || rawIntake.historyOfPresentIllness || ''
    };

    return {
      chiefComplaint,
      historyOfPresentIllness: hpi,
      pastMedicalHistory: rawIntake.pastMedicalHistory || [],
      pastSurgicalHistory: rawIntake.pastSurgicalHistory || rawIntake.surgicalHistory || [],
      medications: rawIntake.medications || [],
      allergies: rawIntake.allergies || [],
      familyHistory: rawIntake.familyHistory || [],
      personalHistory: rawIntake.personalHistory || {
        diet: 'Standard',
        sleep: 'Normal',
        bowel: 'Regular',
        bladder: 'Regular',
        substanceUse: []
      },
      reviewOfSystems: rawIntake.reviewOfSystems || {}
    };
  }
}

module.exports = new HistoryNormalizerService();
