import NotificationType from "../constant/NotificationType.js";
import notification from "../models/notification.js";

const createResendRequestNotification = async (userId) => {
  const newNotification = new Notification({ userId, content: NotificationType.RESEND_ACTIVATION });
  await newNotification.save();
};

const hasRequestedResend = async (userId) => {
  const request = await notification.findOne({ userId });
  return request != null;
};


const markNotificationAsRead = async (notificationId) => {
  try {
    const notiItem = await notification.findById(notificationId);
    if (!notiItem) {
      throw new Error('Notification not found');
    }

    notiItem.isRead = true;
    await notiItem.save();

    return { success: true, message: 'Notification marked as read' };
  } catch (error) {
    throw error;
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const result = await notification.findByIdAndDelete(notificationId);
    if (!result) {
      throw new Error('Notification not found');
    }

    return { success: true, message: 'Notification deleted' };
  } catch (error) {
    throw error;
  }
};


export { hasRequestedResend, createResendRequestNotification, deleteNotification, markNotificationAsRead }
