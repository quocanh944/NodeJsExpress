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


export { hasRequestedResend, createResendRequestNotification }
