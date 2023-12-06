import NotificationType from "../constant/NotificationType.js";
import Notification from "../models/notification.js";

const fetchNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ content: NotificationType.RESEND_ACTIVATION })
      .populate('userId')
      .sort({ createdAt: -1 });
    res.locals.notifications = notifications || [];

    const resendActivationRequestExists = notifications.map(notification => notification.userId._id);
    res.locals.resendActivationRequestExists = JSON.stringify(resendActivationRequestExists);
    next();
  } catch (error) {
    console.error('Error fetching notifications with user info:', error);
    next(error);
  }
};



export { fetchNotifications };
