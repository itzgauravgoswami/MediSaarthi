// Doctor Controller
const Doctor = require('../models/Doctor');
const { sendSuccess } = require('../utils/response');

class DoctorController {
  async getAllDoctors(req, res, next) {
    try {
      const { specialization, isAvailable } = req.query;
      const query = {};

      if (specialization) {
        query.specialization = new RegExp(specialization, 'i');
      }
      if (isAvailable !== undefined) {
        query.isAvailable = isAvailable === 'true';
      }

      const doctors = await Doctor.find(query).sort({ queueCount: 1 });
      return sendSuccess(res, doctors);
    } catch (err) {
      next(err);
    }
  }

  async getDoctorById(req, res, next) {
    try {
      const id = req.params.id;
      const doctor = await Doctor.findOne({ $or: [{ doctorId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      return sendSuccess(res, doctor);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DoctorController();
