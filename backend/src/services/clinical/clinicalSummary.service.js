// Clinical Summary Generation & Compilation Service
const { generateClinicalSummaryDraft } = require('../ai/summary.service');
const clinicalHistoryService = require('./clinicalHistory.service');
const Document = require('../../models/Document');
const logger = require('../../utils/logger');

class ClinicalSummaryService {
  async compileSummaryForPatient(patientId) {
    // 1. Fetch current history and documents
    const history = await clinicalHistoryService.getClinicalHistory(patientId);
    let documents = [];
    try {
      documents = await Document.find({ patientId });
    } catch (e) {}

    // 2. Synthesize using AI summary engine
    const aiSummary = await generateClinicalSummaryDraft(history, { documentsCount: documents.length, documents });

    // 3. Save as draft in clinical history
    await clinicalHistoryService.saveOrUpdateHistory(patientId, {
      chiefComplaint: [aiSummary.chiefComplaint],
      historyOfPresentIllness: {
        summaryNarrative: aiSummary.historyOfPresentIllness,
        ...history.historyOfPresentIllness
      },
      pastMedicalHistory: aiSummary.pastMedicalHistory,
      medications: aiSummary.medicationHistory || history.medications
    });

    logger.info(`[Summary Engine] Generated clinical summary draft for patient ${patientId}`);
    return aiSummary;
  }
}

module.exports = new ClinicalSummaryService();
