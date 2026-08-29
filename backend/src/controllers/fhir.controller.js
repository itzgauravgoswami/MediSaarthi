// FHIR Controller
const fhirService = require('../services/fhir/fhir.service');
const abdmService = require('../services/abdm/abdm.service');
const { sendSuccess } = require('../utils/response');

class FhirController {
  async getFhirPatient(req, res, next) {
    try {
      const patientId = req.params.id || 'P102';
      const fhirResource = await fhirService.getFhirPatient(patientId);
      return res.status(200).json(fhirResource);
    } catch (err) {
      next(err);
    }
  }

  async getFhirBundle(req, res, next) {
    try {
      const patientId = req.params.id || 'P102';
      const bundle = await fhirService.getFhirClinicalBundle(patientId);
      return res.status(200).json(bundle);
    } catch (err) {
      next(err);
    }
  }

  async verifyAbdmAbha(req, res, next) {
    try {
      const { abhaAddress } = req.body;
      const result = await abdmService.verifyAbhaAddress(abhaAddress);
      return sendSuccess(res, result, 'ABHA address verified via ABDM sandbox');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FhirController();
