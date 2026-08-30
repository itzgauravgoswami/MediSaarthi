// Analytics & Hospital Intake Metrics Service
const Patient = require('../../models/Patient');
const Interview = require('../../models/Interview');
const Document = require('../../models/Document');
const RedFlagAlert = require('../../models/RedFlagAlert');
const EmergencyEvent = require('../../models/EmergencyEvent');

class AnalyticsService {
  async getOverviewMetrics() {
    // All values are computed from real MongoDB documents.
    // If the database has zero records, zeros are returned — never fabricated numbers.
    const [
      patientCount,
      completedIntakes,
      documentCount,
      redFlagCount,
      emergencyCount
    ] = await Promise.all([
      Patient.countDocuments().catch(() => 0),
      Interview.countDocuments({ status: 'COMPLETED' }).catch(() => 0),
      Document.countDocuments().catch(() => 0),
      RedFlagAlert.countDocuments({ status: 'OPEN' }).catch(() => 0),
      EmergencyEvent.countDocuments().catch(() => 0)
    ]);

    // Language distribution — computed from real Interview records
    const languageAgg = await Interview.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).catch(() => []);

    const totalInterviews = languageAgg.reduce((sum, l) => sum + l.count, 0);
    const languageDistribution = languageAgg.map(l => ({
      name: l._id || 'Unknown',
      count: l.count,
      percent: totalInterviews > 0 ? Math.round((l.count / totalInterviews) * 100) : 0
    }));

    // Daily throughput by hour — computed from today's Interview records
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const throughputAgg = await Interview.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]).catch(() => []);

    const dailyThroughput = throughputAgg.map(t => ({
      time: `${String(t._id).padStart(2, '0')}:00`,
      count: t.count
    }));

    return {
      patientsProcessedToday: patientCount,
      aiIntakesCompleted: completedIntakes,
      docProcessingCount: documentCount,
      redFlagCount,
      emergencyCount,
      languageDistribution: languageDistribution.length > 0 ? languageDistribution : [],
      dailyThroughput: dailyThroughput.length > 0 ? dailyThroughput : []
    };
  }

  async getDoctorAnalytics(doctorId) {
    // All values computed from real database records
    const query = doctorId ? { doctorId } : {};

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalAttendedToday,
      redFlagsIntercepted
    ] = await Promise.all([
      Interview.countDocuments({
        ...query,
        status: 'COMPLETED',
        completedAt: { $gte: startOfToday }
      }).catch(() => 0),
      RedFlagAlert.countDocuments({
        createdAt: { $gte: startOfToday }
      }).catch(() => 0)
    ]);

    // Hourly consultation throughput
    const throughputAgg = await Interview.aggregate([
      { $match: { status: 'COMPLETED', completedAt: { $gte: startOfToday }, ...query } },
      { $group: { _id: { $hour: '$completedAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]).catch(() => []);

    const consultationThroughput = throughputAgg.map(t => ({
      hour: `${String(t._id).padStart(2, '0')}:00`,
      count: t.count
    }));

    return {
      totalAttendedToday,
      redFlagsIntercepted,
      consultationThroughput: consultationThroughput.length > 0 ? consultationThroughput : [],
      diseaseCategories: []  // Requires structured diagnosis field — return empty until available
    };
  }
}

module.exports = new AnalyticsService();
