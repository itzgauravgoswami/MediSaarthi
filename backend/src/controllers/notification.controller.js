// Notification Controller
const notificationService = require('../services/notifications/notification.service');
const { sendSuccess } = require('../utils/response');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const role = req.user?.role || 'DOCTOR';
      const notifications = await notificationService.getNotifications(role);
      return sendSuccess(res, notifications);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const id = req.params.id;
      const updated = await notificationService.markAsRead(id);
      return sendSuccess(res, updated, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
