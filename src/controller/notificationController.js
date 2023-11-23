
import notification from '../models/notification.js';
import * as NotificationService from '../service/notificationService.js';


const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const result = await NotificationService.markNotificationAsRead(notificationId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const result = await NotificationService.deleteNotification(notificationId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const deleteAllNotifications = async (req, res) => {
  try {
    await notification.deleteMany({});

    res.status(200).json({ success: true, message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all notifications:', error);

    res.status(500).json({ success: false, message: 'Failed to delete notifications' });
  }
};


export { markAsRead, deleteNotification, deleteAllNotifications }
